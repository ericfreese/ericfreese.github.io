define([
  'jquery',
  'underscore',
  'backbone'
],

function($, _, Backbone) {
  return Backbone.View.extend({
    tagName: 'div',
    className: 'card',

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);

      // Fires when the card is moved to another card stack
      this.listenTo(this.model, 'move', function(model, cardStackTo, cardStackFrom) {
        this.$el.appendTo(cardStackTo.view.$el).render();
      });
    },

    events: {
      'click': function(event) {
        this.model.cardStack.cardGame.trigger('click.card', event, this.model);
      }
    },

    render: function() {
      console.log('rendering', this.model.toJSON());

      // Set data attributes for rank & suit
      this.$el.attr('data-suit', this.model.get('suit'));
      this.$el.attr('data-rank', this.model.get('rank'));

      // Toggle class to show card flipped
      if (this.model.get('flipped')) {
        this.$el.addClass('flipped');
      } else {
        this.$el.removeClass('flipped');
      }

      // Toggle class to show card selected
      if (this.model.get('selected')) {
        this.$el.addClass('selected');
      } else {
        this.$el.removeClass('selected');
      }

      // Update offset within card stack
      var cardIndex = this.model.cardStack.indexOfCard(this.model);

      this.$el.css({
        left: this.model.cardStack.get('cardOffsetX') * cardIndex + '%',
        top: this.model.cardStack.get('cardOffsetY') * cardIndex + '%'
      });

      return this;
    }
  });
});
