let mongoose=require("mongoose");
//let AutoIncrement = require('mongoose-sequence')(mongoose);

let speakerSchema=new mongoose.Schema({
    _id:Number,
    Name:{
        type:String,
        required:true
        // default:
    },
    replay:String,
    image:String,
    username:String,
    password:String,
    birthdate:String,
     gender:String,
  
    // ,
    // Address:{
    //     city:String
    // }
});

//speakerSchema.plugin(AutoIncrement, {inc_field: '_id'});

//mapping
mongoose.model("speakers",speakerSchema);

