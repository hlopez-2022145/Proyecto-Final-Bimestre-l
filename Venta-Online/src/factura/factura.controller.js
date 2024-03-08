'use strict'

import Factura from './factura.model.js'
import ShoppingCart from '../shoppingCart/cart.model.js'

//ADD COMPRA
export const buy = async(req, res) => {
    try{
        let user = req.user._id
        let cart = await ShoppingCart.findOne({user: user})
        let total = cart.subtotal
        let description = cart.product
        let facturaDB = new Factura({user, total, description})

        await facturaDB.save()
 
        return res.send({msg: 'Purchase added successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({msg: 'Error when purchasing '})
    }
}

//LIST INVOICE
export const listInvoice = async(req, res) => {
    try{
        let listInvo = await Factura.find()
        .populate('user',['name', '-_id'])
        .populate({path: 'description', select: 'name price -_id'})
        if(listInvo.length == 0){
            return res.status(404).send({msg: 'Not found'})
        }
        return res.send({msg: 'The Invoices are:', listInvo})
    }catch(err){
        console.error(err)
        return res.status(500).send({msg: 'Error getting invoice'})
    }
}
