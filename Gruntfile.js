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
    ]);
};
