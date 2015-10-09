/*
 * objectForm
 * https://github.com/stevenCJC/objectForm
 *
 * Copyright (c) 2014 Steven
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}
	
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		
		build: {
			$: {
				dest: "dist/jquery.objectForm.js",
				minimum: [
					"main",
				],
				removeWith: {
					jquery: [ "jquery" ],
				},
				config:{
					baseUrl: "src",
					name: "main",
					out: "dist/jquery.objectForm.js",
					wrap: {
						startFile: "src/wrap/header.js",
						endFile: "src/wrap/footer.js"
					},
					paths: {
						jquery:'../demo/libs/jquery',
					},
				}
			}
			
		},
		
		uglify: {
			all: {
				files: {
					"dist/jquery.objectForm.min.js": [ "dist/jquery.objectForm.js" ]
				},
				options: {
					preserveComments: false,
					report: "min",
					beautify: {
						ascii_only: true
					},
					banner: "/*! jquery.objectForm v<%= pkg.version %>  created by StevenCJC Email:522702986@qq.com | " +
						"(c) 2005, <%= grunt.template.today('yyyy') %> jquery.objectForm Foundation */",
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false
					}
				}
			}
		}
	});

	grunt.loadTasks( "build" );
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask( "default", [ "build:*:-jquery",'uglify' ] );
  

};
