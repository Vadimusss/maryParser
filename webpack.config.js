const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = (env, argv) => {
  return {
    target: 'node',
    entry: './index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new NormalModuleReplacementPlugin(/^hexoid$/, require.resolve('hexoid/dist/index.js')),
    ]
    /*     resolve: {
          fallback: {
            "fs": require.resolve("file-system"),
            "util": require.resolve("util/"),
            "http": require.resolve("stream-http"),
            "path": require.resolve("path-browserify"),
            "url": require.resolve("url/"),
          }
        } */
  };
};
