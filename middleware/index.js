var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkUserComment = function(req,res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found){
            if(err){
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "you don't have the permission to do that!!!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to login to do that!!!");
        res.redirect("back");

    }
}

middlewareObj.checkUser = function(req,res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, found){
            if(err){
                req.flash("error", "campground not found!!!");
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "you don't have the permission to do that!!!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to login to do that!!!");
        res.redirect("back");

    }
}

middlewareObj.isLoggedin  = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you need to login first!!!");
    res.redirect("/login");
}


module.exports = middlewareObj;