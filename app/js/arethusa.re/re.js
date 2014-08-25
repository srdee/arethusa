"use strict";

angular.module('arethusa.re').service('re', [
  'state',
  'configurator',
  function(state, configurator) {
    var self = this;

    this.defaultConf = {
      name: 're',
      template: 'templates/arethusa.re/re.html',
      ruleSet: [
        "_if_ $head.id === 0 && $morph.attributes.pos === 'verb' _then_ $relation.prefix = 'PRED'"
      ]
    };

    var confKeys = [
      'ruleSet'
    ];

    function configure() {
      configurator.getConfAndDelegate('re', self, confKeys);
      self.rules = [];
      parseRules();
    }

    configure();

    function inBrackets(str) {
      return '{ ' + str +'; }';
    }

    function toIf(str) {
      return 'if (' + str + ') ';
    }

    this.parseRule = function(rule) {
      var body;
      var expanded = rule.replace(/\$/g, 't.');

      var regexp = /^_if_(.*?)_then_(.*)$/;

      var match = regexp.exec(expanded);
      var ifPart = match[1];
      var thenPart = match[2];

      body = toIf(ifPart) + inBrackets(thenPart);

      return new Function('t', body);
    };

    function parseRules() {
      return arethusaUtil.map(self.ruleSet, self.parseRule);
    }

    this.init = function() {
      configure();
    };
  }
]);
