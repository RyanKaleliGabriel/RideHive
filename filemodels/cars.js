const mongoose = require("mongoose");
const Brand = require("./brands");
const Admin = require("./admin");


//Cars Schema
const carsSchema = new mongoose.Schema({
    brand:{type: mongoose.Schema.Types.ObjectId, ref:'Brand'},
    firstName:{type: String},
    secondName:{type: String},
    year: {type: Number},
    engineCapacity: {type: Number},
    torque: {type: Number},
    horsepower: {type: Number},
    transmission: {type: String},
    fuelType:{type: String},
    description:{type: String},
    file:{
        data:Buffer,
        contentType:String
    },
    Author:{type: mongoose.Schema.Types.ObjectId, ref:'Admin'}
});

const Car = new mongoose.model("Car", carsSchema);
module.exports = Car;