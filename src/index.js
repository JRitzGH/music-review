const express=require("express")
const Collection=require("./mongo")

const app=express()
const path=require("path")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcryptjs=require("bcryptjs")

app.use(express.json())
app.use(cookieParser)
app.use(express.urlencoded({extended:false}))


const templatePath=path.join(__dirname,"../templates")
const publicPath=path.join(__dirname,"../public")

app.set('view engine', 'hbs')
app.set("views", templatePath)
app.use(express.static(publicPath))


app.get("/",(req,res)=>{
    res.render("login")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})


app.post("/signup", async(req,res)=>{
    try{
        const check=await Collection.findOne({name:req.body.name})

        if (check){
            res.send("user already exists")
        } else {

            const token=jwt.sign({name:req.body.name},"57fx2Ktg1T4Ow7J4I1TfXxw7u0pkjjT1ca9XmoYqF16JjT1218R9TBSPOGVOzmk0")
            
            const data={
                name:req.body.name,
                password:req.body.password,
                token:token
            }

            await Collection.insertMany([data])
        }
    }
    catch{

        res.send("wrong details")

    }
})


app.listen(3000, ()=>{
    console.log("port connected")
})