const formElem = document.querySelector("#task-form");
let editMode = false;

formElem.addEventListener("submit", async (e) => {
  // page not refreshing
  e.preventDefault();
  //getting the object of form data
  const formData = Object.fromEntries(new FormData(formElem).entries());
  // adding createdAt, updatedAt, isDone properties
  formData.createdAt = new Date();
  formData.updatedAt = editMode ? new Date() : formData.createdAt;
  formData.isDone = false;
  //sending the POST request to the server

  try {
    let response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formData),
    });
    // displaying toast successful
    Toastify({
      text: "Task Added Successfully",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      offset: {
        y: 40, // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      duration: 3000,
      className: "toast-animated-border", // Add the CSS class for the animated border
    }).showToast();
    // resseting the inputs of form
    setTimeout(() => {
      formElem.reset();
      window.location.href = "../html content/Todos.html";
    }, 3000);
  } catch (_error) {
    // displaying toast successful
    Toastify({
      text: "Task Was Not Added",
      style: {
        background: "linear-gradient(to right, #ff0000, #cc0000)",
      },
      offset: {
        y: 40, // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      duration: 3000,
      className: "toast-animated-border", // Add the CSS class for the animated border
    }).showToast();
  }
});
