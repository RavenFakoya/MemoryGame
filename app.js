const title = document.getElementById("title");
const gameBoard = document.getElementById("gameboard");
const startBtn = document.querySelector('#start-button');

const scoreHeader = document.getElementById("score-header");

const gameOver = document.getElementById("gameover");
const finalScore = document.getElementById("finalscore");
const restart = document.querySelector(".again")


let firstCard =  null;
let secondCard = null;
let flippedCards = 0;
let score = 0;

let noClick = false;
let highScore = localStorage.getItem("high-score");

//Emoji array
const EMOJI = [
  "&#128520",
  "&#128525",
  "&#128526",
  "&#128545",
  "&#128557",
  "&#128520",
  "&#128525",
  "&#128526",
  "&#128545",
  "&#128557",
  "&#128514",
  "&#128538",
  "&#128548",
  "&#128567",
  "&#129321",
  "&#128514",
  "&#128538",
  "&#128548",
  "&#128567",
  "&#129321"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of Emojis
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
  function createDivsForEmojis(emojiArray) {
    for (let emoji of emojiArray) {
      // create a new div
      const frontDiv = document.createElement("div");
      const emojiDiv = document.createElement("div");
      const cardDiv = document.createElement('div');
      const gameCard = document.createElement('div');
  
      // give it a class attribute for the value we are looping over
      gameCard.classList.add("gamecard-container")
      cardDiv.classList.add("card");
      frontDiv.classList.add("front");
      emojiDiv.innerHTML = emoji;
      emojiDiv.classList.add("back");
      
      frontDiv.innerHTML = '&#128513';
  
      // call a function handleCardClick when a div is clicked on
      frontDiv.addEventListener("click", handleCardClick);
      emojiDiv.addEventListener("click", handleCardClick);
  
      // append the div to the element with an id of game
      gameBoard.append(gameCard);
      cardDiv.append(frontDiv);
      cardDiv.append(emojiDiv);
      gameCard.append(cardDiv)
  
    }
  }

  if (highScore) {
    scoreHeader.innerText = `HighScore: ${highScore}`;
  }

  startBtn.addEventListener('click', startGame);

  function startGame(e) {
    e.preventDefault();

    //Remove all gameover classes if any
    title.classList.remove('over');
    gameBoard.classList.remove('over');
    title.classList.remove('over');
    scoreHeader.classList.remove('over');
    gameOver.classList.remove('show');
    gameBoard.classList.add('active');
    //reset flipped cards to 0;
    score = 0;
    flippedCards = 0;

    //Remove any children of gameBoard if any
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }

    //Change score header to 0
    scoreHeader.classList.add("current-score");
    scoreHeader.innerText = 'Score: 0';

    
    startBtn.classList.add('playing');
    let shuffledEmojis = shuffle(EMOJI);
    startBtn.removeEventListener('click', startGame);


    return createDivsForEmojis(shuffledEmojis);
  } 

  
  // TODO: Implement this function!
  function handleCardClick(event) {
    event.preventDefault();

    let currentCard = event.target.nextElementSibling; // Make current card the back of the selected card
   
    if (noClick) return;
    if (event.target.parentElement.classList.contains("flip")) return;
    
    if(!firstCard || !secondCard) {
      currentCard.parentElement.classList.add("flip");
      firstCard = firstCard || currentCard;
      
      if(firstCard === currentCard) {
        secondCard = ''; 
      } else {
        secondCard = currentCard;
      }
    }
  
    if(firstCard && secondCard) {
      noClick = true;
  
      let firstEmoji = firstCard.innerHTML;
      let secondEmoji = secondCard.innerHTML;

      if(firstEmoji === secondEmoji) {
        //console.log('YOU HIT A MATCH');
        flippedCards += 2;
  
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
  
        firstCard = null;
        secondCard = null;
  
        noClick = false;
  
        score += 5;
        scoreHeader.innerText = 'Score: ' + score;
  
      } else {
        setTimeout(function() {
          
          //Remove flip from card element
          firstCard.parentElement.classList.remove('flip'); 
          secondCard.parentElement.classList.remove('flip');

          firstCard = null;
          secondCard = null;
  
          noClick = false;
          
          //if score is not 0 substract 1 when player does not get a match.
          if(!score == 0)score -= 1
          scoreHeader.innerText = 'Score: ' + score;
  
        },1000)
         
      }
    }
    if (flippedCards === EMOJI.length)  gameover();     
  }

  function gameover(){
    // Remove gameboard from screen
    gameBoard.classList.remove('active');
    
    //Add game over classes
    gameOver.classList.add('show');
    title.classList.add('over');
    scoreHeader.classList.add('over');
    finalScore.innerText = 'Score: ' + score;

  
    let highScore = +localStorage.getItem("high-score") || 0;
    
    //If score is higher than highscore, set local storage to highscore
    if (score > highScore) {
      finalScore.innerText += " -NEW HIGH SCORE!!";
      localStorage.setItem("high-score", score);
    }
    
    //if reset button is clicked, run the startGame function
    restart.addEventListener("click", startGame); 
  }