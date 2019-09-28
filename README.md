# FullStack Application
*Based on the course: [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/) by Colt Steele*
[Visit CampSide](https://camp-side.herokuapp.com/ "Deployed Demo")

*Note: Initial load may take a while because inactive apps hibernate*

### Please note that this project is a work in progress.

A guest is able to explore different campgrounds. 

A user, after (s)he has **signed up** or **login**, is able to:
* add a new campground
* add comments to campgrounds
* see other users profile

and has a profile with:
* personal info
* his/her added campgrounds
* his/her comments

#### CampSide is a demonstration project and new feautures are added often.

So far CampSide supports:
* Landing Page
* Google Maps
* Image Upload
* In App Fuzzy Search
* Admin User Role Authorization
* Time since timestamp
* Node JS Password Reset
* Pagination Page
* Contact Form (currently not working, due to restriction of google's less secure apps)
* Login, Logout, SignUp
* User Authorization and authentication
* Editing and Deleting Comments
* Editing Profile (the frontend will be updated though)
* Flash messages


**Routers follow the RESTful pattern**

| ROUTE   |      HTTP Verb      |  PATH | Description |
|----------|:-------------|------| --------------|
| Root  | GET | "/" | landing page |
| Index | GET | "/campgrounds | List all the campgrounds |
| Create | POST | "/campgrounds" | Create new campground (if authenticated) |
| New camp | GET | "/campgrounds/new" | Show new campground form |
| Show one | GET | "/campgrounds/:id" | Show one detailed campground |
| Edit camp | GET | "/campgrounds/:id/edit" | Edit campground's info (if authorized) |
| Update | PUT | "/campgrounds/:id" | Update Campground in the DB |
| DESTROY | DELETE | "/campgrounds/:id" | Delete a campground (if authorized)|
| Login | GET |"/login" | Login Form| 
| Login | POST |"/login" | Handling User Login| 
| Register | GET |"/register" | Sign Up form | 
| Register | POST| "/register" | Handling Sign Up | 
| Logout| GET | "/logout" | Logout user |
| Forgot| GET | "/forgot" | Forgot Password Form |
| Forgot| POST | "/forgot" | Handling Forgot password Logic |
| Reset| GET | "/reset/:token" | Get a token to reset password|
| Reset| POST | "/reset/:token" | Confirm new password |
| User | GET | "/users/:id" | Visit user's profile (if authenticated |
| User | GET | "/users/:id/edit" | Edit user's profile (if authorized) |
| User | PUT | "/users/:id" | Update Users Profile (if authorized) |
| Comment New | GET | "/comments/new" | Show add comment form (if authenticated) |
| Comment Create | POST | "/comments" | add a comment in the DB (if authenticated) |
| Comment Edit | GET | "/:comment_id/edit" | Edit User's comment (if authorized) |
| Comment Update | PUT | "/:comment_id" | Edit comment in the DB (if authorized) |
| Comment Delete | DELETE | "/:comments_id" | Delete Users comment (if authorized)|
| Contact | GET | "/contact" | Show contact form |
| Contact | POST | "/send" | Handling contact logic |


### MODELS

#### UserSchema

| username  | password | avatar | firstName | lastName| email | city| birthday | bio |resetPasswordToken|resetPasswordExpire|isAdmin|
| -----     | ------    |----------| ----- | ------|-------------|---|---------|------|---------------|----------|-----|
| String unique| String| String  | String | String | String unique |String| String| String| String|Date|Boolean|


#### CampgroundSchema

| Name  | image | location | price | lat | lng |createdAt| author | comments |
| ----- | ------|----------| ----- | ------|------|------|-------|------------|
| String | String| String  | String | Number| Number| Date | id (ref: "User") | ref: "Comment"
|       |       |         |       |       |         |     |   username: String


#### commentSchema

| text  | createdAt | author |
| ----- | ------|----------| 
| String | Date | id (ref:"User") |
|       |       |    username: String|

