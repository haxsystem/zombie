var debug = require('debug')('worker:config');
var fs = require('fs');
var config_files = fs.readdirSync(__dirname);
var config = {
  environment: 'local',
  cpu_factor: 2
};

try {
  for (var i in config_files) {
    if (config_files[i] != 'general.js') {
      config[config_files[i].replace('\.js', '')] = require('../config/' + config_files[i])(config.environment);
    }
  }
} catch (e) {
  debug(e.message);
}

module.exports = function(environment) {
  return config;
}