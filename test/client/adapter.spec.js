
describe('adapter', function() {
  var globalMock, winAddEventListenerSpy, windowCloseGetterSpy, childWindow;
  beforeEach(function() {
    winAddEventListenerSpy = jasmine.createSpy('addEventListener');
    windowCloseGetterSpy = jasmine.createSpy('windowCloseGetterSpy').and.returnValue(true);
    globalMock = {
      __karma__: {
        complete: jasmine.createSpy('karmaComplete')
      },
      open: function() {
        childWindow = {
          addEventListener: winAddEventListenerSpy
        };
        childWindow.__defineGetter__('closed', windowCloseGetterSpy);

        return childWindow;
      },
      clearInterval: jasmine.createSpy('clearInterval')
    };
  });


  it('should not createa a global adapter object in test mode', function() {
    expect(window.__bpAdapter__).toBeUndefined();
  });


  it('should provide a global bpSuite function', function() {
    expect(globalMock.bpSuite).toBeUndefined();
    var adapter = new BPAdapter(globalMock);
    expect(typeof globalMock.bpSuite).toBe('function');
  });


  describe('.runBenchmark()', function() {
    var bp, sampleConfig;

    beforeEach(function() {
      sampleConfig = {url: 'test/index-auto.html'};
      bp = new BPAdapter(globalMock);
    });

    it('should return a promise', function() {
      expect(typeof bp.runBenchmark(sampleConfig).then).toBe('function');
    });


    it('should call closeWindow()', function() {
      spyOn(bp, 'closeWindow');
      bp.runBenchmark(sampleConfig);
      expect(bp.closeWindow).toHaveBeenCalled();
    });


    it('should call newWindow() with config and callback', function() {
      spyOn(bp, 'newWindow');
      bp.runBenchmark(sampleConfig);
      expect(bp.newWindow.calls.argsFor(0)[0]).toBe(sampleConfig);
      expect(typeof bp.newWindow.calls.argsFor(0)[1]).toBe('function');
    });
  });


  describe('.bpSuite()', function() {
    var bp;

    beforeEach(function() {
      bp = new BPAdapter(globalMock);
    });

    it('should be added to the window object', function() {
      expect(typeof globalMock.bpSuite).toBe('function');
    });


    it('should call runBenchmark with the provided config and proper context', function() {
      var fakeConfig = {};
      spyOn(bp, 'runBenchmark');
      globalMock.bpSuite(fakeConfig);
      expect(bp.runBenchmark).toHaveBeenCalledWith(fakeConfig);
      expect(bp.runBenchmark.calls.all()[0].object).toBe(bp);
    });
  });

  describe('.newWindow()', function() {
    var bp, done, sampleConfig;

    beforeEach(function() {
      sampleConfig = {url: 'foo/bar'};
      done = jasmine.createSpy('done');
      jasmine.clock().install();
      bp = new BPAdapter(globalMock);
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should open a new window with correct parameters', function() {
      spyOn(globalMock, 'open').and.callThrough();
      bp.newWindow(sampleConfig, done);
      expect(globalMock.open).toHaveBeenCalledWith(
        serializeConfig(sampleConfig),
        'benchpress',
        'status=0&menubar=0&toolbar=0&location=0&personalbar=0&status=0&dependent=0&dialog=0');
    });


    it('should add a listener for results from the child window', function() {
      bp.newWindow(sampleConfig, done);
      expect(childWindow.addEventListener.calls.argsFor(0)[0]).toBe('benchpressComplete');
    });


    it('should check if the child window is closed every 50 ms', function() {
      bp.newWindow(sampleConfig, done);
      jasmine.clock().tick(50);
      expect(windowCloseGetterSpy).toHaveBeenCalled();
    });


    it('should clear the interval if the child window is closed', function() {
      bp.newWindow(sampleConfig, done);
      jasmine.clock().tick(50);
      expect(globalMock.clearInterval).toHaveBeenCalledWith(1);
    });
  });


  describe('.closeWindow()', function() {
    var bp;

    beforeEach(function() {
      bp = new BPAdapter(globalMock);
    });

    it('should call close() on the window if present', function() {
      var spy = jasmine.createSpy('close');
      bp._benchWindow = {close: spy};
      bp.closeWindow();
      expect(spy).toHaveBeenCalled();
    });

    it('should delete the window from the adapter object', function() {
      bp._benchWindow = {close: function(){}};
      bp.closeWindow();
      expect(bp._benchWindow).toBeUndefined();
    });

    it('should not throw if no window present', function() {
      expect(function() {
        bp.closeWindow();
      }).not.toThrow();
    });
  });

  describe('serializeConfig()', function() {
    var sampleConfig;

    beforeEach(function() {
      sampleConfig = {url: 'index-auto.html'};
    });

    it('should add __bpAutoClose__=true to config.url', function() {
      expect(serializeConfig(sampleConfig)).toBe('index-auto.html?__bpAutoClose__=true');
    });


    it('should preserve search portion of config', function() {
      sampleConfig.url = 'index-auto.html?foo=bar'
      expect(serializeConfig(sampleConfig)).toBe('index-auto.html?foo=bar&__bpAutoClose__=true')
    });


    it('should keep hash in place', function() {
      sampleConfig.url += '#foobar';
      expect(serializeConfig(sampleConfig)).toBe('index-auto.html?__bpAutoClose__=true#foobar')
    });


    it('should serialize config properties into search params', function() {
      sampleConfig.iterations = 10;
      sampleConfig.numSamples = 5;
      sampleConfig.angular = 'angular.js';
      expect(serializeConfig(sampleConfig)).toBe('index-auto.html?__bpAutoClose__=true&angular=angular.js&iterations=10&numSamples=5');
    });


    it('should ignore reserved/ignored properties of config', function() {
      expect(serializeConfig(sampleConfig)).not.toContain('url=index-auto.html');
    });
  });
});
