// Scroll helper for button
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Sample questions for different exams
const questions = {
  jaiib: [
    {
      question:
        "Which of the following is the main objective of the Reserve Bank of India (RBI)?",
      options: [
        "To provide housing loans",
        "To act as banker to the Government and banks",
        "To provide life insurance",
        "To manage stock exchanges"
      ],
      answerIndex: 1,
      explanation:
        "RBI acts as the banker to the Government and to other banks, and is the central monetary authority."
    },
    {
      question: "CRR (Cash Reserve Ratio) is maintained with:",
      options: [
        "NABARD",
        "SEBI",
        "RBI",
        "State Government"
      ],
      answerIndex: 2,
      explanation:
        "CRR is the percentage of deposits that banks must keep with the RBI in cash form."
    }
  ],
  caiib: [
    {
      question:
        "Duration is primarily used as a measure of which type of risk in banks?",
      options: [
        "Credit Risk",
        "Liquidity Risk",
        "Interest Rate Risk",
        "Operational Risk"
      ],
      answerIndex: 2,
      explanation:
        "Duration measures the sensitivity of bond or asset prices to changes in interest rates."
    }
  ],
  internal: [
    {
      question:
        "An asset is classified as NPA if interest or instalment remains overdue for more than:",
      options: [
        "30 days",
        "60 days",
        "90 days",
        "120 days"
      ],
      answerIndex: 2,
      explanation:
        "As per current norms, an asset becomes NPA when it remains overdue for more than 90 days."
    }
  ]
};

let currentExam = "jaiib";
let currentQuestion = null;

// DOM elements
const examSelect = document.getElementById("examSelect");
const loadQuestionBtn = document.getElementById("loadQuestionBtn");
const quizCard = document.getElementById("quizCard");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const checkAnswerBtn = document.getElementById("checkAnswerBtn");
const feedback = document.getElementById("feedback");

// Load a random question for selected exam
function loadQuestion() {
  currentExam = examSelect.value;
  const examQuestions = questions[currentExam];

  if (!examQuestions || examQuestions.length === 0) {
    quizCard.style.display = "none";
    alert("No questions added yet for this exam.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * examQuestions.length);
  currentQuestion = examQuestions[randomIndex];

  // Display question
  questionText.textContent = currentQuestion.question;

  // Display options
  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((opt, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "option-item";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "quizOption";
    input.value = index;
    input.id = `option-${index}`;

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = opt;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    optionsContainer.appendChild(wrapper);
  });

  feedback.textContent = "";
  feedback.className = "feedback";
  quizCard.style.display = "block";
}

// Check the selected answer
function checkAnswer() {
  if (!currentQuestion) return;

  const selected = document.querySelector('input[name="quizOption"]:checked');
  if (!selected) {
    alert("Please select an option.");
    return;
  }

  const selectedIndex = parseInt(selected.value, 10);

  if (selectedIndex === currentQuestion.answerIndex) {
    feedback.textContent = "Correct! " + currentQuestion.explanation;
    feedback.className = "feedback correct";
  } else {
    const correctText = currentQuestion.options[currentQuestion.answerIndex];
    feedback.textContent =
      "Incorrect. Correct answer: " +
      correctText +
      ". " +
      currentQuestion.explanation;
    feedback.className = "feedback incorrect";
  }
}

// Attach event listeners
if (loadQuestionBtn) {
  loadQuestionBtn.addEventListener("click", loadQuestion);
}

if (checkAnswerBtn) {
  checkAnswerBtn.addEventListener("click", checkAnswer);
}

// Optional: load one question on first visit
// window.addEventListener("load", loadQuestion);
