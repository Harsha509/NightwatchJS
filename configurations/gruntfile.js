module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),

        //To clean required files
        clean: {
            folder: ["./reports/recent_reports/*"],
            contents:["./logs/*.log"]
        },

        //To execute js file
        execute: {
            target: {
                src: ['configurations/nightwatch']
            }
        },

        //To execute batch files as grunt tasks
        run_executables: {
            tests: {
                cmd: 'run_utilities/Report.bat'
            },
            parallelLogs: {
                cmd : './run_utilities/RunParallel.bat'
            }
        }

    });

    //Redirecting to the path where below plugins are available
    grunt.file.setBase('../');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-nightwatch');
    grunt.loadNpmTasks('grunt-nightwatch-report');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-run-executables');

    grunt.registerTask('local',['clean','execute']);
    grunt.registerTask('report','run_executables:tests');
    grunt.registerTask('saucelabs',['clean','run_executables:parallelLogs']);
};

