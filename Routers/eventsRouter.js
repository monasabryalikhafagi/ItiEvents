let express=require("express"),
eventRouter=express.Router(),
path=require("path"),
mongoose=require("mongoose");

require("../Models/speakerModel")
require("../Models/eventModel")

let eventSchema=mongoose.model("events");
let speakerSchema=mongoose.model("speakers");

eventRouter.get("/add",(request,response)=>{

    speakerSchema.find({},(error,result)=>{
        response.render("events/addevent",{speakers:result});

    })
})
eventRouter.post("/add",(request,response)=>{
    console.log("hello");
    console.log(request.body.id+" "+request.body.name+" "+request.body.mainSpeaker+" "+request.body.otherSpeakers);
    let event=new eventSchema({
      _id:request.body.id,
        title:request.body.name,
        date:request.body.date,
        mainSpeaker:request.body.mainSpeaker,
        others:request.body.otherSpeakers
    });
    console.log(event);
    console.log("hell");
    event.save((error)=>{
        if(!error){
        console.log("hell");
        response.redirect("/events/list");  
    }else{
        console.log(error);
    }
    });
})
eventRouter.get("/list",(request,response)=>{

    // eventSchema.find({},(error,result)=>{
    //     response.render("events/eventslist",{events:result});

    // })
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
       
        response.render("events/eventslist",{events:result});

    })

})
eventRouter.get("/edit/:id",(request,response)=>{
eventSchema.findOne({_id:request.params.id}).populate({"path":"mainSpeaker others"}).then((result)=>{
       //console.log(result);
       //console.log(result.mainSpeaker.Name);

       /// console.log(result.others[0].Name);
        console.log(result);
     //  response.send(result);
        speakerSchema.find({},{Name:1,_id:-1},
            (error,rest)=>{
                console.log("hell from allspecker")
            allspecker=rest
            console.log(allspecker);
            });
           response.locals.myspeaker=allspecker 
            console.log(result+"hh"); 
     response.render("events/editevent",{events:result});

    });
 


});
eventRouter.post("/edit/:id",(request,response)=>{
   // console.log(request.body.title,request.body.mainSpeaker,request.body.otherSpeakers);
     maspeakerid=speakerSchema.findOne({})
    eventSchema.update({_id:request.params.id},{
        "$set":{
            title:request.body.title,
            mainSpeaker:request.body.mainSpeaker,
            others:request.body.otherSpeakers
            
        }
    },(error)=>{
 if(!error)
        { console.log("hell");
            response.redirect("/events/list");
        }else{
            console.log(error);
        }
     } );
    });
    eventRouter.get("/delete/:id",(request,response)=>{
        eventSchema.deleteOne({_id:request.params.id},(error)=>{
            if(!error)
            response.redirect("/events/list");
        })
    });





module.exports=eventRouter;