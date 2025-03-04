class Player {
    constructor(id, cardBack) {
        this.id = id;
        this.cardBack = cardBack; // Use unique card back for each player
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.hand = [];
        this.board = [];
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
        } else {
            console.log(`Player ${this.id} Deck is empty!`);
        }
    }

    playCard(cardIndex) {
        if (this.hand.length > 0) {
            const card = this.hand.splice(cardIndex, 1)[0];
            this.board.push(card);
            this.updateBoardUI();
            this.updateHandUI();
        }
    }

    updateHandUI() {
        const handElement = document.querySelector(`#${this.id} .hand`);
        handElement.innerHTML = this.hand
            .map(card => `<img src="${card}" alt="Card" class="card-img">`)
            .join('');
    }

    updateBoardUI() {
        const boardElement = document.querySelector(`#${this.id} .board`);
        boardElement.innerHTML = this.board
            .map(card => `<img src="${card}" alt="Card" class="card-img">`)
            .join('');
    }
}

// Initialize both players with shuffled decks

const player1 = new Player('player1', '/playing-cards-master/back_light.png');
const player2 = new Player('player2', '/playing-cards-master/back_dark.png');

// Each player draws 2 cards
player1.drawCard();
player1.drawCard();
player1.drawCard();
player1.drawCard();
player2.drawCard();
player2.drawCard();
player2.drawCard();
player2.drawCard();

// Each player plays a card
player1.playCard(0);
player1.playCard(0);
player2.playCard(0);
player2.playCard(0);

// Now, both players have shuffled decks and should draw different cards
