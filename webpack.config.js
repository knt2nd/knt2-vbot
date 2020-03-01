const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const metadata = require('./package.json');

module.exports = (_, argv) => {
  const mode = argv.mode || 'development';
  const year = new Date().getFullYear();
  const envPath = path.join(__dirname, 'env.yml');
  const env = {};
  if (fs.existsSync(envPath)) {
    const envAll = yaml.safeLoad(fs.readFileSync(envPath)) || {};
    if (envAll[mode] && envAll[mode].public) Object.assign(env, envAll[mode].public);
  }
  env.mode = mode;
  env.app = {
    title: 'Kanata 2nd Voice Bot',
    copyright: `(c) 2020${year > 2020 ? '-' + year : ''} Kanata`,
    description: metadata.description,
    version: metadata.version,
  };

  return {
    entry: './src/app',
    plugins : [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({ ENV: JSON.stringify(env) }),
      new HtmlWebpackPlugin({ template: 'src/app/index.ejs' }),
    ],
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(woff2?|ttf|eot)$/,
          loader: 'file-loader',
        },
      ],
    },
    performance: {
      maxEntrypointSize: 5000000,
      maxAssetSize: 5000000,
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      open: true,
    },
  };
};
