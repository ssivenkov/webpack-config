const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const isDevMove = process.env.NODE_ENV === 'development';
const isProdMode = !isDevMove;
const outputDevFolderName = 'dist';
const outputProductionFolderName = 'public';
const outputFileName = (extension) => isDevMove ? `[name].${extension}`
  : `[name].[contenthash].${extension}`;

const cssLoaders = (extraLoader) => {
  const loaders = [MiniCSSExtractPlugin.loader, 'css-loader'];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
}

const babelOptions = (preset) => {
  const options = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  }

  if (preset) {
    options.presets.push(preset);
  }

  return options;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];

  if (isDevMove) {
    loaders.push('eslint-loader');
  }

  return loaders;
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    }
  }

  if (isProdMode) {
    config.minimizer = [
      new CSSMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }

  return config;
}

const plugins = () => {
  const plugins = [
    new HTMLWebpackPlugin({
      minify: {
        collapseWhitespace: isProdMode,
      },
      scriptLoading: 'blocking',
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/favicon.ico'),
          to: path.resolve(__dirname, isDevMove ? outputDevFolderName : outputProductionFolderName),
        },
      ]
    }),
    new MiniCSSExtractPlugin({
      filename: outputFileName('css'),
    })
  ];

  if (isProdMode) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isDevMove ? 'development' : 'production',
  target: isProdMode ? 'browserslist' : 'web',
  devServer: {
    port: 3000,
    hot: true,
  },
  devtool: isDevMove ? 'source-map' : 'cheap-module-source-map',
  entry: {
    app: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts',
  },
  optimization: optimization(),
  output: {
    filename: outputFileName('js'),
    path: path.resolve(__dirname, isDevMove ? outputDevFolderName : outputProductionFolderName),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.png', 'jpg', 'jpeg', 'svg', 'gif'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },{
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        }
      },
    ],
  },
}