define([
  'jquery',
  'underscore',
  'backbone',
  'models/Card'
],

function($, _, Backbone) {
  var Card = require('models/Card');

  return Backbone.Collection.extend({
    model: Card,
  });
});
