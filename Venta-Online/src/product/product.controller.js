'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'

//ADD
export const addProduct = async (req, res) => {
    try {
        let data = req.body
        //Validamos si el producto ya existe en la DB
        let productExist = await Product.findOne({ name: data.name })
        if (productExist) {
            return res.status(400).send({ msg: `The ${productExist.name} product already exists in the database` })
        }
        //verificamos si existe el usuario
        // let user = await User.findOne({ _id: data.user })
        // if (!user){
        //     return res.status(404).send({ msg: 'User not found' })
        // } 
        //veridicamos si existe la categoria
        let category = await Category.findOne({ _id: data.category })
        if (!category) {
            return res.status(404).send({ msg: 'Category not found' })
        }
        let product = new Product(data)
        await product.save()
        return res.send({ msg: 'Product added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error added product' })
    }
}
//TO LIST
export const listProducts = async (req, res) => {
    try {
        let listProduc = await Product.find().populate('category', ['categoryName', '-_id']).select('-__v')
        if (listProduc.length == 0) return res.status(404).send({ msg: 'Not found' })
        return res.send({ mss: 'The products are:', listProduc })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error getting products' })
    }
}

//PRODUCTO MAS VENDIDO
export const productMasVendido = async (req, res) => {
    try {
        let listaMasVendida = await Product.find({ sold: { $gt: 1 } }) //Promise.all([]) espera a que todas las promesas dentro del arreglo se resuelvan
            .sort({ sold: -1 }) // Ordena los productos de forma descendente
            .limit(3)//Este nos mostrara los 3 productos más vendidos
            .populate('category', ['categoryName', '-_id'])
            .select('-__v')
        return res.send({ msg: 'Best selling product', listaMasVendida })
    } catch (err) {
        console.error(err)
        return err
    }
}

//PRODUCTO AGOTADO
export const productSoldOut = async (req, res) => {
    try {
        let soulOut = await Product.find({ stock: { $eq: 0 } })//$eq (igual a)
            .populate('category', ['categoryName', '-_id'])
            .select('-__v')
        if (soulOut.length == 0) return res.status(404).send({ msg: 'There are no products out of stock' })
        return res.send({ msg: 'Product sold out', soulOut })
    } catch (err) {
        console.error(err)
        return err
    }
}

//UPDATE 
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateProducto = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category', ['categoryName', '-_id']).select('-__v')
        if (!updateProducto) return res.status(401).send({ msg: 'Product not found and not updated' })
        return res.send({ msg: 'Updated product', updateProducto })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error updated product' })
    }
}

//SEARCH
export const search = async (req, res) => {
    try {
        let { search } = req.body
        let product = await Product.findOne({ name: search })
            .populate('category', ['categoryName', 'description', '-_id'])
            .select('-__v')
        if (!product) {
            return res.status(404).send({ msg: 'Product not found' })
        }
        return res.send({ msg: 'Product found', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error serarching product ' })
    }
}

//DELETE
export const deletePro = async(req, res) => {
    try{
        let { id } = req.params
        let deleteProducto = await Product.findOneAndDelete({_id: id})
        if(!deleteProducto){
            return res.status(404).send({msg: 'Product not found and not deleted'})
        }
        return res.send({msg: 'Product deleted succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({msg: 'Error deleting product'})
    }
}

//LIST OF PRODUCT FOR CATEGORY
export const getProductCategory = async (req, res) => {
    try {
        let { search } = req.body;
        let category = await Category.findOne({ categoryName: search })
        if (!category) return res.status(404).send({ msg: 'Category not found' })
        let product = await Product.find({ category: category._id }).populate('category', ['categoryName', '-_id'])
        if (product.length == 0) return res.status(404).send({ message: 'Product not found' })
        return res.send({ product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error getting product' })
    }
}
