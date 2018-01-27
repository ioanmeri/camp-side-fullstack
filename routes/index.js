var express = require("express"),
router      = express.Router(),
passport    = require("passport"),
User        = require("../models/user"),
Campground  = require("../models/campground"),
Comment     = require("../models/comment"),
async       = require("async"),
nodemailer  = require("nodemailer"),
crypto      = require("crypto"),
request     = require("request"),
multer      = require("multer"),
methodOverride  = require("method-override"),
session = require('express-session');

router.use(methodOverride("_method"));
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




//ROOT ROUTE
router.get("/", function(req, res){
  res.render("landing");
});

// ======================
// AUTH ROUTES
// ======================

//SHOW REGISTER FORM
router.get("/register", function(req, res) {
  res.render("register", {page: "register"});
});

//HANDLE SIGN IN LOGIC
router.post("/register", function(req, res){
  const captcha = req.body["g-recaptcha-response"];
  if (!captcha) {
    console.log(req.body);
    req.flash("error", "Please select captcha");
    return res.redirect("/register");
  }
    // secret key
    var secretKey = process.env.CAPTCHA;
    // Verify URL
    var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    // Make request to Verify URL
    request.get(verifyURL, (err, response, body) => {
      // if not successful
      if (body.success !== undefined && !body.success) {
        req.flash("error", "Captcha Failed");
        return res.redirect("/register");
      }
      var newUser = new User(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        bio: req.body.bio
      });
      newUser.avatar = "/images/no-user-image-square.jpg";
      if(req.body.adminCode === process.env.ADMINCODE){
        newUser.isAdmin = true;
      }
      User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to the CampSide " + user.username);
          res.redirect("/campgrounds");
        });
      });
    });
  });

//SHOW LOGIN FORM
router.get("/login", function(req, res) {
  res.render("login", {page: "login"});
});

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
{
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res) {
});


//LOUGOUT ROUTE
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

//FORGOT PASSWORD
router.get("/forgot", function(req, res) {
  res.render("forgot");
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'nemesis4egos@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if(err){
          console.log(err);
          req.flash("error", "Something went wrong... Please try again later!");
          return res.redirect("/forgot");
        }
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

//Confirm New Password
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
          req.flash("error", "Passwords do not match.");
          return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'nemesis4egos@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'nemesis4egos@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
    ], function(err) {
      res.redirect('/campgrounds');
    });
});



//USERS PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
      req.flash("error","Something went wrong.");
      return res.redirect("/");
    }
        //find all the posts of a user
        Campground.find().where("author.id").equals(foundUser._id).exec(function (err, campgrounds ){
          if(err){
            req.flash("error","Something went wrong.");
            res.redirect("/");
          }
          res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
      });
});

//add middleware
router.get("/users/:id/edit", function(req, res) {
  User.findById(req.params.id, function(err, user) {
      if(err || !user){
        //or not the owner
        console.log(err);
        req.flash("error","Something went wrong.");
        return res.redirect("back");
      }
      Campground.find().where("author.username").equals(user.username).exec(function (err, campgrounds){
        if (err){
          req.flash("error","Something went wrong.");
          res.redirect("/");
        }
        res.render("users/edit", {user: user, campgrounds: campgrounds});
      });
      
  });
  
});


//PUT - UPDATE USER PROFILE IN THE DB
// router.put("/users/:id", function(req, res){
//   // cloudinary.uploader.upload(req.file.path, function(result){
//     // req.body.user.avatar = result.secure_url;
//     User.findByIdAndUpdate(req.params.id, {$set: req.body.user}, function(err, user){
//       if (err){
//         req.flash("error", err.message);
//         return res.redirect("back");
//       }
//       Campground.update({_id: author._id}, {$set: {author.username: user.username}});
//       req.flash("success", "Your profile is updated!");
//       res.redirect("/users/" + user._id);
//       });

// });


router.put("/users/:id", function(req, res){
  User.findByIdAndUpdate(req.params.id, {$set: req.body.user}, {new: true}, function(err, user){
    if(err || !user){
      req.flash("error", err.message);
      return res.redirect("back");
    }
    Campground.update({"author.id": user._id}, {$set: {"author.username": user.username}}, function(err, updatedCampground){
      if(err){
        return res.redirect("back"); 
      }
      Comment.update({"author.id": user._id}, {$set: {"author.username":user.username}}, function(err, updatedComment){
        if(err){
          return res.redirect("back");
        }
        req.login(user, function(err){
          if (err){
            return res.redirect("back");
          }
        });
        req.flash("success", "Your profile is updated!");
        res.redirect("/users/" + user._id);
      });
    });
  });
});






module.exports = router;