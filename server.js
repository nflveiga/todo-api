var express = require("express");
var bodyParser=require("body-parser");
var _=require("underscore");
var db = require("./db.js")
var app=express();
var PORT=process.env.PORT || 3000;
var todos=[];
var todoNextId=1;

app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));


app.get("/", function(req,res){
    res.send("public/index.html");
    
});



//GET by completed: true - /todos?completed=true&q=work

app.get("/todos", function(req,res){
    var query=req.query;
    var where={};
    
    
    if(query.hasOwnProperty("completed")&& query.completed==="true"){
        where.completed=true;
    }
    else if(query.hasOwnProperty("completed")&& query.completed==="false"){
        where.completed=false;
    };
    if(query.hasOwnProperty("q")&& query.q.length>0){
        where.description={
            $like: "%"+query.q+"%"
        }
    };
        db.todo.findAll({where:where}).then(function(todos){
           res.json(todos); 
        }, function(e){
            res.status(500).send();
        })
    
    
});


//app.GET by id
app.get("/todos/:id",function(req,res){
    var todoId=parseInt(req.params.id, 10);
    
    db.todo.findById(todoId).then(function(todo){
            if(!!todo){
                res.json(todo.toJSON())
            }else{
                res.status(404).send();
            };
        }, function(e){
        return res.status(500).send();
    }

    );
    //var matchedTodo=_.findWhere(todos, {id:todoId});
      //  if (matchedTodo){
        //    res.json(matchedTodo);
    //    }
    //else{
      //  res.status(404).send("not found");
    });

//app POST todos
app.post("/todos/", function(req,res){
    var body= req.body;
    
    body=_.pick(body,"description", "completed");
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    },function(e){
        return res.status(400).toJSON(e);
    })
    
    //if(!_.isBoolean(body.completed)|| !_.isString(body.description) || body.description.trim().length===0){
      //  return res.status(400).send();
    //};

    
    //body.description=body.description.trim();
    //body.id=todoNextId;
    
    //todoNextId++;
    
    //todos.push(body)
    //res.json(todos);
    
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
    
    
});

db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
    console.log("express listening to "+PORT);
    });
    
})



