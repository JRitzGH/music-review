const mongoose=require("mongoose");

const uri = 'mongodb://127.0.0.1:27017/UserAuth';

mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Connection error', err);
});

application.get('/', (req,res) => {
    res.send('Hello World');
});

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