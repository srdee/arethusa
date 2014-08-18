require.config({
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular'],
    },
    'angular-resource': {
      deps: ['angular']
    },
    'angular-translate': {
      deps: ['angular'],
    },
    'angular-translate-loader-static-files': {
      deps: ['angular-translate']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    },
    'angular-scroll': {
      deps: ['angular']
    },
    'angulartics': {
      deps: ['angular']
    },
    'angulartics-ga': {
      deps: ['angulartics']
    },
    'mm-foundation': {
      deps: ['angular'],
    },
    'colorpicker.module': {
      deps: ['angular'],
    },
    'd3': {
      exports: 'd3'
    },
    'dagreD3': {
      deps: ['d3'],
      exports: 'dagreD3'
    },
    'UserVoice': {
      exports: 'UserVoice'
    },
    'lunr': {
      exports: 'lunr'
    },
    'jsondiffpatch': {
      exports: 'jsondiffpatch'
    }
  },
  paths: {
    angular: [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular.min",
      "../bower_components/angular/angular"
    ],
    "angular-animate": [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-animate.min",
      "../bower_components/angular-animate/angular-animate"
    ],
    "angular-cookies": [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-cookies.min",
      "../bower_components/angular-cookies/angular-cookies"
    ],
    "angular-mocks": [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-mocks.min",
      "../bower_components/angular-mocksanimate/angular-mocks"
    ],
    "angular-resource": [
      //"//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-resource.min",
      "../vendor/angular-resource/angular-resource.min"
    ],
    "angular-translate": [
      "../bower_components/angular-translate/angular-translate.min"
    ],
    "angular-translate-loader-static-files": [
      "../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min"
    ],
    "angular-route": [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-route.min",
      "../bower_components/angular-route/angular-route"
    ],
    "angular-scroll": [
      "../bower_components/angular-scroll/angular-scroll.min"
    ],
    "angulartics": "../bower_components/angulartics/dist/angulartics.min",
    "angulartics-ga": "../bower_components/angulartics/dist/angulartics-ga.min",
    d3: [
      "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min",
      "../bower_components/d3/d3",
    ],
    foundation: [
      "//cdnjs.cloudflare.com/ajax/libs/foundation/5.2.2/js/foundation.min",
      "../bower_components/foundation/js/foundation",
    ],
    jquery: [
      "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
      "../bower_components/jquery/dist/jquery",
    ],
    x2js: "../bower_components/x2js/xml2json.min",
    lunr: "../bower_components/lunr.js/lunr.min",
    jsondiffpatch: "../bower_components/jsondiffpatch/build/bundle.min",
    "mm-foundation": "../vendor/mm-foundation/mm-foundation-tpls-0.2.2.custom.min",
    "colorpicker.module": "../vendor/angular-foundation-colorpicker/js/foundation-colorpicker-module.min",
    "dagreD3": "../vendor/dagre-d3/dagre-d3.min",
    "UserVoice": "../vendor/uservoice/uservoice.min"
  },
});

requirejs(['../dist/arethusa.min']);
