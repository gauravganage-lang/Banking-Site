// ========== STORAGE KEYS ==========
const STORAGE_KEYS = {
  USERS: "bp_users",
  NOTES: "bp_notes",
  QUIZZES: "bp_quizzes",
  ASSIGNMENTS: "bp_assignments",
  SUBMISSIONS: "bp_submissions",
  SESSION: "bp_session"
};

// ========== GENERIC HELPERS ==========
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

// Ensure default admin user exists
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

// Seed initial JAIIB notes & quizzes (esp. PPB) if empty
function ensureSeedContent() {
  // ---------- NOTES ----------
  let notes = loadData(STORAGE_KEYS.NOTES, []);
  if (!notes.length) {
    notes = [
      // ========== PAPER 1 – IE & IFS ==========
      {
        id: generateId("note"),
        paper: "paper1",
        title: "Indian Economy – Structure & Sectors",
        content:
          "• Primary sector: agriculture, allied activities, mining.\n" +
          "• Secondary sector: manufacturing, construction.\n" +
          "• Tertiary sector: services – now largest contributor to GDP.\n" +
          "• Structural change: movement from primary → tertiary with need for jobs in industry/services."
      },
      {
        id: generateId("note"),
        paper: "paper1",
        title: "RBI – Roles & Key Functions",
        content:
          "• Monetary authority – formulation & implementation of monetary policy.\n" +
          "• Issuer of currency and banker to Government & banks.\n" +
          "• Regulator & supervisor of banks and NBFCs.\n" +
          "• Manager of forex reserves and debt manager for Government."
      },
      {
        id: generateId("note"),
        paper: "paper1",
        title: "Components of the Indian Financial System",
        content:
          "• Financial markets: money market, capital market, forex, derivatives.\n" +
          "• Financial institutions: banks, NBFCs, DFIs (NABARD, SIDBI, EXIM, etc.).\n" +
          "• Financial instruments: deposits, loans, bonds, shares, mutual funds.\n" +
          "• Regulators: RBI, SEBI, IRDAI, PFRDA and others."
      },

      // ========== PAPER 2 – PPB (MAIN FOCUS) ==========
      {
        id: generateId("note"),
        paper: "paper2",
        title: "Banker–Customer Relationship in Detail",
        content:
          "• Debtor–creditor: when customer deposits money, bank is debtor.\n" +
          "• Creditor–debtor: when bank gives a loan, bank becomes creditor.\n" +
          "• Trustee–beneficiary: safe custody articles, locker service.\n" +
          "• Agent–principal: collection of cheques, bills, standing instructions.\n" +
          "• Obligations: secrecy of account, honouring cheques, due care."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "Types of Deposit Accounts",
        content:
          "• Savings Bank (SB): mainly for individuals, limited withdrawals, interest paid.\n" +
          "• Current Account (CA): for business entities, no interest, high transaction volume.\n" +
          "• Term / Fixed Deposits: fixed tenure, higher interest, premature withdrawal allowed with conditions.\n" +
          "• Recurring Deposits: fixed instalments monthly, used for goal-based savings.\n" +
          "• NRE / NRO accounts for NRIs with different tax & repatriation rules."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "KYC & AML – Core Concepts",
        content:
          "• KYC = Know Your Customer; objective is to verify identity & address and assess risk.\n" +
          "• 3 key components: Customer Identification, Customer Due Diligence (CDD), ongoing monitoring.\n" +
          "• Risk-based approach: Low / Medium / High risk customers.\n" +
          "• AML/CFT: detect & report suspicious transactions (STR) and large cash transactions (CTR)."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "Negotiable Instruments – Essentials",
        content:
          "• Cheque, bill of exchange, promissory note are negotiable instruments.\n" +
          "• Features: freely transferable, holder in due course gets better title.\n" +
          "• Crossing: general & special crossing restrict payment to a banker.\n" +
          "• Endorsements: blank, special, restrictive, conditional, sans recourse."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "NPA Classification – Overview",
        content:
          "• NPA = interest and/or instalment remains overdue for more than 90 days.\n" +
          "• Categories: Sub-standard, Doubtful, Loss asset.\n" +
          "• Income recognition: on NPAs, interest is not booked as income on accrual basis.\n" +
          "• Provisioning: higher provisions as asset quality deteriorates."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "SARFAESI Act & Recovery Channels",
        content:
          "• SARFAESI allows secured creditors to enforce security without court intervention (for eligible accounts).\n" +
          "• Measures: take possession of securities, take over management, sell assets.\n" +
          "• Other channels: DRTs, Lok Adalats, compromise settlements, OTS.\n" +
          "• Objective: faster recovery and reduction of NPAs."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "Payment & Settlement Systems",
        content:
          "• RTGS: high-value real-time gross settlement.\n" +
          "• NEFT: electronic fund transfer in batches as per current RBI guidelines.\n" +
          "• IMPS: 24x7 instant payments via banks & PPIs.\n" +
          "• UPI: app-based real-time payments using VPA/QR.\n" +
          "• BBPS: interoperable bill payments platform."
      },
      {
        id: generateId("note"),
        paper: "paper2",
        title: "Banking Ethics & Customer Rights",
        content:
          "• Fair treatment: transparency in pricing, non-discrimination, responsible selling.\n" +
          "• Codes: BCSBI code, RBI’s Charter of Customer Rights.\n" +
          "• Key rights: fair treatment, transparency, suitability, privacy, grievance redressal.\n" +
          "• Role of internal code of conduct and whistleblower policy."
      },

      // ========== PAPER 3 – AFM ==========
      {
        id: generateId("note"),
        paper: "paper3",
        title: "Accounting Equation & Double Entry",
        content:
          "• Basic equation: Assets = Liabilities + Capital.\n" +
          "• Every transaction has dual aspect – at least one debit and one credit.\n" +
          "• Flow: Journal → Ledger → Trial balance → Final accounts.\n" +
          "• Trial balance is a statement, not an account."
      },
      {
        id: generateId("note"),
        paper: "paper3",
        title: "Key Financial Ratios for Bankers",
        content:
          "• Liquidity: Current ratio, Quick ratio.\n" +
          "• Leverage: Debt–equity ratio.\n" +
          "• Profitability: Gross profit, Net profit margin, ROE, ROA.\n" +
          "• Activity: Inventory turnover, Debtor turnover.\n" +
          "• Interpretation more important than pure calculation."
      },

      // ========== PAPER 4 – RBWM ==========
      {
        id: generateId("note"),
        paper: "paper4",
        title: "Retail Banking – Advantages & Risks",
        content:
          "• For bank: diversified risk, stable income, cross-selling opportunities.\n" +
          "• For customer: convenience, standardised products, digital access.\n" +
          "• Risks: credit risk in unsecured loans, operational & fraud risk, interest rate risk.\n" +
          "• Need for strong scoring models and analytics."
      },
      {
        id: generateId("note"),
        paper: "paper4",
        title: "Mutual Funds – Basic Types",
        content:
          "• Equity funds: higher risk, higher return potential.\n" +
          "• Debt funds: invest in bonds, debentures, money market instruments.\n" +
          "• Hybrid funds: mix of equity and debt.\n" +
          "• SIP: disciplined periodic investment.\n" +
          "• Bank staff should follow suitability & risk profiling before selling."
      }
    ];
    saveData(STORAGE_KEYS.NOTES, notes);
  }

  // ---------- QUIZZES ----------
  let quizzes = loadData(STORAGE_KEYS.QUIZZES, []);
  if (!quizzes.length) {
    quizzes = [
      // ========== PAPER 1 – IE & IFS ==========
      {
        id: generateId("quiz"),
        paper: "paper1",
        question:
          "Which sector currently contributes the largest share to India’s GDP?",
        options: ["Primary", "Secondary", "Tertiary (services)", "Quaternary"],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper1",
        question: "Which of the following is NOT an objective of monetary policy?",
        options: [
          "Price stability",
          "Control of inflation",
          "Ensuring profitability of all banks",
          "Economic growth with stability"
        ],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper1",
        question: "Which institution regulates the capital market in India?",
        options: ["RBI", "SEBI", "IRDAI", "PFRDA"],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper1",
        question:
          "Which of the following is a Development Financial Institution (DFI)?",
        options: ["NABARD", "RBI", "SEBI", "NPCI"],
        answerIndex: 0
      },

      // ========== PAPER 2 – PPB (MAIN FOCUS) ==========
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Under banker–customer relationship, when a customer deposits money, the bank becomes:",
        options: [
          "Creditor of the customer",
          "Debtor of the customer",
          "Agent of the customer",
          "Trustee of the customer"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Which account is most suitable for a business entity with large number of daily transactions?",
        options: [
          "Savings Bank account",
          "Current account",
          "Recurring deposit",
          "Fixed deposit"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "KYC guidelines are primarily meant to prevent which of the following?",
        options: [
          "Credit risk",
          "Money laundering and terrorist financing",
          "Interest rate risk",
          "Operational risk in branches"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question: "CDD in KYC stands for:",
        options: [
          "Customer Due Diligence",
          "Corporate Debt Derivatives",
          "Cash Deposit Details",
          "Credit Default Determination"
        ],
        answerIndex: 0
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "A cheque which is payable to a specific banker only is called:",
        options: [
          "Bearer cheque",
          "Order cheque",
          "Crossed cheque",
          "Open cheque"
        ],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Holder in due course under the NI Act is a person who:",
        options: [
          "Obtains the instrument after maturity",
          "Obtains the instrument before maturity for consideration and in good faith",
          "Is only the original payee",
          "Is only a banker"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "An account becomes Non-Performing Asset (NPA) when interest or installment remains overdue for more than:",
        options: ["30 days", "60 days", "90 days", "120 days"],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Which of the following is NOT a recovery channel for banks?",
        options: ["SARFAESI", "DRT", "Lok Adalat", "CRR"],
        answerIndex: 3
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Which among the following is a non-fund based facility?",
        options: ["Term loan", "Cash credit", "Letter of credit", "Overdraft"],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "In RTGS, the settlement of funds takes place:",
        options: [
          "In batches at the end of day",
          "In half-hourly batches",
          "On a gross basis in real time",
          "Only once a week"
        ],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question: "IMPS is best described as:",
        options: [
          "Inward Money Processing System",
          "Immediate Payment Service providing instant 24x7 funds transfer",
          "Inter-bank Message Processing System",
          "International Money Processing Service"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Which of the following is TRUE about Savings Bank accounts?",
        options: [
          "They are meant only for companies",
          "They generally pay interest and are used by individuals for savings",
          "Overdraft is freely allowed in all SB accounts",
          "They are non-KYC accounts"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "The right of a banker to adjust the debit balance in one account with credit balance in another account of the same customer is called:",
        options: [
          "Lien",
          "Pledge",
          "Hypothecation",
          "Right of set-off"
        ],
        answerIndex: 3
      },
      {
        id: generateId("quiz"),
        paper: "paper2",
        question:
          "Which one of the following best describes 'Ethics in Banking'?",
        options: [
          "Maximising profit at any cost",
          "Ensuring compliance only with internal circulars",
          "Doing the right thing even when not specifically regulated",
          "Strictly following instructions of customers regardless of law"
        ],
        answerIndex: 2
      },

      // ========== PAPER 3 – AFM ==========
      {
        id: generateId("quiz"),
        paper: "paper3",
        question: "Which of the following is a Real Account?",
        options: [
          "Bank account",
          "Rent account",
          "Commission received",
          "Salary expense"
        ],
        answerIndex: 0
      },
      {
        id: generateId("quiz"),
        paper: "paper3",
        question:
          "The main purpose of preparing a Trial Balance is to:",
        options: [
          "Calculate net profit",
          "Check arithmetical accuracy of ledger posting",
          "Prepare final accounts",
          "Compute depreciation"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper3",
        question:
          "Time value of money concept means:",
        options: [
          "Money loses value only during inflation",
          "Money has the same value at all times",
          "Value of money changes with time due to interest and inflation",
          "Money value is fixed by Government"
        ],
        answerIndex: 2
      },

      // ========== PAPER 4 – RBWM ==========
      {
        id: generateId("quiz"),
        paper: "paper4",
        question:
          "Home loan to individuals generally falls under which business segment?",
        options: [
          "Corporate banking",
          "Retail banking",
          "Treasury operations",
          "Agri-business only"
        ],
        answerIndex: 1
      },
      {
        id: generateId("quiz"),
        paper: "paper4",
        question:
          "In wealth management, risk profiling of the customer is done primarily to:",
        options: [
          "Decide branch working hours",
          "Determine CRR and SLR",
          "Match investment products with customer’s risk appetite",
          "Fix service charges for the customer"
        ],
        answerIndex: 2
      },
      {
        id: generateId("quiz"),
        paper: "paper4",
        question:
          "An SIP (Systematic Investment Plan) in a mutual fund is best described as:",
        options: [
          "One-time lump sum investment",
          "Fixed periodic investment of a small amount",
          "Scheme available only to HNIs",
          "Type of bank deposit"
        ],
        answerIndex: 1
      }
    ];
    saveData(STORAGE_KEYS.QUIZZES, quizzes);
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

// ========== ADMIN NAV ==========
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

// ========== INIT ON PAGE LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  ensureDefaultAdmin();
  ensureSeedContent(); // fill default JAIIB notes + MCQs
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
