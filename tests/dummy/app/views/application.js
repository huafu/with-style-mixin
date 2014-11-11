/* globals hljs */
import Ember from 'ember';
import WithStyleMixin from 'with-style-mixin/mixins/with-style';

export default Ember.View.extend(WithStyleMixin, {
  styleBindings: [
    'controller.appPaddingTop:padding-top[px]',
    'bgColor:background-color'
  ],

  bgColor: 'inherit',

  initHljs: function () {
    if (typeof hljs === 'undefined') {
      return;
    }
    Ember.run.schedule('afterRender', this, function () {
      this.$('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
      });
    });
  }.on('didInsertElement')
});
