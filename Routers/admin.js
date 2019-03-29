let express=require("express"),
adminRouter=express.Router(),
path=require("path");
mongoose=require("mongoose");
require("../Models/speakerModel");
let speakerSchema=mongoose.model("speakers");

adminRouter.get("/profile/:id?",(request,response)=>{
    // response.sendFile(path.join(__dirname,"..","views","admin","profile.html",username,image));
    response.locals.age=20;
    request.cookies.lastAcess;
    response.render("admin/profile",{userName:"eman",names:["ahmed","ali","mona"],imgSrc:""});

});
adminRouter.get("/getspearker/:id",(request,response)=>{
    console.log("hello");
speakerSchema.findOne({_id:request.params.id},(error,result)=>{
        if(!error){
            console.log(result);
response.locals.speakerdata=result;
response.send(result);
//response.redirect("/admin/profile");
}else{
    console.log(error);
}
});

});

adminRouter.get("/getspearker",(request,response)=>{
    console.log("hello");
speakerSchema.find({},(error,result)=>{
        if(!error){
            console.log(result);
response.locals.speakerdata=result;
response.send(result);
//response.redirect("/admin/profile");
}else{
    console.log(error);
}
});

});

module.exports=adminRouter;