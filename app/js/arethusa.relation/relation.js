'use strict';
angular.module('arethusa.relation').service('relation', [
  'state',
  'configurator',
  'globalSettings',
  function (state, configurator, globalSettings) {
    var self = this;
    this.name = "relation";

    this.canSearch = true;

    globalSettings.addColorizer('relation');

    function configure() {
      configurator.getConfAndDelegate(self);
      configurator.getStickyConf(self, ['advancedMode']);
      self.relationValues = self.conf.relations;
      self.relations = {};
      colorMap = undefined;
    }

    configure();

    // Currently selected labels
    this.currentLabels = function () {
      return arethusaUtil.inject({}, state.selectedTokens, function (memo, id, event) {
        memo[id] = self.relations[id];
      });
    };

    // Label handling
    function splitLabel(relation, label) {
      label = angular.isDefined(label) ? label : relation.label;
      var split = label.split('_');
      relation.prefix = split.shift() || '';
      relation.suffix = split.join('_');
    }

    this.buildLabel = function (relation, doNotSet) {
      var elements = [
          relation.prefix,
          relation.suffix
        ];
      var clean = arethusaUtil.inject([], elements, function (memo, el) {
          if (el) {
            memo.push(el);
          }
        });

      var label = clean.join('_');
      if (!doNotSet) {
        relation.label = label;
      }
      return label;
    };

    this.prefixWithAncestors = function(relation) {
      return arethusaUtil.inject([], relation.ancestors, function(memo, ancestor) {
        memo.push(ancestor.short);
      }).join(' > ') || '---';
    };

    this.suffixOrPlaceholder = function(relation) {
      return relation.suffix || '---';
    };

    this.usePrefix = 'prefix';
    this.useSuffix = 'suffix';
    this.defineAncestors = true;

    // This function is a disgrace. Please refactor.
    function getRelationValueObj(prefix) {
      var hits = arethusaUtil.findNestedProperties(self.relationValues, prefix);
      try {
        return hits[prefix][0][prefix];
      } catch(e) {}
    }
    this.initAncestors = function(relation) {
      // calculate a real ancestor chain here if need be
      var prefix = relation.prefix;
      var ancestors = [];
      if (prefix) {
        var obj = getRelationValueObj(prefix);
        if (obj) ancestors.push(obj);
      }
      relation.ancestors = ancestors;
    };

    this.expandRelation = function (relation) {
      splitLabel(relation);
      self.initAncestors(relation);
      return relation;
    };

    // Empty template for relation objects
    this.relationTemplate = function () {
      return {
        prefix: '',
        suffix: '',
        label: '',
        ancestors: []
      };
    };

    // Search/Selector
    this.resetSearchedLabel = function () {
      self.searchedLabel = self.relationTemplate();
    };

    this.selectByLabel = function (label) {
      var ids = arethusaUtil.inject([], self.relations, function (memo, id, rel) {
          if (rel.relation.label === label) {
            memo.push(id);
          }
        });
      state.multiSelect(ids);
    };

    this.buildLabelAndSearch = function(rel) {
      rel = rel ? rel : self.searchedLabel;
      self.buildLabel(rel);
      self.selectByLabel(rel.label);
    };

    // Multi-changer
    this.resetMultiChanger = function () {
      this.multiChanger = self.relationTemplate();
    };

    this.multiChangePossible = function () {
      // We check for the prefix, as only a suffix, which would
      // fill the label already would not be allowed.
      //
      // Tokens need to be selected to of course.
      return self.multiChanger.prefix !== '' &&
        state.hasSelections();
    };

    // Pretty ridiculous changes to gain compatibility with the
    // new state eventing.
    //
    // There is some duplicate stuff happening, to blame is the
    // whole nestedMenu directive logic, which has to be redone
    // for other reasons as well.
    //
    // Prefix/Suffix and Ancestors have already been built by
    // the directive when we enter relation.stateChange, only
    // the label has to be built.
    //
    // Because we need to define proper values for prefix/suffix
    // and ancestors when we want to undo/redo our changes, we
    // have to recreate them during during stateChange, which
    // leads to a redefinition on the initial event. It's not
    // really a problem, it's just not very pretty...
    //
    this.applyMultiChanger = function () {
      // We have to copy the multiChanger, so that its model
      // stays intact, when we remove the label. We need to do
      // this because we will rebuild it through changeState.
      var cleanChanger = angular.copy(self.multiChanger);
      delete cleanChanger.label;

      state.doBatched(function() {
        angular.forEach(self.currentLabels(), function (obj, id) {
          var oldAncestors = obj.relation.ancestors;
          angular.extend(obj.relation, cleanChanger);
          self.changeState(obj.relation, oldAncestors);
        });
      });
    };

    function undoFn(id, obj, val, oldAncestors) {
      oldAncestors = oldAncestors || angular.copy(obj.ancestors);
      return function() {
        splitLabel(obj, val);
        obj.ancestors = oldAncestors;
        if (isColorizer()) setStyle(id, oldAncestors);
        state.change(obj.id, 'relation.label', val);
      };
    }

    function preExecFn(id, obj, val) {
      var newAncestors = angular.copy(obj.ancestors);
      return function() {
        obj.ancestors = newAncestors;
        splitLabel(obj, val);
        if (isColorizer()) setStyle(id, newAncestors);
      };
    }

    function isColorizer() {
      return globalSettings.isColorizer('relation');
    }

    this.changeState = function(relObj, oldAncestors) {
      var id = relObj.id;
      var oldVal = relObj.label;
      var newVal = self.buildLabel(relObj, !!id);

      if (id) {
        state.change(id, 'relation.label', newVal,
                    undoFn(id, relObj, oldVal, oldAncestors),
                    preExecFn(id, relObj, newVal));
      }
    };

    // Init
    function addToInternalState(container, id, token) {
      if (!token.relation) token.relation = self.relationTemplate();
      // Passing the id is a hacky shortcut to allow access to
      // state.change. If we ever have to change ids on the fly,
      // this will call for trouble. Watch out.
      token.relation.id = id;
      container[id] = {
        string: token.string,
        relation: self.expandRelation(token.relation || '')
      };
    }

    this.createInternalState = function () {
      return arethusaUtil.inject({}, state.tokens, addToInternalState);
    };

    this.canEdit = function() {
      return self.mode === "editor";
    };

    state.on('tokenAdded', function(event, token) {
      addToInternalState(self.relations, token.id, token);
    });

    state.on('tokenRemoved', function(event, token) {
      delete self.relations[token.id];
    });

    function extractColor(obj, target, keys) {
      angular.forEach(obj, function(rel, name) {
        var style  = rel.style;
        var nested = rel.nested;
        if (style) {
          var key = aU.flatten(aU.map(keys, rel)).join(' || ');
          target[key] = style;
        }

        if (nested) {
          extractColor(nested, target, keys);
        }
      });
    }

    function createColorMap() {
      var keys = ['short', 'long'];
      var map = { header: keys, colors: {} };

      extractColor(self.relationValues.labels, map.colors, keys);
      return map;
    }

    var colorMap;
    this.colorMap = function() {
      if (!colorMap) colorMap = createColorMap();
      return colorMap;
    };

    function setStyle(id, ancestors) {
      var anc = aU.last(ancestors || self.relations[id].relation.ancestors) || {};
      var style = anc.style || {};
      state.addStyle(id, style);
    }

    this.applyStyling = function() {
      angular.forEach(state.tokens, function(token, id) {
        if (token.relation.label) {
          setStyle(id);
        } else {
          state.unsetStyle(id);
        }
      });
    };

    this.init = function () {
      configure();
      self.relations = self.createInternalState();
      self.resetSearchedLabel();
      self.resetMultiChanger();
      if (isColorizer()) self.applyStyling();
    };
  }
]);
