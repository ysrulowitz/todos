function taskRemoved(btnComleteElement){
    let id = btnComleteElement.parentNode.parentNode.getAttribute('data-task-id');
    console.log("tasks",tasks,"id",id,"target",tasks[id])
    let title = tasks.find((task) => Number(task.id).toString() === id).title;


    let confirmationDialog = document.getElementById('remove-task-dialog')
    confirmationDialog.style.display = 'block'
    confirmationDialog.setAttribute('task-id', id)

    document.querySelector('.confirm-title').textContent = title

}

function confirmCancel(){
    document.getElementById('remove-task-dialog').style.display = 'none';
}

async function confirmDelete(){
    let confirmationDialog = document.getElementById('remove-task-dialog')
    let id = confirmationDialog.getAttribute('task-id');

    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "delete",
      });
      tasks.find((task) => Number(task.id).toString() === id).deleted = true;

    confirmationDialog.style.display = 'none';

    displayTasks();

}