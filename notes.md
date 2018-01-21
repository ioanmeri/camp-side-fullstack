#CampSide
*Add Landing Page
*Add Campgrounds Page that lists all campgrounds

Each Campground has: Name, Image..

#Layout and Basic Styling
*Create our header and footer partials
*Add in Bootstrap

#Creating New Campgrounds
*Setup new campground POST route
*Add in body-parser
*Setup route to show form
*Add basic unstyled form
    
#Style the campgrounds page

#Style the Navbar and Form
*Add a better header/ title
*Make a campgrounds display grid
*Add a navbar to all templates
*Style the new campground form

#Add Mongoose
*Install and configure mongoose
*Setup campground model
*Use campground model inside of routes

#Show Page
*RESTful routes
*Add description to the campground model
*Add a show route/template

#Refactor Mongoose Code
*Create a models directory
*Use module.exports
*Require evertything correctly

#Add Seeds File
*Add a seeds.js file
*Run the seeds file every time the server starts

#Add a Comment model!
*Make errors go away
*Display comments on campground show page

#Comment New/Create
*Nested routes
*Add the comment new and create routes
*Add the new comment form
    
##Style Show Page
*Add sidebar to show page
*Display comments nicely

##Finish Styling Show Page
*Add public directory
*Add custom stylesheet

##Add User Model
*Install all packages needed for auth
*Define User model

##Auth - Register
*Configure Passport
*Add register routes
*Add register template

##Auth -Login
*Add login routes
*Add login template

##Auth - Logout/NavBar
*Add logout route
*Prevent user from adding a comment if not signed in
*Add link to navbar
*Show/hide auth links correctly

##Auth - Show/Hide Links
*Show/hide auth links in navbar correctly

#Editing Comments
*Add Edit route for comments
*Add Edit button
*Add Update route

/campgrounds/:id/edit
/campgrounds/:id/comments/:comment_id/edit

#Deleting Comment
*Add Destroy route
*Add Delete button

Campgrounds Destroy Route : /campgrounds/:id
Comment Destroy Route: /campgrounds/:id/comments/:comment_id

#Authorization: Comments
*User can only edit his/her comments
*User can only delete his/her comments
*Hide/Show edit and delete buttons
*Refactor Middleware

#Adding in Flash
*Demo working version
*Install and configure connect-flash
*Add bootstrap alerts to the header

#UI Improvements
*Style Login and Sign Up Views
*Update the nav-bar menu

#Add Google Maps

#Time Since timestamp

#Admin User Role Authorization

#Add User Profile

#Node JS Password Reset

#In App Fuzzy Search

#Image Upload
    
#Show Page Comments Refactor

#Pagination Page Feature

#reCaptcha for user signup 

#Contact Form