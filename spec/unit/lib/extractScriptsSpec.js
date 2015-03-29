describe('extractScriptsSpec', function() {
  var eof = require('eof');
  var extractJavascriptFiles = require('../../../lib/extractScripts').extractJavascriptFiles;

  it('should extract javascript files from html', function() {
    expect(extractJavascriptFiles(eof.extract(function() {
      /*
         <html>
          <head>
              <script src="components/foo/foo.js"></script>
              <script src="components/bar/bar.js"></script>
          </head>
          <body>
          </body>
         </html>
       */
    }))).toEqual([
      'components/foo/foo.js',
      'components/bar/bar.js'
    ]);
  });
});
