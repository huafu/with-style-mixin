import Ember from 'ember';

function EMPTY_CACHE() {
}
function WRONG_BINDING() {
}

var BINDINGS_CACHE = Object.create(null);

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
  styleBindingsMap: function () {
    var res = {}, match, cssProp, emberProp, unit, binding,
      bindings = this.get('styleBindings');
    for (var i = 0; i < bindings.length; i++) {
      binding = bindings[i];
      // we got a match in the bindings cache
      if ((match = BINDINGS_CACHE[binding])) {
        // if it is a valid binding, use it
        if (match !== WRONG_BINDING) {
          cssProp = match.cssProp;
          res[cssProp] = { property: match.property, unit: match.unit, cache: EMPTY_CACHE };
        }
      }
      // try to parse the binding
      else if ((match = binding.match(/^(([^:]+):)?([a-z0-9_\.-]+)(\[([a-z%]+)\])?$/i))) {
        cssProp = match[3];
        emberProp = match[2] || cssProp;
        unit = match[5];
        res[cssProp] = { property: emberProp, unit: unit, cache: EMPTY_CACHE };
        // cache the binding
        BINDINGS_CACHE[binding] = { property: emberProp, unit: unit, cssProp: cssProp };
      }
      // without match, save it in the bindings cache to avoid re-computing later
      else {
        BINDINGS_CACHE[binding] = WRONG_BINDING;
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
    var props = [], val;
    for (var cssProp in map) {
      // get from the cache, and compute the value if the cache is an empty entry
      if ((val = map[cssProp].cache) === EMPTY_CACHE) {
        val = map[cssProp].cache = this._computeStyle(
          cssProp, this.get(map[cssProp].property), map[cssProp].unit
        );
      }
      if (val !== null) {
        props.push(val);
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
   * Recomputed one property when it has changed
   *
   * @method _stylePropertyDidChange
   * @param {String} cssProp
   * @private
   */
  _stylePropertyDidChange: function (cssProp) {
    var map = this.get('styleBindingsMap');
    map[cssProp].cache = this._computeStyle(cssProp, this.get(map[cssProp].property), map[cssProp].unit);
    this._notifyStyleChange();
  },

  /**
   * Computes the style property given the name of the css property, it's value and unit
   *
   * @method _computeStyle
   * @param {String} cssProp
   * @param {*} value
   * @param {String} unit
   * @returns {String}
   * @private
   */
  _computeStyle: function (cssProp, value, unit) {
    if (value !== undefined && value !== null && value !== '') {
      value = '' + value;
      unit = unit && value !== '0' && /^[0-9\.]+$/.test(value) ? unit : '';
      return cssProp + ': ' + value + unit + ';';
    }
    else {
      return null;
    }
  },

  /**
   * Start listening for any style related property change
   * @method _initWithStyleMixin
   * @private
   */
  _initWithStyleMixin: function () {
    var map = this.get('styleBindingsMap');
    for (var k in map) {
      this.addObserver(map[k].property, this, '_stylePropertyDidChange', k);
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
      this.removeObserver(map[k].property, this, 'stylePropertyDidChange');
    }
  }.observesBefore('styleBindings.@each').on('destroy')
});

export default WithStyleMixin;
