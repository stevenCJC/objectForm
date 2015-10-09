/*
 * GraceJS
 * https://github.com/stevenCJC/GraceJS
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

	var gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		
		built: {
			$: {
				dest: "dist/jquery.objectForm.js",
				minimum: [
					"main",
				],
				removeWith: {
					$: [ "jquery" ],
				},
				config:{
					baseUrl: "src",
					name: "main",
					out: "dist/jquery.objectForm.js",
					wrap: {
						startFile: "src/wrap/intro.js",
						endFile: "src/wrap/outro.js"
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
					sourceMap: "dist/jquery.objectForm.min.map",
					sourceMappingURL: "jquery.objectForm.min.map",
					report: "min",
					beautify: {
						ascii_only: true
					},
					banner: "/*! jquery.objectForm v<%= pkg.version %> | " +
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

	grunt.loadTasks( "built" );

	grunt.registerTask( "default", [ "built:*:*",'uglify' ] );
  

};
