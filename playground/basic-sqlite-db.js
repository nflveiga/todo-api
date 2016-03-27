var Sequelize=require("sequelize");
var sequelize=new Sequelize(undefined,undefined,undefined,{
    "dialect":"sqlite",
    "storage":__dirname+"/basic-sqlite-db.sqlite"
});

var Todo=sequelize.define("todo",{
    description:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            len:[1,250]
    }
    },
    completed:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
     
    }
});

sequelize.sync().then(function(){
    console.log("sync OK");
});

function findTodoById(i){
    Todo.findById(i).then(function(todo){
        if(todo){
            console.log(todo.toJSON())
        }else{
            console.log("no item found...");
        }
    });
};

findTodoById(5);

//Todo.create({
//    description:"Criar conta no banco",
    //completed:false
//}).then(function(todo){
//    console.log("new todo created");
//    console.log(todo);
//}).catch(function(e){
//    console.log(e);
//});