(function (global) {
  System.config({
    baseURL: "src",
    // defaultJSExtensions: true, 
    transpiler: 'plugin-babel',
    meta: {
      '*.js': {
        babelOptions: {
          // stage0: true,
          // The following loads the plugin: transform-decorators-legacy
          plugins: ['https://fec.blob.core.windows.net/bundles/babel-plugin-transform-decorators-legacy/decorators-plugin-build.js'],
        }        
      },          
      '*.css': {
        loader: 'plugin-css'
      },
    },
    paths: {
      'npm:': 'https://unpkg.com/'
    },
    map: {
      'plugin-babel':               'npm:systemjs-plugin-babel@0.0.25/plugin-babel.js',
      'systemjs-babel-build':       'npm:systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js',
      'plugin-css':                 'npm:systemjs-plugin-css@0.1.37/css.js',
      'plugin-json':                'npm:systemjs-plugin-json@0.3.0/json.js',
      'plugin-text':                'npm:systemjs-plugin-text@0.0.11/text.js',
      'babel-polyfill':             'npm:babel-polyfill@^6.26.0/dist/polyfill.min.js',
      'bluebird':                   'npm:bluebird@3.5.1/js/browser/bluebird.min.js'
    },
    packages: {
      '/': {
        defaultExtension: 'js',
        meta: {
          '*.css': {
            loader: 'plugin-css'
          },
          '*.json': { 
            loader: 'plugin-json' 
          },
        }
      }
    }
  });
})(this);
