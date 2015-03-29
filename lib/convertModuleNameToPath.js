/**
 * @param {string} moduleName The module name
 * @return {string} The module path
 */
var convertModuleNameToPath = function(moduleName) {
  var modulePath = moduleName.split('.');
  var moduleFolder = modulePath.pop();
  var moduleFile = moduleFolder + '.js';

  return modulePath
    .concat(moduleFolder)
    .concat(moduleFile)
    .join('/');
};

module.exports.convertModuleNameToPath = convertModuleNameToPath;
