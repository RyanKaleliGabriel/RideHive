const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({urlencoded:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//Configuring Database Connection
mongoose.set("strictQuery", true);
mongoose.connect('mongodb://127.0.0.1:27017:/rideHiveDB', {useNewUrlParser:true});

//Creating collection schemas
const userSchema = new mongoose.Schema({
    fullNames:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        minLength:8,
        maxLength:15,
        }
})






//Home Route
app.get("/", function(req, res){

});

//About Page Route
app.get("/about", function(req,res){

});

//Edit Route
app.get("/edit", function(req, res){

});

//Comment Route
app.get("/comment", function(req,res){

});

//Problems Route
app.get("/problem", function(req,res){

});

//One Care Page
app.get("/car", function(req,res){

});

//Many Cars page
app.get("/cars", function(req, res){

});

//Register Route
app.get("/register", function(req,res){

});

//Login Route
app.get("/login", function(req,res){

});

//Admins Page
app.get("/admin", function(req,res){

});

//Post Car(Admin) Route
app.get("/posts", function(req,res){

});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})