'use strict';

module.exports = function (grunt) {
    // Dynamically load npm tasks.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/lib/ng-grid/fonts/*'],
                        dest: 'web/dist/css',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/images/*'],
                        dest: 'web/dist/images',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/images/team/*'],
                        dest: 'web/dist/images/team',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/admin/*'],
                        dest: 'web/dist/templates/admin',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/general/*'],
                        dest: 'web/dist/templates/general',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/auth/*'],
                        dest: 'web/dist/templates/auth',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/vendor/*'],
                        dest: 'web/dist/templates/vendor',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/directives/*'],
                        dest: 'web/dist/templates/directives',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/customer/*'],
                        dest: 'web/dist/templates/customer',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/web/templates/user/*'],
                        dest: 'web/dist/templates/user',
                        filter: 'isFile'
                    }
                ]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: 'web/dist/images/**/*.{png,jpg,gif}',
                    dest: '.'
                }]
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/web/scss',
                    src: ['main.scss'],
                    dest: 'web/dist/css',
                    ext: '.css'
                }]
            }
        },

        csso: {
            dist: {
                files: {
                    'web/dist/css/main.min.css': 'web/dist/css/main.css',
                }
            }
        },

        concat: {
            dist: {
                files: {
                    'web/dist/js/built-libs.js': [
                        'src/web/js/lib/angular.min.js',
                        'src/web/js/lib/angular-cookies.min.js',
                        'src/web/js/lib/angular-currency-mask.js',
                        'src/web/js/lib/angular-google-maps.min.js',
                        'src/web/js/lib/angular-route.min.js',
                        'src/web/js/lib/checklist-model.js',
                        'src/web/js/lib/lodash.min.js',
                        'src/web/js/lib/ui-bootstrap-tpls-0.12.0.min.js',
                        'src/web/lib/ng-grid/ui-grid.js',
                        'src/web/lib/angular-slider/angular-slider.js',
                        'src/web/lib/angular-ui-position.js',
                        'src/web/lib/angular-ui-dateparser.js',
                        'src/web/lib/angular-ui-datepicker.js',
                        'src/web/lib/angular-ui-transition.js',
                        'src/web/lib/angular-ui-carousel.js',
                    ],
                    'web/dist/js/built-citypantry-es6.js': [
                        'src/web/js/app.module.js',
                        'src/web/js/config.js',
                        'src/web/js/factories/**/*.js',
                        'src/web/js/filters/**/*.js',
                        'src/web/js/controllers/**/*.js',
                        'src/web/js/services/**/*.js',
                        'src/web/js/directives/**/*.js',
                    ],
                },
            },
            dist2: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                files: {
                    'web/dist/js/built.js': [
                        'web/dist/js/built-libs.js',
                        'web/dist/js/built-citypantry-es5.js'
                    ]
                }
            }
        },

        '6to5': {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'web/dist/js/built-citypantry-es5.js': 'web/dist/js/built-citypantry-es6.js'
                }
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['src/web/**/*.scss'],
                tasks: ['sass', 'csso'],
                options: {
                    debounceDelay: 100,
                },
            },
            js: {
                files: ['src/web/**/*.js'],
                tasks: ['js'],
                options: {
                    debounceDelay: 100,
                },
            },
            templates: {
                files: ['src/web/templates/**/*.html'],
                tasks: ['copy:dist'],
                options: {
                    debounceDelay: 100,
                },
            }
        }
    });

    /**
     * Task to build assets for distribution then watch for changes.
     */
    grunt.registerTask('default', [
        'dist',
        'watch',
    ]);

    /**
     * Task to build assets for distribution.
     */
    grunt.registerTask('dist', [
        'copy:dist',
        'imagemin:dist',
        'sass:dist',
        'csso:dist',
        'js',
    ]);

    /**
     * Task to build assets for distribution.
     */
    grunt.registerTask('js', [
        'concat:dist',
        '6to5:dist',
        'concat:dist2',
    ]);
};
