const express=require("express")

const app=express()
const path=require("path")

app.use(express.json())
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



app.listen(3000, ()=>{
    console.log("port connected")
})