var debug = require('debug')('worker:config');
var fs = require('fs');
var inArray = require('in-array');
var config_files = fs.readdirSync(__dirname);
var config = {
  environment: 'local',
  cpu_factor: 2,
  memory: 6096
};

var exclude = ['general.js', 'certificate', '.git'];

try {
  for (var i in config_files) {
    if (!inArray(exclude, config_files[i])) {
      config[config_files[i].replace('\.js', '')] = require('../config/' + config_files[i])(config.environment);
    }
  }
} catch (e) {
  debug(e.message);
}

module.exports = function(environment) {
  return config;
}