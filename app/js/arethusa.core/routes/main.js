'use strict';
angular.module('arethusa.core').constant('MAIN_ROUTE', {
  controller: 'ArethusaCtrl',
  template: '<div ng-include="template"></div>',
  resolve: {
    loadConfiguration: ['$http', 'confUrl', 'configurator', function ($http, confUrl, configurator) {
      var url = confUrl(true);
      return $http.get(url).then(function (res) {
        configurator.defineConfiguration(res.data, url);
      });
    }]
  }
});
