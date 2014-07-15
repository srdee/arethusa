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
    'angular-animate': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    },
    'angular-scroll': {
      deps: ['angular']
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
    }
  },
  paths: {
    angular: "../bower_components/angular/angular",
    "angular-animate": "../bower_components/angular-animate/angular-animate",
    "angular-cookies": "../bower_components/angular-cookies/angular-cookies",
    "angular-mocks": "../bower_components/angular-mocks/angular-mocks",
    "angular-resource": "../bower_components/angular-resource/angular-resource",
    "angular-route": "../bower_components/angular-route/angular-route",
    "angular-scroll": "../bower_components/angular-scroll/angular-scroll.min",
    d3: "../bower_components/d3/d3",
    foundation: "../bower_components/foundation/js/foundation",
    jquery: "../bower_components/jquery/dist/jquery",
    x2js: "../bower_components/x2js/xml2json.min",
    "mm-foundation": "../vendor/mm-foundation/mm-foundation-tpls-0.2.2.min",
    "colorpicker.module": "../vendor/angular-foundation-colorpicker/js/foundation-colorpicker-module.min",
    "dagreD3": "../vendor/dagre-d3/dagre-d3.min",
    "UserVoice": "../vendor/uservoice/uservoice.min"
  },
  packages: [

  ]
});

requirejs(['../dist/all.min']);
