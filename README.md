# with-style-mixin [![Build Status](https://travis-ci.org/huafu/with-style-mixin.svg?branch=master)](https://travis-ci.org/huafu/with-style-mixin)

An Ember mixin to allow you to bind style properties on your view/controller/whatever properties.
Very simple live demo available [here](http://huafu.github.io/with-style-mixin/)

## Installation

* `npm install --save-dev with-style-mixin`

## Using

To use in your app with any view, import and use the mixin:

```js
import Ember from 'ember';
import WithStyleMixin from 'with-style-mixin/mixins/with-style';

export default Ember.View.extend(WithStyleMixin, {
  styleBindings: [
    'width[px]', 'color', 'fontSize:font-size[em]', 'margin[px]',
    'show:display?block:none', 'visible:visibility?:hidden'
  ],
  width: 10,        // => 'width: 10px;'
  color: 'red',     // => 'color: red;'
  fontSize: '3pt',  // => 'font-size: 3pt;'
  margin: 0,        // => 'margin: 0;'
  show: true        // => 'display: block;' (if true => 'display: block;')
  visible: false    // => visibility: hidden; (if true => '')
});
```

You'll then get that in the generated HTML:

```html
<div style="width: 10px; color: red; font-size: 3pt; margin: 0; display: block; visibility: hidden;"></div>
```

...well, ok it doesn't make sense as a style but it is to show the different features.

---

You can also use the `{{bind-style ...}}` helper if you need to bind styles on any other element than
the main element of a view. It's working exactly the same thinking that you give as arguments each entry
you'd put in the view's `styleBindings` property:

```handlebars
<div {{bind-style 'width[px]' 'color' 'fontSize:font-size[em]' 'margin[px]'
    'show:display?block:none' 'visible:visibility?:hidden'}}>
  <p>hello!<p>
</div>
```
    
You can also combine all in one string, separating each of them with a space:

```handlebars
<div {{bind-style 'width[px] color fontSize:font-size[em] margin[px]'
    'show:display?block:none visible:visibility?:hidden'}}>
  <p>hello!<p>
</div>
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
    * One of the 3 above (well 4 exactly) + `?` + the value to use if truthy + `:` + the value to use if falsy:
        * `display?block:none` (`block` will be used if `display` is truthy, else `none`)
        * `isVisible:display?:none` (nothing used if `isVisible` is truthy, `none` is used if `isVisible` is falsy)
        * `isLarge:line-height[px]?30:20` (`line-height` will be `30px` if `isLarge` is truthy, else `20px`)
* If the property value is `undefined`, `null` or `''` (empty string), it'll not be included in the `style`
* When a unit is specified, it'll be appended to the value unless the value is `0` or not numeric, which allow you to do:
    * `width[px]`:
        * `width` is `0`: `width: 0;`
        * `width` is `10` or `'10'`: `width: 10px;` (works also with float values)
        * `width` is `'10%'`: `width: 10%;`


## Authors

* ![Huafu Gandon](https://s.gravatar.com/avatar/950590a0d4bc96f4a239cac955112eeb?s=24) [Huafu Gandon](https://github.com/huafu)
