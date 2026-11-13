/* ==========================================================
   Student Portfolio - main JavaScript file
   Features: mobile menu, academic planner, contact validation
   ========================================================== */
 
document.addEventListener("DOMContentLoaded", function () {
  setYear();
  initNavigation();
  initPlanner();
  initContactForm();
});
 
/* ---------- Footer year ---------- */
function setYear() {
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
 
/* ---------- Mobile navigation toggle ---------- */
function initNavigation() {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;
 
  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}
 
/* ==========================================================
   ACADEMIC PLANNER
   ========================================================== */
var tasks = []; // array of { id, text, completed }
 
function initPlanner() {
  var form = document.getElementById("taskForm");
  if (!form) return; // not on the planner page
 
  var input = document.getElementById("taskInput");
  var list = document.getElementById("taskList");
  var clearBtn = document.getElementById("clearCompleted");
 
  loadTasks();
  renderTasks();
 
  // Add a task
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    var errorBox = document.getElementById("taskError");
 
    if (text === "") {
      errorBox.textContent = "Please enter a task before adding.";
      return;
    }
    errorBox.textContent = "";
    addTask(text);
    input.value = "";
    input.focus();
  });
 
  // Delete a task (event delegation)
  list.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      var item = event.target.closest(".task-item");
      deleteTask(Number(item.dataset.id));
    }
  });
 
  // Mark a task as completed
  list.addEventListener("change", function (event) {
    if (event.target.type === "checkbox") {
      var item = event.target.closest(".task-item");
      toggleTask(Number(item.dataset.id));
    }
  });
 
  // Remove all completed tasks
  clearBtn.addEventListener("click", clearCompleted);
}
 
function addTask(text) {
  var newTask = { id: Date.now(), text: text, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}
 
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  saveTasks();
  renderTasks();
}
 
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}
 
function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  saveTasks();
  renderTasks();
}
 
function renderTasks() {
  var list = document.getElementById("taskList");
  var emptyMsg = document.getElementById("emptyMsg");
  list.innerHTML = "";
 
  tasks.forEach(function (task) {
    var li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;
 
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
 
    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text; // textContent prevents HTML injection
 
    var del = document.createElement("button");
    del.className = "delete-btn";
    del.type = "button";
    del.textContent = "Delete";
 
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
 
  emptyMsg.style.display = tasks.length === 0 ? "block" : "none";
  updateStats();
}
 
function updateStats() {
  var done = tasks.filter(function (t) { return t.completed; }).length;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("pendingCount").textContent = tasks.length - done;
}
 
function saveTasks() {
  try {
    localStorage.setItem("academicTasks", JSON.stringify(tasks));
  } catch (e) { /* storage unavailable - tasks stay in memory */ }
}
 
function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem("academicTasks")) || [];
  } catch (e) {
    tasks = [];
  }
}
 
/* ==========================================================
   CONTACT FORM VALIDATION
   ========================================================== */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return; // not on the contact page
 
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
 
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var message = document.getElementById("message").value.trim();
    var valid = true;
 
    // 1. No field should be empty
    if (name === "") { showError("name", "Name is required."); valid = false; }
 
    if (email === "") {
      showError("email", "Email address is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      // 2. Email format must be valid
      showError("email", "Please enter a valid email address (e.g. name@example.com).");
      valid = false;
    }
 
    if (phone === "") {
      showError("phone", "Phone number is required.");
      valid = false;
    } else if (!/^\d+$/.test(phone)) {
      // 3. Phone must contain digits only
      showError("phone", "Phone number must contain digits only.");
      valid = false;
    }
 
    if (message === "") { showError("message", "Message cannot be empty."); valid = false; }
 
    var success = document.getElementById("formSuccess");
    if (valid) {
      success.textContent = "Thank you, " + name + "! Your message has been sent successfully.";
      form.reset();
    } else {
      success.textContent = "";
    }
  });
 
  // Remove the red border as the user corrects a field
  ["name", "email", "phone", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      this.classList.remove("invalid");
      document.getElementById(id + "Error").textContent = "";
    });
  });
}
 
function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}
 
function showError(fieldId, message) {
  document.getElementById(fieldId + "Error").textContent = message;
  document.getElementById(fieldId).classList.add("invalid");
}
 
function clearErrors() {
  ["name", "email", "phone", "message"].forEach(function (id) {
    document.getElementById(id + "Error").textContent = "";
    document.getElementById(id).classList.remove("invalid");
  });
}
