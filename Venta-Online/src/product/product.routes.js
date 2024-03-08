'use strict'

import { Router } from 'express'
import { deletePro,addProduct,search, productMasVendido, productSoldOut, listProducts, update,getProductCategory } from './product.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()

//ACCESOS PARA ADMINISTRADOR
api.post('/addProduct',[validateJwt, isAdmin], addProduct)
api.get('/productSoldOut',[validateJwt, isAdmin], productSoldOut)
api.get('/listProducts',[validateJwt, isAdmin], listProducts)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin],deletePro)

//ACCESOS PARA CLIENTE Y ADMINISTRADOR
api.post('/search', search)
api.get('/productMasVendido', productMasVendido)
api.get('/getProductCategory',getProductCategory)

export default api