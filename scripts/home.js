const formElem = document.querySelector("#task-form");

formElem.addEventListener("submit", (e) => {
  // page not refreshing
  e.preventDefault();
  // displaying toast
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
  formElem.reset();
  setTimeout(() => {
    window.location.href = "../Todos.html";
  }, 1000);
});
