define([
  'models/CardStack',
  'models/Card'
],

function() {
  var CardStack = require('models/CardStack'),
      Card = require('models/Card');

  var Spider = function() {
    this.name = 'Spider Solitaire';
    this.description = 'Spider Solitaire is pretty cool.';

    // Game-specific variables
    this.selectedCard = null;
  };

  Spider.prototype.initialize = function(cardGame) {
    this.cardGame = cardGame;

    this.createCardStacks();
    this.populateDeck();
    this.initializeEventListeners();
    this.shuffle();
    this.deal();
  };

  Spider.prototype.createCardStacks = function() {
    // Create Deck
    this.deck = new CardStack({
      id: 'deck',
      positionX: 90,
      positionY: 0,
      anchorY: 'bottom'
    });
    this.cardGame.addCardStack(this.deck);

    // Create Foundation stacks
    var foundationStacks = [];
    _.times(8, function(index) {
      var foundationStack = new CardStack({
        id: 'foundation-' + index,
        positionX: 10 * index,
        positionY: 0,
        anchorY: 'bottom'
      });

      foundationStacks.push(foundationStack);
      this.cardGame.addCardStack(foundationStack);
    }, this);

    // Create Tableau stacks
    this.tableauStacks = [];
    for (var i = 0; i < 10; i++) {
      var tableauStack = new CardStack({
        id: 'tableau-' + i,
        positionX: 10 * i,
        positionY: 10,
        cardOffsetX: 0,
        cardOffsetY: 25
      });

      this.tableauStacks.push(tableauStack);
      this.cardGame.addCardStack(tableauStack);
    }
  };

  Spider.prototype.populateDeck = function() {
    // Add cards to the deck
    for (var deck = 0; deck < 2; deck++) {
      for (var rank = 1; rank <= 13; rank++) {
        for (var suit = 0; suit < 4; suit++) {
          this.deck.addCard(new Card({
            rank: rank,
            suit: [ 'hearts', 'hearts', 'spades', 'spades' ][suit]
          }));
        }
      }
    }
  };

  Spider.prototype.selectCard = function(card) {
    this.deselectCard();

    this.selectedCard = card;
    this.selectedCard.set('selected', true);
  };

  Spider.prototype.deselectCard = function(card) {
    if (this.selectedCard) {
      this.selectedCard.set('selected', false);
      this.selectedCard = null;
    }
  };

  // Check if selected card and cards above it form a valid run to be moved together
  Spider.prototype.isSelectedCardValidMove = function() {
    var currentCard, rank, suit;

    if (this.selectedCard) {
      currentCard = this.selectedCard;
      rank = this.selectedCard.get('rank');
      suit = this.selectedCard.get('suit');

      while ((currentCard = currentCard.getNextCardInStack()) !== undefined) {
        if (currentCard.get('suit') !== suit || currentCard.get('rank') !== --rank) return false;
      }

      return true;
    } else {
      return false;
    }
  };

  // Check if selected card and cards above it form a run from King to Ace of the same suit with no cards on top of them
  Spider.prototype.isSelectedCardValidMoveToFoundation = function() {
    var currentCard, rank, suit;

    if (this.selectedCard) {
      currentCard = this.selectedCard;
      rank = this.selectedCard.get('rank');
      suit = this.selectedCard.get('suit');

      if (rank !== 13) return false;

      while ((currentCard = currentCard.getNextCardInStack()) !== undefined) {
        if (currentCard.get('suit') == suit && currentCard.get('rank') === --rank) {
          if (currentCard.get('rank') === 1 && currentCard.isTopCard()) return true;
        } else {
          return false;
        }
      }

    }

    return false;
  };

  // Don't allow dealing cards from deck if any tableau stacks are empty
  Spider.prototype.canDeal = function() {
    for (var i = 0; i < this.tableauStacks.length; i++) {
      if (this.tableauStacks[i].getCardCount() === 0) return false;
    }

    return true;
  };

  // Set up game event listeners
  Spider.prototype.initializeEventListeners = function() {
    this.cardGame.on('click.cardstack', function(e, cardStack) {
      // Deck handler
      if (cardStack.id === 'deck' &&
          cardStack.getCardCount() > 0 &&
          this.canDeal()) {

        for (var i = 0; i < 10; i++) {
          cardStack.getTopCard().moveToCardStack(this.tableauStacks[i]).flip();
        }
      }

      // Flip over tableau cards
      if (cardStack.id.match(/tableau-/)) {
        if (this.selectedCard !== null &&
            cardStack.getCardCount() === 0 &&
            this.isSelectedCardValidMove()) {
          this.selectedCard.moveCardAndCardsAboveToCardStack(cardStack);
          this.deselectCard();
        } else if (cardStack.getCardCount() > 0 && cardStack.getTopCard().get('flipped')) {
          cardStack.getTopCard().flip();
        }
      }

      // Move cards to foundation
      if (cardStack.id.match(/foundation-/) &&
          this.selectedCard !== null &&
          cardStack.getCardCount() === 0 &&
          this.isSelectedCardValidMoveToFoundation()) {

        this.selectedCard.moveCardAndCardsAboveToCardStack(cardStack);
        this.deselectCard();
      }
    }, this);

    this.cardGame.on('click.card', function(e, card) {
      // Select and move cards
      if (!card.get('flipped') && card.cardStack.id.match(/tableau-/)) {
        if (this.selectedCard !== null) {
          if (card === this.selectedCard) {
            this.deselectCard();
            e.stopImmediatePropagation();
          } else if (card.isTopCard() &&
                     this.selectedCard.get('rank') === card.get('rank') - 1 &&
                     this.isSelectedCardValidMove()) {

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

  Spider.prototype.shuffle = function() {
    this.deck.shuffle();
  };

  Spider.prototype.deal = function() {
    var i;

    for (i = 0; i < 54; i++) {
      this.deck.getTopCard().moveToCardStack(this.tableauStacks[i % 10]);
    }
    for (i = 0; i < 10; i++) {
      this.tableauStacks[i].getTopCard().flip();
    }
  };

  return new Spider();
});