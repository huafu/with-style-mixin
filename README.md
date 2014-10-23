# with-style-mixin

An Ember mixin to allow you to bind style properties on your view/controller/whatever properties.

## Installation

* `npm install --save-dev with-style-mixin`

## Using

To use in your app with any view, import and use the mixin:

```js
import Ember from 'ember';
import WithStyleMixin from 'with-style-mixin/mixins/with-style';

export default Ember.View.extend(WithStyleMixin, {
  styleBindings: ['width[px]', 'color', 'fontSize:font-size[em]', 'margin[px]'],
  width: 10,
  color: 'red',
  fontSize: '3pt', // will not use 'em' unless it is a number and !== 0
  margin-top: 0 // will not use 'px' since it is 0
});
```

You'll then get that in the generated HTML:

```html
<div style="width: 10px; color: red; font-size: 3pt; margin: 0;"></div>
```

## API

* All style properties have to be defined on `styleBindings` as an array
* Each property can be:
    * The name of the css property:
        * `width` (the `width` Ember property will then be used as source for `width` css property)
    * The name of your Ember property + `:` + the name of the css property:
        * `myWidth:width` (the `myWidth` Ember property will then be used as source for `width` css property) 
    * One of the 2 above + a unit between `[` and `]`:
        * `width[px]` (the `width` Ember property will then be used as source for `width` css property, append `px` at the end of the value)
        * `myWidth:width[px]` (the `myWidth` Ember property will then be used as source for `width` css property, append `px` at the end of the value)
* If the property value is `undefined`, `null` or `''` (empty string), it'll not be included in the `style`
* When a unit is specified, it'll be appended to the value unless the value is `0` or not numeric, which allow you to do:
    * `width[px]`:
        * `width` is `0`: `width: 0;`
        * `width` is `10` or `'10'`: `width: 10px;` (works also with float values)
        * `width` is `'10%'`: `width: 10%;`
