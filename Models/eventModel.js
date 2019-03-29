let mongoose=require("mongoose");

let eventSchema=new mongoose.Schema({
    _id:Number,
    title:String,
    date:Date,
    mainSpeaker:{
        type:String,   
        ref:"speakers"
    },
    others:[{
        type:Number,
        ref:"speakers"
    }]

});




mongoose.model("events",eventSchema);