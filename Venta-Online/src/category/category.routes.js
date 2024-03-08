'use strict'

import { Router } from 'express'
import { addCategory, deleteCategory, listCategory, update } from './category.controller.js'
import { validateJwt,isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()
//ACCESO ADMINISTRADOR
api.post('/addCategory',[validateJwt, isAdmin], addCategory)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteCategory)

//ACCESO ADMINISTRADOR Y CLIENTE
api.get('/listCategory', listCategory)

export default api