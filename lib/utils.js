var flatten = function(list) {
  return list.reduce(function(result, item) {
    return result.concat(item);
  }, []);
};

var uniq = function(list) {
  return list.reduce(function(result, item) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }

    return result;
  }, []);
};

module.exports.flatten = flatten;
module.exports.uniq = uniq;
