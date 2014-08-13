"use strict";

angular.module('arethusa.morph').directive('nounForms', [
  function() {
    return {
      restrict: 'A',
      scope: {
        forms: '=nounForms'
      },
      link: function(scope, element, attrs) {
        scope.principalParts = {
          nom:  scope.forms[0].string,
          stem: scope.forms[1].stem,
          gen:  scope.forms[1].ending,
          sex:  scope.forms[0].sexus
        };


        scope.tableData = {};
        for (var i=1; i < 7; i++) {
          scope.tableData[i] = { 1: [], 2: [] };
        }

        scope.formsAsString = function(forms) {
          return arethusaUtil.map(forms, function(el) {
            return el.string;
          }).join(', ');
        };

        angular.forEach(scope.forms, function(form, i) {
          scope.tableData[form.casus][form.numerus].push(form);
        });
      },
      templateUrl: 'templates/arethusa.morph/noun_forms.html'
    };
  }
]);
