const mongoose = require("mongoose");
const Car = require("./cars");
const Admin = require("./admin");

const brandSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    file: {
        data:Buffer,
        contentType:String,
    },
    uploadTime:{
        type:Date,
        default:Date.now
    },
    brandName:{
        type:String,
        required:true
    },
    brandCars:[{type: mongoose.Schema.Types.ObjectId, ref:'Car'}],
    Author:{type: mongoose.Schema.Types.ObjectId, ref:'Admin'}
});


const Brand = new mongoose.model("Brand", brandSchema);
module.exports = Brand;