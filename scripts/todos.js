const checkButton = document.querySelector(".blank-circle");
const gridItem = document.querySelector(".grid-item");
const editIcon = document.querySelector(".edit-icon");
const deleteIcon = document.querySelector(".delete-icon");

checkButton.addEventListener("click", () => {
  checkButton.classList.toggle("checked");
  gridItem.classList.toggle("checked");
  editIcon.classList.toggle("checked");
});
