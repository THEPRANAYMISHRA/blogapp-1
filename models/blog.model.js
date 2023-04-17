const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
    email:String,
    title:String,
    matter:String,  
})

const BlogModel=mongoose.model("blog",blogSchema)

module.exports=BlogModel