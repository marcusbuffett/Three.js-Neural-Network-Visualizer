# module.exports = (grunt) ->
  # grunt.initConfig {
    # coffee:
      # app:
        # src: ['coffee/*.coffee']
        # dest: 'temp'
  # }

  # grunt.registerTask('default', [
    # 'watch'
  # ]
  # )
  # grunt.registerTask('thing', [
    # 'coffee:app'
  # ])

module.exports = (grunt) ->

  grunt.initConfig
    watch:
      coffee:
        files: 'coffee/*.coffee'
        tasks: ['coffee:build', 'browserify:build']

    coffee:
      options:
        bare: true
      build:
        expand: true,
        flatten: true,
        cwd: "#{__dirname}/coffee",
        src: ['*.coffee'],
        dest: 'scripts/temp/',
        ext: '.js'
    
    browserify:
      build:
        src: ['scripts/temp/*.js'],
        dest: 'scripts/main.js'

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('default', [
    'coffee:build',
    'browserify:build',
    'watch'
  ])

