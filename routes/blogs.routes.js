const express=require("express")
const BlogModel = require("../models/blog.model")
const checkrole = require("../middleware/role.mddleware")
const blogRouter=express.Router()

//for creating blogs================================>
blogRouter.post("/add",async(req,res)=>{
    const {email,title,matter}=req.body
    try {
        const blog=new BlogModel({email,title,matter})
        await blog.save()
        res.send({"msg":"blog have been posted!"})
    } catch (error) {
        res.status(400).send({"msg":"blog not posted!"})
    }
})
//for reading blogs=================================>
blogRouter.get("/get",async(req,res)=>{
    const {email}=req.body
    try {
        const blogs= await BlogModel.find({email:email})
        res.send(blogs)
    } catch (error) {
        res.status(404).send({"msg":"no blogs"})
    }
})
//for updating blogs================================>
blogRouter.patch("/update/:id",checkrole(["moderator"]),async(req,res)=>{
    const paramsId=req.params.id
    const {title,matter}=req.body
    try {
        const blogs= await BlogModel.findByIdAndUpdate(paramsId,{title,matter})
        res.send(" blog is updated")
    } catch (error) {
        res.status(404).send({"msg":"could not update"})
    }
})
//for deleting blogs=================================>
blogRouter.delete("/delete/:id",checkrole(["moderator"]),async(req,res)=>{
    const paramsId=req.params.id
    try {
        const blogs= await BlogModel.findByIdAndDelete(paramsId)
        res.send(" blog is deleted")
    } catch (error) {
        res.status(404).send({"msg":"could not delete"})
    }
})

module.exports=blogRouter