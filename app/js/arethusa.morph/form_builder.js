"use strict";

angular.module('arethusa.morph').factory('FormBuilder', [
  'configurator',
  function(configurator) {
    return function() {
      var self = this;
      this.resource = configurator.provideResource('lltFormBuilder');

      this.getForms = function(data, fn) {
        self.resource.post([data]).then(fn);
      };
    };
  }
]);
