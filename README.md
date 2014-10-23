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
