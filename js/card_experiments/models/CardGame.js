define([
  'jquery',
  'underscore',
  'backbone',

  'collections/CardStackList',

  'views/CardGameView'
],

function($, _, Backbone) {
  var CardStackList = require('collections/CardStackList'),
      CardGameView = require('views/CardGameView');

  return Backbone.Model.extend({

    defaults: {},

    initialize: function() {
      this.cardStackList = new CardStackList();
      
      this.view = new CardGameView({ model: this });
    },

    addCardStack: function(cardStack) {
      cardStack.cardGame = this;
      this.cardStackList.add(cardStack);
    },

    getCardStack: function(cardStackId) {
      return this.cardStackList.get(cardStackId);
    }
  });
});
