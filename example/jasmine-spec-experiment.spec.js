describe('test benchmark', function() {
  var beforeDefault;
  beforeEach(function() {
    beforeDefault = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = beforeDefault;
  });

  it('should take less than 15 seconds to apply', function(done) {
    bpSuite({url: 'base/largetable/index-auto.html', variable: 'ngBind', numSamples: 2, iterations: 2}).
      then(function(result) {
        expect(result.$apply.testTime).toBeLessThan(15);
        done();
      }, function(reason) {
        console.error('failed because', reason.message);
      });
  });
});
