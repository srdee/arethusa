"use strict";

describe("foreignKeys", function() {
  var element, state, scope, parentScope, keyCapture, globalSettings, languageSettings;

  var template1 = '\
    <input\
      foreign-keys\
      ng-model = "str"\
    </input>\
  ';

  var template2 = '\
    <div>\
      <input\
        foreign-keys\
      </input>\
    </div>\
  ';

  function keys(){
    return {
      keys: {
        "gr" : {
          "modifiers" : {
            "[" : "3",
          },
          "a" : "α",
          "A" : "Α",
          "[-a" : "ᾶ",
          "c" : "ψ"
        }
      }
    };
  }
  var conf = { configurationFor: keys };
  var lang = {
    getFor: function(doc) {
      return {
        name: 'Greek',
        lang: 'gr',
        leftToRight: true
      };
    },
    langNames:  {
      'gr' : 'Greek'
    }
  };

  beforeEach(function() {
    module("arethusa.core", function($provide) {
      $provide.value('configurator', arethusaMocks.configurator(conf));
      $provide.value('languageSettings', lang);
    });
  });

  function init(template, fn, isolateScope) {
    inject(function($compile, $rootScope, _state_, _keyCapture_, _languageSettings_, _globalSettings_) {
      state = _state_;
      keyCapture = _keyCapture_;
      languageSettings = _languageSettings_;
      globalSettings = _globalSettings_;

      parentScope = $rootScope.$new();
      element = angular.element(template);

      if (angular.isFunction(fn)) fn();

      $compile(element)(parentScope);

      if (isolateScope === true) {
        scope = element.isolateScope();
      } else {
        scope = element.scope();
      }
      scope.$digest();
    });
  }

  describe('parseEvent', function() {
    beforeEach(function() { init(template1, undefined, true); });
    describe('with Greek', function() {
      it('returns false if input is transformed', function() {
        var event = { keyCode: 65 };
        var parse = scope.parseEvent(event);
        expect(parse).toBeFalsy();
      });

      it('returns true if input is undefined', function() {
        var event = { keyCode: 66 };
        var parse = scope.parseEvent(event);
        expect(parse).toBeTruthy();
      });

      it('is enabled by default', function() {
        expect(scope.enabled).toBeTruthy();
      });

      it('transforms input and displays it', function() {
        var event = { keyCode: 65 };
        var parse = scope.parseEvent(event);
        expect(element[0].value).toEqual('α');
        expect(parse).toBeFalsy();
      });

      it('appends new input at the end', function() {
        var event1 = { keyCode: 65 };
        // Since we fake a previous input, we have to move
        // the cursor manually by one.
        element[0].value = 'ψ';
        scope.position = 1;

        var parse = scope.parseEvent(event1);
        expect(element[0].value).toEqual('ψα');
        expect(parse).toBeFalsy();
      });

      it('has a placeHolderText', function() {
      });
    });
  });

  describe('has a help element appended', function() {
    beforeEach(function() { init(template2); });
    xit('displays a keyboard', function() {
      var children = element.children().length;
      expect(children).toEqual(2);
    });
  });
});
