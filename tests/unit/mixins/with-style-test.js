import Ember from 'ember';
import WithStyleMixin from 'with-style-mixin/mixins/with-style';

var WithStyleView;
var containerView, view;

function render(view) {
  Ember.run(function () {
    Ember.tryInvoke(containerView, 'destroy');
    containerView = Ember.ContainerView.create();
    containerView.pushObject(view);
    containerView.appendTo('#ember-testing');
  });
}

module('WithStyleMixin', {
  setup:    function () {
    WithStyleView = Ember.View.extend(WithStyleMixin);
  },
  teardown: function () {
    Ember.run(function () {
      Ember.tryInvoke(containerView, 'destroy');
    });
    containerView = null;
    WithStyleView = null;
  }
});

test('it renders bare properties ignoring undefined/null/""', function () {
  var subject = WithStyleView.create({
    styleBindings: ['width', 'margin', 'display', 'color'],
    width:         '10px',
    display:       'none',
    color:         ''
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 10px; display: none;');
  });
});

test('it renders mapped properties ignoring undefined/null/""', function () {
  var subject = WithStyleView.create({
    styleBindings: ['myWidth:width', 'myMargin:margin', 'myDisplay:display', 'myColor:color'],
    myWidth:       '10px',
    myDisplay:     'none',
    myColor:       ''
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 10px; display: none;');
  });
});

test('it renders properties with unit', function () {
  var subject = WithStyleView.create({
    styleBindings: ['width[px]', 'margin[pt]'],
    width:         10,
    margin:        5
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 10px; margin: 5pt;');
  });
});

test('it ignores unit when the value is 0 or is not a number', function () {
  var subject = WithStyleView.create({
    styleBindings: ['width[px]', 'margin[pt]'],
    width:         '50%',
    margin:        0
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 50%; margin: 0;');
  });
});

test('it renders properties with unit and mapping', function () {
  var subject = WithStyleView.create({
    styleBindings: ['myWidth:width[em]', 'myMargin:margin[pt]', 'myHeight:height[%]'],
    myWidth:       '10px',
    myMargin:      0,
    myHeight:      30
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 10px; margin: 0; height: 30%;');
  });
});
