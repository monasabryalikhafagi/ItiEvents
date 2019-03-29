let express=require("express"),
    morgan=require("morgan"),
    authRouter=require("./Routers/authintication"),
    adminRouter=require("./Routers/admin"),
    speakerRouter=require("./Routers/speakers"),
    eventRouter=require("./Routers/eventsRouter"),
    path=require("path"),
    bodyParser=require("body-parser"),
    express_session=require("express-session"),
    connect_flash=require("connect-flash"),
    cookie_parser=require("cookie-parser"),
    mongoose=require("mongoose");

    require("./Models/eventModel");
let eventSchema=mongoose.model("events");

 //express_ejs_layouts=require("express-ejs-layouts");
    mongoose.connect("mongodb://localhost:27017/itiEvents");
//open server
let server=express();
function handleRequestMW(request,response,next)
{
    console.log(request.url,request.method);
    next();
    // response.send("Helloo From Server");
}
//*******************middlewares */
//1- first Middleware
// server.use(handleRequestMW);
server.use(morgan("short"));

//2- second MW
server.use((request,response,next)=>{
    let minites=(new Date()).getMinutes();
    // if(minites>20)
    // {
    //     console.log("OK");
        next();
    // }
    // else{
    //     console.log("Error");
    //     // response.send("Error");
    //     next(new Error("not Authorized"));
    // }
});


//3-error
server.use((error,request,response,next)=>{
 
   
    response.send("Error "+error);

});


/********************* Routings */
server.set("view engine","ejs");
server.set("views",path.join(__dirname,"views"));
 //server.use(express_ejs_layouts);
 //server.set("layout",path.join("layouts","layout"));
server.use(express.static(path.join(__dirname,"publics")));
server.use(express.static(path.join(__dirname,"node_modules","jquery","dist")));
server.use(express.static(path.join(__dirname,"node_modules","bootstrap","dist")));
server.use(bodyParser.urlencoded());
server.use(express_session({
    secret:"Eman Fathi"
    // ,    cookie:{maxAge:1000}
}));
server.use(connect_flash());
server.use(cookie_parser());



server.use(/\//,(request,response)=>{
    eventSchema.find({date:new Date()},(error,result)=>{
     if(!error){
       console.log(result);
        response.render("index",{events:result,greaeting:"hello"});
     }
    })



});
server.use(authRouter);
server.use("/speakers",speakerRouter);
server.use((request,response,next)=>{

        if(request.session.userName&& request.session.userPassword)
        {
            response.locals.userName=request.session.userName;
            next();
        }
        else
        {
            request.flash("msg","Session ended ......")
            response.redirect("/login");
        }
});


server.use("/admin",adminRouter);

server.use("/events",eventRouter);
server.use((request,response)=>{
    response.send("Not Found");

});


let port=process.env.port||8080;
server.listen(8080,function(){
    console.log("I am Listening ........");
});
