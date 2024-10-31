const mongoose=require("mongoose")
mongoose.set("strictQuery", false);
const mongoDB = "mongodb://127.0.0.1:27017/UserAuth";

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const Schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})

const Collection=new mongoose.model("AuthCollection", Schema)

module.exports=Collection