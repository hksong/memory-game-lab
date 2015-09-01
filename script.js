document.addEventListener("DOMContentLoaded", start);

var suits = ["s", "h", "c", "d"];
var guesses = 0;
var matches = 0;

function start() {
  generateBoard(4, 4);
  listenForGenerate();
  listenForNewGame();
  listenGiveUp();
  newGame();
}

function listenForNewGame() {
  var nG = document.getElementById("newGame");
  nG.addEventListener("click", newGame);
}

function newGame() {
  q("#win").style.display = "none";
  guesses = matches = 0;
  updateScores();
  fillBoard();
  listenCardFlip(true);
  var cards = qAll(".cards.matched");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    toggleMatch(card);
    q(".card", card).classList.remove("flipped");
  }
}

function listenCardFlip(opt) {
	var cards = qAll(".cards:not(.matched) .flipClick");
  for (var i  = 0, len = cards.length; i < len; i++) {
  	if (opt) {
  		cards[i].addEventListener("click", cardFlip);
  	}
  	else {
  		cards[i].removeEventListener("click", cardFlip);
  	}
  }
}

function cardFlip() {
  guesses++;
	this.classList.toggle("flipped");
  checkPair();
  updateScores();
  checkWin();
}

function checkWin() {
  var unmatched = qAll(".cards:not(.matched)");
  var win;

  if (unmatched.length === 0) {
    win = q("#win");
    win.innerText = "Congratulations. It took you "+guesses+" flips to match "+matches+" cards";
    win.style.display = "block";
  }
}

function checkPair() {
  var pair = qAll(".cards:not(.matched) .flipped");
  if (pair.length === 2) {
    if (pair[0].dataset.card === pair[1].dataset.card) {
      toggleMatch(pair[0].parentNode);
      toggleMatch(pair[1].parentNode);
      pair[0].removeEventListener("click", cardFlip);
      pair[1].removeEventListener("click", cardFlip);
      matches += 2;
    }
    else {
      listenCardFlip(false);
      setTimeout(function() {
        pair[0].classList.toggle("flipped");
        pair[1].classList.toggle("flipped");
        listenCardFlip(true);
      }, 2000);
    }
  }
}

function listenGiveUp() {
	var giveUp = document.getElementById("giveUp");
	giveUp.addEventListener("click", revealAll);
}

function revealAll() {
  listenCardFlip(false);
	var cards = qAll(".cards:not(.matched)");
	for (var i = 0, len = cards.length; i < len; i++) {
    var card = cards[i];
    toggleMatch(card);
    q(".card", card).classList.add("flipped");
  }
}

function toggleMatch(card) {
  card.classList.toggle("matched");
}

function q(selector, obj) {
  obj = obj || document;
  return obj.querySelector(selector);
}

function qAll(selector, obj) {
  obj = obj || document;
  return obj.querySelectorAll(selector);
}

function listenForGenerate() {
  var gen = document.getElementById("generate");
  gen.addEventListener("click", generateInputCheck);
}

function generateInputCheck() {
  var rowInput, colInput, r, c;
  rowInput = q("#numRows");
  colInput = q("#numCols");
  r = rowInput.value;
  c = colInput.value;
  if (2 <= r && r <= 6 && 2 <= c && c <= 12) {
    q("#board").innerText = "";
    generateBoard(r, c);
    newGame();
  }
  else {
    rowInput.value = "";
    colInput.value = "";
  }
}

function generateBoard(rows, cols) {
  var row, card, cardFlip, back, front, img;
  var board = q("#board");
  var frontImg = new Array(rows);
  for (var i = 0; i < rows; i++) {
    row = document.createElement("div");
    row.classList.add("row");
    board.appendChild(row);

    for (var j = 0; j < cols; j++) {
      card = document.createElement("div");
      card.classList.add("col-xs-1", "cards");
      row.appendChild(card);

      cardFlip = document.createElement("div");
      cardFlip.classList.add("card", "flipClick");
      cardFlip.setAttribute("data-card", "");
      card.appendChild(cardFlip);

      back = document.createElement("div");
      back.classList.add("back");
      cardFlip.appendChild(back);

      img = document.createElement("img");
      img.setAttribute("src", "images/b1fv.png");
      back.appendChild(img);

      front = document.createElement("div");
      front.classList.add("front");
      cardFlip.appendChild(front);

      img = document.createElement("img");
      img.setAttribute("src", "");
      front.appendChild(img);

      // <div class="row">

      //   <div class="col-xs-1 cards">
      //     <div class="card flipClick" data-card="s1">
      //       <div class="front">
      //         <img src="images/s1.png" alt="">
      //       </div>
      //       <div class="back">
      //         <img src="images/b1fv.png" alt="">
      //       </div>
      //     </div>
      //   </div>

      //   <div class="col-xs-1 cards">
      //     <div...
    }
  }
}


function fillBoard() {
  var cards = qAll(".card");
  var numPairs = cards.length/2;
  var pairs = newArr(numPairs).map(randomCard);
  var i = 0;
  shuffle(dupeArr(pairs)).forEach(function(card) {
    cards[i].dataset.card = card;
    q(".front img", cards[i++]).src = "images/" + card + ".png";
  });
}

function newArr(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

function dupeArr(arr) {
  return arr.concat(arr.slice());
}
function randomCard() {
  return suits[rand(4)] + rand(1,13);
}

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  return min + Math.floor(Math.random() * max);
}

function shuffle(arr) {
  var temp;
  for (var i = arr.length - 1, j; i; i--) {
    j = rand(i);
    if (j !== i) {
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  return arr;
}

function updateScores() {
  q("#guesses").innerText = guesses;
  q("#matches").innerText = matches;
}