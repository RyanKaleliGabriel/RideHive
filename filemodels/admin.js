const mongoose = require("mongoose");
const Brand = require("./brands");
const Car = require("./cars");

//Admin Schema
const adminSchema = new mongoose.Schema({
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
    },
    carsPosted: [{type: mongoose.Schema.Types.ObjectId, ref:'Car'}],
    brandsPosted: [{type: mongoose.Schema.Types.ObjectId, ref:'Brand'}]
});

//Admin Model
const Admin = new mongoose.model("Admin", adminSchema);
module.exports = Admin;