
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#form-new-task');
    
    form.addEventListener('submit', function (event) {
        const taskInput = document.querySelector('#new-task');
        const deadlineInput = document.querySelector('#new-deadline');
        
        if (!taskInput.value.trim()) {
            alert('Task cannot be empty.');
            event.preventDefault(); 
            return;
        }
        
    });
});

let addNewTask = document.querySelector("#new-task-btn");
let newTask = document.querySelector(".new-task-major");
let addTaskBtn = document.querySelector("#add-task-btn"); 
let taskDisplay = false ;
addNewTask.addEventListener("click", ()=> {
    if(taskDisplay == false ){
        newTask.style.display = "block";
        taskDisplay = true;
    }else{
        newTask.style.display = "none";
        taskDisplay = false};
});

addTaskBtn.addEventListener("click", ()=> {
    if(taskDisplay == false ){
        newTask.style.display = "block";
        taskDisplay = true;
    }else{
        newTask.style.display = "none";
        taskDisplay = false};
})

