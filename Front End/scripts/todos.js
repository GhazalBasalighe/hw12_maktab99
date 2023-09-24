import { getJSON, updateJSON } from "./requests.js";

const gridContainer = document.querySelector(".grid-container");

//------------RENDERING TASKS------------
generateTasks();
// ------------GENERATE GRID ITEMS-------------
async function generateTasks(queryParam = "?_page=1&_limit=12") {
  const tasks = await getJSON(queryParam);
  if (queryParam) {
    // gridContainer.innerHTML = "";
    gridContainer.textContent = "";
    //According to MDN this will be faster than innerHTML as browsers won't invoke their HTML parsers and will instead immediately replace all children of the element with a single #text node.
  }
  tasks.forEach((task) => {
    const content = `<div class="grid-item" data-task-id="${task.id}">
                        <div class="first-line">
                           <div class="info">
                            <input type="checkbox" name="checkbox" class="checkbox" id="checked-btn">
                              <h6>${task.title}</h6>
                              <p>${task.dueDate}</p>
                           </div>
                           <div class="task-controls">
                              <div><img src="../images/icon edit.svg" alt="edit icon" class="edit-icon"></div>
                              <div><img src="../images/icon delete.svg" alt="delete icon" class="delete-icon"></div>
                           </div>
                        </div>
                        <p>${task.description}</p>
                      </div>
`;
    gridContainer.insertAdjacentHTML("beforeend", content);
  });
}

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

//------------SHOW MODAL-------------
function showModal(taskId) {
  const modal = document.querySelector(`.modal[data-task-id="${taskId}"]`);
  const overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.style.display = "flex";
    overlay.style.display = "block";
  }
}

//------------HIDE MODAL-------------
function hideModal(modal) {
  const overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
}

//------------EVENT DELEGATION FOR TASKS-------------
gridContainer.addEventListener("click", async (event) => {
  //------------DELETE MODAL AND TASK-------------
  if (event.target.classList.contains("delete-icon")) {
    const gridItem = event.target.closest(".grid-item");
    if (gridItem) {
      const taskId = gridItem.dataset.taskId;
      const task = await getJSON(taskId);
      generateModal(task);
      showModal(task.id);
    }
  } //------------EDIT TASK-------------
  else if (event.target.classList.contains("edit-icon")) {
    const gridItem = event.target.closest(".grid-item");
    if (gridItem) {
      const taskId = +gridItem.dataset.taskId;
      await getJSON(taskId);
      location.assign(
        `http://127.0.0.1:5500/htmlContent/Home.html?id=${taskId}`
      );
    }
  } //------------CHECK TASK DONE-------------
  else if (event.target.classList.contains("checkbox")) {
    const checkbox = event.target;
    const gridItem = checkbox.closest(".grid-item");
    const taskId = +gridItem.dataset.taskId;
    if (checkbox.checked) {
      gridItem.style.textDecoration = "line-through";
      gridItem.style.color = "rgba(44, 43, 43, 0.605)";
    } else {
      gridItem.style.textDecoration = "none";
      gridItem.style.color = "black";
    }
    await updateJSON("PATCH", { isDone: checkbox.checked }, taskId);
  }
});

//------------CONFIRM OR CANCEL DELETION-------------
document.addEventListener("click", async (event) => {
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
      modal.remove();
      await updateJSON("DELETE", taskId);

      //go one page back if page becomes empty after deletion
      if (gridContainer.childElementCount === 0) {
        if (currentPage > 1) {
          currentPage--;
        }
        updateTasksPerPage(currentPage);
        updateActivePage(currentPage);

        // Remove the page-number element of the deleted page
        const pageNumberToDelete = document.getElementById(
          currentPage + 1
        );
        if (pageNumberToDelete) {
          pageNumberToDelete.remove();
        }
      }
    }
  }
});

//------------PAGINATION------------

const footer = document.querySelector(".bottom-gray");

const taskPerPage = 12;
let tasksTotalCount = (await getJSON()).length;
const pageCount = Math.ceil(tasksTotalCount / taskPerPage);
let currentPage = 1;

//dynamic ui creation for page numbers
for (let i = 1; i <= pageCount; i++) {
  const pageNum = document.createElement("div");
  pageNum.textContent = i;
  pageNum.classList.add("page-number");
  pageNum.id = i;
  footer.appendChild(pageNum);
}
//------------ARROWS FUNCTIONALITY-------------

//left arrow at the very beginning
const prevPage = document.createElement("span");
const prevpageSvg = ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="#1ab8db" d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"/></g></g></svg>`;
insertArrowSvg(prevPage, prevpageSvg, "afterbegin");

//right arrow at the very end
const nextPage = document.createElement("span");
const nextPageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="#1ab8db" d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"/></g></svg>`;
insertArrowSvg(nextPage, nextPageSvg, "beforeend");

//right arrow -> next page
nextPage.addEventListener("click", () => {
  if (currentPage < pageCount) currentPage++;
  else return;
  updateTasksPerPage(currentPage);
  updateActivePage(currentPage);
});

//left arrow -> previous page
prevPage.addEventListener("click", () => {
  if (currentPage != 1) currentPage--;
  else return;
  updateTasksPerPage(currentPage);
  updateActivePage(currentPage);
});

//page numbers themselves
footer.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    const pageId = e.target.id;
    currentPage = pageId;
    updateTasksPerPage(currentPage);
    updateActivePage(currentPage);
  }
});

//------------INSERT ARROW FOR PAGINATION-------------
function insertArrowSvg(elemName, innerHtml, placeTo) {
  elemName.innerHTML = `${innerHtml}`;
  elemName.style.cursor = "pointer";
  footer.insertAdjacentElement(`${placeTo}`, elemName);
}

//------------UPDATE TASKS ACCORDING TO PAGE-------------
function updateTasksPerPage(currentPage) {
  const queryParam = `?_page=${currentPage}&_limit=${taskPerPage}`;
  generateTasks(queryParam);
  const pageAddress = new URL(window.location.href);
  pageAddress.searchParams.set("_page", currentPage);
  pageAddress.searchParams.set("_limit", taskPerPage);
  window.history.replaceState({}, "", pageAddress);
}

//------------UPDATE ACTIVE PAGE-------------
function updateActivePage(currentPage) {
  const pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach((pageNumber) => {
    pageNumber.classList.remove("active-page");
    if (pageNumber.id == currentPage) {
      pageNumber.classList.add("active-page");
    }
  });
}
//------------MAKING FIRST PAGE ACTIVE BY DEFAULT-------------
{
  const firstPageNumber = document.querySelector(".page-number"); //only first appearance
  if (firstPageNumber) {
    firstPageNumber.classList.add("active-page");
  }
}
