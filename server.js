var express = require("express");
var bodyParser=require("body-parser");
var app=express();
var PORT=process.env.PORT || 3000;
var todos=[];
var todoNextId=1;

app.use(bodyParser.json());


app.get("/", function(req,res){
    res.send("todo API root");
    
});

//app.GET

app.get("/todos",function(req,res){
    res.json(todos);
});

//app.GET by id
app.get("/todos/:id",function(req,res){
    var todoId=parseInt(req.params.id, 10);
    var itemFound=false;
    for(var i= 0; i<todos.length;i++){
        if (todoId===todos[i].id){
            res.json(todos[i]);
            itemFound=true;
            break;
        }
    }
    if (itemFound===false){res.status(404).send("not found");
    }
})

//app POST todos
app.post("/todos", function(req,res){
    var body=req.body;
    body.id=todoNextId;
    todoNextId++;
    todos.push(body)
    res.json(todos);
    
});

app.listen(PORT, function(){
    console.log("express listening to "+PORT);
});

