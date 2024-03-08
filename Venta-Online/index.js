import { initServer } from './configs/app.js'
import { connect  } from './configs/mongo.js'
import Category from './src/category/category.model.js'

async function categoryDefault () {
    try{
        let categoryExists = await Category.findOne({categoryName: 'Others'})
    
        if(categoryExists){
            return console.log('The category already exists in the database ')
        }

        let newCategory = new Category({
            categoryName: 'Others',
            description: 'This category is default'
        })

        let categorySave = await newCategory.save()
        console.log('Category created successfully', categorySave)
    }catch(err){
        console.error({msg: 'Error creating category ', err})
    }
}

initServer() 
connect()
categoryDefault()