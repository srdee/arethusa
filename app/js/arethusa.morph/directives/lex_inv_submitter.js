"use strict";

angular.module('arethusa.morph').directive('lexInvSubmitter', [
  'morph',
  'state',
  'configurator',
  '$modal',
  function(morph, state, configurator, $modal) {
    return {
      restrict: 'A',
      scope: {
        id: "=formId"
      },
      link: function(scope, element, attrs) {
        scope.toggle = function() {
          scope.visible = !scope.visible;
          var builder = configurator.getRetriever({ 'FormBuilder' : {
            resource: "lltFormBuilder"
          }});

          scope.values = {
            "noun" : {
              "inputFields" : [
                { "cat" : "nominative" },
                { "cat" : "stem" },
                {
                  "cat" : "inflection class",
                  "values" : [
                    {
                      "val" : "1",
                      "str" : "A-Declension"
                    },
                    {
                      "val" : "2",
                      "str" : "O-Declension"
                    },
                    {
                      "val" : "3",
                      "str" : "Third Declension (consonant)"
                    },
                    {
                      "val" : "31",
                      "str" : "Third Declension (i, neuter)"
                    },
                    {
                      "val" : "32",
                      "str" : "Third Declension (i, feminine)"
                    },
                    {
                      "val" : "33",
                      "str" : "Third Declension (mixed)"
                    },
                    {
                      "val" : "4",
                      "str" : "U-Declension"
                    },
                    {
                      "val" : "5",
                      "str" : "E-Declension"
                    }
                  ]
                },
                {
                  "cat" : "gender",
                  "values" : [
                    { "val" : "m", "str" : "m" },
                    { "val" : "f", "str" : "f" },
                    { "val" : "n", "str" : "n" }
                  ]
                }
              ],
              "options" : {
                "casus" : [ 1, 2, 3, 4, 5, 6],
                "numerus" : [ "sg", "pl"]
              }
            },
            "adj" : {
              "inputFields" : [
                { "cat" : "nominative" },
                { "cat" : "stem" },
                {
                  "cat" : "inflection class",
                  "values" : [
                    {
                      "val" : "1",
                      "str" : "A/0-Declension"
                    },
                    {
                      "val" : "3",
                      "str" : "Third Declension (consonant)"
                    },
                    {
                      "val" : "33",
                      "str" : "Third Declension (i-stem)"
                    }
                  ]
                },
                {
                  "cat" : "number of terminations",
                  "values": [
                    { "val" : 1, "str" : "1" },
                    { "val" : 2, "str" : "2" },
                    { "val" : 3, "str" : "3" }
                  ]
                }
              ]
            }
          };

          scope.clearData = function() {
            scope.data = {};
          };

          var modal;
          scope.submit = function() {
            scope.request = { type: scope.pos };
            arethusaUtil.inject(scope.request, scope.data, function(memo, k, v) {
              memo[k.split(' ').join('_')] = v;
            });
            if (scope.pos === 'adj') {
              scope.request.degree = 'pos';
            }

            scope.forms = false;
            builder.getForms(scope.request, function(res) {
              scope.forms = res.data;
            });

            modal = $modal.open({
              templateUrl: 'templates/arethusa.morph/form_builder_modal.html',
              scope: scope,
              windowClass: 'full-modal'
            });
          };

          scope.cancelModal = function() {
            modal.close();
          };

        };

      },
      templateUrl: 'templates/arethusa.morph/lex_inv_submitter.html'
    };
  }
]);
