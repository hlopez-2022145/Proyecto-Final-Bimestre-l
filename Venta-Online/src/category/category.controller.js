'use strict'

import Category from './category.model.js'
import Product from '../product/product.model.js'

//ADD
export const addCategory = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ msg: 'Category added successfully ' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error added category' })
    }
}

//TO LIST
export const listCategory = async (req, res) => {
    try {
        let categories = await Category.find().select('-_id -__v')
        //if (categories.length == 0) return res.status(404).send({ msg: 'Not found' })
        return res.send({msg: 'The categories list are: ', categories })
    }catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error gettind category' })
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCategory) return res.status(401).send({ msg: 'Category not foun and not updated' })
        return res.send({ msg: 'Updated category', updateCategory })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error updated category' })
    }
}

//DELETE
export const deleteCategory = async(req, res) =>{
    try{
        let idCategory = req.params.id
        //Emcontramos la categoría que queremos eliminar 
        let deleteCate = await Category.findOne({_id: idCategory})
        //Verificamos si la categoria existe
        if(!deleteCate){
            return res.status(404).send({msg: 'Category not found, not deleted'})
        }
        //Encontramos la categoria por default
        let defaultCategory = await Category.findOne({categoryName: 'Others'})
        //Verificamos si encontro la categoría por default
        if(!defaultCategory){
            return res.status(404).send({msg: 'Default category not found'})
        }
        await Product.updateMany(
            {category: deleteCate._id},
            {category: defaultCategory._id},
            {multi: true}
        )
        await deleteCate.deleteOne()
        return res.send({msg: 'Deleted category successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({msg: 'Error deleting category'})
    }
}