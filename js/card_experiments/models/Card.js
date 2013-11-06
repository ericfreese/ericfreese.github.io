define([
  'jquery',
  'underscore',
  'backbone',

  'views/CardView'
],

function($, _, Backbone) {
  var CardView = require('views/CardView');

  return Backbone.Model.extend({
    defaults: {
      'suit': 'spades',
      'rank': 'ace',
      'flipped': true,
      'selected': false
    },

    initialize: function() {
      this.cardStack = undefined;

      this.view = new CardView({ model: this });
    },

    validate: function(attributes, options) {
      var validSuits = 'hearts diamonds spades clubs'.split(' '),
          validRanks = '1 2 3 4 5 6 7 8 9 10 11 12 13'.split(' ');
      
      if (validSuits.indexOf(attributes.suit) === -1) {
        return 'invalid suit';
      }
      
      if (validRanks.indexOf(attributes.rank) === -1) {
        return 'invalid rank';
      }
    },

    getColor: function() {
      switch (this.get('suit')) {
        case 'hearts':
        case 'diamonds':
          return 'red';
        case 'spades':
        case 'clubs':
          return 'black';
      }
    },

    moveToCardStack: function(cardStack) {
      this.cardStack.removeCard(this);
      cardStack.addCard(this);

      this.view.trigger('move', this, cardStack, this.cardStack);

      return this;
    },

    moveCardAndCardsAboveToCardStack: function(cardStack) {
      var cardStackFrom = this.cardStack,
          selectedIndex = cardStackFrom.indexOfCard(this),
          cardToMove;

      while ((cardToMove = cardStackFrom.getCardAt(selectedIndex)) !== undefined) {
        cardToMove.moveToCardStack(cardStack);
      }
    },
    
    flip: function() {
      this.set('flipped', !this.get('flipped'));
      return this;
    },

    isTopCard: function() {
      return this === this.cardStack.getTopCard();
    },

    getNextCardInStack: function() {
      return this.cardStack.getCardAt(this.cardStack.indexOfCard(this) + 1);
    }
  });
});
