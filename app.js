require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require('md5');
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();


mongoose.connect('mongodb://localhost/USERdb', { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
app.use(express.static("public"));

app.set ("view engine","ejs");
app.use(express.urlencoded({
    extended:true
}));

app.use(session({
    secret :"hi everybody",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());



const userSchema =new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);
 
//userSchema.plugin(encrypt,{ secret : process.env.SECRET, encryptedFields : ["password"]});


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
res.render("Home");
});


app.get("/login",function(req,res){
    res.render("login");
    });

    
app.get("/register",function(req,res){
    res.render("register");
    });

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
     res.render("/login");
    }
});

app.post("/register",function(req,res){
     
     User.register({username : req.body.username} , req.body.password , function(err , user){
         if(err){
             console.log(err);
             res.redirect("/register");
         }
         else{
             passport.authenticate("local")(req,res,function(){
                 res.redirect("/secrets");
             });
         }
     });
     
    // const userx = new User({
    //     email : req.body.username,
    //     password :md5( req.body.password)
    // });

    // userx.save(function(err){
    //     if(!err){
    //         res.render("secrets");
    //     }
    //     else{
    //         console.log(err);
    //     }
    // });
});


app.post("/login",function(req,res){

    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
              res.render("secrets");
            });
        }
    });

//     const usermail = req.body.username;
//     const password = req.body.password;


// User.findOne({email : usermail},function(err,UserFound){ 
//     if(err){
//         console.log(err);
//     }
//     else{
//         if(UserFound){
//             if(UserFound.password === password){
//                 res.render("secrets");
//             }
//         }
//     }
//   });
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.listen(3000,function(req,res){
    console.log("server started at port 3000");
})