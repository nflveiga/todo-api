function getreq(){
            $.get( "/todos", function( data ) {
                $( ".result" ).html( data[0].description );
                 
  console.log(data);
});
};

function postTodo(){
    var descricao=$("#descricao").val();
    console.log(descricao);
    
    var data=JSON.stringify({description:descricao, completed:"false"});
    console.log(data);
        $.ajax({
            type:"POST",
            url:"/todos",
            data: data,
            contentType:"application/json;charset=utf-8",
            dataType:"json",
            success:function(){
                console.log("cool")
            },
            error:function(){
                console.log("erro")
            }
        });
}