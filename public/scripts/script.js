/* global $ */
$(document).ready(function(){

    $("img.scale").imageScale();
    
    setInterval(function(){
        $("body").removeClass("preload");
    }, 200);
    
    window.setTimeout(function() {
      $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
      });
    }, 2500);

})

