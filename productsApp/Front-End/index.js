/* add "type":"module" in package.json to make the below import works */
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const root_dir = "/Users/indiraus/Desktop/The-Room-Assignment/productsApp";
const port = 3000; 
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded());

app.listen(port,()=>{
    console.log(`Express app listening on port http://localhost:${port}`)
});

// respond with "hello world" when a GET request is made to the homepage
app.get("/",(req,res)=>
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
app.get("/add",(req,res)=>
{
    res.sendFile("Front-End/addProduct.html",{root: root_dir})
});