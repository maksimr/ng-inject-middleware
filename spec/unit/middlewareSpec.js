describe('middlewareSpec', function() {
  var eof = require('eof');
  var mocks = require('mocks');
  var middlewareFactory = require('../../src/middleware').middlewareFactory;

  beforeEach(function() {
    var componentsFileList = {
      components: {
        foo: {
          'foo.js': mocks.fs.file('2012-04-04', 'angular.module("components.foo", ["components.bar", "components.moo", "components.zoo"]);')
        },
        bar: {
          'bar.js': mocks.fs.file('2012-04-04', 'angular.module("components.bar", ["components.zoo"]);')
        },
        zoo: {
          'zoo.js': mocks.fs.file('2012-04-04', 'angular.module("components.zoo", []);')
        },
        moo: {
          'moo.js': mocks.fs.file('2012-04-04', 'angular.module("components.moo", []);')
        }
      }
    };

    this.fs = mocks.fs.create({
      components: componentsFileList.components,
      test1: {
        components: componentsFileList.components
      },
      test2: {
        bower_components: {
          'ng-router': {
            'ng-router.js': mocks.fs.file('2012-04-04', 'angular.module("ngRouter", []);')
          }
        },
        components: {
          foo: {
            'foo.js': mocks.fs.file('2012-04-04', 'angular.module("components.foo", ["components.bar"]);')
          },
          bar: {
            'bar.js': mocks.fs.file('2012-04-04', 'angular.module("components.bar", ["ngRouter"]);')
          }
        }
      }
    });

    this.middleware = middlewareFactory(this.fs);
  });

  it('should take dependencies for script in html file', function() {
    expect(this.middleware(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }))).toEqual(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="/components/zoo/zoo.js"></script><script src="/components/bar/bar.js"></script><script src="/components/moo/moo.js"></script><script src="components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }));
  });

  it('should set current working directory relative to which should be resolved paths of modules', function() {
    this.middleware.resolve.setCurrentWorkingDirectory('test1');

    expect(this.middleware(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="test1/components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }))).toEqual(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="test1/components/zoo/zoo.js"></script><script src="test1/components/bar/bar.js"></script><script src="test1/components/moo/moo.js"></script><script src="test1/components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }));
  });

  it('should allow define path for module with no convention', function() {
    this.middleware.resolve.setCurrentWorkingDirectory('test2');
    this.middleware.resolve.setMapWithExternalModules({
      'ngRouter': 'test2/bower_components/ng-router/ng-router.js'
    });

    expect(this.middleware(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="test2/components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }))).toEqual(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="test2/bower_components/ng-router/ng-router.js"></script><script src="test2/components/bar/bar.js"></script><script src="test2/components/foo/foo.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }));
  });
});
