(function() {

//Config properties not to serialize to url
var ignoredProps = ['url'];

function BPAdapter (global) {
  var self = this;
  this.benchmarks = [];
  this._global = global;
  global.bpSuite = this.bpSuite.bind(this);
}

BPAdapter.prototype.bpSuite = function bpSuite(config) {
  return this.runBenchmark.call(this, config);
};

BPAdapter.prototype.newWindow = function(config, done) {
  var timer = setInterval(checkClosed.bind(this), 50);
  var result;
  this._benchWindow = this._global.open(
    serializeConfig(config),
    'benchpress',
    [
      'status=0',
      'menubar=0',
      'toolbar=0',
      'location=0',
      'personalbar=0',
      'status=0',
      'dependent=0',
      'dialog=0'
    ].join('&'));

  this._benchWindow.addEventListener('benchpressComplete', function(e) {
    result = e.result;
  });

  function checkClosed() {
    if (!this._benchWindow || this._benchWindow.closed) {
      clearInterval(timer);
      done(result);
    }
  }
};

BPAdapter.prototype.closeWindow = function() {
  this._benchWindow && this._benchWindow.close();
  delete this._benchWindow;
};

BPAdapter.prototype.runBenchmark = function(config) {
  var self = this;
  return new Promise(function(resolve) {
    self.closeWindow();
    self.newWindow(config, function(result) {
      try {
        resolve(result);
      }
      catch(e) {
        console.error('could not resolve', e);
      }

    });
  });
};

if (!window.__runningBenchPressAdapterSpec__) {
  window.__bpAdapter__ = new BPAdapter(window);
}
else {
  //expose private fns for testing
  window.BPAdapter = BPAdapter;
  window.serializeConfig = serializeConfig;
}

function serializeConfig(config) {
  var urlParts = /([^\?^\#]*)([^\#]*)(.*)/.exec(config.url);
  urlParts.shift();
  //serialize config to search
  urlParts[1] += (urlParts.length ? '&' : '') + '__bpAutoClose__=true';
  Object.keys(config).forEach(function(prop) {
    if (ignoredProps.indexOf(prop) > -1) return;
    urlParts[1] += '&' + prop + '=' + config[prop];
  });
  return urlParts[0] + '?' + urlParts[1] + '#' + urlParts[2];
}

}());
