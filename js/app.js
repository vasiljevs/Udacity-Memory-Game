document.addEventListener("DOMContentLoaded", () => {

/*
 * Create a list that holds all of your cards
 */
const cards = [...document.querySelectorAll('.card')];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function createGame() {
  const shuffledCards = shuffle(cards);
  const deck = document.querySelector('.deck');
  const fragment = document.createDocumentFragment();

  // Reset HTML DOM
  deck.innerHTML = '';

  /**
   * Create the HTML for each card and add to Document Fragment
   */
  for (let x = 0; x < shuffledCards.length; x++) {
    const li = document.createElement('li');
    const i = document.createElement('i');

    // Get classes for the symbol to be displayed on the card
    const cardClasses = shuffledCards[x].firstElementChild.classList;

    li.classList.add('card');
    i.classList.add(...cardClasses);

    li.appendChild(i);
    fragment.appendChild(li);
  }

  // Add new deck to HTML DOM
  deck.appendChild(fragment);

  createEventListeners();
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function createEventListeners() {
  let openedCards = [];
  const cards = [...document.querySelectorAll('.card')];
  cards.forEach(card => card.addEventListener('click', (e) => {
    openCard(e);
    checkOpenedCards(openedCards, e);
  }));

};

/**
 * Display the card that has been clicked on
 */
function openCard(e) {
  // Grab the classes of the card that has been clicked
  const cardClasses = e.target.classList;

  // Check if the card has been opened, if not, open the card
  if (cardClasses.contains('show') && cardClasses.contains('open')) {
    return;
  } else {
    e.target.classList.add('show', 'open');
  }
};

/**
 * Hold a list of all open cards
 */
function checkOpenedCards(openedCards, e) {
  const cardName = e.target.firstElementChild.classList[1];
  // Add the card name to the array
  openedCards.push(cardName);

};

/**
 * Start the game
 */
createGame();
});
