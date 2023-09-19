const checkButton = document.querySelectorAll("#checked-btn");
const gridItem = document.querySelector(".grid-item");
const editIcon = document.querySelector(".edit-icon");
const deleteIcon = document.querySelector(".delete-icon");

async function renderTasks() {
  try {
    let response = await fetch("http://localhost:3000/tasks");
    let response2 = await response.json();
    return response2;
  } catch (error) {
    console.log(error.massage);
  }
}
async function makeGridItems() {
  const gridContainer = document.querySelector(".grid-container");
  const tasks = await renderTasks();
  tasks.forEach((task) => {
    const content = `<div class="grid-item">
                        <div class="first-line">
                           <div class="info">
                              <div class="blank-circle" id="checked-btn" data-taskId="1" data-status="unDone"></div>
                              <h6>${task.title}</h6>
                              <p>${task.dueDate}</p>
                           </div>
                           <div class="task-controls">
                              <div class="edit-icon"><img src="../images/icon edit.svg" alt="edit icon"></div>
                              <div class="delete-icon"><img src="../images/icon x.png" alt="delete icon"></div>
                           </div>
                        </div>
                        <p>${task.description}</p>
                      </div>
`;
    gridContainer.insertAdjacentHTML("beforeend", content);
  });
}
makeGridItems();
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
