// seed the DB with fake data to check if comments work
var Campground = require("./models/campground");
var Comment  = require("./models/comment");

var data = [
{
    name: "Cloud 's Rest",
    image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},
{
    name: "Desert Mesa",
    image: "https://farm4.staticflickr.com/3053/2586934044_339a678e73.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},
{
    name: "Canyon Floor",
    image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},
];

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("remove campgrounds!");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();
                                console.log("Created new comment");
                            }
                            
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;