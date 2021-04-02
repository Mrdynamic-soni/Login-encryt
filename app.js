require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

mongoose.connect('mongodb://localhost/USERdb', { useNewUrlParser: true , useUnifiedTopology: true});
app.use(express.static("public"));

app.set ("view engine","ejs");
app.use(express.urlencoded({
    extended:true
}));

const userSchema =new mongoose.Schema({
    email : String,
    password : String
});
 
userSchema.plugin(encrypt,{ secret : process.env.SECRET, encryptedFields : ["password"]});


const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
res.render("Home");
});


app.get("/login",function(req,res){
    res.render("login");
    });

    
app.get("/register",function(req,res){
    res.render("register");
    });


app.post("/register",function(req,res){


    const userx = new User({
        email : req.body.username,
        password : req.body.password
    });

    userx.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
});


app.post("/login",function(req,res){

    const usermail = req.body.username;
    const password = req.body.password;


User.findOne({email : usermail},function(err,UserFound){ 
    if(err){
        console.log(err);
    }
    else{
        if(UserFound){
            if(UserFound.password === password){
                res.render("secrets");
            }
        }
    }
  });
});

app.listen(3000,function(req,res){
    console.log("server started at port 3000");
})