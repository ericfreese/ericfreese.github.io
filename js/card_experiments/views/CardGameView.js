define([
  'jquery',
  'underscore',
  'backbone',

  'views/CardStackView'
],

function($, _, Backbone) {
  var CardStackView = require('views/CardStackView');

  return Backbone.View.extend({
    el: $('#card-game'),

    initialize: function() {
      this.listenTo(this.model.cardStackList, 'add', function(model, collection, options) {
        this.$el.append(model.view.render().el);
      });
    },
  });
});
