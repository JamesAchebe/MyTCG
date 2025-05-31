class Player {
    constructor(id, cardBack) {
        this.id = id;
        this.cardBack = cardBack; // Use unique card back for each player
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.hand = [];
        this.board = [];
        this.discardPile = [];
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
    handElement.innerHTML = ''; // Clear current hand display

    const countDiv = document.createElement('div');
    countDiv.className = 'hand-count';
    countDiv.textContent = `Hand: ${this.hand.length} cards`;
    handElement.appendChild(countDiv);

    this.hand.forEach((card, index) => {
        const img = document.createElement('img');
        img.src = card;
        img.alt = 'Card';
        img.className = 'card-img';
        img.draggable = true;

        // CLICK — send to board
        img.addEventListener('click', () => {
            console.log(`Card clicked: ${card} at index ${index}`);
            this.playCard(index); // This must call updateHandUI() + updateBoardUI()
        });

        // DRAG — set data
        img.addEventListener('dragstart', (event) => {
            console.log(`Dragging card from hand: ${card} at index ${index}`);
            event.dataTransfer.setData(
                'application/json',
                JSON.stringify({ card, index, source: 'hand' })
            );

            // Prevent ghost image
            event.dataTransfer.setDragImage(img, 0, 0);
        });

        handElement.appendChild(img);
    });
}


updateBoardUI() {
    const boardElement = document.querySelector(`#${this.id} .board`);

    // Add drop handlers ONCE
    if (!boardElement.dataset.listenersAdded) {
        boardElement.addEventListener('dragover', (event) => {
            event.preventDefault(); // Allow drop
        });

        boardElement.addEventListener('drop', (event) => {
            event.preventDefault();

            try {
                const data = JSON.parse(event.dataTransfer.getData('application/json'));
                if (data.source === 'hand') {
                    console.log(`Dropped card on board: ${data.card} from hand`);
                    this.playCard(data.index); // Move from hand to board
                }
            } catch (err) {
                console.warn('Invalid drag data:', err);
            }
        });

        boardElement.dataset.listenersAdded = 'true';
    }

    // Clear and re-render
    boardElement.innerHTML = '';

    const countDiv = document.createElement('div');
    countDiv.className = 'board-count';
    countDiv.textContent = `Board: ${this.board.length} cards`;
    boardElement.appendChild(countDiv);

    this.board.forEach((card, index) => {
        const img = document.createElement('img');
        img.src = card;
        img.alt = 'Card';
        img.className = 'card-img';
        img.draggable = true;

        img.addEventListener('click', () => {
            console.log(`Card on board clicked: ${card} at index ${index}`);
            this.discard(index); // This must call updateBoardUI()
        });

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

    updateDiscardPileUI() {
        const pileElement = document.querySelector(`#${this.id} .discard-pile`);
        pileElement.innerHTML = ''; // Clear existing content

    // Create and append count element
        const countDiv = document.createElement('div');
        countDiv.className = 'pile-count';
        countDiv.textContent = `Discard Pile: ${this.discardPile.length} cards`;
        pileElement.appendChild(countDiv);

    // Append each card image
        this.discardPile.forEach(card => {
            const img = document.createElement('img');
            img.src = card;
            img.alt = 'Card';
            img.className = 'card-img';
            pileElement.appendChild(img);
        });
    }

    discard(cardIndex) {
        if (this.board.length > 0 && cardIndex >= 0 && cardIndex < this.board.length) {
            const card = this.board.splice(cardIndex, 1)[0];
            this.discardPile.push(card);

            console.log(`Discarding card: ${card}`);

            this.updateBoardUI();
            this.updateDiscardPileUI();
        } else {
            console.log(`Invalid card index: ${cardIndex}`);
        }
    }
    
    
}

// Initialize both players with shuffled decks

const player1 = new Player('player1', '/playing-cards-master/back_light.png');
const player2 = new Player('player2', '/playing-cards-master/back_dark.png');