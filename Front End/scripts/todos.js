const checkButton = document.querySelectorAll("#checked-btn");
const gridItem = document.querySelector(".grid-item");
const editIcon = document.querySelector(".edit-icon");
const deleteIcon = document.querySelector(".delete-icon");

checkButton.forEach((item) => {
  item.addEventListener("click", async function () {
    const taskId = this.getAttribute("data-taskId");
    const status = this.getAttribute("data-status");
    try {
      let response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ isDone: status === "done" ? false : true }),
      });
    } catch (error) {
      console.log(error.massage);
    }
  });
});

// checkButton.addEventListener("click", () => {
//   checkButton.classList.toggle("checked");
//   gridItem.classList.toggle("checked");
//   editIcon.classList.toggle("checked");
// });
