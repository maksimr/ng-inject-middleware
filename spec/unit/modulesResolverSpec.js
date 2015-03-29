describe('moduleResolverSpec', function() {
  var mocks = require('mocks');
  var moduleResolver = require('../../src/middleware').resolver;

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
      },
      test3: {
        components: {
          foo: {
            'foo.js': mocks.fs.file('2012-04-04', 'angular.module("components.foo", ["components.bar"]);')
          },
          bar: {
            'bar.js': mocks.fs.file('2012-04-04', 'angular.module("components.bar", []);'),
            service: {
              'bar.js': mocks.fs.file('2012-04-04', 'angular.module("components.bar").factory("myService", function(){});')
            }
          }
        }
      },
    });

    this.resolve = moduleResolver(this.fs);
  });

  it('should resolve dependencies for file', function() {
    expect(this.resolve('/components/foo/foo.js')).toEqual([
      '/components/zoo/zoo.js',
      '/components/bar/bar.js',
      '/components/moo/moo.js'
    ]);
  });

  it('should set current working directory relative to which should be resolved modules', function() {
    this.resolve.setCurrentWorkingDirectory('/test1');

    expect(this.resolve('/test1/components/foo/foo.js')).toEqual([
      '/test1/components/zoo/zoo.js',
      '/test1/components/bar/bar.js',
      '/test1/components/moo/moo.js'
    ]);
  });

  it('should allow define custom paths for modules', function() {
    this.resolve.setCurrentWorkingDirectory('/test2');
    this.resolve.setMapWithExternalModules({
      'ngRouter': '/test2/bower_components/ng-router/ng-router.js'
    });

    expect(this.resolve('/test2/components/foo/foo.js')).toEqual([
      '/test2/bower_components/ng-router/ng-router.js',
      '/test2/components/bar/bar.js'
    ]);
  });

  it('should resolve services', function() {
    this.resolve.setCurrentWorkingDirectory('/test3');

    expect(this.resolve('/test3/components/foo/foo.js')).toEqual([
      '/test3/components/bar/bar.js',
      '/test3/components/bar/service/bar.js'
    ]);
  });
});
