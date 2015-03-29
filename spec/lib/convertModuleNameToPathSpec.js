describe('getPathFromModuleSpec', function() {
  var convertModuleNameToPath = require('../../lib/convertModuleNameToPath').convertModuleNameToPath;

  it('should convert module name to file path', function() {
    expect(convertModuleNameToPath('components.foo')).toEqual('components/foo/foo.js');
  });
});
