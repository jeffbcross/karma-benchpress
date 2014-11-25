var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var initBenchpress = function(files) {
  files.unshift(createPattern(__dirname + '/adapter.js'));
};

initBenchpress.$inject = ['config.files'];

module.exports = {
  'framework:benchpress': ['factory', initBenchpress]
};
