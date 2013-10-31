require.config({
  baseUrl: '/js/card_experiments',
  paths: {
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: [ 'underscore', 'jquery' ],
      exports: 'Backbone'
    },
  }
});

define([
  'views/CardExperimentsView'
],

function() {
  var CardExperimentsView = require('views/CardExperimentsView');

  window.CardExperiments = new CardExperimentsView();
});
