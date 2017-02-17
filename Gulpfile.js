//Webpack/dev server configuration
const webpackPort = 8080;
const webpackConfigPath = 'webpack.config.js';

//Pull environment from .env
require('dotenv').config();

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      exec = require('child_process').exec,
      path = require('path'),
      inquirer = require('inquirer'),
      webpack = require('webpack'),
      webpackConfig = require(path.join(__dirname, webpackConfigPath)),
      WebpackDevServer = require('webpack-dev-server');

gulp.task('webpack', ['xwlists'], (callback) => {
    new WebpackDevServer(webpack(webpackConfig), {
        hot: true,
        contentBase: path.join(__dirname, 'static'),
    }).listen(webpackPort, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack', err);
        callback();
    });

    console.log(`Webpack dev server listening on ${webpackPort}`);
});

gulp.task('xwlists', (callback) => {
    //Prompt for required environment
    const prompts = [{
        type: 'input',
        name: 'DYLD_LIBRARY_PATH',
        message: 'DYLD_LIBRARY_PATH',
        default: process.env.DYLD_LIBRARY_PATH
    },{
        type: 'input',
        name: 'LOCAL_DB_URL',
        message: 'LOCAL_DB_URL',
        default: process.env.LOCAL_DB_URL
    }];

    inquirer.prompt(prompts).then((env) => {
        const pythonPath = process.env.VIRTUAL_ENV ? path.join(process.env.VIRTUAL_ENV, 'bin', 'python') : 'python';
        const xwlists = exec(`${pythonPath} xwlists.py dev`, {
            env
        });

        xwlists.stdout.pipe(process.stdout);
        xwlists.stderr.pipe(process.stderr);

        xwlists.on('exit', function (code) {
           console.log('xwlists exited with code ' + code.toString());
        });

        callback();
    });
});

gulp.task('serve', ['xwlists', 'webpack']);
