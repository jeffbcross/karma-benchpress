var framework = require('../../src/index');
describe('framework', function() {
  it('should have the framework definition and name', function() {
    var splitKey = Object.keys(framework)[0].split(':');
    expect(splitKey[0]).toBe('framework');
    expect(splitKey[1]).toBe('benchpress');
  });


  it('should export the injected constructor', function() {
    expect(framework['framework:benchpress'].length).toBe(2);
  });
});
