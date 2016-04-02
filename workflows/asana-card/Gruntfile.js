'use strict';

var livereload = require('connect-livereload');
var path = require('path');
var serveStatic = require('serve-static');

module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var yeomanConfig = {
      app: 'app',
      tmp: '.tmp',
      dev: 'dev',
      dist: 'dist'
  };

  grunt.initConfig({
      yeoman: yeomanConfig,
      // connect: {
      //     options: {
      //       port: 5000,
      //       hostname: 'localhost' //change to '0.0.0.0' to enable outside connections
      //     },
      //     livereload: {
      //       options: {
      //         middleware: function (connect) {
      //           return [
      //             livereload({port: 35799}),
      //             //serveStatic(path.resolve('.tmp')),
      //             serveStatic(path.resolve(yeomanConfig.dev))
      //           ];
      //         }
      //       }
      //     }
      // },
      watch: {
        options: {
          livereload: 35799,
          livereloadOnError: false
        },
        react: {
          files: ['<%= yeoman.app %>/scripts/**/*.{jsx,js}'],
          tasks: ['browserify:dev', 'copy:dev']
        },
        styles: {
          files: ['<%= yeoman.app %>/styles/*.{sass,scss}'],
          tasks: ['compass:dev', 'autoprefixer:dev', 'copy:dev']
        },
        html: {
          files: ['<%= yeoman.app %>/*.html'],
          tasks: ['copy:dev']
        }
      },
      clean: {
        dev: ['.tmp', '<%= yeoman.dev %>/*'],
        dist: ['.tmp', '<%= yeoman.dist %>/*']
      },
      browserify: {
        options: {
          transform: ['reactify']
        },
        dev: {
          files: {
            '.tmp/scripts/app.js': '<%= yeoman.app %>/scripts/app.js',
            '.tmp/scripts/preview_app.js': '<%= yeoman.app %>/scripts/preview_app.js'
          },
          options: {
            browserifyOptions: {
              debug: true,
              extensions: '.jsx'
            }
          }
        },
        dist: {
          files: {
            '.tmp/scripts/app.js': '<%= yeoman.app %>/scripts/app.js'
          },
          options: {
            browserifyOptions: {
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
            cwd: '<%= yeoman.app %>/styles/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/styles/images'
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
        dev: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dev %>',
            src: [
              '*.html',
              '*.{ico,txt}',
              'images/{,*/}*.*'
            ]
          }, {
            expand: true,
            cwd: '<%= yeoman.tmp %>',
            dest: '<%= yeoman.dev %>',
            src: ['**']
          }]
        },
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
    'clean:dev',
    'browserify:dev',
    'compass:dev',
    'autoprefixer:dev',
    'copy:dev',
    //'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'clean:dev',
    'browserify:dev',
    'compass:dev',
    'autoprefixer:dev',
    'copy:dev'
  ]);

  // grunt.registerTask('build', [
  //   'clean:dist',
  //   'browserify:dist',
  //   'compass:dist',
  //   'useminPrepare',
  //   'concat',
  //   'autoprefixer:dist',
  //   'imagemin:dist',
  //   'cssmin',
  //   'uglify',
  //   'copy:dist',
  //   'filerev',
  //   'usemin'
  //   //'htmlmin'
  // ]);

  grunt.registerTask('default', 'serve');
};
