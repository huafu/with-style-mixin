import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller) {
    controller.setProperties({
      borderWidth: 2,
      borderStyle: 'dashed',
      fontPercent: 100,
      appPaddingTop: 20
    });
  }
});
