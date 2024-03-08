import { Schema, model } from 'mongoose'

const facturaSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'The user is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: Array,
        ref: 'product',
        default: []
    },
    total: {
        type: Number,
        default: 0
    }
})

export default model('factura', facturaSchema)