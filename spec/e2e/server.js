var connect = require('connect');
var middlewareFactory = require('../../src/middleware').middlewareFactory;

var middleware = middlewareFactory(require('fs'));
middleware.resolve.setCurrentWorkingDirectory(require('path').resolve('app'));

connect()
  .use(function(req, res, next) {
    function accept(req) {
      var ha = req.headers["accept"];
      if (!ha) return false;
      return ha.indexOf("html") > -1;
    }

    function restore() {
      res.writeHead = writeHead;
      res.write = write;
      res.end = end;
    }

    if (res._ngInject) return next();
    res._ngInject = true;

    var writeHead = res.writeHead;
    var write = res.write;
    var end = res.end;

    if (!accept(req)) return next();

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    res.writeHead = function() {
      var headers = arguments[arguments.length - 1];
      if (headers && typeof headers === 'object') {
        for (var name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name];
          }
        }
      }

      var header = res.getHeader('content-length');
      if (header) res.removeHeader('content-length');

      writeHead.apply(res, arguments);
    };

    res.inject = res.write = function(string, encoding) {
      if (string !== undefined) {
        //var body = string instanceof Buffer ? string.toString(encoding) : string;
        restore();
        return write.call(res, string, encoding);
      }
      return true;
    };

    res.end = function(string, encoding) {
      restore();
      var result = res.inject(string, encoding);
      if (!result) return end.call(res, string, encoding);
      if (res.data !== undefined && !res._header) res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
      res.end(res.data, encoding);
    };

    next();
  })
  .use(connect.static('app'))
  .listen(8080);
