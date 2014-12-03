# Status: In-Development

See https://github.com/angular/benchpress for information about benchpress.

This project allows automated execution of already-built
[benchpress](https://github.com/angular/benchpress) benchmarks through Karma.

See [example/karma-experiment.conf.js](example/karma-experiment.conf.js) for reference configuration and see
[example/jasmine-spec-experiment.spec.js] for reference spec.

## `bpSuite`

This plugin comes with an adapter that provides a global function called `bpSuite` that allows
imperative execution of a benchmark with custom configuration. bpSuite returns a promise that will
resolve with the result object

```javascript
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
```

The `bpSuite` options object can have the following properties:

| Property | Required | Description |
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
| url      | yes      | Url of the benchmark to be executed (ie. `base/largetable/index-auto.html`) |
| variable | no       | Benchpress variable with which to run the benchmarks |
| numSamples | no     | How many samples to collect. Will use benchpress default (currently 20) if not specified |
| iterations | no     | How many iterations to run (should be greater than samples). Will use benchpress default (currently 25) if not specified |

The adapter will serialize all non-reserved properties into query parameters in the benchmark's url, so any
supported benchpress paramaters may be used here.

## Result Object

The result object has the following structure:

```javascript
{
  stepName1 : ...,
  stepName2: {
    testTime: {
      avg: {
        mean: 5.0, //milliseconds of how long the step took to execute
        stdDev: 0.1, //Standard deviation of sample
        coefficientOfVariation: 0.02 //stdDev as percentage of mean
      },
      min: 4,
      max: 6,
      history: [
        4.0,
        5.0,
        6.0
      ]
    },
    //All other measured characteristics have the same structure, though they may represent values other than time
    gcTime: ..., //time spent collecting garbage after this step
    garbageCount: ..., //how much garbage was generated during this step in KB
    retainedCount: ..., //how much memory is retained by the step
  }
}
```

## Gotchas & FAQs

 * `jasmine.DEFAULT_TIMEOUT_INTERVAL` should be set to a number high enough to run all iterations of the benchmark. This would be best inside of a beforeEach/afterEach which will set the interval back to its original value
 * A custom launcher based on Chrome Canary should be used to provide the best memory profiling characteristics. An example launcher configuration can be found in the [example karma config](example/karma-experiment.conf.js).
 * This plugin and the `bpSuite` function have no dependency on Jasmine, though Jasmine is the only framework with which it has been tested.
