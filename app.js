//Currently required packages
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const _ = require("lodash");
require("dotenv").config();
const session = require('express-session');
const passport = require("passport");
const path = require("path");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrcreate = require('mongoose-findorcreate');
const fs = require("fs");
//All External models that have image uploads
const Brand = require("./filemodels/brands");
const Car = require("./filemodels/cars");
const Model = require("./filemodels/model");


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
  },
  email: {
    type: String,
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
  googleId:String,
  Issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  UserWishList: { type: mongoose.Schema.Types.ObjectId, ref: "WishList" },
});

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrcreate);
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

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/RideHive",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},

function(accessToken, refreshToken, profile, cb) {
  User.findOne({ googleId: profile.id }).then((foundUser) => {
      if (foundUser) {
        return foundUser;
      } else {
        const newUser = new User({
          googleId: profile.id
        });
        return newUser.save();
      }
    }).then((user) => {
      return cb(null, user);
    }).catch((err) => {
      return cb(err);
    });
}

));


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
  res.render("./app/home")
});

app.get("/auth/google", 
    passport.authenticate('google', {scope: ["profile"] })
);
app.get("/auth/google/RideHive", passport.authenticate("google", {failureRedirect:"/login"}),
function(req, res){
    res.redirect("/cars")
});



//All Car Page
app.get("/cars", function (req, res) {
  if(req.isAuthenticated()){
    res.render("./app/cars");
  }else{
    res.render("./app/login");
  }
});

//One Car Page
app.get("/car", function(req,res){
  res.render("./app/car")
});

//Register Route
app.get("/register", function (req, res) {
  res.render("./app/register")
});

//Login Route
app.get("/login", function (req, res) {
  res.render("./app/login");
});

//Admins Page
app.get("/admin", function (req, res) {
  res.render("./admin/admin");
});

//Brands Car(Admin) Route
app.get("/brands", function (req, res) {
  Brand.find({}).then((foundBrands)=>{
    if(foundBrands){
      Model.find({}).then((foundModels)=>{
        if(foundModels){
          res.render("./admin/brand/brands", {newBrands: foundBrands, newModels:foundModels});
        }
      })
    }
  }).catch((err)=>{
    console.error(err);
  })
});
app.get("/brand/post", function(req,res){
  res.render("./admin/brand/post")
});

app.get("/brand/edit/:brandId", function(req,res){
  const makeid = req.params.brandId;
  console.log(makeid)
  Brand.findOne({_id : makeid}).then((foundBrand)=>{
    res.render("./admin/brand/edit", {brandToEdit: foundBrand})
  }).catch((err)=>{
    console.error(err)
  });
});
app.post("/updatebrand", function(req,res){
  idUpdate = req.body.brandId;
  Brand.findByIdAndUpdate(idUpdate, {name:req.body.brandName}, {overwrite:true}).then((result)=>{
    res.redirect("/brands")
  }).catch((err)=>{
    console.error(err);
  })
})


// Car(Admin) Route
app.get("/car-admin", function (req, res) {
  Brand.find({}).then((foundbrands)=>{
    if(foundbrands){
      Model.find({}).then((foundmodels)=>{
        if(foundmodels){
          Car.find({}).then((foundcars)=>{
            if(foundcars){
              res.render("./admin/car/car-admin", {allbrands:foundbrands, allcars:foundcars})
            }
          })
        }
      });
    }
  });  
});


app.get("/car/post", function(req,res){
  res.render("./admin/car/post");
});
app.get("/car/edit/:carId", function(req, res){
  const carid = req.params.carId;
  Car.findOne({_id: carid}).then((foundCar)=>{
    if(foundCar){
      Model.find({}).then((foundmodels)=>{
        if(foundmodels){
          Brand.find({}).then((foundbrands)=>{
            if(foundbrands){
              res.render("./admin/car/edit", {cartoedit:foundCar, allbrands:foundbrands, allmodels:foundmodels})
            }
          })
        }
      })
    }
  }).catch((err)=>{
    console.log(err)
  });
  
});


//  Users(Admin) Route
app.get("/users", function (req, res) {
  res.render("./admin/user/users");
});



app.get("/model/edit/:modelId", function(req,res){
  modelIdToUpdate = req.params.modelId;
  Model.findOne({_id:modelIdToUpdate}).then((foundModel)=>{
    res.render("./admin/model/edit", {modelToEdit:foundModel});
  }).catch((err)=>{
    console.error(err);
    //Add a pop up
  });
});

app.post("/updateModel", function(req,res){
  idModelUpdate = req.body.modelId;
  Model.findByIdAndUpdate(idModelUpdate, {name:req.body.modelName}, {overwrite:true}).then((results)=>{
    console.log("Updated Successfully");
    //Add a popUp
    res.redirect("/models");
  }).catch((err)=>{
    console.error(err);
    //Add a Pop Up
  })
})


app.post("/register", function(req,res){
  User.register({username:req.body.username, email:req.body.email}, req.body.password, function(err, user){
    if(err){
      console.error(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/cars")
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

app.post("/postbrand", function(req,res){
  const brandname = req.body.brandName
  const lowercaseBrandname = _.lowerCase(brandname);

  Brand.findOne({name: {$regex: new RegExp('^' + lowercaseBrandname + '$', 'i')}}).then(existingBrand=>{
    if(existingBrand){
      console.log("Brand already exists");
      //add a pop up
    }else{
      const { brandName, models} = req.body;
      const brand = new Brand({
        name:brandName,
        models: Array.isArray(models) ? models: [models],
      });
      brand.save();
      res.redirect("/brands");
    }
  }).catch(err=>{
    console.error(err);
    res.status(500).send("Internal Server Error");
  });
});

app.post("/postmodel", function(req,res){
  const modelname = req.body.modelName;
  const lowercaseModelname = _.lowerCase(modelname);

  Model.findOne({name: {$regex: new RegExp('^' + lowercaseModelname + '$', 'i')}}).then(existingModel=>{
    if(existingModel){
      console.log("Model already exists");
      //Add a pop up
    }else{
      const model = new Model({
        name:modelname
      });
      model.save();
      res.redirect("/models")
    }
  }).catch(err=>{
    console.error(err);
    res.status(500).send("Internal Server Error");
  })
});

app.post("/deletebrand/:brandid", function(req,res){
  const brandid = req.params.brandid;
  Brand.findOneAndDelete({_id:brandid}).then((results)=>{
    //add a pop up
    res.redirect("/brands")
  }).catch((err)=>{
    //Add a pop up
    console.error(err)
  });
});

app.post("/deletemodel/:modelid", function(req,res){
  const modelid = req.params.modelid;
  Model.findOneAndDelete({_id:modelid}).then((results)=>{
    //Add a pop up
    res.redirect("/models")
  }).catch((err)=>{
    //Add a popup
    console.error(err)
  }); 
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Set the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Set the file name to be saved as
  }
});

var upload = multer({storage:storage})

app.post("/postcar", upload.single('image'), function(req,res){
  if(!req.file){
    return res.status(400).send('No file uploaded.');
  }
  const newCar = new Car({
    name:req.body.carName,
    year:req.body.year,
    description:req.body.description,
    brandid:req.body.carBrand,
    modelid:req.body.carModel,
    filename:req.file.filename,
    path:req.file.path,
    size:req.file.size
  })
  newCar.save().then(()=>{
    //Add a popup
    res.redirect("/car-admin")
    console.log("Successfully saved")
  }).catch(()=>{
    res.status(500).send('Failed to upload file.');
  });
});


app.post("/updatecar", upload.single('image'), function(req, res) {
  const carid = req.body.carId;
  Car.findOneAndUpdate({"_id":carid},
  {
    "$set":{
      "brandid": req.body.carBrand,
      "name": req.body.carName,
      "year": req.body.year,
      "modelid": req.body.carModel,
      "description": req.body.description,
      "filename": req.file.filename,
      "path": req.file.path,
      "size": req.file.size
    }
  }
  ).then((result)=>{
    res.redirect("/car-admin")
    console.log("Updated successfully")
  }).catch((err)=>{
    console.error(err)
  })
});

app.post("/deletecar/:carId", function(req,res){
  const carid = req.params.carId
  Car.findOneAndDelete({_id:carid}).then((results)=>{
    //add a pop up
    res.redirect("/car-admin")
    console.log("Deleted successfully");
  }).then((err)=>{
    console.error(err)
  });
});

app.get('/brand/:id/models', function(req,res){
  try{
    const brand = req.params.id;    
    Brand.findById(brand).then((foundBrand)=>{
      const models = foundBrand.models
      Model.find({_id: {$in:models}}).then(models =>{
        const modelOptions = models.map(model =>({
          value:model._id,
          label:model.name
        }));
        res.json(modelOptions);
      })
    })
  }catch(err){
    console.error(err)
  }
})
//Car models Rute
app.get("/brand/models/:id", function(req,res){
  // Model.find({}).then((foundModels)=>{
  //   res.render("./admin/model/models", {newModels:foundModels})
  // }).catch((err)=>{
  //   console.error(err)
  // });
  const brand = req.params.id;
  Brand.findById(brand).then((foundBrand)=>{
    const models = foundBrand.models;
    Model.find({_id: {$in:models}}).then(models =>{
      const modelOptions = models.map(model =>({
        value:model._id,
        label:model.name
      }))
      Model.find({}).then((foundModels)=>{
        const allmodels = foundModels
        if(foundModels){
          res.render("./admin/model/models", {newModels:allmodels, chosenModels:modelOptions})
        }
      })
      
    })
  })
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port 3000");
});
