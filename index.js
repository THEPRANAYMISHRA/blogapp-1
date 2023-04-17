const express=require("express")
const connection = require("./db")
const userRouter = require("./routes/user.routes")
const app=express()
const cookieParser=require("cookie-parser")
const blogRouter = require("./routes/blogs.routes")
const auth = require("./middleware/auth.middleware")
app.use(cookieParser())

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.use("/user",userRouter)

app.use("/blogs",auth,blogRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to db :)")
    } catch (error) {
        console.log("failed to db :(")
    }
    console.log("server running!");
})