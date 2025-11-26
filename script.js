// =============== BASIC CONSTANTS ===============

// Default admin credentials
const ADMIN_EMAIL = "admin@bank.com";
const ADMIN_PASSWORD = "admin123";

// Load users from localStorage or empty list
let userList = [];
try {
  const stored = localStorage.getItem("portalUsers");
  userList = stored ? JSON.parse(stored) : [];
} catch (e) {
  userList = [];
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem("portalUsers", JSON.stringify(userList));
}

// =============== AUTH / LOGIN LOGIC ===============

function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("loginError");

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  // Admin login
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("loggedInRole", "admin");
    localStorage.setItem("loggedInEmail", ADMIN_EMAIL);
    window.location.href = "admin.html";
    return;
  }

  // Normal user login
  const user = userList.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    errorBox.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("loggedInRole", "user");
  localStorage.setItem("loggedInEmail", user.email);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("loggedInRole");
  localStorage.removeItem("loggedInEmail");
  window.location.href = "index.html";
}

// =============== PAGE PROTECTION ===============

function enforceProtection() {
  const body = document.body;
  if (!body) return;

  const requiredRole = body.getAttribute("data-require-role");
  if (!requiredRole) return; // Public page (login)

  const loggedRole = localStorage.getItem("loggedInRole");
  const loggedEmail = localStorage.getItem("loggedInEmail");

  if (!loggedRole || loggedRole !== requiredRole) {
    // Not logged in or wrong role
    window.location.href = "index.html";
    return;
  }

  // Optional: show logged-in email on user dashboard
  if (requiredRole === "user") {
    const welcomeSpan = document.getElementById("welcomeUser");
    if (welcomeSpan && loggedEmail) {
      welcomeSpan.textContent = `Logged in as ${loggedEmail}`;
    }
  }
}

// =============== ADMIN: USER MANAGEMENT ===============

function addUser() {
  const emailInput = document.getElementById("newUserEmail");
  const passwordInput = document.getElementById("newUserPassword");
  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    alert("This email is reserved for admin.");
    return;
  }

  // Check duplicate
  if (userList.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    alert("User already exists.");
    return;
  }

  userList.push({ email, password });
  saveUsers();
  emailInput.value = "";
  passwordInput.value = "";
  loadUserTable();
  alert("User added successfully.");
}

function deleteUser(email) {
  if (!confirm(`Delete user ${email}?`)) return;
  userList = userList.filter(
    (u) => u.email.toLowerCase() !== email.toLowerCase()
  );
  saveUsers();
  loadUserTable();
}

function loadUserTable() {
  const tableBody = document.getElementById("userTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (userList.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No users found. Add one above.";
    tableBody.appendChild(row);
    row.appendChild(cell);
    return;
  }

  userList.forEach((u) => {
    const row = document.createElement("tr");

    const emailCell = document.createElement("td");
    emailCell.textContent = u.email;

    const passCell = document.createElement("td");
    passCell.textContent = u.password;

    const actionCell = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteUser(u.email));
    actionCell.appendChild(delBtn);

    row.appendChild(emailCell);
    row.appendChild(passCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// =============== INITIALIZE ON PAGE LOAD ===============

document.addEventListener("DOMContentLoaded", () => {
  // Protect pages (dashboard & admin)
  enforceProtection();

  // Login form on index.html
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Logout button on protected pages
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Admin-only controls
  const addUserBtn = document.getElementById("addUserBtn");
  if (addUserBtn) {
    addUserBtn.addEventListener("click", addUser);
    loadUserTable();
  }
});
