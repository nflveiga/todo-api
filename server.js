var express = require("express");
var bodyParser=require("body-parser");
var _=require("underscore");
var app=express();
var PORT=process.env.PORT || 3000;
var todos=[];
var todoNextId=1;

app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));


app.get("/", function(req,res){
    res.send("public/index.html");
    
});



//GET by completed: true

app.get("/todos", function(req,res){
    var queryParams=req.query;
    var filteredTodos=todos;
    
    if(queryParams.hasOwnProperty("completed")&& queryParams.completed==="true"){
        filteredTodos=_.where(filteredTodos,{completed:true})
    }
    else if(queryParams.hasOwnProperty("completed")&& queryParams.completed==="false"){
        filteredTodos=_.where(filteredTodos,{completed:false})
    };
    res.json(filteredTodos);
    
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
app.post("/todos/", function(req,res){
    var body= req.body;
    console.log(body.description);
    body=_.pick(body,"description", "completed");
    console.log(body);
    
    if(!_.isBoolean(body.completed)|| !_.isString(body.description) || body.description.trim().length===0){
        return res.status(400).send("erro do caralho");
        console.log("errrrrro");
    };
    console.log(body);
    
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

//PUT - actualizar todos
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

