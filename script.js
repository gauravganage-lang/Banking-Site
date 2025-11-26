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
  document.getElementById("noteContent").value = n.content || "";
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  let notes = loadData(STORAGE_KEYS.NOTES, []);
  notes = notes.filter((n) => n.id !== id);
  saveData(STORAGE_KEYS.NOTES, notes);
  renderNotes();
}

function resetNoteForm() {
  document.getElementById("noteId").value = "";
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
}

// ========== ADMIN: QUIZZES ==========
function renderQuizzes() {
  const tbody = document.getElementById("quizTableBody");
  if (!tbody) return;
  const quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  tbody.innerHTML = "";

  quizzes.forEach((q) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${q.paper}</td>
      <td>${q.question}</td>
      <td>
        <button data-action="edit" data-id="${q.id}">Edit</button>
        <button data-action="delete" data-id="${q.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") loadQuizIntoForm(id);
      else if (action === "delete") deleteQuiz(id);
    });
  });
}

function handleQuizForm(event) {
  event.preventDefault();
  let quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  const idEl = document.getElementById("quizId");
  const paperEl = document.getElementById("quizPaper");
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const ansEl = document.getElementById("quizAnswerIndex");

  const id = idEl.value;
  const paper = paperEl.value;
  const question = questionEl.value.trim();
  const options = optionsEl.value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  const answerIndex = parseInt(ansEl.value, 10) || 0;

  if (!question || !options.length) return;

  if (id) {
    const q = quizzes.find((x) => x.id === id);
    if (q) {
      q.paper = paper;
      q.question = question;
      q.options = options;
      q.answerIndex = answerIndex;
    }
  } else {
    quizzes.push({
      id: generateId("quiz"),
      paper,
      question,
      options,
      answerIndex
    });
  }

  saveData(STORAGE_KEYS.QUIZZES, quizzes);
  resetQuizForm();
  renderQuizzes();
}

function loadQuizIntoForm(id) {
  const quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  const q = quizzes.find((x) => x.id === id);
  if (!q) return;
  document.getElementById("quizId").value = q.id;
  document.getElementById("quizPaper").value = q.paper;
  document.getElementById("quizQuestion").value = q.question;
  document.getElementById("quizOptions").value = q.options.join("\n");
  document.getElementById("quizAnswerIndex").value = q.answerIndex;
}

function deleteQuiz(id) {
  if (!confirm("Delete this question?")) return;
  let quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  quizzes = quizzes.filter((n) => n.id !== id);
  saveData(STORAGE_KEYS.QUIZZES, quizzes);
  renderQuizzes();
}

function resetQuizForm() {
  document.getElementById("quizId").value = "";
  document.getElementById("quizQuestion").value = "";
  document.getElementById("quizOptions").value = "";
  document.getElementById("quizAnswerIndex").value = 0;
}

// ========== ADMIN: ASSIGNMENTS ==========
function renderAssignments() {
  const tbody = document.getElementById("assignmentTableBody");
  if (!tbody) return;
  const assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  tbody.innerHTML = "";

  assignments.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.title}</td>
      <td>${a.dueDate || "-"}</td>
      <td>
        <button data-action="edit" data-id="${a.id}">Edit</button>
        <button data-action="delete" data-id="${a.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") loadAssignmentIntoForm(id);
      else if (action === "delete") deleteAssignment(id);
    });
  });
}

function handleAssignmentForm(event) {
  event.preventDefault();
  let assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  const idEl = document.getElementById("assignmentId");
  const titleEl = document.getElementById("assignmentTitle");
  const descEl = document.getElementById("assignmentDescription");
  const dueEl = document.getElementById("assignmentDueDate");

  const id = idEl.value;
  const title = titleEl.value.trim();
  const description = descEl.value.trim();
  const dueDate = dueEl.value;

  if (!title) return;

  if (id) {
    const a = assignments.find((x) => x.id === id);
    if (a) {
      a.title = title;
      a.description = description;
      a.dueDate = dueDate;
    }
  } else {
    assignments.push({
      id: generateId("assign"),
      title,
      description,
      dueDate
    });
  }

  saveData(STORAGE_KEYS.ASSIGNMENTS, assignments);
  resetAssignmentForm();
  renderAssignments();
}

function loadAssignmentIntoForm(id) {
  const assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  const a = assignments.find((x) => x.id === id);
  if (!a) return;
  document.getElementById("assignmentId").value = a.id;
  document.getElementById("assignmentTitle").value = a.title;
  document.getElementById("assignmentDescription").value = a.description || "";
  document.getElementById("assignmentDueDate").value = a.dueDate || "";
}

function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return;
  let assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  assignments = assignments.filter((n) => n.id !== id);
  saveData(STORAGE_KEYS.ASSIGNMENTS, assignments);
  renderAssignments();
}

function resetAssignmentForm() {
  document.getElementById("assignmentId").value = "";
  document.getElementById("assignmentTitle").value = "";
  document.getElementById("assignmentDescription").value = "";
  document.getElementById("assignmentDueDate").value = "";
}

// ========== ADMIN: ANALYTICS ==========
function renderAnalytics() {
  const users = loadData(STORAGE_KEYS.USERS, []);
  const notes = loadData(STORAGE_KEYS.NOTES, []);
  const quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  const assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  const submissions = loadData(STORAGE_KEYS.SUBMISSIONS, []);

  const totalUsersEl = document.getElementById("statTotalUsers");
  const studentsEl = document.getElementById("statStudents");
  const notesEl = document.getElementById("statNotes");
  const quizEl = document.getElementById("statQuizzes");
  const assEl = document.getElementById("statAssignments");
  const subEl = document.getElementById("statSubmissions");

  if (totalUsersEl)
    totalUsersEl.textContent = users.length.toString();
  if (studentsEl)
    studentsEl.textContent = users.filter((u) => u.role === "student").length.toString();
  if (notesEl)
    notesEl.textContent = notes.length.toString();
  if (quizEl)
    quizEl.textContent = quizzes.length.toString();
  if (assEl)
    assEl.textContent = assignments.length.toString();
  if (subEl)
    subEl.textContent = submissions.length.toString();
}

// ========== STUDENT: NOTES ==========
function initStudentNotes() {
  const wrapper = document.getElementById("studentNotesList");
  const tabs = document.querySelectorAll("#student-notes .subject-tab");
  if (!wrapper || !tabs.length) return;

  function showNotesForPaper(paper) {
    const notes = loadData(STORAGE_KEYS.NOTES, []).filter(
      (n) => n.paper === paper
    );
    wrapper.innerHTML = "";
    if (!notes.length) {
      wrapper.innerHTML = "<p>No notes available for this paper yet.</p>";
      return;
    }
    notes.forEach((n) => {
      const div = document.createElement("div");
      div.className = "note-item";
      div.innerHTML = `
        <h4>${n.title}</h4>
        <p>${(n.content || "").replace(/\n/g, "<br>")}</p>
      `;
      wrapper.appendChild(div);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showNotesForPaper(tab.dataset.paper);
    });
  });

  showNotesForPaper(tabs[0].dataset.paper);
}

// ========== STUDENT: QUIZ ==========
let currentQuizPaper = "paper1";
let currentQuizIndex = 0;

function initStudentQuiz() {
  const panel = document.getElementById("quizPanel");
  const tabs = document.querySelectorAll("#student-quiz .subject-tab");
  if (!panel || !tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentQuizPaper = tab.dataset.paper;
      currentQuizIndex = 0;
      loadQuizQuestion();
    });
  });

  const checkBtn = document.getElementById("quizCheckBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  if (checkBtn) checkBtn.addEventListener("click", checkQuizAnswer);
  if (nextBtn) nextBtn.addEventListener("click", nextQuizQuestion);

  loadQuizQuestion();
}

function loadQuizQuestion() {
  const questions = loadData(STORAGE_KEYS.QUIZZES, []).filter(
    (q) => q.paper === currentQuizPaper
  );
  const qText = document.getElementById("quizQuestionText");
  const optDiv = document.getElementById("quizOptions");
  const feedback = document.getElementById("quizFeedback");

  if (!qText || !optDiv || !feedback) return;

  if (!questions.length) {
    qText.textContent = "No questions available for this paper yet.";
    optDiv.innerHTML = "";
    feedback.textContent = "";
    return;
  }

  if (currentQuizIndex >= questions.length) currentQuizIndex = 0;
  const q = questions[currentQuizIndex];

  qText.textContent = q.question;
  optDiv.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "quiz-feedback";

  q.options.forEach((opt, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-option-item";
    wrapper.innerHTML = `
      <input type="radio" name="quizOption" id="quizOpt_${idx}" value="${idx}" />
      <label for="quizOpt_${idx}">${opt}</label>
    `;
    optDiv.appendChild(wrapper);
  });
}

function checkQuizAnswer() {
  const questions = loadData(STORAGE_KEYS.QUIZZES, []).filter(
    (q) => q.paper === currentQuizPaper
  );
  if (!questions.length) return;
  const q = questions[currentQuizIndex];

  const selected = document.querySelector('input[name="quizOption"]:checked');
  const feedback = document.getElementById("quizFeedback");
  if (!feedback) return;

  if (!selected) {
    alert("Please select an option.");
    return;
  }

  const chosen = parseInt(selected.value, 10);
  if (chosen === q.answerIndex) {
    feedback.textContent = "Correct!";
    feedback.className = "quiz-feedback correct";
  } else {
    feedback.textContent = `Incorrect. Correct answer index: ${q.answerIndex}`;
    feedback.className = "quiz-feedback incorrect";
  }

  // Record submission for analytics
  const session = getSession();
  const submissions = loadData(STORAGE_KEYS.SUBMISSIONS, []);
  submissions.push({
    id: generateId("sub"),
    quizId: q.id,
    paper: q.paper,
    studentEmail: session ? session.email : "",
    correct: chosen === q.answerIndex,
    time: new Date().toISOString()
  });
  saveData(STORAGE_KEYS.SUBMISSIONS, submissions);
}

function nextQuizQuestion() {
  const questions = loadData(STORAGE_KEYS.QUIZZES, []).filter(
    (q) => q.paper === currentQuizPaper
  );
  if (!questions.length) return;
  currentQuizIndex++;
  loadQuizQuestion();
}

// ========== STUDENT: ASSIGNMENTS ==========
function initStudentAssignments() {
  const list = document.getElementById("assignmentList");
  if (!list) return;
  const assignments = loadData(STORAGE_KEYS.ASSIGNMENTS, []);
  const submissions = loadData(STORAGE_KEYS.SUBMISSIONS, []);
  const session = getSession();
  const studentEmail = session ? session.email : "";

  list.innerHTML = "";
  if (!assignments.length) {
    list.innerHTML = "<p>No assignments yet.</p>";
    return;
  }

  assignments.forEach((a) => {
    const div = document.createElement("div");
    div.className = "assignment-item";

    const submitted = submissions.some(
      (s) => s.assignmentId === a.id && s.studentEmail === studentEmail
    );

    div.innerHTML = `
      <h4>${a.title}</h4>
      <div class="assignment-meta">
        Due: ${a.dueDate || "Not specified"}
      </div>
      <p>${(a.description || "").replace(/\n/g, "<br>")}</p>
      <button class="secondary-btn" data-assign="${a.id}">
        ${submitted ? "Submitted" : "Mark as Submitted"}
      </button>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll("button[data-assign]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-assign");
      markAssignmentSubmitted(id);
      initStudentAssignments(); // re-render
    });
  });
}

function markAssignmentSubmitted(assignmentId) {
  const session = getSession();
  if (!session) return;
  const submissions = loadData(STORAGE_KEYS.SUBMISSIONS, []);
  const already = submissions.some(
    (s) =>
      s.assignmentId === assignmentId && s.studentEmail === session.email
  );
  if (already) return;
  submissions.push({
    id: generateId("asub"),
    assignmentId,
    studentEmail: session.email,
    time: new Date().toISOString()
  });
  saveData(STORAGE_KEYS.SUBMISSIONS, submissions);
}

// ========== INIT ON LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  ensureDefaultAdmin();
  enforceRole();

  const session = getSession();
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // LOGIN PAGE
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // ADMIN PAGE
  if (document.body.getAttribute("data-role-required") === "admin") {
    const welcome = document.getElementById("adminWelcome");
    if (welcome && session) {
      welcome.textContent = `Logged in as ${session.email}`;
    }

    initAdminNav();

    // Users
    const userForm = document.getElementById("userForm");
    if (userForm) userForm.addEventListener("submit", handleUserForm);
    const userReset = document.getElementById("userResetBtn");
    if (userReset) userReset.addEventListener("click", resetUserForm);
    renderUsers();

    // Notes
    const noteForm = document.getElementById("noteForm");
    if (noteForm) noteForm.addEventListener("submit", handleNoteForm);
    const noteReset = document.getElementById("noteResetBtn");
    if (noteReset) noteReset.addEventListener("click", resetNoteForm);
    renderNotes();

    // Quizzes
    const quizForm = document.getElementById("quizForm");
    if (quizForm) quizForm.addEventListener("submit", handleQuizForm);
    const quizReset = document.getElementById("quizResetBtn");
    if (quizReset) quizReset.addEventListener("click", resetQuizForm);
    renderQuizzes();

    // Assignments
    const assignmentForm = document.getElementById("assignmentForm");
    if (assignmentForm)
      assignmentForm.addEventListener("submit", handleAssignmentForm);
    const assignmentReset = document.getElementById("assignmentResetBtn");
    if (assignmentReset)
      assignmentReset.addEventListener("click", resetAssignmentForm);
    renderAssignments();

    // Analytics
    renderAnalytics();
  }

  // STUDENT PAGE
  if (document.body.getAttribute("data-role-required") === "student") {
    const welcome = document.getElementById("studentWelcome");
    if (welcome && session) {
      welcome.textContent = `Logged in as ${session.email}`;
    }

    initStudentNav();
    initStudentNotes();
    initStudentQuiz();
    initStudentAssignments();
  }
});
