// Karma configuration
// Generated on Fri Nov 14 2014 16:13:09 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    plugins: [
        require('../src/index'),
        require('karma-jasmine'),
        require('karma-chrome-launcher')
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'benchpress'],


    // list of files / patterns to load in the browser
    files: [
      '**/*'
    ],


    // list of files to exclude
    exclude: [
      'karma-experiment.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeCanaryPerf'],
    customLaunchers: {
        ChromeCanaryPerf: {
            base: 'ChromeCanary',
            flags: [
                '--enable-memory-info ',
                '--enable-precise-memory-info ',
                '--enable-memory-benchmarking ',
                '--js-flags="--expose-gc"',
                '-incognito'
            ]
        }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
