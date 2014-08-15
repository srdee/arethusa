"use strict";

angular.module('arethusa.morph').directive('adjForms', [
  function() {
    return {
      restrict: 'A',
      scope: {
        forms: '=adjForms'
      },
      link: function(scope, element, attrs) {
        scope.adverb = scope.forms.pop();
        scope.principalParts = {
          nomM: scope.forms[0].string,
          nomF: scope.forms[12].string,
          nomN: scope.forms[24].string
        };

        scope.tableData = { 1: {}, 2: {} };
        for (var i=1; i < 7; i++) {
          scope.tableData[1][i] = { m: [], f: [], n: [] };
          scope.tableData[2][i] = { m: [], f: [], n: [] };
        }

        scope.formsAsString = function(forms) {
          return arethusaUtil.map(forms, function(el) {
            return el.string;
          }).join(', ');
        };

        angular.forEach(scope.forms, function(form, i) {
          scope.tableData[form.numerus][form.casus][form.sexus].push(form);
        });
      },
      templateUrl: 'templates/arethusa.morph/adj_forms.html'
    };
  }
]);
