const mongoose = require("mongoose");
const Car = require("./cars");
const Admin = require("./admin");
const model = require("./model");

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brandCars:[{type: mongoose.Schema.Types.ObjectId, ref:"Car"}],
    Author:{type: mongoose.Schema.Types.ObjectId, ref:'Admin'},
    Model:[{type: mongoose.Schema.Types.ObjectId, ref:'Model'}]
});

const Brand = new mongoose.model("Brand", brandSchema);
module.exports = Brand;