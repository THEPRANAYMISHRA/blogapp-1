const jwt=require("jsonwebtoken")
const BlackModel = require("../models/black.model")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const auth=async (req,res,next)=>{
    const {token1}=req.cookies

    const blackToken=await BlackModel.findOne({token:token1})

    if(blackToken){
        res.status(400).send({"msg":"please login again"})
    }else{
        if(token1){
            const decoded=jwt.verify(token1,"Pranay")
                if(decoded){
                    next()
                }else{
                    res.status(400).send({"msg":"token expired"})
                }
        }else{
            const newtoken=await fetch("http://localhost:7500/user/refresh",{
                headers:{
                    "content-type":"application/json",
                    "token2":req.cookies.token2
                }
            })
            .then((res)=>res.json())
            res.cookie("token1",newtoken,{httpOnly:true})
        }
    }
}

module.exports=auth