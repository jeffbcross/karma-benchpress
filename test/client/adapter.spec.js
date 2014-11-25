
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


  describe('.runBenchmark()', function() {

  });


  describe('.bpSuite()', function() {

  });
});
