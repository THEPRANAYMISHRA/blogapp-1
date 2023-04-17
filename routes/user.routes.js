const express=require("express")
const userRouter=express.Router()
const UserModel=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const BlackModel = require("../models/black.model")

//for signup=======================================>
userRouter.post("/signup",async(req,res)=>{
    const {name,email,pass}=req.body
    try {
        bcrypt.hash(pass,5,async(err, hash)=>{
            if(err){
                res.send("failed here")
            }else{
                let user= new UserModel({name,email,pass:hash})
                await user.save()
                res.send({"msg":"signup done :)"})
            }
        });
    } catch (error) {
        console.log("error",error)
    }
})
//for login=========================================>
userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    let user= await UserModel.findOne({email})

    if(!user){
        res.send({"msg":"no such user,please signup!"})
    }
    if(user){
        try {
            bcrypt.compare(pass,user.pass, function(err, result){
                if(err){
                    res.send({"msg":"wrong password"})
                }else{
                    const token1=jwt.sign({userId:user._id},"Pranay",{expiresIn:"1h"})
                    const token2=jwt.sign({userId:user._id},"Pranay2",{expiresIn:"3h"})

                    res.cookie("token1",token1,{httpOnly:true})
                    res.cookie("token2",token2,{httpOnly:true})

                    res.send({"msg":"login done :)"})
                }
            });
        } catch (error) {
            console.log("error",error)
        }
    }
})
//for logout=========================================>
userRouter.get("/logout",async(req,res)=>{
    try {
        const {token1,token2}=req.cookies
        const blacklist1=new BlackModel(token1)
        const blacklist2=new BlackModel(token2)

        await blacklist1.save()
        await blacklist2.save()

        res.send({"msg":"logout done :)"})
    } catch (error) {
        res.send({"msg":"logout failed :("})
    }
})
//for refresh token==================================>
userRouter.get("/refresh",async(req,res)=>{
    try {
        const token2=req.cookies.token2 || req?.headers?.authorization?.token2
        const isTokenValid=jwt.verify(token2,"Pranay2")

        const blackToken=await BlackModel.findOne({token:token2})

        if(blackToken){
            return res.status(400).send({"msg":"unauthozied"})
        }
        if(!isTokenValid){
            return res.status(400).send({"msg":"please login again"})
        }

        const newToken=jwt.sign({userId:isTokenValid._id},"Pranay",{expiresIn:"1h"})

        res.cookie("token1",newToken,{httpOnly:true})

    } catch (error) {
        console.log("Error in refresh token",error)
    }
})

module.exports=userRouter