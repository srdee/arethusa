"use strict";

angular.module('arethusa.perseidsPerf').service('perseidsPerf', [
  'state',
  'configurator',
  '$location',
  function(state, configurator, $location) {
    var self = this;
    var docs = ['iliad', 'cicero', 'sallust'];
    self.documents = docs.join(' ');
    self.retrieverCount = 0;
    var retrievers;

    this.defaultConf = {
      name: 'perseidsPerf',
      main: true,
      template: 'templates/arethusa.perseidsPerf/perseidsPerf.html'
    };

    function configure() {
      configurator.getConfAndDelegate('perseidsPerf', self);
      retrievers = arethusaUtil.map(docs, function(el) {
        var r = configurator.getRetriever(self.conf.retriever);
        r.docPath(el);
        return r;
      });
      self.retrieverCount = retrievers.length;
      self.canPost = false;
      self.getResults = [];
      self.postResults = [];
    }

    configure();

    this.getFiles = function() {
      self.getResults = [];
      angular.forEach(retrievers, function(retriever, i) {
        retriever.get(function(report) {
          self.getResults.push(report);
        });
      });
      self.canPost = true;
    };

    this.postFiles = function() {
      self.postResults = [];
      angular.forEach(retrievers, function(retriever, i) {
        retriever.post(function(report) {
          self.postResults.push(report);
        });
      });
    };

    this.reinit = function() {
      docs = self.documents.split(' ');
      configure();
    };

    this.init = function() {
    };
  }
]);
