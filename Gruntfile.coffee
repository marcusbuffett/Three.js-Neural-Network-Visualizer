# module.exports = (grunt) ->
  # grunt.initConfig {
    # coffee:
      # app:
        # src: ['coffee/*.coffee']
        # dest: 'temp'
  # }

  # require('load-grunt-tasks')(grunt)
  # grunt.registerTask('default', [
    # 'watch'
  # ]
  # )
  # grunt.registerTask('thing', [
    # 'coffee:app'
  # ])

module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig
    watch:
      coffee:
        files: 'src/*.coffee'
        tasks: ['coffee:compile']

    coffee:
      compile:
        expand: true,
        flatten: true,
        cwd: "#{__dirname}/coffee",
        src: ['*.coffee'],
        dest: 'scripts/',
        ext: '.js'
