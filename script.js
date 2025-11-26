//-------------------------------------------------------------
// 0. DEFAULT ADMIN LOGIN
//-------------------------------------------------------------
const adminCredentials = {
  email: "admin@bank.com",
  password: "admin123"
};

//-------------------------------------------------------------
// 1. LOAD USERS FROM STORAGE OR CREATE EMPTY LIST
//-------------------------------------------------------------
let userList = JSON.parse(localStorage.getItem("userList")) || [];

// SAVE USERS
function saveUsers() {
  localStorage.setItem("userList", JSON.stringify(userList));
}

//-------------------------------------------------------------
// 2. LOGIN HANDLER
//-------------------------------------------------------------
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

  // ADMIN LOGIN
  if (email === adminCredentials.email && password === adminCredentials.password) {
    localStorage.setItem("loggedInUser", "ADMIN");
    window.location.href = "admin.html";
    return;
  }

  // NORMAL USER LOGIN
  const user = userList.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    errorBox.textContent = "Invalid email or password!";
    return;
  }

  localStorage.setItem("loggedInUser", email);
  window.location.href = "index.html";
}

//-------------------------------------------------------------
// 3. PROTECT USER PAGES
//-------------------------------------------------------------
function protectUserPages() {
  const requiredUser = document.body.getAttribute("data-protected");

  if (!requiredUser) return;

  const logged = localStorage.getItem("loggedInUser");

  if (!logged || logged === "ADMIN") {
    window.location.href = "login.html";
  }
}

//-------------------------------------------------------------
// 4. PROTECT ADMIN PAGE
//-------------------------------------------------------------
function protectAdminPages() {
  const isAdminPage = document.body.getAttribute("data-admin");

  if (!isAdminPage) return;

  const logged = localStorage.getItem("loggedInUser");

  if (logged !== "ADMIN") {
    window.location.href = "login.html";
  }
}

//-------------------------------------------------------------
// 5. LOGOUT
//-------------------------------------------------------------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

//-------------------------------------------------------------
// 6. ADMIN PANEL — ADD USER
//-------------------------------------------------------------
function addUser() {
  const email = document.getElementById("newUserEmail").value.trim();
  const password = document.getElementById("newUserPassword").value.trim();

  if (!email || !password) {
    alert("Enter email and password!");
    return;
  }

  // Check duplicate
  if (userList.some((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  userList.push({ email, password });
  saveUsers();
  loadUserTable();

  document.getElementById("newUserEmail").value = "";
  document.getElementById("newUserPassword").value = "";
}

//-------------------------------------------------------------
// 7. ADMIN PANEL — DELETE USER
//-------------------------------------------------------------
function deleteUser(email) {
  userList = userList.filter((u) => u.email !== email);
  saveUsers();
  loadUserTable();
}

//-------------------------------------------------------------
// 8. LOAD USER TABLE IN ADMIN PANEL
//-------------------------------------------------------------
function loadUserTable() {
  const tableBody = document.querySelector("#userTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  userList.forEach((u) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.email}</td>
      <td>${u.password}</td>
      <td><button onclick="deleteUser('${u.email}')">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

//-------------------------------------------------------------
// 9. INIT ON PAGE LOAD
//-------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const addUserBtn = document.getElementById("addUserBtn");
  if (addUserBtn) addUserBtn.addEventListener("click", addUser);

  protectUserPages();
  protectAdminPages();
  loadUserTable();
});
