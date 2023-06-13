//Currently required packages
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//All External models that have image uploads
const Brand = require("./filemodels/brands");
const Car = require("./filemodels/cars");

///configuring our middleware
const app = express();
app.use(bodyParser.urlencoded({ urlencoded: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized:false 
})); 

app.use(passport.initialize());
app.use(passport.session());

// Configuring Database Connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true}).then(()=>{
    console.log("Successfully connected to Mongo Database")
}).catch((err)=>{
    console.log("Couldn't Connect to Mongo Database", err)
});

//Creating collection schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 15,
  },
  Issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  UserWishList: { type: mongoose.Schema.Types.ObjectId, ref: "WishList" },
});

userSchema.plugin(passportLocalMongoose);
//Model for Users Schema
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//Issues schema
const issueSchema = new mongoose.Schema({
  issue: {
    type: String,
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
//Issues Model
const Issue = new mongoose.model("Issue", issueSchema);

//Comments schema
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
//Comments Model
const Comment = new mongoose.model("Comment", commentSchema);

//WishList Schema
const wishlistSchema = new mongoose.Schema({
  carsSaved: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
//Wishlist Model
const WishList = new mongoose.model("WishList", wishlistSchema);

//Home Route
app.get("/", function (req, res) {
  res.render("home")
});

//Edit Route
app.get("/edit", function (req, res) {
  
  res.render("edit");
});

//All Car Page
app.get("/cars", function (req, res) {
  if(req.isAuthenticated()){
    res.render("cars");
  }else{
    redirect("/login");
  }
  
});

//One Car Page
app.get("/car", function(req,res){
  res.render("car")
});

//Register Route
app.get("/register", function (req, res) {
  res.render("register")
});

//Login Route
app.get("/login", function (req, res) {
  res.render("login");
});

//Admins Page
app.get("/admin", function (req, res) {
  
  res.render("admin");
});

//Post Car(Admin) Route
app.get("/posts", function (req, res) {
  
  res.render("post");
});

//Brands Car(Admin) Route
app.get("/brands", function (req, res) {
  
  res.render("brands");
});
// Car(Admin) Route
app.get("/car-admin", function (req, res) {
  
  res.render("car-admin");
});
// Admin Users(Admin) Route
app.get("/admin-users", function (req, res) {
  
  res.render("admin-users");
});
//  Users(Admin) Route
app.get("/users", function (req, res) {
  
  res.render("users");
});
//  Post(Admin) Route
app.get("/post", function (req, res) {
  res.render("post");
});


app.post("/register", function(req,res){
  User.register({username:req.body.username, email:req.body.email}, req.body.password, function(err, user){
    if(err){
      console.error(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/login")
      });
    }
  });
});


app.post("/login", function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err)
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/cars")
      });
    }
  });
})



app.listen(process.env.PORT, function () {
  console.log("Server is running on port 3000");
});
