(function(win) {
  var benchmarks = [];
  window.bench = function(config) {
    console.log('registering');
    benchmarks.push(config);
    console.log('bench!', config);
  };

  function execute () {
    console.log('executing!');
    benchmarks.forEach(function (bench) {
      console.log('bench: ', bench);
    });
  }

  var createStartFn = function (karma) {
    return execute;
  };

  window.__karma__.start = createStartFn(window.__karma__);
}(window))
