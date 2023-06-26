const mongoose = require("mongoose");
const Brand = require("./brands");

const modelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brand:{type: mongoose.Schema.Types.ObjectId, ref:"Brand"}
});

const Model = new mongoose.model("Model", modelSchema);
module.exports = Model;

