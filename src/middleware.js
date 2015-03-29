var extractJavascriptFiles = require('../lib/extractScripts').extractJavascriptFiles;
var extractModules = require('../lib/extractModules').extractModules;
var convertModuleNameToPath = require('../lib/convertModuleNameToPath').convertModuleNameToPath;
var utils = require('../lib/utils');

var flatten = utils.flatten;
var uniq = utils.uniq;

/**
 * @param {Object} fs The file system object
 */
var resolver = function(fs) {
  var path = require('path');

  var moduleDepsToPath = function(module) {
    return module.moduleDependencies.map(function(dep) {
      if (getModules.externalModulesMap[dep]) {
        return getModules.externalModulesMap[dep];
      }

      return path.join(getModules.currentWorkingDirectory, convertModuleNameToPath(dep));
    });
  };

  var getModules = function(jsFile) {
    var fileContent = fs.readFileSync(jsFile);
    var modules = flatten(extractModules(fileContent.toString()).map(moduleDepsToPath));

    return uniq(flatten(modules.map(getModules)).concat(modules));
  };

  getModules.currentWorkingDirectory = '';
  getModules.externalModulesMap = {};

  getModules.setCurrentWorkingDirectory = function(cwd) {
    getModules.currentWorkingDirectory = cwd;
  };

  getModules.setMapWithExternalModules = function(map) {
    getModules.externalModulesMap = map;
  };

  return getModules;
};

var middlewareFactory = function(fs) {
  var resolve = resolver(fs);

  var middleware = function(fileContent) {
    var jsFiles = extractJavascriptFiles(fileContent);

    var scripts = uniq(flatten(jsFiles.map(resolve))).map(function(filePath) {
      return '<script src="' + filePath + '"></script>';
    });

    return fileContent.replace('<script', scripts.concat('<script').join(''));
  };

  middleware.resolve = resolve;
  return middleware;
};

module.exports.middlewareFactory = middlewareFactory;
module.exports.resolver = resolver;
