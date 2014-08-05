"use strict";

angular.module('arethusa.perseidsPerf').directive('perfReport', [
  function() {
    return {
      restrict: 'A',
      scope: {
        report: '=perfReport'
      },
      link: function(scope, element, attrs) {
        scope.time = scope.report.stop - scope.report.start;
      },
      templateUrl: 'templates/arethusa.perseidsPerf/perf_report.html' };
  }
]);
