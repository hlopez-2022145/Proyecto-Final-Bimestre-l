'use strict'

import { checkUpdate, encrypt, checkPassword } from '../utils/validator.js'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    return res.send('Hellow World')
}

//REGISTER
export const registerUser = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        //Creamos una instancia del modelo user
        let user = new User(data)
        //Guadamos la información
        await user.save()
        //Respondemos al usuario
        return res.send({ msg: 'Registered successfylly' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error registering user', err })
    }
}

//LOGIN
export const login = async(req, res) => {
    try{
        let {  mail, username, password } = req.body

        let user = await User.findOne({$or: [{mail},{username}]})
        if(!user){
            if(username){
                return res.status(404).send({msg: 'The username you entered is not connected to an account'})
            }else if(mail){
                return res.status(404).send({msg: 'The mail you entered is not connected to an account'})
            }
        }

        if(user && await checkPassword(password, user.password)){
            let loggedUser ={
                uid: user._id,
                mail: user.mail,
                username: user.username,
                name: user.name
            }
            let token = await generateJwt(loggedUser)
            return res.send({
                msg: `Welcome ${user.name}`,
                loggedUser,
                token
            })
        }
        return res.status(404).send({msg: 'Invalid credentials'})
    }catch{
        console.error(err)
        return res.status(500).send({msg: 'Failed to login', err})
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ msg: 'Have submitted some data tahat cannot be updated or missing data' })

        //Actualizamos la base de datos
        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        //Validamos si se actualizó
        if (!updateUser) return res.status(401).send({ msg: 'User not found not updated' })
        return res.send({ msg: 'Updated user', updateUser })
    } catch (err) {
        console.error(err)
        if (err.keyValue.username) return res.status(400).send({ msg: `Username ${err.keyValue.username} is already taken` })
        return res.status(500).send({ msg: 'Error updating account' })
    }
}

//DELETE
export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params
        let deleteUser = await User.findOneAndDelete({ _id: id })
        if (!deleteUser) return res.status(404).send({ msg: 'Account not found and not deleted' })
        return res.send({ msg: `The account with username ${deleteUser.username} deleted seccessfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error deleting account' })
    }
}