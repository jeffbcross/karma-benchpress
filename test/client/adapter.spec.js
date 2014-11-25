
describe('adapter', function() {
  var globalMock;
  beforeEach(function() {
    globalMock = {
      __karma__: {
        complete: jasmine.createSpy('karmaComplete')
      }
    }
  });


  it('should not createa a global adapter object in test mode', function() {
    expect(window.__bpAdapter__).toBeUndefined();
  });


  it('should provide a global bpSuite function', function() {
    expect(globalMock.bpSuite).toBeUndefined();
    var adapter = new BPAdapter(globalMock);
    expect(typeof globalMock.bpSuite).toBe('function');
  });


  it('should add a "start" method to karma', function() {
    expect(globalMock.__karma__.start).toBeUndefined();
    var adapter = new BPAdapter(globalMock);
    expect(typeof globalMock.__karma__.start).toBe('function');
  });


  describe('.execute()', function() {
    var adapter, benchConfig;
    beforeEach(function() {
      adapter = new BPAdapter(globalMock);
      benchConfig = {
        numSamples: 5,
        iterations: 10
      }
      globalMock.bpSuite(benchConfig);
    });

    it('should throw if benchpress is not globally available', function() {
      globalMock.bp = null;
      expect(adapter.execute).toThrow('Cannot execute without global benchpress object');
    });


    it('should execute each benchmark configuration', function() {
      var spy = spyOn(adapter, 'runBenchmark').and.callThrough();
      globalMock.__karma__.start();
      expect(spy).toHaveBeenCalledWith(benchConfig);
    });
  });


  describe('.runBenchmark()', function() {

  });


  describe('.bpSuite()', function() {

  });
});
