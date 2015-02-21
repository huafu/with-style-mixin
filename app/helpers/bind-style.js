import Ember from 'ember';
import StyleBindingsMeta from 'with-style-mixin/core/style-bindings-meta';

var addListener = Ember.addListener;
var run = Ember.run;
var once = run.once;
var SafeString = Ember.Handlebars.SafeString;

var uuid = 0;

var ATTRIBUTE_REPLACE_MAP = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};


/**
 * Escape an HTML attribute value
 * TODO: replace with Ember helper if there is one and if it runs faster
 *
 * @method escapeAttribute
 * @param {*} str
 * @returns {String}
 */
function escapeAttribute(str) {
  if (str === null || str === undefined) {
    str = '';
  }
  else {
    str = '' + str;
  }
  return str.replace(/[&<>'"]/g, function (c) {
    return ATTRIBUTE_REPLACE_MAP[c];
  });
}

function bindStyle(/*binding1, binding2, ..., options*/) {
  var bindings = [].slice.call(arguments);
  var options = bindings.pop();
  var view = options.data.view;
  var bindingsMeta = new StyleBindingsMeta(this, bindings);
  var id = ++uuid;
  // listen for changes
  bindingsMeta.addListener(function () {
    var $el;
    if (!view || view.isDestroying || view.isDestroyed || !($el = view.$('[data-bindstyle-' + id + '="' + id + '"]')).length) {
      // we have been removed, destroy our meta
      bindingsMeta.destroy();
      bindingsMeta = null;
    }
    else {
      $el.attr('style', bindingsMeta.getStyle());
    }
  });
  addListener(view, 'willClearRender', bindingsMeta, 'destroy');
  addListener(view, 'willDestroyElement', bindingsMeta, 'destroy');
  once(bindingsMeta, 'startObserving');
  return new SafeString(
    'style="' + escapeAttribute(bindingsMeta.getStyle()) + '" data-bindstyle-' + id + '="' + id + '"'
  );
}

export {
  bindStyle
  };

export default bindStyle;
