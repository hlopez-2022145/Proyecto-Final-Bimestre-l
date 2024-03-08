'use strict'

import express from 'express'

import { buy, listInvoice } from './factura.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/buy', validateJwt, buy)
api.get('/listInvoice', validateJwt, listInvoice)

export default api
