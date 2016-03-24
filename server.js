var express = require("express");
var bodyParser=require("body-parser");
var _=require("underscore");
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
    var matchedTodo=_.findWhere(todos, {id:todoId});
        if (matchedTodo){
            res.json(matchedTodo);
        }
    else{
        res.status(404).send("not found");
    };
})

//app POST todos
app.post("/todos", function(req,res){
    var body=_.pick(req.body,"description", "completed");
    
    if(!_.isBoolean(body.completed)|| !_.isString(body.description) || body.description.trim().length===0){
        return res.status(400).send();
    };
    
    body.description=body.description.trim();
    body.id=todoNextId;
    
    todoNextId++;
    
    todos.push(body)
    res.json(todos);
    
});

//DELETE /todos/:id

app.delete("/todos/:id",function(req,res){
    var todoId=parseInt(req.params.id, 10);
    var matchedTodo=_.findWhere(todos, {id:todoId});
    if (matchedTodo){
            console.log("DELETED");
            todos=_.without(todos, matchedTodo);
        res.json(matchedTodo);
        }
    else{
        res.status(404).send({"error":"No such todo"});
    
}})

//PUT
app.put("/todos/:id",function(req,res){
    
    var body=_.pick(req.body, "description","completed");
    var validAttributes={};
    var todoId=parseInt(req.params.id, 10);
    var matchedTodo=_.findWhere(todos, {id:todoId});
    
    if(!matchedTodo){
        return res.status(404).send();
    }
    
    if(body.hasOwnProperty("completed")&&_.isBoolean(body.completed)){
       validAttributes.completed=body.completed;
       }
    else if(body.hasOwnProperty("completed")){
        return res.status(400).send();
    };
    if(body.hasOwnProperty("description")&&_.isString(body.description)&& body.description.trim().length>0){
        validAttributes.description=body.description.trim();
    }
    else if(body.hasOwnProperty("description")){
        return res.status(400).send();
    };
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
    
    
})

app.listen(PORT, function(){
    console.log("express listening to "+PORT);
});

