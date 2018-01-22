var express = require("express"),
router      = express.Router(),
Campground  = require("../models/campground"),
middlware   = require("../middleware"),
multer      = require('multer');
// IMAGE UPLOAD CONFIGURATION
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
}
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GOOGLE MAPS CONFIG
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_MAPS_KEY
};
var geocoder = NodeGeocoder(options);


//INDEX - show all campgrounds
router.get("/", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});


// CREATE - ADD NEW CAMPGROUND TO DB
router.post("/", middlware.isLoggedIn, upload.single("image"),  function(req, res){
    //get data from form and add to campgrounds array
    geocoder.geocode(req.body.location, function (err, data){
        if (err || data.status === "ZERO_RESULTS"){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        cloudinary.uploader.upload(req.file.path, function(result) {
          // add cloudinary url for the image to the campground object under image property
          req.body.campground.image = result.secure_url;
          // add author to campground
          req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        };
          //Create a new campground and save to DB
          Campground.create(req.body.campground, function(err, campground) {
            if (err) {
              req.flash('error', err.message);
              return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground.id);
      });
      });
    });
});


// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middlware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


// SHOW - PAGE FOR ONE CAMPGROUND
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middlware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// PUT - UPDATE CAMPGROUND IN THE DB
router.put("/:id", upload.single("image"), function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.status === "ZERO_RESULTS"){
        req.flash("error", "Invalid address");
        return res.redirect("back");
    } 
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.campground.image = result.secure_url;
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        };
        Campground.findByIdAndUpdate(req.params.id, {$set: req.body.campground}, function(err, campground){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        });
        
    });

});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middlware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//escape it for ddos
function escapeRegex(text) {
  return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


module.exports = router;