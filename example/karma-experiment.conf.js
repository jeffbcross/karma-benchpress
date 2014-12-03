module.exports = function(config) {
  config.set({
    basePath: '',
    plugins: [
        require('../src/index'),
        require('karma-jasmine'),
        require('karma-chrome-launcher')
    ],
    frameworks: ['jasmine', 'benchpress'],
    files: [
      '**/*'
    ],
    exclude: [
      'karma-experiment.conf.js',
      'largetable/bp.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserNoActivityTimeout: 90000,
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
    singleRun: true
  });
};
