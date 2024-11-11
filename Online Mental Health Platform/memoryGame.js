const cardsArray = [
    "🍎", "🍎",
    "🍌", "🍌",
    "🍇", "🍇",
    "🍓", "🍓",
    "🍉", "🍉",
    "🍑", "🍑",
    "🍍", "🍍",
    "🥝", "🥝",
    "🥂", "🥂",
    "💘", "💘",

];

let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameBoard = document.getElementById("game-board");
    shuffle(cardsArray);
    cardsArray.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.value = card;
        cardElement.innerText = card;
        cardElement.addEventListener("click", flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.innerText = this.dataset.value;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedCards.push(card1, card2);
        flippedCards = [];

        if (matchedCards.length === cardsArray.length) {
            setTimeout(() => alert("Congratulations! You've won!"), 300);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.innerText = "";
            card2.innerText = "";
            flippedCards = [];
        }, 1000);
    }
}

createBoard();