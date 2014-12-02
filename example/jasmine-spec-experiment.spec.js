describe('test benchmark', function() {
  var beforeDefault;
  beforeEach(function() {
    beforeDefault = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = beforeDefault;
  });

  it('should be within acceptable limits', function(done) {
    bpSuite({url: 'base/largetable/index-auto.html', variable: 'ngBind', numSamples: 15, iterations: 20}).
      then(function(result) {
        expect(result.$apply.testTime.avg.mean).toBeLessThan(15);
        expect(result.create.testTime.avg.mean).toBeLessThan(1500);
        done();
      }, function(reason) {
        console.error('failed because', reason.message);
      }).then(null, function(e) { console.error('something went wrong', e); done()});
  });
});
