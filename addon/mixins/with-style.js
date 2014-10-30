import Ember from 'ember';
import {
  buildBindingsMap,
  computeStylesFromMap,
  updateStyleCacheInMap
  } from '../helpers/bind-style';

function makeObserver(cssProp) {
  return function () {
    this._stylePropertyDidChange(cssProp);
  };
}

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
  styleBindings: Ember.required(),


  /**
   * @property styleBindingsMap
   * @type Object<Object>
   */
  styleBindingsMap: Ember.computed('styleBindings.@each', function () {
    return buildBindingsMap(this.get('styleBindings'));
  }).readOnly(),

  /**
   * @property style
   * @type String
   */
  style: Ember.computed(function () {
    return computeStylesFromMap.call(this, this.get('styleBindingsMap'));
  }).readOnly(),

  /**
   * Schedule the notification of the change of the style property
   * @method _notifyStyleChange
   * @private
   */
  _notifyStyleChange: function () {
    Ember.run.once(this, 'notifyPropertyChange', 'style');
  },

  /**
   * Recomputed one property when it has changed
   *
   * @method _stylePropertyDidChange
   * @param {String} cssProp
   * @private
   */
  _stylePropertyDidChange: function (cssProp) {
    updateStyleCacheInMap.call(this, this.get('styleBindingsMap'), cssProp);
    this._notifyStyleChange();
  },

  /**
   * Start listening for any style related property change
   * @method _initWithStyleMixin
   * @private
   */
  _initWithStyleMixin: Ember.observer('styleBindings.@each', Ember.on('init', function () {
    var map = this.get('styleBindingsMap');
    for (var k in map) {
      this.addObserver(map[k].property, this, map[k].observer = makeObserver(k));
    }
  })),

  /**
   * Stop listening for any style related property change
   * @method _destroyWithStyleMixin
   * @private
   */
  _destroyWithStyleMixin: Ember.beforeObserver('styleBindings.@each', Ember.on('destroy', function () {
    var map = this.get('styleBindingsMap');
    for (var k in map) {
      this.removeObserver(map[k].property, this, map[k].observer);
      delete map[k].observer;
    }
  }))
});

export default WithStyleMixin;
