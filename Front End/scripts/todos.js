const checkButton = document.querySelectorAll("#checked-btn");
const gridContainer = document.querySelector(".grid-container");
const gridItem = document.querySelector(".grid-item");
const editIcon = document.querySelector(".edit-icon");
const deleteIcon = document.querySelectorAll(".delete-icon");
const modal = document.querySelector(".modal");

//------------RENDERING TASKS AND GET REQUEST-------------
async function renderTasks() {
  try {
    let response = await fetch("http://localhost:3000/tasks");
    let response2 = await response.json();
    return response2;
  } catch (error) {
    console.log(error.massage);
  }
}

//------------GENERATE GRID ITEMS-------------
async function generateTasks() {
  const tasks = await renderTasks();
  tasks.forEach((task) => {
    const content = `<div class="grid-item" data-task-id="${task.id}">
                        <div class="first-line">
                           <div class="info">
                            <input type="checkbox" name="checkbox" class="blank-circle" id="checked-btn">
                              <h6>${task.title}</h6>
                              <p>${task.dueDate}</p>
                           </div>
                           <div class="task-controls">
                              <div class="edit-icon"><img src="../images/icon edit.svg" alt="edit icon"></div>
                              <div><img src="../images/icon delete.svg" alt="delete icon" class="delete-icon"></div>
                           </div>
                        </div>
                        <p>${task.description}</p>
                      </div>
`;
    gridContainer.insertAdjacentHTML("beforeend", content);
  });
}
generateTasks();

//------------DELETE TASK FROM DATABASE-------------
// deleteIcon.forEach((element) => {
//   element.addEventListener("click", async () => {
//     const gridItem = element.closest(".grid-item");
//     const taskId = gridItem.dataset.taskId; // Get the task ID from the data attribute
//     // const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
//     //   method: "DELETE",
//     // });
//     // let response2 = await response.json();
//     console.log("hellooooo");
//   });
// });
gridContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-icon")) {
    showModal();
    const target = event.target;
    const gridItem = target.closest(".grid-item");
    const taskId = gridItem.dataset.taskId; // Get the task ID from the data attribute
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    });
  }
});

// Function to show the modal
function showModal() {
  const overlay = document.querySelector(".overlay");

  modal.style.top = "15rem"; // Slide the modal down
  overlay.style.display = "block"; // Show the overlay
  modal.style.display = "flex"; // Show the modal
}

// Function to hide the modal
function hideModal() {
  const overlay = document.querySelector(".overlay");

  modal.style.top = "-100%"; // Slide the modal off-screen
  overlay.style.display = "none"; // Hide the overlay
  modal.style.display = "none"; // Hide the modal
}

// Example: Add event listener to close button inside the modal to hide it
const closeModalButton = document.querySelector("#cancelDeleteBtn");
closeModalButton.addEventListener("click", hideModal);

// checkButton.forEach((item) => {
//   item.addEventListener("click", async function () {
//     const taskId = this.getAttribute("data-taskId");
//     const status = this.getAttribute("data-status");
//     try {
//       let response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json;charset=utf-8",
//         },
//         body: JSON.stringify({ isDone: status === "done" ? false : true }),
//       });
//     } catch (error) {
//       console.log(error.massage);
//     }
//   });
// });

// checkButton.addEventListener("click", () => {
//   checkButton.classList.toggle("checked");
//   gridItem.classList.toggle("checked");
//   editIcon.classList.toggle("checked");
// });
