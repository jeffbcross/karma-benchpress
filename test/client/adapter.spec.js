
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

  describe('.newWindow()', function() {

  });

  describe('.closeWindow()', function() {

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
