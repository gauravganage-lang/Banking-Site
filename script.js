// ========== STORAGE KEYS ==========
const STORAGE_KEYS = {
  USERS: "bp_users",
  NOTES: "bp_notes",
  QUIZZES: "bp_quizzes",
  ASSIGNMENTS: "bp_assignments",
  SUBMISSIONS: "bp_submissions",
  SESSION: "bp_session"
};

// ========== HELPERS ==========
function loadData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// ========== USERS & SESSION ==========
function ensureDefaultAdmin() {
  let users = loadData(STORAGE_KEYS.USERS, []);
  const adminExists = users.some((u) => u.role === "admin");
  if (!adminExists) {
    users.push({
      id: generateId("user"),
      email: "admin@bank.com",
      password: "admin123",
      role: "admin"
    });
    saveData(STORAGE_KEYS.USERS, users);
  }
}

function getSession() {
  return loadData(STORAGE_KEYS.SESSION, null);
}

function setSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    saveData(STORAGE_KEYS.SESSION, session);
  }
}

// ========== AUTH / ROUTING ==========
function handleLogin(event) {
  event.preventDefault();
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const errorEl = document.getElementById("loginError");
  const email = emailEl.value.trim().toLowerCase();
  const password = passEl.value.trim();

  let users = loadData(STORAGE_KEYS.USERS, []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    errorEl.textContent = "Invalid email or password.";
    return;
  }

  setSession({ email: user.email, role: user.role, userId: user.id });

  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "student.html";
  }
}

function logout() {
  setSession(null);
  window.location.href = "index.html";
}

function enforceRole() {
  const requiredRole = document.body.getAttribute("data-role-required");
  if (!requiredRole) return; // login page
  const session = getSession();
  if (!session || session.role !== requiredRole) {
    window.location.href = "index.html";
  }
}

// ========== ADMIN UI NAV ==========
function initAdminNav() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".admin-section");
  if (!navButtons.length || !sections.length) return;

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.section;
      sections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === `admin-${target}`);
      });
    });
  });
}

// ========== STUDENT NAV ==========
function initStudentNav() {
  const navButtons = document.querySelectorAll("[data-student-section]");
  const sections = document.querySelectorAll(".student-section");
  if (!navButtons.length || !sections.length) return;

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.studentSection;
      sections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === `student-${target}`);
      });
    });
  });
}

// ========== ADMIN: USERS ==========
function renderUsers() {
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;
  const users = loadData(STORAGE_KEYS.USERS, []).filter(
    (u) => u.role !== "admin"
  );

  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.email}</td>
      <td>
        <button data-action="edit" data-id="${u.id}">Edit</button>
        <button data-action="delete" data-id="${u.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") {
        loadUserIntoForm(id);
      } else if (action === "delete") {
        deleteUser(id);
      }
    });
  });
}

function loadUserIntoForm(userId) {
  const users = loadData(STORAGE_KEYS.USERS, []);
  const user = users.find((u) => u.id === userId);
  if (!user) return;
  document.getElementById("userId").value = user.id;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userPassword").value = user.password;
}

function deleteUser(userId) {
  if (!confirm("Delete this user?")) return;
  let users = loadData(STORAGE_KEYS.USERS, []);
  users = users.filter((u) => u.id !== userId);
  saveData(STORAGE_KEYS.USERS, users);
  renderUsers();
}

function handleUserForm(event) {
  event.preventDefault();
  let users = loadData(STORAGE_KEYS.USERS, []);
  const idEl = document.getElementById("userId");
  const emailEl = document.getElementById("userEmail");
  const passEl = document.getElementById("userPassword");

  const id = idEl.value;
  const email = emailEl.value.trim().toLowerCase();
  const password = passEl.value.trim();

  if (!email || !password) return;

  if (id) {
    const u = users.find((x) => x.id === id);
    if (u) {
      u.email = email;
      u.password = password;
    }
  } else {
    users.push({
      id: generateId("user"),
      email,
      password,
      role: "student"
    });
  }

  saveData(STORAGE_KEYS.USERS, users);
  idEl.value = "";
  emailEl.value = "";
  passEl.value = "";
  renderUsers();
}

function resetUserForm() {
  document.getElementById("userId").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
}

// ========== ADMIN: NOTES ==========
function renderNotes() {
  const tbody = document.getElementById("noteTableBody");
  if (!tbody) return;
  const notes = loadData(STORAGE_KEYS.NOTES, []);
  tbody.innerHTML = "";

  notes.forEach((n) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${n.paper}</td>
      <td>${n.title}</td>
      <td>
        <button data-action="edit" data-id="${n.id}">Edit</button>
        <button data-action="delete" data-id="${n.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") loadNoteIntoForm(id);
      else if (action === "delete") deleteNote(id);
    });
  });
}

function handleNoteForm(event) {
  event.preventDefault();
  let notes = loadData(STORAGE_KEYS.NOTES, []);
  const idEl = document.getElementById("noteId");
  const paperEl = document.getElementById("notePaper");
  const titleEl = document.getElementById("noteTitle");
  const contentEl = document.getElementById("noteContent");

  const id = idEl.value;
  const paper = paperEl.value;
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title) return;

  if (id) {
    const n = notes.find((x) => x.id === id);
    if (n) {
      n.paper = paper;
      n.title = title;
      n.content = content;
    }
  } else {
    notes.push({
      id: generateId("note"),
      paper,
      title,
      content
    });
  }

  saveData(STORAGE_KEYS.NOTES, notes);
  resetNoteForm();
  renderNotes();
}

function loadNoteIntoForm(id) {
  const notes = loadData(STORAGE_KEYS.NOTES, []);
  const n = notes.find((x) => x.id === id);
  if (!n) return;
  document.getElementById("noteId").value = n.id;
  document.getElementById("notePaper").value = n.paper;
  document.getElementById("noteTitle").value = n.title;
  document.getEleme
