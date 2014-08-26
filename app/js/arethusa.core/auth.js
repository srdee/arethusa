'use strict';
angular.module('arethusa.core').factory('Auth', [
  '$resource',
  '$cookies',
  function ($resource,$cookies) {
    return function(conf) {
      var self = this;
      self.conf = conf;

      var ping = self.conf.ping;
      var pinger = ping ? $resource(self.conf.ping, null, {
        get: {
          transformRequest: function(data, headers) {
            headers()['Access-Control-Allow-Credentials'] = true;
          };
          method: "GET",
          withCredentials: true
        }
      }) : {};

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

      function updateCookie(cookie) {
        $cookies[self.conf.cookie] = cookie;
      }

      this.checkAndSave = function(q, callback) {
        pinger.get(function(data, headers) {
          console.log(headers());
          console.log(angular.copy($cookies));
          var newCookie = headers()['Set-Cookie'][self.conf.cookie];
          updateCookie(newCookie);
          console.log($cookies);

          // restore the cookie
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
