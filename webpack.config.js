const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        resolve: {
          extensions: ['.js', '.jsx']
        }
      }
    ]
  }
};
