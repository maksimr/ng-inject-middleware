/**
 * @param {string} moduleName
 * @param {Array} dependencies module dependencies
 * @return {Object} The module object
 */
var ngModuleCreate = function(moduleName, dependencies) {
  return {
    moduleName: moduleName,
    moduleDependencies: dependencies
  };
};

/**
 * @param {string} fileContent
 * @return {Array} The list of angular modules objects
 */
var extractModules = function(fileContent) {
  var modules = [];

  /**
   * @param {Object} module The module object
   */
  var addModule = function(module) {
    modules.push(module);
  };

  fileContent
    .split('\n')
    .join('')
    .replace(/\s*/g, '')
    .replace(/angular.module\(["'](.*?)['"],\[(.*?)\]\)/mg, function(_, moduleName, moduleDependencies) {
      moduleDependencies = moduleDependencies
        .replace(/['"]/g, '')
        .split(',')
        .filter(function(moduleName) {
          return moduleName;
        });

      addModule(ngModuleCreate(moduleName, moduleDependencies));
    });

  return modules;
};

module.exports.extractModules = extractModules;
module.exports.extractModules.ngModuleCreate = ngModuleCreate;
