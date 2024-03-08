'use strict'

import express from 'express'

import { createCart, addToCart} from './cart.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/createCart', validateJwt, createCart)
api.post('/addToCart', validateJwt, addToCart)
//api.delete('/delete/:id',validateJwt,removeFromCart)

export default api
