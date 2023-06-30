const mongoose = require("mongoose");
const Brand = require("./brands");
const Admin = require("./admin");
const Model = require("./model");


//Cars Schema
const carsSchema = new mongoose.Schema({
    brandid:{type: mongoose.Schema.Types.ObjectId, ref:'Brand'},
    name:{type: String},
    year:{type:String},
    modelid:{type: mongoose.Schema.Types.ObjectId, ref:'Model'},
    description:{type: String},
    filename:{type: String},
    path:{type: String},
    size:{type: String}
});

const Car = new mongoose.model("Car", carsSchema);
module.exports = Car;