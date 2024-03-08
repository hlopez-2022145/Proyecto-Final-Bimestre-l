'use strict'

import express from 'express'

import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'
import { deleteUser, login, registerUser, test, update } from './user.controller.js'

const api = express.Router()

api.post('/registerUser', registerUser)
api.post('/login', login)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteUser)

export default api