describe('extractModules', function() {
  var eof = require('eof');
  var extractModules = require('../../../lib/extractModules').extractModules;
  var ngModuleCreate = extractModules.ngModuleCreate;

  it('should extract angular modules from file content', function() {
    expect(extractModules(eof.extract(function() {
      /*
        angular.module("components.bar", []);

        angular.module("components.foo", [
          "components.bar"
        ]);

        angular.module("components.test", [
          "components.foo",
          "components.bar"
        ]);
       */
    }).format('javascript'))).toEqual([
      ngModuleCreate('components.bar', []),
      ngModuleCreate('components.foo', ['components.bar']),
      ngModuleCreate('components.test', ['components.foo', 'components.bar'])
    ]);
  });

  it('should extract angular modules independent from quote mark and formatting', function() {
    expect(extractModules(eof.extract(function() {
      /*
        angular.module('components.bar', []);

        angular.module("components.foo", [ 'components.bar' ]);

        angular.module("components.test", [ "components.foo",
          'components.bar'
        ]);
       */
    }))).toEqual([
      ngModuleCreate('components.bar', []),
      ngModuleCreate('components.foo', ['components.bar']),
      ngModuleCreate('components.test', ['components.foo', 'components.bar'])
    ]);
  });
});
