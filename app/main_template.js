define([ "jquery",
  "angular",
  "x2js",
  "d3",
  "dagreD3",
  "UserVoice",
  "colorpicker.module",
  "mm-foundation",
  "angular-route", "angular-resource", "angular-cookies", "angular-scroll", "angulartics", "angulartics-ga"],
  function($, angular, x2js, d3, dagreD3, UserVoice) {
    $(document).ready(function() {
      {{text}}
      angular.bootstrap(document, ['arethusa']);
    });
  });
