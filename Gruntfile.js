module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/**\n' +
							' * <%= pkg.title %> v<%= pkg.version %>\n' +
							' *\n' +
							' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>\n' +
							' * Code provided under the <%= pkg.license.type %> license\n' +
							' * <%= pkg.license.url %>\n' +
							' *\n' +
							' * Requires SoundManager 2 Javascript API.\n' +
							' * http://schillmania.com/projects/soundmanager2\n' +
							' */\n\n'
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['concat', 'uglify']);
};
