var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var User        = require("../models/user");

var middlwareObj = {};
middlwareObj.checkCampgroundOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");   
                }
            }
        });
} else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
}
};


middlwareObj.checkProfileOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error", "User not found");
                res.redirect("back");
            } else {
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","Sorry! You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","Sorry! You need to be logged in to do that");
        res.redirect("back");
    }
};

middlwareObj.checkCommentOwnership = function(req, res, next) {
   if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err || !foundComment) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
                //does user own the comment?, req.user._id from password
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");   
                }
            }
        });
} else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
}
};


middlwareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};



module.exports = middlwareObj;