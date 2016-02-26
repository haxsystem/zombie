var caminte = require('caminte');
var driver = 'redis';

var redis = {
  local: {
    driver: driver,
    host: "localhost",
    port: "6379",
    user: '',
    password: '',
    database: "zombie_manager"
  },
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var Caminte = caminte.Schema;
  var schema = new Caminte(redis[environment].driver, redis[environment]);
  var config = {
    schema: schema
  };

  return config;
}