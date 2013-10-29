define([
  'jquery',
  'underscore',
  'backbone',
  'models/CardStack'
],

function($, _, Backbone) {
  var CardStack = require('models/CardStack');

  return Backbone.Collection.extend({
    model: CardStack,
  });
});
