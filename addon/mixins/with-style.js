import Ember from 'ember';
import StyleBindingsMeta from '../core/style-bindings-meta';

var computed = Ember.computed;
var required = Ember.required;
var observer = Ember.observer;
var on = Ember.on;

/**
 * @mixin WithStyleMixin
 * @example
 * ```javascript
 * export default Ember.View.extend(WithStyleMixin, {
 *   styleBindings: ['width[px]', 'color', 'fontSize:font-size[em]', 'margin[px]'],
 *   width: 10,
 *   color: 'red',
 *   fontSize: '3pt', // will not use 'em' unless it is a number and !== 0
 *   margin-top: 0 // will not use 'px' since it is 0
 * });
 * ```
 * will generate:
 * ```html
 * <div style="width: 10px; color: red; font-size: 3pt; margin: 0;"></div>
 * ```
 */
var WithStyleMixin = Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings:      ['style'],

  /**
   * Define each style binding as you'd do with `attributeBindings` with one added feature: the units
   * If no unit is defined, the value of the property is used as the style if it is not null, undefined or ''
   * If a unit is defined it is appended to the style value only if the value is recognized as a number
   * and if this number is not 0.
   * To define the unit, append it to the style binding around brackets.
   *
   * @example
   * ```javascript
   *  styleBindings: [
   *    // use the `display` property as the `display` style value:
   *    'display',
   *
   *    // use the `width` property as the `width` style value using `px` as the unit:
   *    'width[px]',
   *
   *    // use the `myHeightProperty` as the `height` style value using `%` as the unit:
   *    'myHeightProperty:height[%]'
   *  ]
   * ```
   *
   * @property styleBindings
   * @type Array<String>
   */
  styleBindings: required(),


  /**
   * @property styleBindingsMeta
   * @type StyleBindingsMeta
   */
  styleBindingsMeta: computed(function (key, value) {
    if (arguments.length < 2) {
      value = new StyleBindingsMeta(this);
    }
    return value;
  }),

  /**
   * @property style
   * @type String
   */
  style: computed(function () {
    return this.get('styleBindingsMeta').getStyle();
  }),

  /**
   * Schedule the notification of the change of the style property
   * @method _notifyStyleChange
   * @private
   */
  _notifyStyleChange: function () {
    this.notifyPropertyChange('style');
  },

  /**
   * Start listening for any style related property change
   * @method _initWithStyleMixin
   * @private
   */
  _initWithStyleMixin: on('init', observer('styleBindings.@each', function () {
    var meta = this.get('styleBindingsMeta');
    meta.setBindings(this.get('styleBindings'));
    meta.startObserving();
    meta.addListener('_notifyStyleChange');
  })),

  /**
   * Stop listening for any style related property change
   * @method _destroyWithStyleMixin
   * @private
   */
  _destroyWithStyleMixin: on('destroy', function () {
    this.get('styleBindingsMeta').destroy();
    this.set('styleBindingsMeta', null);
  })
});

export default WithStyleMixin;
