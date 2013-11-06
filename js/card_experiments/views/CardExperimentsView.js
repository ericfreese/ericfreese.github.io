define([
  'jquery',
  'underscore',
  'backbone',

  'models/CardGame'
],

function($, _, Backbone) {
  var CardGame = require('models/CardGame');

  return Backbone.View.extend({
    el: $('#card-experiments'),

    initialize: function() {
      this.loadGame(this.$('input[name="game"]').val());
    },

    events: {
      'submit form.load-game': function() {
        this.loadGame(this.$('input[name="game"]').val());
        return false;
      },

      'submit form.full-screen': function() {
        if (this.el.webkitRequestFullscreen) this.el.webkitRequestFullscreen();
        return false;
      }
    },

    loadGame: function(game) {
      var _this = this;

      if (game.match(/[a-z\-]+/)) {
        require(['games/' + game], function(game) {
          var newGame = new CardGame();
          // _this.$('.card-game-container').remove();
          // _this.$el.prepend($('<div class="card-game-container"></div>').append(newGame.view.render().$el));
          _this.$('.card-game').remove();
          _this.$el.append(newGame.view.render().$el);

          game.initialize(newGame);
        });
      }
    }
  });
});
