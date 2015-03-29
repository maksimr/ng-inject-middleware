/**
 * @param {string} fileContent The html file content
 */
var extractJavascriptFiles = function(fileContent) {
  var jsFiles = [];
  var addJavascriptFile = function(file) {
    jsFiles.push(file);
  };

  fileContent.replace(/<script[\s]+src=['"](.*?)['"]>/mg, function(_, fileSrc) {
    addJavascriptFile(fileSrc);
  });

  return jsFiles;
};

module.exports.extractJavascriptFiles = extractJavascriptFiles;
