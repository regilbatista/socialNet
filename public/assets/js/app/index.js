$(document).ready(function() {
    
$(".delete-publi").on("click", function(e){
        e.preventDefault();
        
        if(confirm("esta seguro que quieres eliminar la publicacion?")){
        $(this).closest("#form-delete-publi").submit();
        }
})
 

$(".delete-friend").on("click", function(e){
    e.preventDefault();
    if(confirm("esta seguro que quieres eliminar este amigo?")){
       $(this).closest("#form-delete-friend").submit();
    }
})

$(".delete-event").on("click", function(e){
    e.preventDefault();
    if(confirm("esta seguro que quieres eliminar este evento?")){
    $(this).closest("#form-delete-event").submit();
    }
})

$(".delete-guests").on("click", function(e){
    e.preventDefault();
    if(confirm("esta seguro que quieres desinvitar a su amigo?")){
    $(this).closest("#form-delete-guests").submit();
    }
})


});

