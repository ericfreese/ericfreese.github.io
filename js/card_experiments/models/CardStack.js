define([
  'jquery',
  'underscore',
  'backbone',

  'collections/CardList',

  'views/CardStackView'
],

function($, _, Backbone) {
  var CardList = require('collections/CardList'),
      CardStackView = require('views/CardStackView');

  return Backbone.Model.extend({

    defaults: {
      'positionX': 0,
      'positionY': 0,

      'anchorX': 'left',
      'anchorY': 'top',

      'cardOffsetX': 0.2,
      'cardOffsetY': 0.2
    },

    initialize: function() {
      this.cardGame = undefined;

      this.cardList = new CardList();

      this.view = new CardStackView({ model: this });
    },

    validate: function(attributes, options) {
      var validAnchorXs = 'left right'.split(' '),
          validAnchorYs = 'top bottom'.split(' ');

      if (validAnchorXs.indexOf(attributes.anchorX) === -1) {
        return 'invalid anchorX';
      }
      
      if (validAnchorYs.indexOf(attributes.anchorY) === -1) {
        return 'invalid anchorY';
      }
    },

    addCard: function(card) {
      card.cardStack = this;
      this.cardList.add(card);
    },

    addCardAt: function(card, index) {
      card.cardStack = this;
      this.cardList.add(card, { at: index });
    },

    removeCard: function(card) {
      card.cardStack = undefined;
      this.cardList.remove(card);
    },

    getCardAt: function(index) {
      return this.cardList.at(index);
    },

    getBottomCard: function() {
      return this.cardList.at(0);
    },

    getTopCard: function() {
      return this.cardList.at(this.cardList.length - 1);
    },

    indexOfCard: function(card) {
      return this.cardList.indexOf(card);
    },

    getAllCards: function() {
      return this.cardList.models.slice(0);
    },

    getCardCount: function() {
      return this.cardList.length;
    },

    eachCard: function(callback, context) {
      var cards = this.getAllCards().reverse();
      _.each(cards, callback, context);
    },

    shuffle: function() {
      this.cardList.reset(this.cardList.shuffle());
    }
  });
});
