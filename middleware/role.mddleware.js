const checkrole=([permittedrole])=>{
    return (req,res,next)=>{
        const role=req.role

        if(role==permittedrole){
            next()
        }else{
            res.send({"msg":"you are unauthorized"})
        }
    }
}

module.exports=checkrole