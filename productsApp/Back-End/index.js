/* add "type":"module" in package.json to make the below import works */
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';

const root_dir = "/Users/indiraus/Desktop/The-Room-Assignment/productsApp";
const port = 3000; 
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//connecting to mongoDB collection named as 'productApp'
mongoose.connect("mongodb+srv://indira:Sivaganga31@mymongodb.wvbx2d5.mongodb.net/productApp?retryWrites=true&w=majority")
.then(()=>{
    console.log("Successfully connected to mongoDB")
}).catch((error)=>{
    console.log(error)
})

app.listen(port,()=>{
    console.log(`Express app listening on port http://localhost:${port}`)
});

// respond with "hello world" when a GET request is made to the homepage
app.get("/",async(req,res)=>
{
    res.sendFile("Front-End/index.html",{root: root_dir})
});

app.get("/register",(req,res)=>
{
    res.sendFile("Front-End/register.html",{root: root_dir})
});
app.get("/login",(req,res)=>
{
    res.sendFile("Front-End/login.html",{root: root_dir})
});
// app.get("/add",(req,res)=>
// {
//     res.sendFile("Front-End/addProduct.html",{root: root_dir})
// });

//post
app.post("/register",async(req,res)=>
{
    console.log("Inside app.post('/register') in index.js:request body = ",req.body)
    const {username,password} = req.body;

    //checking if user alredy exists
    const uname = await User.findOne({username});
    if(uname)
    {
        return res.json({sucess:false,message: "User already Exists!"})
    }
    // Hashing password before storing it in DB
       const hPwd = await bcrypt.hash(password,10);

    // inserting the JSON data in mongoDB model 'User'
    const newUser = new User({username:username,password:hPwd});
    await newUser.save().then(()=>{
        console.log("Registration data successfully inserted inside data base.")
        res.status(200).json({success:true,message:"User successfully registered."});
    }).catch((error)=>{
        console.log(error,"Registration failed, Try Again with a differet username")
        res.status(400).json({sucess:false,message:"Registration failed"});
    })
//     let user = await User.create('username':username,'password':hPwd).then(()=>{
//         console.log("Registration data successfully inserted inside data base.")
//         res.status(200).json({success:true});
//     }).catch((error)=>{
//         console.log(error,"Registration failed, Try Again with a differet username")
//         res.status(400).json({sucess:false});
//     }); // as 'username' field in the DB is unique it will fail if username already exists
 });

app.post("/login",async(req,res)=>
{
    console.log("index.js : app.post('/login'): request body = ",req.body);
    const {username,password} = req.body;

     // checking if username & password combo exist in mongoDB model 'User'
    const user = await User.findOne({username});
    const validPwd = await bcrypt.compare(password,user.password);
    console.log("user: ",user)
    if(!user && !validPwd)  // if no such combo exists
    {
        console.log("Login Failed.");
        res.status(400).json({success:false,message:"username or password not found"});
    }
    else
    {
        console.log("Logged In Successfully");
        const token = jwt.sign({id: user._id},"secret");

        res.status(200).json({success:true,token,userId:user._id,message:"Login into session"});
    }
    
});

app.post("/",async(req,res)=>
{
    console.log("index.js : app.post('/add'):request body: ",req.body);
    
    // inserting the JSON data in mongoDB model 'Product'
    let product = await Product.create(req.body).then(()=>{
        console.log("Product added successfully into data base.")
        res.status(200).json({success:true});
    }).catch((error)=>{
        console.log(error,"Product add failed.")
        res.status(400).json({sucess:false});
    }); 
});