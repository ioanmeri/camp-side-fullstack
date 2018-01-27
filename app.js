var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
flash           = require("connect-flash"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
methodOverride  = require("method-override"),
User            = require("./models/user"),
seedDB          = require("./seeds");


require('dotenv').config();
//requiring routes
var commentRoutes   = require("./routes/comments"),
campgroundRoutes    = require("./routes/campgrounds"),
indexRoutes         = require("./routes/index"),
contactRoutes       = require("./routes/contact");

mongoose.connect("mongodb://localhost/camp_side_v2");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// seedDB();


// PASSPORT CONFIGURATIONS
app.use(require("express-session")({
    secret: "Once again Rusty wind cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// will be called in every route to check if user is logged in
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})



app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/contact", contactRoutes);
//gia na perasei to :id, prepei sto comments.js mergeParams: true

app.get("*", function(req, res){
    res.send("Sorry, page not found..");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The CampSide Server is Running!!");
});