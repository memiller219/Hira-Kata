const cardData = {
  hiragana: {
    vowels: ["あ", "い", "う", "え", "お"],
    ks: ["か", "き", "く", "け", "こ"],
    ss: ["さ", "し", "す", "せ", "そ"],
    ts: ["た", "ち", "つ", "て", "と"],
    ns: ["な", "に", "ぬ", "ね", "の"],
    hs: ["は", "ひ", "ふ", "へ", "ほ"],
    ms: ["ま", "み", "む", "め", "も"],
    ys: ["や", "ゆ", "よ"],
    rs: ["ら", "り", "る", "れ", "ろ"],
    wsn: ["わ", "を", "ん"],
  },
  katakana: {
    vowels: ["ア", "イ", "ウ", "エ", "オ"],
    ks: ["カ", "キ", "ク", "ケ", "コ"],
    ss: ["サ", "シ", "ス", "セ", "ソ"],
    ts: ["タ", "チ", "ツ", "テ", "ト"],
    ns: ["ナ", "ニ", "ヌ", "ネ", "ノ"],
    hs: ["ハ", "ヒ", "フ", "ヘ", "ホ"],
    ms: ["マ", "ミ", "ム", "メ", "モ"],
    ys: ["ヤ", "ユ", "ヨ"],
    rs: ["ラ", "リ", "ル", "レ", "ロ"],
    wsn: ["ワ", "ヲ", "ン"],
  },
};

// Elements
const startBtn = document.getElementById("startGameBtn");
const modal = document.getElementById("gameSettings");
const closeModalBtn = document.getElementById("closeModalBtn");
const confirmPlayBtn = document.getElementById("confirmPlayBtn");
const setsDiv = document.getElementById("sets");
const gameBoard = document.getElementById("gameBoard");
const winModal = document.getElementById("winModal");
const playAgainBtn = document.getElementById("playAgainBtn");
const gameHeader = document.getElementById("gameHeader");

let chosenLanguage = null;
let chosenSet = null;

// Open Modal
startBtn.addEventListener("click", () => {
  gameHeader.classList.add("hidden");
  startBtn.classList.add("hidden");
  modal.classList.add("show");
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  startBtn.classList.remove("hidden");
  gameHeader.classList.remove("hidden");
  modal.classList.remove("show");
  resetSelections();
});

// Language Selection
document.querySelectorAll(".language-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".language-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    chosenLanguage = e.target.id === "hiraganaBtn" ? "hiragana" : "katakana";
    setsDiv.classList.remove("hidden");
    checkSelections();
  });
});

// Set Selection
document.querySelectorAll(".set-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    chosenSet = e.target.dataset.set;
    document
      .querySelectorAll(".set-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    checkSelections();
  });
});

// Check selections
function checkSelections() {
  if (chosenLanguage && chosenSet) {
    confirmPlayBtn.classList.remove("hidden");
  } else {
    confirmPlayBtn.classList.add("hidden");
  }
}

// Confirm Play
confirmPlayBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  startGame(chosenLanguage, chosenSet);
});

// Reset selections
function resetSelections() {
  chosenLanguage = null;
  chosenSet = null;
  setsDiv.classList.add("hidden");
  confirmPlayBtn.classList.add("hidden");
  document
    .querySelectorAll(".set-btn, .language-btn")
    .forEach((b) => b.classList.remove("active"));
}

// --- Build the board ---
function startGame(language, set) {
  gameBoard.innerHTML = "";
  gameBoard.classList.remove("hidden");

  const chars = cardData[language][set];
  if (!chars) return;

  const pairs = [...chars, ...chars];
  shuffleArray(pairs);

  pairs.forEach((char) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">${char}</div>
      </div>
    `;
    gameBoard.appendChild(card);
  });

  setupCardLogic();
}

// Shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Flip/Match Logic
function setupCardLogic() {
  let flipped = [];
  let matched = 0;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.classList.contains("flipped")) return;
      if (flipped.length === 2) return;

      card.classList.add("flipped");
      flipped.push(card);

      if (flipped.length === 2) {
        const [c1, c2] = flipped;
        const t1 = c1.querySelector(".card-front").textContent;
        const t2 = c2.querySelector(".card-front").textContent;

        if (t1 === t2) {
          matched += 2;
          flipped = [];
          if (matched === cards.length) {
            setTimeout(() => {
              winModal.classList.add("show");
            }, 500);
          }
        } else {
          setTimeout(() => {
            c1.classList.remove("flipped");
            c2.classList.remove("flipped");
            flipped = [];
          }, 1000);
        }
      }
    });
  });
}

// Play Again
playAgainBtn.addEventListener("click", () => {
  winModal.classList.remove("show");
  resetSelections();
  gameBoard.classList.add("hidden");
  gameBoard.innerHTML = "";
  modal.classList.add("show");
});
