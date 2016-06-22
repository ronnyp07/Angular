'use strict';

module.exports = function(grunt) {
  var filesList = [ 
  'public/ciudad/*.js',   
  'public/ciudad/**/*.js', 
  'public/pais/*.js',
  'public/pais/**/*.js',
  'public/clientes/*.js',
  'public/clientes/**/*.js', 
  'public/doctors/*.js',
  'public/doctors/**/*.js', 
  'public/patients/*.js',
  'public/patients/**/*.js',
  'public/procedimientos/*.js',
  'public/procedimientos/**/*.js',
  // 'public/orders/*.js',
  // 'public/orders/**/*.js',
  // 'public/results/*.js',
  // 'public/results/**/*.js',  
  'public/locations/*.js',
  'public/locations/**/*.js',  
  '!public/**/tests/*.js'];

  var serverFileList = ['**/*.js', '!test.js'];
	// Project Configuration
	grunt.initConfig({
		jshint: {
			all: filesList, serverFileList
		},
		 // configure nodemon
     nodemon: {
         dev: {
           script: 'server.js'
        }
      },
      watch: {
      scripts: {
        files: filesList,
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false,
        },
      },
    },
     uglify: {
    //    target: {
    //     files: [{
    //       expand: true,
    //       cwd: 'public/',
    //       src: ['public/patients/*.js', 'public/ciudad/*.js', 'public/patients/**/*.js',  'public/ciudad/**/*.js', 'public/pais/*.js','public/pais/**/*.js',  '!public/**/tests/*.js'],
    //       dest: 'public/dist/js'
    //   }]
    // }
     target: {
         files : [{
            expand: true,
            cwd: 'app/controllers/',
            src: serverFileList,
            dest:'app/controllers/',
            ext: '.server.min.js'

         }]
      },
      build: {
        files: {
          'public/dist/js/app.min.js': filesList,
          //'public/dist/js/server/controller.min.js': serverFileList
        }
      }
    }
	});

  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['nodemon', 'uglify']);

};
