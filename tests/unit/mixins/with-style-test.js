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

test('it renders properties with ternary operator', function () {
  var subject = WithStyleView.create({
    styleBindings: ['display?:none', 'visibility?visible:', 'overflow?visible:hidden'],
    display:       true,
    visibility:    true,
    overflow:      true
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'visibility: visible; overflow: visible;');
    subject.setProperties({
      display:    false,
      visibility: false,
      overflow:   false
    });
  });
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'display: none; overflow: hidden;');
  });
});

test('it renders properties with ternary operator and mapping', function () {
  var subject = WithStyleView.create({
    styleBindings: ['disp:display?:none', 'vis:visibility?visible:', 'over:overflow?visible:hidden'],
    disp:          true,
    vis:           true,
    over:          true
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'visibility: visible; overflow: visible;');
    subject.setProperties({
      disp: false,
      vis:  false,
      over: false
    });
  });
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'display: none; overflow: hidden;');
  });
});

test('it renders properties with ternary operator and units', function () {
  var subject = WithStyleView.create({
    styleBindings: ['width[px]?:10', 'height[%]?50:', 'padding[em]?10:0'],
    width:         true,
    height:        true,
    padding:       true
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'height: 50%; padding: 10em;');
    subject.setProperties({
      width:   false,
      height:  false,
      padding: false
    });
  });
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 10px; padding: 0;');
  });
});

test('it renders properties with ternary operator, mapping and units', function () {
  var subject = WithStyleView.create({
    styleBindings: ['w:width[px]?:100', 'h:height[%]?50:', 'pad:padding[em]?10:0'],
    w:             true,
    h:             true,
    pad:           true
  });
  render(subject);
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'height: 50%; padding: 10em;');
    subject.setProperties({
      w:   false,
      h:   false,
      pad: false
    });
  });
  Ember.run(function () {
    strictEqual(subject.$().attr('style'), 'width: 100px; padding: 0;');
  });
});
