import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        require: [true, 'The user is required']
    },
    product: {
        type: Array,
        ref: 'product',
        default: []
    },
    subtotal: {
        type: Number,
        default: 0
    }
})

export default model('shoppingCart', cartSchema)
