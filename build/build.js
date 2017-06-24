var rm = require('rimraf')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')

rm('./dist/', function (pErr) {
  if (pErr) throw pErr
  webpack(webpackConfig, function (err, stat) {
    if (err) throw err
    console.log('finished')
  })
})
