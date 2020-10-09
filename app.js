var express =require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require("passport");
var flash    = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var User  = require("./models/user");
const { rawListeners } = require('./models/campgrounds');
var Comment = require("./models/comment");


var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes       = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/campour', {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//seedDB();
//passport config
app.use(require("express-session")({
    secret: "yo yo yo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);

//Campground.create(
 //    {
  //      name: "granite hill",
  //      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
 //       description: "This ground is just for fun nothing serious"
 //   },
 //   function(err, campground){
 //       if(err){
//            console.log(err);
//        } else {
//            console.log("newly created camp");
//            console.log(campground);
    //    }
  //  }
//);



app.get('/', function(req,res){
    res.render('landing');
});

//==============
// comment routes
//===============




//authenticate routes

//show register form


const port = process.env.PORT || 3000 ;
app.listen(port, function(){
    console.log(port);
});