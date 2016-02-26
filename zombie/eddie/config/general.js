var debug = require('debug')('worker:config_eddie');
var fs = require('fs');
var config_files = fs.readdirSync(__dirname);

module.exports = function(environment) {
  var config = {};
  for (var i in config_files) {
    if (config_files[i] != 'general.js') {
      config[config_files[i].replace('\.js', '')] = require('./' + config_files[i])(environment);
      debug(config_files[i]);
    }
  }
  return config;
}