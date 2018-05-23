document.addEventListener('DOMContentLoaded', () => {
  /*
  * Create a array that holds all of your cards
  */
  const cards = [...document.querySelectorAll('.card')];

  // Create global variables
  const moveCounter = document.querySelector('.moves');
  const stars = document.querySelector('.stars');
  let moves = 0;
  let matchedCardPairs = 0;
  let openedCards = [];

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
    moveCounter.textContent = moves;

    /**
     * Create the HTML for each card and add to the Document Fragment
     */
    for (let x = 0; x < shuffledCards.length; x++) {
      // Create new HTML elements that will be used
      const li = document.createElement('li');
      const i = document.createElement('i');

      // Get DOMList of classes to be displayed on the card
      const cardClasses = shuffledCards[x].firstElementChild.classList;

      // Apply the classes to each card
      li.classList.add('card');
      i.classList.add(...cardClasses);

      li.appendChild(i);
      fragment.appendChild(li);
    }

    // Add new deck to HTML DOM
    deck.appendChild(fragment);

    // Add event listeners to newly created DOM Elements
    createEventListeners();
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

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
    // Select new cards from DOM
    const newCards = [...document.querySelectorAll('.card')];

    newCards.forEach(card =>
      card.addEventListener('click', e => {
        const isCardClosed = !e.target.className.includes('open');

        // Only handle the click event for "li" elements that are closed
        if (e.target.nodeName === 'LI' && isCardClosed && openedCards.length < 2) {
          showCard(e);
          addCardToOpenedCards(e);

          if (openedCards.length === 2) {
            checkOpenedCards();
          }
        }
      }),
    );
  }

  /**
   * Display the card that has been clicked on
   */
  function showCard(e) {
    // Grab the classes of the card that has been clicked
    const isCardShowing = e.target.className.includes('show');
    const isCardOpen = e.target.className.includes('open');

    // Check if the card has been opened, if not, open the card
    if (!isCardShowing && !isCardOpen) {
      e.target.classList.add('show', 'open');
      countMoves();
    }
  }

  /**
   * Add card to a array of all open cards
   */
  function addCardToOpenedCards(e) {
    const card = e.target;

    openedCards.push(card);
  }

  /**
   * Check if the currently opened cards match
   */
  function checkOpenedCards() {
    // Get the descriptive classname for both cards (fa-bolt, fa-cube)
    const firstOpenCard = openedCards[0].children[0].className.split(' ')[1];
    const secondOpenCard = openedCards[1].children[0].className.split(' ')[1];

    // Allow for a delay so that both cards are showed to the user
    setTimeout(() => {
      if (firstOpenCard === secondOpenCard) {
        matchedPair();
      } else {
        pairNotMatched();
      }
    }, 700);
  }

  /**
   * Count moves each time card is clicked
   */
  function countMoves() {
    const amountOfStars = stars.children.length;

    moves++;
    moveCounter.textContent = moves;

    // Remove stars above a certain score threshold
    if (moves >= 14 && amountOfStars === 3) {
      stars.removeChild(stars.childNodes[0]);
    } else if (moves >= 20 && amountOfStars === 2) {
      stars.removeChild(stars.childNodes[0]);
    }
  }

  /**
   * If the cards match, lock them.
   * Reset currently opened card "tracking"
   * Count the matched pairs
   */
  function matchedPair() {
    openedCards.forEach(card => {
      card.classList.add('match');
    });

    openedCards = [];
    matchedCardPairs++;

    // Check game winning condition
    if (matchedCardPairs === 8) {
      gameWon();
    }
  }

  /**
   * If the cards do not match, hide them and reset opened cards
   * Reset currently opened card "tracking"
   */
  function pairNotMatched() {
    openedCards.forEach(card => {
      card.classList.add('noMatch');

      // Allow for time so that "noMatch" animation completes
      setTimeout(() => {
        card.classList.remove('show', 'open', 'noMatch');
      }, 600);
    });

    openedCards = [];
  }

  // Reset global variables
  function resetGame() {
    moves = 0;
    matchedCardPairs = 0;
    openedCards = [];
  }

  // If game won, alert the user
  function gameWon() {
    alert(`Game won. ${matchedCardPairs} Matched pairs with a score of ${moves}.`);
  }

  /**
   * Restart the game
   */
  document.querySelector('.restart').addEventListener('click', () => {
    resetGame();
    createGame();
  });

  /**
   * Starts the game on page load
   */
  createGame();
});
