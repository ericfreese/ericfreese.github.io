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
      'flipped': true
    },

    initialize: function() {
      this.cardStack = undefined;

      this.view = new CardView({ model: this });
    },

    validate: function(attributes, options) {
      var validSuits = 'hearts diamonds spades clubs'.split(' '),
          validRanks = 'ace 2 3 4 5 6 7 8 9 10 jack queen king'.split(' ');
      
      if (validSuits.indexOf(attributes.suit) === -1) {
        return 'invalid suit';
      }
      
      if (validRanks.indexOf(attributes.rank) === -1) {
        return 'invalid rank';
      }
    },

    moveToCardStack: function(cardStack) {
      this.cardStack.removeCard(this);
      cardStack.addCard(this);

      this.view.trigger('move', this, cardStack, this.cardStack);

      return this;
    },
    
    flip: function() {
      this.set('flipped', !this.get('flipped'));
      return this;
    }
  });
});
