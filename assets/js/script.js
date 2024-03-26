// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  const cardColor = getTaskColor(task);

  // Create the card div and add classes and styles
  const card = document.createElement('div');
  card.className = 'card mb-3 task-card';
  card.id = `task-${task.id}`;
  card.setAttribute('data-id', task.id);
  card.style.background = `${cardColor}`;

  // Create the card body
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // Create and append the title to the card body
  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = task.title;
  cardBody.appendChild(title);

  // Create and append the description to the card body
  const description = document.createElement('p');
  description.className = 'card-text';
  description.textContent = task.description;
  cardBody.appendChild(description);

  // Create and append the due date to the card body
  const dueDate = document.createElement('p');
  dueDate.className = 'card-text';
  dueDate.textContent = task.dueDate;
  cardBody.appendChild(dueDate);

  // Create and append the delete button to the card body
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn btn-danger delete-task';
  deleteButton.textContent = 'Delete';
  cardBody.appendChild(deleteButton);

  // Append the card body to the card
  card.appendChild(cardBody);

  return card;
}

// Function to get task color based on due date
function getTaskColor(task) {
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    // overdue
    return "#FF2727"; 
  } else if (diffDays <= 5) {
    // closer to date
    return "#F4FF47"; 
    // in progress more than 5 days 
  } else {
    return "#4EFF27";
  }
}

// Function to render the task list
function renderTaskList() {
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  taskList.forEach(task => {
    const card = createTaskCard(task);
    switch (task.status) {
      case "todo":
        $("#todo-cards").append(card);
        break;
      case "inProgress":
        $("#in-progress-cards").append(card);
        break;
      case "done":
        $("#done-cards").append(card);
        break;
    }
  });

  // Make cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    cursor: "move",
    start: handleDragStart,
    stop: handleDragStop
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const task = {
    id: generateTaskId(),
    title: $("#task-name").val(),
    description: $("#message-text").val(),
    dueDate: $("#datepicker").val(),
    status: "todo",
  };
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  renderTaskList();
  $("#exampleModal").modal("hide");
}

// Function for deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).closest(".task-card").data("id");
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function that drops a task into a different lane
function handleDrop(event, card) {
  const taskId = card.draggable.data("id");
  let newStatus;
  switch ($(this).attr("id")) {
    case "in-progress":
      newStatus = "inProgress";
      break;
    case "done":
      newStatus = "done";
      break;
    default:
      newStatus = "todo";
  }
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  taskList[taskIndex].status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function for dragging tasks and adjusting Z index
function handleDragStart(event, ui) {
  $(this).css("z-index", 1000); 
}

// Function that stops dragging task and reset  Z index
function handleDragStop(event, ui) {
  $(this).css("z-index", ""); 
}

// Event listener for adding a new task
$("#modal-submit").click(handleAddTask);

// Event listener for deleting a task
$(document).on("click", ".delete-task", handleDeleteTask);

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
});

//Function for datepicker in modal
$(function () {
  $("#datepicker").datepicker();
});