var webpack = require('webpack'),
    path = require('path'),
    merge = require('lodash/merge');

const NODE_ENV = process.env.NODE_ENV || 'development';
var defines = {
  ENVIRONMENT: JSON.stringify(NODE_ENV)
};

var loaders = [{
  test: /\.(jsx|js|es)$/,
  loaders: ['babel-loader'],
  include: path.join(process.cwd(), 'ui')
},{
  test: require.resolve("react-dom"),
  loader: "expose-loader?ReactDOM"
},{
  test: /\.css$/,
  loaders: [ 'style-loader', 'css-loader' ]
}];

var configs = {
  production: {
    devtool: 'none',
    entry: {
      bundle: ['babel-polyfill', './ui/xwlists.js']
    },
    plugins: [
      new webpack.DefinePlugin(defines),
      new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ],
    module: {
      loaders
    },
    stats: {children: false}
  },

  development: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin(defines),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    entry: {
      bundle: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        'babel-polyfill',
        './ui/xwlists.js'
      ]
    },
    module: {
      loaders
    }
  }
}

var shared = {
  cache: true,
  output: {
    path: path.join(process.cwd(), '/static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom'
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./ui')],
    extensions: ['.js', '.jsx', '.es', '.json']
  }
};

module.exports = merge({}, shared, configs[NODE_ENV]);
