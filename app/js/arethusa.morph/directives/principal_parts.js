"use strict";

angular.module('arethusa.morph').directive('principalParts', [
  'morph',
  function(morph) {
    return {
      restrict: 'A',
      scope: {
        parts: "=principalParts",
        type: "@"
      },
      link: function(scope, element, attrs) {
        function setTemplate() {
          scope.template = scope.type ? "templates/arethusa.morph/principal_parts_" + scope.type + '.html' : '';
        }

        scope.$watch('type', function(newVal, oldVal) {
          setTemplate();
        });
      },
      template: '<span ng-include="template"/>'
    };
  }
]);
