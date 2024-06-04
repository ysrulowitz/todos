function taskRemoved(btnComleteElement){
    let id = btnComleteElement.parentNode.parentNode.getAttribute('data-task-id');
    let title = tasks[id].title

    let confirmationDialog = document.getElementById('remove-task-dialog')
    confirmationDialog.style.display = 'block'
    confirmationDialog.setAttribute('task-id', id)

    document.querySelector('.confirm-title').textContent = title

}

function confirmCancel(){
    document.getElementById('remove-task-dialog').style.display = 'none';
}

function confirmDelete(){
    let confirmationDialog = document.getElementById('remove-task-dialog')
    let taskId = confirmationDialog.getAttribute('task-id');

    tasks.splice(taskId, 1);

    confirmationDialog.style.display = 'none';

    displayTasks();

}