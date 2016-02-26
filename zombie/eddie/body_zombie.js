var debug = require('debug')('worker:eddie');
var exports = module.exports = {};
var config = null;

exports.set_config = function(environment) {
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
      status: true
    },
    after_die: {
      status: true
    }
  });
}