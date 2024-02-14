const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@primary-color': '#120543',
                '@secondary-color': '#2196f3',
                '@font-family': 'Arial, sans-serif',
                '@body-background': '#333',
                '@component-background': '#333333',
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};