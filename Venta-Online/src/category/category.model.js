
import { Schema, model} from 'mongoose'

export const categorySchema = Schema({
    categoryName:{
        type:String,
        required: [true, 'The category name is obligatori']
    },
    description:{
        type:String,
        required:[true, 'The category description is obligatori']
    }
})

export default model('category', categorySchema)