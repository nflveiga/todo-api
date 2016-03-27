function getreq(){
            $.get( "/todos", function( data ) {
                for(var i=0;i<data.length;i++)
                $( ".result" ).append( "<p>"+data[i].description+"</p>" );
                 
  console.log(data);
});
};

function postTodo(){
    var descricao=$("#descricao").val();
    console.log(descricao);
    
    var data=JSON.stringify({description:descricao, completed:false});
    console.log(data);
        $.ajax({
            type:"POST",
            url:"/todos",
            data: data,
            contentType:"application/json;charset=utf-8",
            dataType:"JSONP",
            success:function(response){
                console.log("cool")
            },
            error:function(response){
                console.log(response.status + " " + response.statusText);

            }
        });
}