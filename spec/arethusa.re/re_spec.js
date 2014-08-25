"use strict";

describe("re", function() {
  beforeEach(module("arethusa.core", function($provide) {
    $provide.value('configurator', arethusaMocks.configurator({
      getConfAndDelegate: function(name, obj) {
        obj.ruleSet = [];
      }
    }));
  }));

  beforeEach(module("arethusa.re"));

  var createTokens = function() {
    return {
      '01': {
        id: '01',
        string: 'Arma',
        relation: {
          label: "OBJ_CO"
        }
      },
      '02': {
        id: '02',
        string: 'virum',
        relation: {
          label: "OBJ_CO"
        }
      },
      '03': {
        id: '03',
        string: '-que',
        relation: {
          label: "COORD"
        }
      },
      '04': {
        id: '04',
        string: 'cano',
        relation: {
          label: "PRED"
        }
      }
    };
  };

  function fnToString(fn) {
    return fn.toString().replace(/\s/g, '');
  }

  var re;
  var state;
  beforeEach(inject(function(_re_, _state_) {
    state = _state_;
    state.tokens = createTokens();
    re = _re_;
    //re.init();
  }));

  describe('recommendation engine', function() {
    describe('this.parseRule', function() {
      iit('parses rules', function() {
        var rule ="_if_ $head.id === 0 && $morph.attributes.pos === 'verb' _then_ $relation.prefix = 'PRED'";
        var fn = function anonymous(t) { if (t.head.id === 0 && t.morph.attributes.pos === 'verb') { t.relation.prefix = 'PRED'; } };
        var res = fnToString(re.parseRule(rule));
        expect(fnToString(res)).toEqual(fnToString(fn));
      });
    });
  });
});
