import { getJSON, updateJSON } from "./requests.js";

const formElem = document.querySelector("#task-form");
const btnCancel = document.querySelector(".btnCancel");

const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const dateInput = document.querySelector("#dueDate");

let editMode = false;

formElem.addEventListener("submit", async (e) => {
  // Page not refreshing
  e.preventDefault();

  // Getting the object of form data
  const formData = Object.fromEntries(new FormData(formElem).entries());

  // Adding createdAt, updatedAt, isDone properties
  formData.createdAt = new Date();
  formData.updatedAt = editMode ? new Date() : formData.createdAt;
  formData.isDone = false;

  // Sending the POST request to the server
  try {
    if (editMode) {
      const response = await fetch(
        `http://localhost:3000/tasks/${taskId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: titleInput.value,
            description: descriptionInput.value,
            dueDate: dateInput.value,
            updatedAt: new Date(),
          }),
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      editMode = false;
    } else {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });
    }

    // Displaying toast successful
    Toastify({
      text: "Task Added Successfully",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      offset: {
        y: 40, // Vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      duration: 3000,
      className: "toast-animated-border", // Add the CSS class for the animated border
    }).showToast();

    // Resetting the inputs of form
    setTimeout(() => {
      formElem.reset();
      window.location.href = "../html content/Todos.html";
    }, 3000);
  } catch (error) {
    // Displaying toast unsuccessful
    Toastify({
      text: "Task Was Not Added",
      style: {
        background: "linear-gradient(to right, #ff0000, #cc0000)",
      },
      offset: {
        y: 40, // Vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      gravity: "top", // `top` or ` bottom`
      position: "center", // `left`, `center`, or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      duration: 3000,
      className: "toast-animated-border", // Add the CSS class for the animated border
    }).showToast();
  }
});

btnCancel.addEventListener(
  "click",
  () => (window.location.href = "../html content/Todos.html")
);

// // Check if the URL contains the 'taskId' query parameter
const btnAdd = document.querySelector(".btnAdd");
const addTask = document.querySelector(".add-task-title");

const urlParams = new URLSearchParams(window.location.search);
const taskId = +urlParams.get("id");
await getJSON(taskId);
if (taskId) {
  editMode = true;
  btnAdd.textContent = "Save";
  addTask.textContent = "Edit Task";
  (async () => {
    try {
      let response = await fetch(`http://localhost:3000/tasks/${taskId}`);
      let response2 = await response.json();
      titleInput.value = response2.title;
      descriptionInput.value = response2.description;
      dateInput.value = response2.dueDate;
    } catch {}
  })();
}
