"use strict";

angular.module('arethusa').factory('PerseidsPerfHandler', [
  'configurator',
  function(configurator) {
    return function(conf) {
      var self = this;
      var resource = configurator.provideResource(conf.resource);
      var queryParam;

      this.docPath = function(doc) {
        queryParam = { doc: doc};
      };

      function Report(method, start, stop, size, docId) {
        this.method = method;
        this.start = start;
        this.stop = stop;
        this.size = size;
        this.docId = docId;
      }

      var getData;

      function createReport(res, callback, method, start) {
        var stop = new Date();
        var getData = res.data;
        var size = res.data.length;
        var report = new Report(method, start, stop, size, queryParam.doc);
        callback(report);
      }

      function error() {
        return { error: true };
      }

      this.get = function(callback) {
        var start = new Date();
        resource.get(queryParam).then(function(res) {
          createReport(res, callback, 'GET', start);
        }, error);
      };

      this.post = function(callback) {
        var start = new Date();
        resource.save(getData, queryParam, 'text/xml').then(function(res) {
          createReport(res, callback, 'POST', start);
        }, error);
      };

    };
  }
]);

