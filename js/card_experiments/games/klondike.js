define([
  'models/CardStack',
  'models/Card'
],

function() {
  var CardStack = require('models/CardStack'),
      Card = require('models/Card');

  var Klondike = function() {
    this.name = 'Klondike Solitaire';
    this.description = 'Klondike Solitaire is awesome.';

    // Game-specific variables
    this.selectedCard = null;
  };

  Klondike.prototype.initialize = function(cardGame) {
    this.cardGame = cardGame;

    this.createCardStacks();
    this.populateDeck();
    this.initializeEventListeners();
    this.shuffle();
    this.deal();
  };

  Klondike.prototype.createCardStacks = function() {
    // Create Deck
    this.deck = new CardStack({
      id: 'deck',
      positionX: 10,
      positionY: 10
    });
    this.cardGame.addCardStack(this.deck);

    // Create Discard pile
    this.discard = new CardStack({
      id: 'discard',
      positionX: 20,
      positionY: 10
    });
    this.cardGame.addCardStack(this.discard);

    // Create Foundation stacks
    var foundationStacks = [];
    _.times(4, function(index) {
      var foundationStack = new CardStack({
        id: 'foundation-' + index,
        positionX: 40 + 10 * index,
        positionY: 10
      });

      foundationStacks.push(foundationStack);
      this.cardGame.addCardStack(foundationStack);
    }, this);

    // Create Tableau stacks
    this.tableauStacks = [];
    for (var i = 0; i < 7; i++) {
      var tableauStack = new CardStack({
        id: 'tableau-' + i,
        positionX: 10 + 10 * i,
        positionY: 25,
        cardOffsetX: 0,
        cardOffsetY: 30
      });

      this.tableauStacks.push(tableauStack);
      this.cardGame.addCardStack(tableauStack);
    }
  };

  Klondike.prototype.populateDeck = function() {
    // Add cards to the deck
    for (var rank = 1; rank <= 13; rank++) {
      for (var suit = 0; suit < 4; suit++) {
        this.deck.addCard(new Card({
          rank: rank,
          suit: [ 'hearts', 'diamonds', 'spades', 'clubs' ][suit]
        }));
      }
    }
  };

  Klondike.prototype.selectCard = function(card) {
    this.deselectCard();

    this.selectedCard = card;
    this.selectedCard.set('selected', true);
  };

  Klondike.prototype.deselectCard = function(card) {
    if (this.selectedCard) {
      this.selectedCard.set('selected', false);
      this.selectedCard = null;
    }
  };

  // Set up game event listeners
  Klondike.prototype.initializeEventListeners = function() {
    this.cardGame.on('click.cardstack', function(e, cardStack) {
      // Deck handler
      if (cardStack.id === 'deck') {
        if (cardStack.getCardCount() > 0) {
          cardStack.getTopCard().moveToCardStack(this.discard).flip();
        } else {
          this.discard.eachCard(function(card) {
            card.flip().moveToCardStack(this.deck);
          }, this);
        }
      }

      // Move kings to empty stacks, flip top cards
      if (cardStack.id.match(/tableau-/)) {
        if (this.selectedCard !== null && this.selectedCard.get('rank') === 13 && cardStack.getCardCount() === 0) {
          this.selectedCard.moveCardAndCardsAboveToCardStack(cardStack);
          this.deselectCard();
        } else if (cardStack.getCardCount() > 0 && cardStack.getTopCard().get('flipped')) {
          cardStack.getTopCard().flip();
        }
      }

      // Move cards to foundation
      if (this.selectedCard && this.selectedCard.isTopCard() && cardStack.id.match(/foundation-/)) {
        if (cardStack.getCardCount() > 0 &&
            cardStack.getTopCard().get('suit') === this.selectedCard.get('suit') &&
            cardStack.getTopCard().get('rank') === this.selectedCard.get('rank') - 1 ||
            this.selectedCard.get('rank') === 1) {
          this.selectedCard.moveToCardStack(cardStack);
          this.deselectCard();
        }
      }
    }, this);

    this.cardGame.on('click.card', function(e, card) {
      var cardStackFrom, cardToMove, selectedIndex;

      // Select and move cards
      if (!card.get('flipped') && (card.cardStack !== this.discard || card.isTopCard())) {
        if (this.selectedCard !== null) {
          if (card === this.selectedCard) {
            this.deselectCard();
            e.stopImmediatePropagation();
          } else if (card.cardStack.id.match(/tableau-/) &&
                     card.isTopCard() &&
                     this.selectedCard.get('rank') === card.get('rank') - 1 &&
                     this.selectedCard.getColor() !== card.getColor()) {

            this.selectedCard.moveCardAndCardsAboveToCardStack(card.cardStack);
            this.deselectCard();
            e.stopImmediatePropagation();
          }
        } else {
          this.selectCard(card);
          e.stopImmediatePropagation();
        }

      }
    }, this);
  };

  Klondike.prototype.shuffle = function() {
    this.deck.shuffle();
  };

  Klondike.prototype.deal = function() {
    for (var row = 0; row < 7; row++) {
      var card;
      for (var col = row; col < 7; col++) {
        card = this.deck.getTopCard();
        card.moveToCardStack(this.tableauStacks[col]);
        if (row === col) card.flip();
      }
    }
  };

  return new Klondike();
});