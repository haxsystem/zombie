var debug = require('debug')('worker:eddie');
var exports = module.exports = {};
var config = null;
var config_global = null;

exports.set_config_global = function(config) {
  config_global = config;
}

exports.set_config_zombie = function(environment) {
  config = require('./config/general')(environment);
}

exports.head = function(message, callback) {
  debug('zombie: ' + process.pid + ' message: ' + message);
  debug(config);
  callback(null, {
    status: true,
    seppuku: {
      status: true
    },
    before_die: {
      status: false
    },
    after_die: {
      status: false
    }
  });
}