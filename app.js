//Currently required packages
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

//All External models that have image uploads
const Brand = require("./filemodels/brands");
const Car = require("./filemodels/cars");

///configuring our middleware
const app = express();
app.use(bodyParser.urlencoded({ urlencoded: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//Configuring Database Connection
// mongoose.set("strictQuery", true);
// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true}).then(()=>{
//     console.log("Successfully connected to Mongo Database")
// }).catch((err)=>{
//     console.log("Couldn't Connect to Mongo Database", err)
// });

//Creating collection schemas
const userSchema = new mongoose.Schema({
  fullNames: {
    type: String,
    required: true,
  },
  userName: {
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
//Model for Users Schema
const User = new mongoose.model("User", userSchema);

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
  console.log("This Page should be showing");
  res.render("home");
});

//About Page Route
app.get("/about", function (req, res) {
  console.log("This Page should be showing");
  res.render("about");
});

//Edit Route
app.get("/edit", function (req, res) {
  console.log("This Page should be showing");
  res.render("edit");
});

//All Car Page
app.get("/cars", function (req, res) {
  console.log("This Page should be showing");
  res.render("cars");
});

//One Car Page
app.get("/car", function(req,res){
  res.render("car")
});

//Register Route
app.get("/register", function (req, res) {
  console.log("This Page should be showing");
  res.render("register");
});

//Login Route
app.get("/login", function (req, res) {
  console.log("This Page should be showing");
  res.render("login");
});

//Admins Page
app.get("/admin", function (req, res) {
  console.log("This Page should be showing");
  res.render("admin");
});

//Post Car(Admin) Route
app.get("/posts", function (req, res) {
  console.log("This Page should be showing");
  res.render("post");
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port 3000");
});
