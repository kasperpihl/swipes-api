'use strict';

var livereload = require('connect-livereload'),
    modRewrite = require('connect-modrewrite'),
    serveStatic = require('serve-static'),
    path = require('path');

module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var yeomanConfig = {
      app: 'app',
      dev: 'dev',
      dist: 'dist'
  };

  grunt.initConfig({
      yeoman: yeomanConfig,
      connect: {
          livereload: {
            options: {
              port: 3000,
              livereload: true,
              hostname: '0.0.0.0', //change to 'localhost' to disable outside connections
              base: ['.tmp', yeomanConfig.app],
              middleware: function (connect, options) {
                  var middlewares = [];
                  var rules = [
                    '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
                  ];

                  // RewriteRules support
                  middlewares.push(modRewrite(rules));

                  if (!Array.isArray(options.base)) {
                      options.base = [options.base];
                  }

                  var directory = options.directory || options.base[options.base.length - 1];

                  options.base.forEach(function (base) {
                      // Serve static files.
                      middlewares.push(serveStatic(base));
                  });

                  // Make directory browse-able.
                  //middlewares.push(connect.directory(directory));

                  return middlewares;
              }
            }
          }
      },
      watch: {
        options: {
          livereload: 35729
        },
        react: {
          files: ['<%= yeoman.app %>/scripts/**/*.{jsx,js}'],
          tasks: ['browserify:dev']
        },
        styles: {
          files: ['<%= yeoman.app %>/styles/**/*.{sass,scss}'],
          tasks: ['compass:dev', 'autoprefixer:dev']
        },
        images: {
          files: [
            '<%= yeoman.app %>/*.html',
            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      },
      clean: {

        dist: ['.tmp', '<%= yeoman.dist %>/*'],
        serve: {
          dot: true,
          src: ['.tmp']
        },
        dev: {
          dot: true,
          src: ['<%= yeoman.dev %>/*']
        }
      },
      browserify: {
        options: {
          transform: ['reactify']
        },
        dist: {
          files: {
            '.tmp/scripts/bundle/app.js': '<%= yeoman.app %>/scripts/app.js'
          },
          options: {
            browserifyOptions: {
              extensions: '.jsx'
            }
          }
        },
        dev: {
          files: {
            '.tmp/scripts/bundle/app.js': '<%= yeoman.app %>/scripts/app.js',
          },
          options: {
            browserifyOptions: {
              debug: true,
              extensions: '.jsx'
            }
          }
        }
      },
      compass: {
        options: {
          sassDir: '<%= yeoman.app %>/styles',
          cssDir: '.tmp/styles',
          specify: '<%= yeoman.app %>/styles/main.scss',
          imagesDir: '<%= yeoman.app %>/images',
          javascriptsDir: '<%= yeoman.app %>/scripts',
          fontsDir: '<%= yeoman.app %>/fonts',
          relativeAssets: true
        },
        dist: {},
        dev: {
          options: {
            debugInfo: true
          }
        }
      },
      useminPrepare: {
        src: '<%= yeoman.app %>/index.html',
        options: {
            dest: '<%= yeoman.dist %>'
        }
      },
      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/styles/img',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/styles/img'
          }]
        }
      },
      htmlmin: {
        dist: {
          options: {
            //removeCommentsFromCDATA: true,
            // https://github.com/yeoman/grunt-usemin/issues/44
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            //removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            //useShortDoctype: true,
            removeEmptyAttributes: true,
            //removeOptionalTags: true
          },
          files: [{
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '*.html',
            dest: '<%= yeoman.dist %>'
          }]
        }
      },
      filerev: {
        dist: {
          files: [{
            src: [
              '<%= yeoman.dist %>/scripts/**/*.js',
              '<%= yeoman.dist %>/styles/**/*.css',
              '<%= yeoman.dist %>/vendor/**/*.js'
            ]
          }]
        }
      },
      autoprefixer: {
        options: {
          browsers: [
            'last 5 versions'
          ]
        },
        dev: {
          expand: true,
          src: '.tmp/styles/*.css'
        },
        dist: {
          expand: true,
          src: '.tmp/concat/styles/*.css'
        }
      },
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.html',
              '*.{ico,txt}',
              'images/{,*/}*.{webp,gif}'
            ]
          }]
        },
        dev: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dev %>',
            src: [
              '*.html',
              '*.{ico,txt}'
            ]
          }, {
            expand: true,
            dot: true,
            cwd: '.tmp',
            dest: '<%= yeoman.dev %>',
            src: ['**']
          }]
        }
      },
      usemin: {
        html: ['<%= yeoman.dist %>/{,*/}*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
          dirs: ['<%= yeoman.dist %>']
        }
      }
  });

  grunt.registerTask('serve', [
    'clean:serve',
    'browserify:dev',
    'compass:dev',
    'autoprefixer:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'clean:dev',
    'browserify:dev',
    'compass:dev',
    'autoprefixer:dev',
    'copy:dev'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'browserify:dist',
    'compass:dist',
    'useminPrepare',
    'concat',
    'autoprefixer:dist',
    'imagemin',
    'cssmin',
    'uglify',
    'copy',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', 'build');
};
