class Player {
    constructor(id, cardBack) {
        this.id = id;
        this.cardBack = cardBack; // Use unique card back for each player
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.hand = [];
        this.board = [];
        this.updateDeckUI();  // Initial deck count display
    }

    // Create a deck with image paths for all 52 playing cards
    createDeck() {
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];

        suits.forEach(suit => {
            values.forEach(value => {
                const cardPath = `/playing-cards-master/${suit}_${value}.png`;
                deck.push(cardPath);  // Store the image path for each card
            });
        });

        return deck;
    }

    // Shuffle the deck using Fisher-Yates algorithm
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; // Swap cards
        }
    }

    drawCard() {
        if (this.deck.length > 0) {
            const card = this.deck.pop();
            this.hand.push(card);
            this.updateHandUI();
            this.updateDeckUI();
        } else {
            console.log(`Player ${this.id} Deck is empty!`);
        }
    }

    playCard(cardIndex) {
        if (this.hand.length > 0) {
            const card = this.hand.splice(cardIndex, 1)[0];
            this.board.push(card);

            console.log(`Playing card: ${card}`);

            this.updateBoardUI();
            this.updateHandUI();
        } else {
            console.log(`Invalid card index: ${cardIndex}`);
        }
    }

    updateHandUI() {
        const handElement = document.querySelector(`#${this.id} .hand`);
        handElement.innerHTML = ''; // Clear existing content
    

    // Create and append count element
        const countDiv = document.createElement('div');
        countDiv.className = 'hand-count';
        countDiv.textContent = `Hand: ${this.hand.length} cards`;
        handElement.appendChild(countDiv);

    // Append each card image
        this.hand.forEach((card, index) => {
        const img = document.createElement('img');
        img.src = card;
        img.alt = 'Card';
        img.className = 'card-img';

        // Debugging: Log index and card info
        img.addEventListener('click', () => {
            console.log(`Card clicked: ${card} at index ${index}`);
            this.playCard(index);
        });
        
        handElement.appendChild(img);
        });
    }

    updateBoardUI() {
        const boardElement = document.querySelector(`#${this.id} .board`);
        boardElement.innerHTML = ''; // Clear existing content

    // Create and append count element
        const countDiv = document.createElement('div');
        countDiv.className = 'board-count';
        countDiv.textContent = `Board: ${this.board.length} cards`;
        boardElement.appendChild(countDiv);

    // Append each card image
        this.board.forEach(card => {
            const img = document.createElement('img');
            img.src = card;
            img.alt = 'Card';
            img.className = 'card-img';
            boardElement.appendChild(img);
        });
    }

    updateDeckUI() {
        const deckElement = document.querySelector(`#${this.id} .deck`);
        deckElement.innerHTML = ''; // Clear any existing content
        
        // Ensure event listener is added only once
        if (!deckElement.dataset.listenerAdded) {
            deckElement.addEventListener('click', () => this.drawCard());
            deckElement.dataset.listenerAdded = "true"; // Mark listener as added
        }
    
        if (this.deck.length > 0) {
            // Create an image element for the card back
            const img = document.createElement('img');
            img.src = this.cardBack;
            img.alt = 'Card Back';
            img.className = 'card-back';
            deckElement.appendChild(img);
    
            // Create and append a count element
            const countDiv = document.createElement('div');
            countDiv.className = 'deck-count';
            countDiv.textContent = `Deck: ${this.deck.length} cards`;
            deckElement.appendChild(countDiv);
        } else {
            // If the deck is empty, display a message
            const countDiv = document.createElement('div');
            countDiv.className = 'deck-count';
            countDiv.textContent = 'Deck is empty!';
            deckElement.appendChild(countDiv);
        }
    }
    
    
}

// Initialize both players with shuffled decks

const player1 = new Player('player1', '/playing-cards-master/back_light.png');
const player2 = new Player('player2', '/playing-cards-master/back_dark.png');

// Each player draws 4 cards
player1.drawCard();
player1.drawCard();
player1.drawCard();
player1.drawCard();
player2.drawCard();
player2.drawCard();
player2.drawCard();
player2.drawCard();

// Each player plays two card
player1.playCard(0);
player1.playCard(0);
player2.playCard(0);
player2.playCard(0);

// Now, both players have shuffled decks and should draw different cards
