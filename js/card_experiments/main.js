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
        rank: [ 'ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king' ][rank],
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
  });

  cardGame.on('click.card', function(card) {
    console.log('click.card', card);
  });
});
