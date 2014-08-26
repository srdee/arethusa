'use strict';
angular.module('arethusa.core').factory('Auth', [
  '$resource',
  '$cookies',
  function ($resource,$cookies) {

    return function(conf) {
      var self = this;
      self.conf = conf;

      var ping = self.conf.ping;
      var pinger = ping ? $resource(self.conf.ping, null, {}) || {};

      this.preflight = function() {
        // if the authorization config for this resource has a
        // ping method configured, use it to initialize the cookies
        if (self.conf.ping) {
          var ping = $resource(self.conf.ping, null, { });
          // TODO should really have some error handling here
          // because if the ping fails the subsequent get and post
          // requests on the resource will
          ping.get(function(res) {
            //$cookies[self.conf.cookie] =
          });
        }
      };

      this.checkAndSave = function(q, callback) {
        pinger.get(function() {
          callback().then(function(res) {
            q.resolve(res);
          });
        }, function() {
          q.reject();
        });
      };

      this.transformResponse = function(headers) {
      };

      this.transformRequest = function(headers) {
        if (self.conf.type == 'CSRF') {
            headers()[self.conf.header] = $cookies[self.conf.cookie];
        }
      };
    };
  }
]);
