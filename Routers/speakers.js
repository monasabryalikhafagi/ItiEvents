let express=require("express"),
speakerRouter=express.Router(),
path=require("path"),
mongoose=require("mongoose"),

fs=require("fs");
multer=require("multer");
multerMW=multer({
    dest:path.join(__dirname,"..","publics","images")
});

require("../Models/speakerModel");
let speakerSchema=mongoose.model("speakers");
require("../Models/eventModel");
let eventSchema=mongoose.model("events");



speakerRouter.get("/profile/:id",(request,response)=>{
    response.locals.msg=request.flash("msg");
    
    eventSchema.find({$or:[{mainSpeaker:request.params.id},{"others":request.params.id}]},{title:1,_id:0},(error1,result1)=>{
       
       // eventsasigned=result1;
      console.log(result1);
   //  response.send(result);
   response.locals.speackerevent=result1;
    
    });
    speakerSchema.findOne({_id:request.params.id},(error,result)=>{

      
        if(!error){
           
      
      //  response.locals.speackerevent=eventsasigned;
        //    //console.log(eventsasigned);
            response.render("speakers/profile",{speakers:result});
        }
 //response.send(result);
    });

  //  response.render("speakers/profile");
   // response.render("../views/speakers/profile");
}) 
speakerRouter.get("/editeprofile/:id",(request,response)=>{
    speakerSchema.findOne({_id:request.params.id},(error,result)=>{
        response.render("speakers/editeprofile",{speaker:result});
    });  

})
speakerRouter.post("/editeprofile/:id"/*,multerMW.single("speakerImage")*/,(request,response)=>{
 
    //fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});

    speakerSchema.updateOne({_id:request.params.id},{
        "$set":{
            Name:request.body.name,
          //  image:request.file.originalname,
            username:request.body.username,
            password:request.body.password,
            birthdate:request.body.birthdate,
            gender:request.body.gender
        }
    },(error)=>{
        if(!error)
        {
           // response.send("done");
           response.redirect("/speakers/profile/1");
        }
       // response.send(" not done");
    })
       // response.redirect("/speakers/profile/:id");
    });

    // speakerRouter.get("/editprofile/:id",(request,response)=>{
    //     console.log("hello");
    //     speakerSchema.findOne({_id:request.params.id},(error,result)=>{
    //         response.render("speakers/editeprofile",{speaker:result})
    
    //     });
    // })


     

speakerRouter.get("/list",(request,response)=>{
    
    speakerSchema.find({},(error,result)=>{
        if(!error)
        response.render("speakers/speakerslist",{speakers:result});

    });//list
    
    // response.send("LIST");
})
speakerRouter.get("/add",(request,response)=>{
    
    
    
    response.render("speakers/addspeaker");
})
speakerRouter.post("/add",multerMW.single("speakerImage"),(request,response)=>{
    console.log(request.body);
    console.log(request.body.speakerImage);
    console.log(request.file.path);
console.log(request.file.originalname);
   console.log(request.file.destination);
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
     console.log(request.body);
    console.log(request.file);
    response.send(request.file);
 

    let speaker=new speakerSchema({
         _id:request.body.id,
        Name:request.body.name,
        image:request.file.originalname,
        username:request.body.username,
        password:request.body.password,
        birthdate:request.body.birthdate,
        gender:request.body.gender,
    });

    speaker.save((err)=>{


        if(!err)
        {
            // response.send("DONE")
            response.redirect("/speakers/list");
        }
        else
        {
            console.log(err);
        }
    })

})
speakerRouter.get("/edit/:id",(request,response)=>{
    speakerSchema.findOne({_id:request.params.id},(error,result)=>{
        response.render("speakers/editSpeaker",{speaker:result})

    });
})
speakerRouter.post("/edit/:id",multerMW.single("speakerImage"),(request,response)=>{
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});

    speakerSchema.update({_id:request.params.id},{
        "$set":{
            Name:request.body.name,
            image:request.file.originalname,
            username:request.body.username,
            password:request.body.password
        }
    },(error)=>{
        if(!error)
        { 
            response.redirect("/speakers/list");
        }
    });


})

speakerRouter.get("/delete/:id",(request,response)=>{
    speakerSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/speakers/list");
    })
});
speakerRouter.get("/accept/:id",(request,response)=>{
    console.log("hell");
    speakerSchema.updateOne({_id:request.params.id},{
    "$set":{
        replay:"Accept" 
    }},(error)=>{
    if(!error)
    { console.log("hell");
        response.redirect("/speakers/profile/speakers._id");
    }else{
        console.log(error);
    }
});

});
speakerRouter.get("/regict/:id",(request,response)=>{
    console.log("hell");
    speakerSchema.updateOne({_id:request.params.id},{
        
        "$set":{
            replay:"regiect",
            
        }},(error)=>{
        if(!error)
        { console.log("hell");
            response.redirect("/speakers/profile/speakers._id");
        }else{
            console.log(error);
        }
    });  
});

speakerRouter.get("/logout",(request,response)=>{
    request.session.destroy((error)=>{
        response.cookie("lastAccess",new Date());

        response.redirect("/login");
    });
});


module.exports=speakerRouter;