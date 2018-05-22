document.addEventListener('DOMContentLoaded', () => {
  /*
  * Create a array that holds all of your cards
  */
  const cards = [...document.querySelectorAll('.card')];
  // Create global variables
  const moveCounter = document.querySelector('.moves');
  const stars = document.querySelector('.stars');
  let moves = 0;
  let matchedCards = 0;
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
      const li = document.createElement('li');
      const i = document.createElement('i');

      // Get classes for the symbol to be displayed on the card
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
        // Only handle the click event for "li" elements
        if (e.target.nodeName === 'LI') {
          showCard(e);
          addCard(e);

          if (openedCards.length === 2) {
            checkCards();
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
    const cardClasses = e.target.className;

    // Check if the card has been opened, if not, open the card
    if (!cardClasses.includes('show') && !cardClasses.includes('open')) {
      e.target.classList.add('show', 'open');
      countMoves();
    }
  }

  /**
   * Add card to a array of all open cards
   */
  function addCard(e) {
    const card = e.target;

    openedCards.push(card);
  }

  /**
   * Check if the cards currently selected match
   */
  function checkCards() {
    // Get the descriptive classname for both cards (fa-bolt, fa-cube)
    const firstCard = openedCards[0].children[0].className.split(' ')[1];
    const secondCard = openedCards[1].children[0].className.split(' ')[1];

    // Allow for a delay so that both cards are showed to the user
    setTimeout(() => {
      if (firstCard === secondCard) {
        cardsMatched();
      } else {
        cardsNotMatched();
      }
    }, 600);
  }

  /**
   * Count moves each time card is clicked
   */
  function countMoves() {
    moves++;
    moveCounter.textContent = moves;

    // if (moves > 10) {
    //   stars.removeChild(stars.childNodes[0]);
    // } else if (moves > 20) {
    //   stars.removeChild(stars.childNodes[0]);
    // } else {
    //   stars.removeChild(stars.childNodes[0]);
    // }
  }

  /**
   * If the cards match, lock them. Also count each group of cards that are matched
   */
  function cardsMatched() {
    openedCards.forEach(card => {
      card.classList.add('matched');
    });
    // Reset current selected cards "tracking"
    openedCards = [];
    // Count the amount of matched pairs
    matchedCards++;
  }

  /**
   * If the cards do not match, hide them and reset opened cards array
   */
  function cardsNotMatched() {
    openedCards.forEach(card => {
      card.classList.remove('show', 'open');
    });
    openedCards = [];
  }

  function resetGame() {
    // Reset global variables
    moves = 0;
    matchedCards = 0;
    openedCards = [];
  }

  /**
   * Restart the game
   */
  document.querySelector('.restart').addEventListener('click', () => {
    resetGame();
    createGame();
  });

  /**
   * Start the game on page load
   */
  createGame();
});
