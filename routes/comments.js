var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middleware = require("../middleware");



router.get("/new", middleware.isLoggedin , function(req, res){

    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });



    
});

router.post("/", middleware.isLoggedin , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "something went wrong!!!");
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!!!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//comment edit
router.get("/:comment_id/edit", middleware.checkUserComment ,function(req , res){
    Comment.findById(req.params.comment_id, function(err,found){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: found});
        }
    });
});

//comment update
router.put("/:comment_id", middleware.checkUserComment ,function(req , res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err , update){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    });

});

//delete comment route
router.delete("/:comment_id", middleware.checkUserComment ,function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;