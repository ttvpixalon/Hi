let deck = [];
const colors = ['red', 'blue', 'green', 'yellow'];
const specialCards = ['Skip', 'Reverse', 'Draw Two'];
let currentPlayer = 1;
let playerHands = {};
let discardPile = [];

// Create a full Uno deck
function createDeck() {
    colors.forEach(color => {
        for (let i = 0; i <= 9; i++) {
            deck.push({ color: color, value: i });
        }
        specialCards.forEach(special => {
            deck.push({ color: color, value: special });
        });
    });
    // Adding wild cards
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'black', value: 'Wild' });
        deck.push({ color: 'black', value: 'Wild Draw Four' });
    }
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal cards to players
function dealCards(players, numCards = 7) {
    for (let i = 1; i <= players; i++) {
        playerHands[`player-${i}`] = [];
        for (let j = 0; j < numCards; j++) {
            playerHands[`player-${i}`].push(deck.pop());
        }
    }
}

// Render player cards on the board
function renderPlayerCards() {
    Object.keys(playerHands).forEach(playerId => {
        const handDiv = document.getElementById(`hand-${playerId}`);
        handDiv.innerHTML = '';
        playerHands[playerId].forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', card.color);
            cardDiv.textContent = card.value;
            cardDiv.addEventListener('click', () => playCard(playerId, card));
            handDiv.appendChild(cardDiv);
        });
    });
}

// Play a card
function playCard(playerId, card) {
    if (isPlayable(card)) {
        discardPile.push(card);
        playerHands[playerId] = playerHands[playerId].filter(c => c !== card);
        renderPlayerCards();
        renderDiscardPile();
        handleSpecialCard(card);
        if (playerHands[playerId].length === 0) {
            alert(`${playerId} wins!`);
            resetGame();
        } else {
            endTurn();
        }
    }
}

// Check if card can be played
function isPlayable(card) {
    const topCard = discardPile[discardPile.length - 1];
    return !topCard || card.color === topCard.color || card.value === topCard.value || card.color === 'black';
}

// Handle special cards
function handleSpecialCard(card) {
    if (card.value === 'Skip') {
        endTurn(); // Skip next player
    } else if (card.value === 'Reverse') {
        // Implement reverse logic for multiple players
    } else if (card.value === 'Draw Two') {
        drawCards(getNextPlayer(), 2);
    } else if (card.value === 'Wild Draw Four') {
        drawCards(getNextPlayer(), 4);
    }
}

// Draw cards for a player
function drawCards(playerId, numCards) {
    for (let i = 0; i < numCards; i++) {
        playerHands[playerId].push(deck.pop());
    }
    renderPlayerCards();
}

// End turn
function endTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    alert(`Player ${currentPlayer}'s turn`);
}

// Render discard pile
function renderDiscardPile() {
    const discardPileDiv = document.getElementById('discard-pile');
    const topCard = discardPile[discardPile.length - 1];
    discardPileDiv.innerHTML = '';
    if (topCard) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', topCard.color);
        cardDiv.textContent = topCard.value;
        discardPileDiv.appendChild(cardDiv);
    }
}

// Reset the game
function resetGame() {
    deck = [];
    playerHands = {};
    discardPile = [];
    createDeck();
    shuffleDeck(deck);
    dealCards(2);
    discardPile.push(deck.pop());
    renderPlayerCards();
    renderDiscardPile();
}

// Initial Setup
createDeck();
shuffleDeck(deck);
dealCards(2);
discardPile.push(deck.pop());
renderPlayerCards();
renderDiscardPile();

document.getElementById('draw-card').addEventListener('click', () => {
    playerHands[`player-${currentPlayer}`].push(deck.pop());
    renderPlayerCards();
});

document.getElementById('end-turn').addEventListener('click', endTurn);
