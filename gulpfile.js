const run = require('gulp-run');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

function buildprocess(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data.hasErrors()) {
        return reject(new Error(data.compilation.errors.join('\n')));
      }
      return resolve();
    });
  }).then(() => {
    console.log('build complete');
    run('aws s3 cp  ./dist/bundle.js s3://reservation-airbnb/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers').exec();
  }).catch((err) => {
    console.log(err, 'Error');
  });
}


exports.default = buildprocess;
