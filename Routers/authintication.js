 let express=require("express"),
    authRouter=express.Router(),
    path=require("path"),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    fs=require("fs"),
    speakerRouter=require("./speakers");
    require("../Models/speakerModel");
    let speakerSchema=mongoose.model("speakers");
    authRouter.use("/speakers",speakerRouter);
    multer=require("multer");
multerMW=multer({
    dest:path.join(__dirname,"..","publics","images")
});
    authRouter.get("/login/:id?",(request,response)=>{
        // response.send("Login GET");
       //console.log( request.query);   ?name=eman&age=30;
       console.log(request.params.id);
        // response.sendFile(path.join(__dirname,"..","views","auth","login.html"));
        response.locals.msg=request.flash("msg");
        response.render("auth/login");
    });
    authRouter.post("/login",/*bodyParser.urlencoded(),*/(request,response)=>{
        console.log(request.body)
       
        if(request.body.UserName=="eman" && request.body.UserPassword=="123")
        {
            if(request.cookies.lastAccess)
            response.cookie("lastAccess",new Date());
            request.session.userName=request.body.UserName;
            request.session.userPassword=request.body.UserPassword;
              

                response.redirect("/admin/profile");
        } else if(request.body.UserName=="speaker" && request.body.UserPassword=="456"){
            if(request.cookies.lastAccess)
            response.cookie("lastAccess",new Date());
            request.session.userName=request.body.UserName;
            request.session.userPassword=request.body.UserPassword;
            response.redirect("/speakers/profile/1");
        }
        else
        {
            request.flash("msg","User Name or Password is incotrrected")
            response.redirect("/login");
        }


        // response.send("Login POST");

    });
    authRouter.get("/register",(request,response)=>{
        response.render("users/register")

    });
    authRouter.post("/register",multerMW.single("speakerImage"),(request,response)=>{
    
            //console.log(request.file.path);
           // console.log(request.file);
            fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
            // console.log(request.body);
            // console.log(request.file);
            // response.send(request.file);
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
                    response.redirect("/speakers/profile/:speaker._id");
                }
                else
                {
                    console.log(err);
                }
            })
        
        
    });
    authRouter.get("/logout",(request,response)=>{
        request.session.destroy((error)=>{
            response.cookie("lastAccess",new Date());

            response.redirect("/login");
        });
    });




    module.exports=authRouter;