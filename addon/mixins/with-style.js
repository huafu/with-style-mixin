import Ember from 'ember';

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
  styleBindings:          Ember.required(),


  /**
   * @property styleBindingsMap
   * @type Object<Object>
   */
  styleBindingsMap: function () {
    var res = {}, match, cssProp, emberProp, unit,
      bindings = this.get('styleBindings');
    for (var i = 0; i < bindings.length; i++) {
      if ((match = bindings[i].match(/^(([^:]+):)?([a-z0-9_\.-]+)(\[([a-z%]+)\])?$/i))) {
        cssProp = match[3];
        emberProp = match[2] || cssProp;
        unit = match[5];
        res[cssProp] = { property: emberProp, unit: unit };
      }
    }
    return res;
  }.property('styleBindings.@each').readOnly(),

  /**
   * @property style
   * @type String
   */
  style: function () {
    var map = this.get('styleBindingsMap');
    var props = [], cssVal, unit;
    for (var cssProp in map) {
      cssVal = this.get(map[cssProp].property);
      if (cssVal !== undefined && cssVal !== null && cssVal !== '') {
        unit = map[cssProp].unit;
        cssVal = '' + cssVal;
        unit = unit && cssVal !== '0' && /^[0-9\.]+$/.test(cssVal) ? unit : '';
        props.push(cssProp + ': ' + cssVal + unit + ';');
      }
    }
    return props.join(' ');
  }.property().readOnly(),

  /**
   * Schedule the notification of the change of the style property
   * @method _notifyStyleChange
   * @private
   */
  _notifyStyleChange: function () {
    Ember.run.once(this, 'notifyPropertyChange', 'style');
  },

  /**
   * Start listening for any style related property change
   * @method _initWithStyleMixin
   * @private
   */
  _initWithStyleMixin: function () {
    var map = this.get('styleBindingsMap');
    for (var k in map) {
      this.addObserver(map[k].property, this, '_notifyStyleChange');
    }
  }.observes('styleBindings.@each').on('init'),

  /**
   * Stop listening for any style related property change
   * @method _destroyWithStyleMixin
   * @private
   */
  _destroyWithStyleMixin: function () {
    var map = this.get('styleBindingsMap');
    for (var k in map) {
      this.removeObserver(map[k].property, this, '_notifyStyleChange');
    }
  }.observesBefore('styleBindings.@each').on('destroy')
});

export default WithStyleMixin;
