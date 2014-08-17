"use strict";

define([ "jquery",
  "angular",
  "x2js",
  "d3",
  "dagreD3",
  "jsondiffpatch",
  "lunr",
  "UserVoice",
  "colorpicker.module",
  "mm-foundation",
  "angular-route",
  "angular-resource",
  "angular-cookies",
  "angular-animate",
  "angular-scroll",
  "angular-translate",
  "angular-translate-loader-static-files",
  "angulartics",
  "angulartics-ga"],
  function($, angular, x2js, d3, dagreD3, jsondiffpatch, lunr, UserVoice) {
    $(document).ready(function() {
      {{text}} // jshint ignore:line
      angular.bootstrap(document, ['arethusa']);
    });
  });
