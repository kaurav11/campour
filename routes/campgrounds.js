var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");


router.get('/', function(req,res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', {campgrounds: allcampgrounds, page: 'campgrounds'});

        }
    });
});
router.post('/', middleware.isLoggedin ,function(req,res){
    var name= req.body.name;
    var price = req.body.price;
    var image= req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcamp = {name: name, price: price, image: image, description: desc, author: author}
    Campground.create(newcamp, function(err, newly){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
    
});
router.get('/new', middleware.isLoggedin , function(req, res){
    res.render('campgrounds/new');
});

router.get('/:id', function(req, res){

    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            console.log(err);
        } else {
            console.log(found);
            res.render('campgrounds/show', {campground: found});
        }
    });

    
});

//edit the campground
router.get("/:id/edit", middleware.checkUser, function(req,res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", { campground: found});
        }
    });
   
});
//update 
router.put("/:id", middleware.checkUser , function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy the campground route
router.delete("/:id", middleware.checkUser , function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;