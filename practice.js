const express = require("express");
const fs = require("fs");
const app = express();
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});
app.use(express.json());
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});
app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/public/about.html");
});
app.get("/contact", function (request, response) {
  response.sendFile(__dirname + "/public/contact.html");
});
app.get("/style.css", function (request, response) {
  response.sendFile(__dirname + "/public/css/style.css");
});
app.get("/todo", function (request, response) {
  response.sendFile(__dirname + "/public/todo.html");
});
app.post("/todo",function(request,response){
  const todo=request.body;
  savetodo(todo,function(error){
    if(error)
    {
      response.status(500);
      response.json({error:error});
    }
    else{
      response.status(200);
      response.send();
    }
  });
});
function savetodo(todo,callback)
{
  gettodos(null,true,function(error,todos){
    if(error)
    {
      callback(error)
    }
    else{
      todos.push(todo);
      fs.writeFile("./todos.txt",JSON.stringify(todos),function(error){
        if(error){
        callback(error);}
        else{
        callback();}
      });
    }
  });
}
app.get("/todos",function(request,response){
  const name=request.query.name;
  gettodos(name,false,function(error,todos){
    if(error)
    {
      response.status(500);
      response.json({error:error});
    }
    else{
      response.status(200);
      response.json(todos);
    }
  })
});
function gettodos(username,all,callback)
{
  fs.readFile("./todos.txt","utf-8",function(error,data){
    if(error)
    {
      callback(error);
    }
    else
    {
      if (data.length===0)
      {
        data="[]";
      }
      try{
        let todos=JSON.parse(data);
        if(all)
        {
          callback(null,todos);
          return;
        }
        const filteredTodos=todos.filter(function(todo){
          return todo.createdBy===username;
        });
        callback(null,filteredTodos);
      }catch(error){
        callback(null, []);
      }
    }
  });
}
app.listen(8000,function(error)
{
  if(error)
  console.log(error);
  else
  console.log("Server is running on port 8000");
})
app.get("/todo.js", function (request, response) {
  response.sendFile(__dirname + "/todo.js");
  });
app.delete("/todo", function (request, response) {
    const todo = request.body;
    gettodos(null, true, function (error, todos) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        const filteredTodos = todos.filter(function (item) {
          return item.id !== Number(todo.id);
        });
        fs.writeFile("./todos.txt",JSON.stringify(filteredTodos),function (error) {
            if (error) {
              response.status(500);
              response.json({ error: error });
            } else {
              response.status(200);
              response.send();
            }
          }
        );
      }
    });
  });
  app.post("/update", function (request, response) {
    const todo = request.body;
    gettodos(null, true, function (error, todos) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        const filteredTodos = todos.filter(function (item) {
          if(item.id===Number(todo.id)){
              if(Number(item.flag)===1)
               item.flag=0;
               else
               item.flag=1;}
          return true;
        });
        fs.writeFile("./todos.txt",JSON.stringify(filteredTodos),function (error) {
            if (error) {
              response.status(500);
              response.json({ error: error });
            } else {
              response.status(200);
              response.send();
            }
          }
        );
      }
    });
  });