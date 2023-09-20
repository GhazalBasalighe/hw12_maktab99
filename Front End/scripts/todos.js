const gridContainer = document.querySelector(".grid-container");

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

//------------GENERATE MODALS FOR TASKS-------------
async function generateModal(task) {
  const content = `<div class="modal animated-border" data-task-id="${task.id}">
                          <div class="modal-header">
                              <img src="../images/icon warning.svg" alt="warning">
                              <span class="modal-title">Delete</span>
                          </div>
                          <div class="modal-content">
                              <p>Do You Want To Delete This Task?</p>
                              <div class="modal-info">
                                 <p>${task.title}</p>
                                 <p>${task.dueDate}</p>
                              </div>
                          </div>
                          <div class="modal-buttons">
                              <button type="submit" id="confirmDeleteBtn">Delete</button>
                              <button id="cancelDeleteBtn">Cancel</button>
                          </div>
                    </div>`;
  document.body.insertAdjacentHTML("beforeend", content);
}

//------------DELETE MODAL TOGGLE-------------
gridContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-icon")) {
    const gridItem = event.target.closest(".grid-item");
    if (gridItem) {
      const taskId = gridItem.dataset.taskId;
      try {
        let response = await fetch(
          `http://localhost:3000/tasks/${taskId}`
        );
        let task = await response.json();
        generateModal(task);
        showModal(task.id);
      } catch (error) {
        console.log(error.massage);
        //redirect to notfound page
      }
    }
  }
});

//function to show modal when it's clicked on delete-icon
function showModal(taskId) {
  const modal = document.querySelector(`.modal[data-task-id="${taskId}"]`);
  const overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.style.display = "flex";
    overlay.style.display = "block";
  }
}

//defining which task this modal belongs to
document.addEventListener("click", (event) => {
  if (event.target.id === "cancelDeleteBtn") {
    const modal = event.target.closest(".modal");
    if (modal) {
      hideModal(modal);
    }
  } else if (event.target.id === "confirmDeleteBtn") {
    const modal = event.target.closest(".modal");
    const taskId = modal.dataset.taskId;
    const gridItem = document.querySelector(
      `.grid-item[data-task-id="${taskId}"]`
    );
    if (gridItem) {
      gridItem.remove();
      hideModal(modal);
      deleteTask(gridItem.dataset.taskId);
    }
  }
});

//function to hide modal when it's clicked on cancel button
function hideModal(modal) {
  const overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
}

async function deleteTask(taskId) {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE",
  });
}

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
