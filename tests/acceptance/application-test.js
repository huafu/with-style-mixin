import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

function styleOf(selector) {
  return Ember.$(selector).attr('style');
}

module('Acceptance: Application', {
  setup:    function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

test('{{bind-style...}}', function () {
  visit('/');

  andThen(function () {
    strictEqual(styleOf('#test1'), 'width: 10px; height: 20%; margin: 10px; margin-top: 1em;');
    strictEqual(styleOf('#test2'), '');
    click('#isShown');
  });
  andThen(function () {
    strictEqual(styleOf('#test2'), 'display: none;');
    click('#isLarge');
  });
  andThen(function () {
    strictEqual(styleOf('#test2'), 'display: none; font-weight: bold;');
    fillIn('#width', 400);
    fillIn('#height', '');
    fillIn('#margin', 20);
    fillIn('#marginTop', '3px');
  });
  andThen(function() {
    strictEqual(styleOf('#test1'), 'width: 400px; margin: 20pt; margin-top: 3px;');
  });
});
