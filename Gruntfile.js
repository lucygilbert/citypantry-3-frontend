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
                        src: ['src/web/fonts/*'],
                        dest: 'web/dist/fonts',
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
                        'src/web/js/lib/angular-route.min.js',
                        'src/web/js/lib/ui-bootstrap-tpls-0.12.0.min.js',
                        'src/web/js/lib/ui-grid-unstable.min.js',
                    ],
                    'web/dist/js/built-citypantry-es6.js': [
                        'src/web/js/app.module.js',
                        'src/web/js/config.js',
                        'src/web/js/factories/**/*.js',
                        'src/web/js/filters/**/*.js',
                        'src/web/js/controllers/**/*.js',
                        'src/web/js/services/**/*.js',
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
