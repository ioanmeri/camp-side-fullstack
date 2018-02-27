# FullStack Application

[Visit CampSide](https://camp-side.herokuapp.com/ "Deployed Demo")
(The server may take a while to respond)

### Please note that this project is a work in progress.

A visitor is able to explore different campgrounds. 

A user, after (s)he has **signed up** or **login**, is able to:
* add a new campground
* add comments to campgrounds
* see other users profile

and has a profile with:
* personal info
* his/her added campgrounds
* his/her comments

**Routers follow the RESTful pattern**

#### CampSide is more like a playground and new feautures are added often.

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

