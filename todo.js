const todolist=document.getElementById("new-todo");
const username=prompt("Enter username:");
getTodos();
todolist.addEventListener("keyup",function(event){
   if(event.key==="Enter"){
    const id=Math.random();
    const flag=0;
   const todovalue=todolist.value;
   if(todovalue)
   {
      savetodo(todovalue,id,flag,function(error){
         if(error)
         {
            alert("something went wrong");
         }
         else
         {
            localStorage.setItem("currentid",id);
            addTodoindom(todovalue,id);
         }
      });
   }
   else
   {
      alert("Please enter todo");
   }
}
});
function savetodo(todo,id,flag,callback)
{ 
   fetch("/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: todo, createdBy: username,id:id ,flag:flag}),
    }).then(function(response){
      if(response.status===200)
      {
         callback();
      }
      else{
         callback("Something went wrong");
      }
   });
}
function addTodoindom(todos,id,flag){
   const list=document.getElementById("todo-list");
   const item=document.createElement("li");
   const box=document.createElement("input");
   const crs=document.createElement("span");
   crs.textContent = '\u00D7';
   crs.classList.add("cross");
   box.type='checkbox';
   item.innerText=todos;
   crs.setAttribute("todo-id",id);
   box.setAttribute("todo-id",id);
   list.appendChild(item);
   item.appendChild(box);
  item.appendChild(crs);
  if (flag) {
    box.checked = true;
    item.classList.add("item");
  }
   box.addEventListener("click",function(event){
    event.stopPropagation();
    const todoid=event.target.getAttribute("todo-id");
    savestate(todoid, function (error) {
      if (error) {
        alert(error);
      }
    });
      item.classList.toggle("item");
   });
   crs.addEventListener("click", function (event) {
     event.stopPropagation();
     const todoid=event.target.getAttribute("todo-id");
      deleteTodo(todoid, function (error) {
        if (error) {
          alert(error);
        } else {
          list.removeChild(item);
        }
      });
    });
}
function getTodos() {
   fetch("/todos?name=" + username)
     .then(function (response) {
       if (response.status !== 200) {
         throw new Error("Something went wrong");
       }
       return response.json();
     })
     .then(function (todos) {
       todos.forEach(function (todo) {
         addTodoindom(todo.text,todo.id,todo.flag);
       });
     })
     .catch(function (error) {
       alert(error);
     });
 }
 function deleteTodo(todoid, callback) {
   fetch("/todo", {
     method: "DELETE",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ id: todoid, createdBy: username }),
   }).then(function (response) {
     if (response.status === 200) {
       callback();
     } else {
       callback("Something went wrong");
     }
   });
 }
function savestate(todoid, callback) {
  fetch("/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: todoid, createdBy: username }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}