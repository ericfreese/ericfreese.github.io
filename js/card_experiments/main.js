require.config({
  baseUrl: '/js/card_experiments',
  paths: {
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: [ 'underscore', 'jquery' ],
      exports: 'Backbone'
    },
  }
});

define([
  'models/CardGame',
  'models/CardStack',
  'models/Card',

  'views/CardGameView'
],

function() {
  var CardGame = require('models/CardGame'),
      CardStack = require('models/CardStack'),
      Card = require('models/Card'),

      CardGameView = require('views/CardGameView');

  var cardGame = new CardGame();

  // Deck
  var deck = new CardStack({
    id: 'deck',
    positionX: 10,
    positionY: 10
  });
  cardGame.addCardStack(deck);

  // Discard pile
  var discard = new CardStack({
    id: 'discard',
    positionX: 20,
    positionY: 10
  });
  cardGame.addCardStack(discard);

  // Foundation stacks
  var foundationStacks = [];
  _.times(4, function(index) {
    var foundationStack = new CardStack({
      id: 'foundation-' + index,
      positionX: 40 + 10 * index,
      positionY: 10
    });

    foundationStacks.push(foundationStack);
    cardGame.addCardStack(foundationStack);
  }, this);

  // Tableau stacks
  var tableauStacks = [];
  _.times(7, function(index) {
    var tableauStack = new CardStack({
      id: 'tableau-' + index,
      positionX: 10 + 10 * index,
      positionY: 25,
      cardOffsetX: 0,
      cardOffsetY: 30
    });

    tableauStacks.push(tableauStack);
    cardGame.addCardStack(tableauStack);
  }, this);

  // Initialize the deck
  _.times(13, function(rank) {
    _.times(4, function(suit) {
      deck.addCard(new Card({
        rank: rank + 1,
        suit: [ 'hearts', 'diamonds', 'spades', 'clubs' ][suit]
      }));
    });
  });

  deck.shuffle();

  // Deal
  for (var row = 0; row < 7; row++) {
    var card;
    for (var col = row; col < 7; col++) {
      card = deck.getTopCard();
      card.moveToCardStack(cardGame.getCardStack('tableau-' + col));
      if (row === col) card.flip();
    }
  }

  var selectedCard = null;

  // Set up game event listeners
  cardGame.on('click.cardstack', function(cardStack) {
    console.log('click.cardstack', cardStack);

    // Deck handler
    if (cardStack.id === 'deck') {
      if (cardStack.getCardCount() > 0) {
        cardStack.getTopCard().moveToCardStack(discard).flip();
      } else {
        discard.eachCard(function(card) {
          card.flip().moveToCardStack(deck);
        });
      }
    }

    // Flip over tableau cards
    if (cardStack.id.match(/tableau-/)) {
      if (selectedCard !== null && selectedCard.get('rank') === 13 && cardStack.getCardCount() === 0) {
        selectedCard.moveToCardStack(cardStack);
      } else if (cardStack.getTopCard().get('flipped')) {
        cardStack.getTopCard().flip();
      }
    }

    // Move cards to foundation
    if (cardStack.id.match(/foundation-/)) {
      if ((cardStack.getCardCount() > 0 && cardStack.getTopCard().get('rank') === selectedCard.get('rank') - 1) || (selectedCard.get('rank') === 1)) {
        selectedCard.moveToCardStack(cardStack);
      }
    }
  });

  cardGame.on('click.card', function(card) {
    console.log('click.card', card);

    // Select and move cards
    if (!card.get('flipped')) {
      if (selectedCard !== null) {
        if (card === selectedCard) {
          selectedCard = null;
          card.set('selected', false);
        } else if (card.cardStack.id.match(/tableau-/) &&
                   card.isTopCard() &&
                   selectedCard.get('rank') === card.get('rank') - 1 &&
                   selectedCard.getColor() !== card.getColor()) {

          selectedCard.moveToCardStack(card.cardStack);
        }
      } else {
        selectedCard = card;
        card.set('selected', true);
      }
    }
  });
});
