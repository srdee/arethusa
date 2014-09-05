"use strict";

var srcFiles = 'app/**/*.js';
var htmlFiles = 'app/**/*.html';
var cssFiles = 'app/**/*.scss';
var specFiles = 'spec/**/*.js';
var specE2eFiles = 'spec-e2e/**/*.js';
var devServerPort = 8081;
var reloadPort = 35279;
var confPath = 'app/static/configs';

var arethusaModules = [
  'arethusa.morph',
  'arethusa.artificial_token',
  'arethusa.core',
  'arethusa.comments',
  'arethusa.hebrew_morph',
  'arethusa.context_menu',
  //'arethusa.conf_editor',
  'arethusa.review',
  'arethusa.search',
  'arethusa.history',
  'arethusa.dep_tree',
  'arethusa.relation',
  'arethusa.exercise',
  'arethusa.sg',
  'arethusa.text'
];

function eachModule(fn) {
  for (var i = arethusaModules.length - 1; i >= 0; i--){
    fn(arethusaModules[i]);
  }
}

function arethusaUglify() {
  var obj = {
    options: {
      sourceMap: true
    },
    dagred3: { files: { "vendor/dagre-d3/dagre-d3.min.js": "vendor/dagre-d3/dagre-d3.js"} },
    uservoice: { files: { "vendor/uservoice/uservoice.min.js": "vendor/uservoice/uservoice.js"} },
    toasts: { files: { "vendor/angularJS-toaster/toaster.min.js": "vendor/angularJS-toaster/toaster.js"} },
    templates: { files: { "dist/templates.min.js": "app/templates/compiled/*.js"} },
    util: { files: { "dist/arethusa_util.min.js": "app/js/util/**/*.js" } },
    main: { files: pluginFiles('arethusa', 'arethusa.main') }
  };

  eachModule(function(module) {
    obj[toTaskScript(module)] = { files: pluginFiles(module) };
  });
  return obj;
}

function uglifyTasks() {
  var res = [ 'newer:concat:packages', 'newer:ngtemplates' ];
  eachModule(function(module) {
    res.push('newer:uglify:' + toTaskScript(module));
  });
  res.push('newer:uglify:main');
  res.push('newer:uglify:util');
  res.push('newer:concat:main');
  return res;
}

function arethusaTemplates() {
  var obj = {
    arethusa: {
      cwd: "app",
      src: "templates/*.html",
      dest: "app/templates/compiled/arethusa.templates.js"
    }
  };

  eachModule(function(module) {
    obj[toJsScript(module)] = templateObj(module);
  });

  return obj;
}

function templateObj(module) {
  return {
    cwd: "app",
    src: 'templates/' + module + '/**/*.html',
    dest: "app/templates/compiled/" + module + '.templates.js'
  };
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function toJsScript(str) {
  var parts = str.split('_');
  var res = [], part;
  for (var i = 0; i  < parts.length; i ++) {
    part = parts[i];
    if (i !== 0) part = capitalize(part);
    res.push(part);
  }
  return res.join('');
}

function toTaskScript(str) {
  return toJsScript(str.replace(/^arethusa\./, ''));
}


function getReloadPort() {
  reloadPort++;
  return reloadPort;
}

function mountFolder(connect, dir) {
  return connect.static(require('path').resolve(dir));
}

function pluginFiles(name, destName) {
  var minName = 'dist/' + (destName || name) + '.min.js';
  var mainFile = 'app/js/' + name + '.js';
  var others = '<%= "app/js/' + name + '/**/*.js" %>';
  var templates = '<%= "app/templates/compiled/' + name + '.templates.js" %>';
  var obj = {};
  obj[minName] = [mainFile, others, templates];
  return obj;
}

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  function confFiles() {
    return grunt.file.expand(confPath + '/*.json');
  }

  function confMergeCommands() {
    var file, target, cmd, cmds = [];
    var files = confFiles();
    for (var i = files.length - 1; i >= 0; i--){
      file = files[i];
      target = file.replace(confPath, 'dist/configs');
      cmd = 'arethusa merge ' + file + ' -m > ' + target;
      cmds.push(cmd);
    }
    return cmds;
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: srcFiles,
      options: {
        specs: specFiles,
        // helpers: 'spec/*Helper.js',
        // template: 'custom.tmpl'
      }
    },
    watch: {
      default: {
        files: [srcFiles, specFiles],
        tasks: 'default'
      },
      spec: {
        files: [srcFiles, specFiles],
        tasks: 'spec'
      },
      server: {
        files: [srcFiles, htmlFiles, cssFiles],
        tasks: 'minify:all',
        options: {
          livereload: true
        }
      },
      serverNoCss: {
        files: [srcFiles, htmlFiles],
        tasks: 'minify',
        options: {
          livereload: true,
          spawn: false
        }
      },
      serverCss: {
        files: cssFiles,
        tasks: 'minify:css',
        options: {
          spawn: false
        }
      },
      conf: {
        files: 'app/static/configs/**/*',
        tasks: 'minify:conf',
        options: {
          spawn: false
        }
      },

      e2e: {
        files: [srcFiles, specE2eFiles],
        tasks: 'protractor:all'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
      },
      all: ['*.js', srcFiles, specFiles]
    },
    karma: {
      spec: {
        autoWatch: false,
        singleRun: true,
        options: {
          files : [
            './bower_components/angular/angular.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './bower_components/angular-route/angular-route.js',
            './vendor/angular-resource/angular-resource.js',
            './bower_components/angular-cookies/angular-cookies.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-scroll/angular-scroll.js',
            './bower_components/angular-translate/angular-translate.js',
            './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            './bower_components/angulartics/dist/angulartics.min.js',
            './bower_components/angulartics/dist/angulartics-ga.min.js',
            './bower_components/x2js/xml2json.min.js',
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/d3/d3.min.js',
            './bower_components/lunr.js/lunr.min.js',
            './bower_components/oclazyload/dist/ocLazyLoad.min.js',
            './bower_components/angular-gridster/dist/angular-gridster.min.js',
            './bower_components/javascript-detect-element-resize/jquery.resize.js',
            './vendor/angular-foundation-colorpicker/js/foundation-colorpicker-module.js',
            './vendor/mm-foundation/mm-foundation-tpls-0.1.0.min.js',
            './vendor/dagre-d3/dagre-d3.min.js',
            './vendor/angularJS-toaster/toaster.min.js',
            // Some source files we'll need to include manually, otherwise
            // the load order is wrong
            'app/js/*.js',
            'app/js/arethusa*/**/*.js',
            'app/js/util/**/*.js',
            'dist/templates.min.js',
            specFiles
          ],
          frameworks: ['jasmine'],
          browsers : ['PhantomJS'],
          plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-coverage'
          ],
          reporters: ['progress', 'coverage'],
          preprocessors: {
            'app/**/*.js': ['coverage']
          },
          coverageReporter: {
            reporters: [
              {type: 'html', dir:'coverage/'},
              {type: 'lcov'},
            ]
          }
        }
      },
    },
    coveralls: {
      src: 'coverage/**/lcov.info'
    },
    protractor: {
      options: {
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
      },
      all: {
        options: {
          args: {
            seleniumAddress: 'http://localhost:4444/wd/hub',
            specs: [specE2eFiles],
            multiCapabilities: [{'browserName': 'firefox'}, {'browserName': 'chrome'}],
            //capabilities: {'browserName': 'firefox'},
            baseUrl: 'http://localhost:' + devServerPort
          }},
      }, // A target needs to be defined, otherwise protractor won't run
      travis: {
        options: {
          args: {
            sauceUser: 'arethusa',
            sauceKey: '8e76fe91-f0f5-4e47-b839-0b04305a5a5c',
            specs: [specE2eFiles],
            baseUrl: 'http://localhost:' + devServerPort,
            multiCapabilities: [{
              browserName: "firefox",
              version: "26",
              platform: "XP"
            }, {
              browserName: "chrome",
              platform: "XP"
            }, {
              browserName: "chrome",
              platform: "linux"
            }, {
              browserName: "internet explorer",
              platform: "WIN8",
              version: "10"
            }, {
              browserName: "internet explorer",
              platform: "VISTA",
              version: "9"
            }
            ],
            capabilities: {
              /* global process:true */
              'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
              'build': process.env.TRAVIS_BUILD_NUMBER
            }
          }
        }
      }
    },
    connect: {
      devserver: {
        options: {
          port: devServerPort,
          debug: true,
          keepalive: true,
          livereload: true,
          middleware: function(connect) {
            return [
              require('connect-livereload')(),
              mountFolder(connect, './')
            ];
          }
        }
      },
    },
    sauce_connect: {
      your_target: {
        options: {
          username: 'arethusa',
          accessKey: '8e76fe91-f0f5-4e47-b839-0b04305a5a5c',
          verbose: true
        }
      }
    },
    uglify: arethusaUglify(),
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files: {
          'app/css/arethusa.css': 'app/css/arethusa.scss'
        }
      }
    },
    cssmin: {
      css: {
        src: [
          'bower_components/angular-gridster/dist/angular-gridster.min.css',
          'app/css/arethusa.css',
          'app/css/fonts/**/*.css'
        ],
        dest: 'dist/arethusa.min.css'
      }
    },
    githooks: {
      precommit: {
        options: {
          'template': 'hooks/staging_only.js'
        },
        'pre-commit': 'default'
      },
      update: {
        options: {
          template: 'hooks/update.js'
        },
        'post-merge': true,
        'post-checkout': true
      }
    },
    ngtemplates: arethusaTemplates(),
    shell: {
      minifyConfs: {
        command: confMergeCommands().join('&')
      },
      install: {
        command: [
          'npm install',
          'bower install',
          'gem install sass -v 3.3.14',
          'gem install arethusa-cli'
        ].join('&&')
      }
    },
    concurrent: {
      minifyAll: {
        tasks: ['minify:css', 'minify', 'minify:conf']
      },
      watches: {
        tasks: ['reloader:no-css', 'reloader:conf', 'reloader:css'],
        options: {
          logConcurrentOutput: true
        }
      },
      server: {
        tasks: ['concurrent:watches', 'server'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    concat: {
      packages: {
        src: [
          "./bower_components/jquery/dist/jquery.min.js",
          "./bower_components/jquery-ui/jquery-ui.min.js",
          "./bower_components/javascript-detect-element-resize/jquery.resize.js",
          "./bower_components/angular/angular.min.js",
          "./bower_components/angular-route/angular-route.min.js",
          "./vendor/angular-resource/angular-resource.min.js",
          "./bower_components/angular-cookies/angular-cookies.min.js",
          "./bower_components/angular-animate/angular-animate.min.js",
          "./bower_components/angular-scroll/angular-scroll.min.js",
          "./bower_components/angular-translate/angular-translate.min.js",
          "./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
          "./bower_components/x2js/xml2json.min.js",
          "./bower_components/angulartics/dist/angulartics.min.js",
          "./bower_components/angulartics/dist/angulartics-ga.min.js",
          "./bower_components/angular-gridster/dist/angular-gridster.min.js",
          "./bower_components/oclazyload/dist/ocLazyLoad.min.js",
          //"./vendor/angular-foundation-colorpicker/js/foundation-colorpicker-module.min.js",
          "./vendor/mm-foundation/mm-foundation-tpls-0.2.2.custom.min.js",
          "./vendor/uservoice/uservoice.min.js",
          "./vendor/angularJS-toaster/toaster.min.js",
        ],
        dest: 'dist/arethusa_packages.min.js'
      },
      main: {
        src: [
          "dist/arethusa_util.min.js",
          "dist/arethusa.core.min.js",
          "dist/arethusa.context_menu.min.js",
          "dist/arethusa.history.min.js",
          "dist/arethusa.main.min.js"
        ],
        dest: 'dist/arethusa.min.js'
      }
    }
  });

  grunt.registerTask('default', ['karma:spec', 'jshint']);
  grunt.registerTask('spec', 'karma:spec');
  grunt.registerTask('e2e', 'protractor:all');
  grunt.registerTask('server', ['minify:all', 'connect:devserver']);
  grunt.registerTask('reload-server', 'concurrent:server');
  grunt.registerTask('reloader', 'concurrent:watches');
  grunt.registerTask('reloader:no-css', 'watch:serverNoCss');
  grunt.registerTask('reloader:conf', 'watch:conf');
  grunt.registerTask('reloader:css', 'watch:serverCss');
  grunt.registerTask('minify:css', ['sass', 'cssmin:css']);
  grunt.registerTask('minify:conf', 'shell:minifyConfs');
  grunt.registerTask('minify', uglifyTasks());
  grunt.registerTask('minify:all', 'concurrent:minifyAll');
  grunt.registerTask('install', 'shell:install');
  grunt.registerTask('sauce', ['sauce_connect', 'protractor:travis', 'sauce-connect-close']);
};
