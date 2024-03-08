'use strict'

import ShoppingCart from './cart.model.js'
import Product from '../product/product.model.js'

//CREATE
export const createCart = async (req, res) => {
    try {
        let data = req.body
        let userId = req.user.id
        data.user = userId

        let cartExist = await ShoppingCart.findOne({ user: userId })
        if (cartExist) {
            return res.status(400).send({ msg: 'The user already has a cart' })
        }

        let cart = new ShoppingCart(data)
        await cart.save()
        return res.send({ msg: 'Shopping cart created successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error creating shopping cart' })
    }
}

//ADD TO CART
export const addToCart = async(req, res) => {
    try{
        let { idProduct } = req.body
        let userId = req.user._id
        let data = req.body

        let product = await Product.findById(idProduct)
        let coincide = await ShoppingCart.findOne({ user: userId})

        if(!coincide){
            return res.status(404).send({msg: 'No es tu carrito'})
        }
        if(!product || product.stock === 0 || data.stock === 0){
            return res.send({msg: 'There is no product in stock'})
        }

        let subtotalCart = coincide.subtotal + product.price

        let cartUpdate = await ShoppingCart.findOneAndUpdate(
            {_id: coincide._id},
            {$push: {product: product._id},
            subtotal: subtotalCart},
            {new: true}
        ).populate({path: 'product', select: 'name price -_id'}).populate({path: 'user', select: 'name -_id'})
        
        product = await Product.findById(idProduct)
        //cada que comprara uno se le restara 1
        product.stock -= 1
        //cada que agregue uno se le sumara a vendidos
        product.sold += 1
        await product.save()
        return res.send({msg: 'Producto agregado sactisfactoriamente', cartUpdate})
    }catch(err){
        console.error(err)
        return res.status(500).send({msg: 'Error al agregar'})
    }

}

// REMOVE FROM CART
/*export const removeFromCart = async (req, res) => {
    try {
        const { idProduct } = req.body;
        const userId = req.user._id

        // Buscar el carrito del usuario y eliminar el producto del array
        const updatedCart = await ShoppingCart.findOneAndUpdate(
            { user: userId },
            { $pull: { product: idProduct } },
            { new: true }
        )

        if (!updatedCart) {
            return res.status(404).send({ msg: 'No se encontró el carrito del usuario' })
        }

        // Devolver la cantidad al stock del producto
        await Product.findByIdAndUpdate(idProduct, { $inc: { stock: + 1 } })

        return res.send({ msg: 'Producto eliminado del carrito satisfactoriamente' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al eliminar el producto del carrito' })
    }
}
*/