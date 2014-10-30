function EMPTY_CACHE() {
}
function WRONG_BINDING() {
}

var STYLE_BINDING_PROPERTY_REGEXP = /^(([^\?:]+):)?([a-z0-9_\.-]+)(\[([a-z%]+)\])?(\?([a-z0-9_\.-]*):([a-z0-9_\.-]*))?$/i;

/**
 * Cache for building bindings
 * @name BINDINGS_CACHE
 * @type Object
 */
var BINDINGS_CACHE = Object.create(null);


/**
 * Build the bindings map from given array
 *
 * @method buildBindingsMap
 * @param {Array<String>} bindings
 * @returns {Object}
 */
export function buildBindingsMap(bindings) {
  var res = {}, match, cssProp, emberProp, unit, binding, meta, cache;
  for (var i = 0; i < bindings.length; i++) {
    binding = bindings[i];
    // we got a match in the bindings cache
    if ((match = BINDINGS_CACHE[binding])) {
      // if it is a valid binding, use it
      if (match !== WRONG_BINDING) {
        cssProp = match.cssProp;
        res[cssProp] = meta = Object.create(null);
        meta.property = match.property;
        meta.unit = match.unit;
        meta.yesNo = match.yesNo;
        meta.cache = EMPTY_CACHE;
      }
    }
    // try to parse the binding
    else if ((match = binding.match(STYLE_BINDING_PROPERTY_REGEXP))) {
      cssProp = match[3];
      emberProp = match[2] || cssProp;
      unit = match[5];
      res[cssProp] = meta = Object.create(null);
      meta.property = emberProp;
      meta.unit = unit;
      meta.cache = EMPTY_CACHE;
      if (match[6]) {
        meta.yesNo = Object.create(null);
        meta.yesNo.yes = match[7];
        meta.yesNo.no = match[8];
      }
      // cache the binding
      BINDINGS_CACHE[binding] = cache = Object.create(null);
      cache.property = emberProp;
      cache.unit = unit;
      cache.cssProp = cssProp;
      cache.yesNo = meta.yesNo;
    }
    // without match, save it in the bindings cache to avoid re-computing later
    else {
      BINDINGS_CACHE[binding] = WRONG_BINDING;
    }
    cache = meta = undefined;
  }
  return res;
}

/**
 * Flushes the bindings map building cache
 *
 * @method flushBindingsMapCache
 */
export function flushBindingsMapCache() {
  BINDINGS_CACHE = Object.create(null);
}

/**
 * Compute the style property given its css property name, value and unit
 *
 * @param {String} cssProp
 * @param {*} value
 * @param {Object} [yesNo]
 * @param {String} [unit]
 * @returns {String}
 */
export function computeStyleProperty(cssProp, value, yesNo, unit) {
  if (yesNo) {
    if (value) {
      value = yesNo.yes;
    }
    else {
      value = yesNo.no;
    }
  }
  if (value !== undefined && value !== null && value !== '') {
    value = '' + value;
    unit = (unit && value !== '0' && /^[0-9\.]+$/.test(value)) ? unit : '';
    return cssProp + ': ' + value + unit + ';';
  }
  else {
    return null;
  }
}


/**
 * Compute the full style from a bindings map
 *
 * @method computeStylesFromMap
 * @param {Object} map
 * @param {Object} [target=this]
 * @param {Function|String} [targetMethod='get']
 * @returns {string}
 */
export function computeStylesFromMap(map, target, targetMethod) {
  var buffer = '', val;
  targetMethod = targetMethod || 'get';
  target = target || this;
  if (typeof targetMethod === 'string') {
    targetMethod = target[targetMethod];
  }
  for (var cssProp in map) {
    // get from the cache, and compute the value if the cache is an empty entry
    if ((val = map[cssProp].cache) === EMPTY_CACHE) {
      val = map[cssProp].cache = computeStyleProperty(
        cssProp,
        targetMethod.call(target, map[cssProp].property),
        map[cssProp].yesNo,
        map[cssProp].unit
      );
    }
    if (val !== null) {
      buffer += buffer ? ' ' + val : val;
    }
  }
  return buffer;
}


/**
 * Compute the style of a given css property and save it in the cache of given map
 *
 * @method updateStyleCacheInMap
 * @param {Object} map
 * @param {String} cssProp
 * @param {Object} [target=this]
 * @param {Function|String} [targetMethod='get']
 * @returns {string}
 */
export function updateStyleCacheInMap(map, cssProp, target, targetMethod) {
  targetMethod = targetMethod || 'get';
  target = target || this;
  if (typeof targetMethod === 'string') {
    targetMethod = target[targetMethod];
  }
  return map[cssProp].cache = computeStyleProperty(
    cssProp,
    targetMethod.call(target, map[cssProp].property),
    map[cssProp].yesNo,
    map[cssProp].unit
  );
}

