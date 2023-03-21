const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box"),
  searchInput = document.querySelector(".search-input");

let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});
//2//
function showTodo(filter, filteredTodos) {
  let liTag = "";
  let todosToDisplay = filteredTodos || todos;
  
  if (todosToDisplay) {
    todosToDisplay.forEach((todo, id) => {

      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        let favoriteSymbol = todo.isFavorite ? "⭐" : "";
        let favoriteText = todo.isFavorite ? "favorite" : "";
        liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name} ${favoriteSymbol} <span>${favoriteText}</span> -- ${todo.createdDateTime} </p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                            <li onclick='favoriteTask(${id})'><i class="uil uil-heart"></i>${favoriteText == "favorite" ? "nonfavorite" : "favorites"}</li>
                        </ul>
                    </div>
                </li>`;
        
      }
    });
  }
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
   
}
//4//
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}
//3//
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
//6//
function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}
//5//
function deleteTask(deleteId, filter) {
   isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}
function favoriteTask(taskId) {
  todos[taskId].isFavorite = !todos[taskId].isFavorite;
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(document.querySelector("span.active").id);
}

//7//
clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});
  
//1//
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date+' '+time;
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;

      let taskInfo = { name: userTask, status: "pending", createdDateTime: dateTime, isFavorite: false };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});
//  function add(e) {}

//8//
searchInput.addEventListener("keyup", (e) => {
  let searchValue = e.target.value.trim().toLowerCase();

  let filteredTodos = todos.filter((todo) =>
    todo.name.toLowerCase().includes(searchValue)
  );
  // alert(JSON.stringify(filteredTodos));


  showTodo(document.querySelector("span.active").id, filteredTodos);
});




