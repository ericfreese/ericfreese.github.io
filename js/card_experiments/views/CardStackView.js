define([
  'jquery',
  'underscore',
  'backbone',

  'views/CardView'
],

function($, _, Backbone) {
  var CardView = require('views/CardView');

  return Backbone.View.extend({
    tagName: 'div',
    className: 'card-stack',

    initialize: function() {
      this.listenTo(this.model.cardList, 'add', function(model, collection, options) {
        this.$el.append(model.view.render().el);
      });

      this.listenTo(this.model.cardList, 'reset', function(list, options) {
        this.$el.empty();
        this.model.cardList.each(function(card) {
          this.$el.append(card.view.render().delegateEvents().$el);
        }, this);
      });
    },

    events: {
      'click': function(event) {
        this.model.cardGame.trigger('click.cardstack', event, this.model);
      }
    },

    render: function() {
      var css = {};
      css[this.model.get('anchorX')] = this.model.get('positionX') + '%';
      css[this.model.get('anchorY')] = this.model.get('positionY') + '%';

      this.$el.css(css);

      return this;
    }
  });
});
