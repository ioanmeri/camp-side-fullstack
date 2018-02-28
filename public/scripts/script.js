/* global $ */
$(document).ready(function(){

    $("img.scale").imageScale();
    
    setInterval(function(){
        $("body").removeClass("preload");
    }, 200);

})

