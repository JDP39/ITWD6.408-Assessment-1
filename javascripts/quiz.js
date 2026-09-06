//--------------------------------------------------------
// Storing the questions and answers in an array of objects
//--------------------------------------------------------
const quizQuestions = [
  {
    question: "Who won the 2010 F1 Drivers Championship?",
    options: ["Fernando Alonso", "Jenson Button", "Sebastian Vettel", "Lewis Hamilton"],
    answer: "Sebastian Vettel"
  },
  {
    question: "What F1 team was purchased for £1?",
    options: ["Jaguar", "Williams", "BrawnGP", "Haas"],
    answer: "BrawnGP"
  },
  {
    question: "What type of engine is used in F1 in 2026?",
    options: ["V6 Turbo Hybrid", "V8", "V10", "Hydrogen V8"],
    answer: "V6 Turbo Hybrid"
  },
  {
    question: "Who has the most Drivers Championships?",
    options: ["Michael Schumacher", "Max Verstappen", "Ayrton Senna", "Alain Prost"],
    answer: "Michael Schumacher"
  },
  {
    question: "What team has the most Constructors Championships?",
    options: ["Mercedes", "Red Bull", "McLaren", "Ferrari"],
    answer: "Ferrari"
  },
  {
    question: "Who is the oldest driver on the 2026 grid?",
    options: ["Max Verstappen", "Fernando Alonso", "Valtteri Bottas", "Nico Hülkenberg"],
    answer: "Fernando Alonso"
  },
  {
    question: "Which country hosts the oldest F1 circuit still on the calendar?",
    options: ["Italy", "Monaco", "United Kingdom", "Belgium"],
    answer: "United Kingdom"
  },
  {
    question: "What does 'DRS' stand for in F1?",
    options: ["Driver Response System", "Dynamic Race Steering", "Drag Reduction System", "Downforce Regulation System"],
    answer: "Drag Reduction System"
  },
  {
    question: "Which driver holds the record for most race wins in a single season?",
    options: ["Michael Schumacher", "Sebastian Vettel", "Max Verstappen", "Lewis Hamilton"],
    answer: "Max Verstappen"
  },
  {
    question: "Who is widely regarded as the most successful aerodynamicist in F1 history?",
    options: ["Adrian Newey", "James Allison", "Ross Brawn", "Pat Symonds"],
    answer: "Adrian Newey"
  }
];

let current = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result");
const scoreEl = document.getElementById("score");

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;
  const q = quizQuestions[current];
  questionEl.textContent = `${current + 1}. ${q.question}`;
  optionsEl.innerHTML = "";

  q.options.forEach((optText) => {
    const btn = document.createElement("button");
    btn.textContent = optText;
    btn.classList.add("option");
    btn.addEventListener("click", () => selectAnswer(optText, btn));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selectedText, btn) {
  if (answered) return; // prevent multiple clicks
  answered = true;

  const correctText = quizQuestions[current].answer;
  const allButtons = optionsEl.querySelectorAll(".option");

  if (selectedText === correctText) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("incorrect");
    allButtons.forEach((b) => {
      if (b.textContent === correctText) b.classList.add("correct");
    });
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < quizQuestions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizBox.style.display = "none";
  nextBtn.style.display = "none";
  resultBox.style.display = "block";
  scoreEl.textContent = `${score} / ${quizQuestions.length}`;
}

restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  quizBox.style.display = "block";
  nextBtn.style.display = "inline-block";
  resultBox.style.display = "none";
  loadQuestion();
});

loadQuestion();