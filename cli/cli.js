#!/usr/bin/env node

var program = require('commander');
var async = require('async');
var fs = require('fs');
var after_seppuku = "var debug = require('debug')('worker:after_zombie');\n \n module.exports = function(params, callback) {\n   debug('After die');\n   debug(params);\n   callback(true);\n }";
var before_seppuku = "var debug = require('debug')('worker:before_zombie');\n \n module.exports = function(params, callback) {\n   debug('Before die');\n   debug(params);\n   callback(true);\n }";
var general_config = "var debug = require('debug')('worker:config_{name}');\n var fs = require('fs');\n var config_files = fs.readdirSync(__dirname);\n var inArray = require('in-array');\n var exclude = ['general.js', 'certificate', '.git'];\n \n module.exports = function(environment) {\n   var config = {};\n  for (var i in config_files) {\n     if (!inArray(exclude, config_files[i])) {\n       config[config_files[i].replace('\.js', '')] = require('./' + config_files[i])(environment);\n       debug(config_files[i]);\n     }\n   }\n   return config;\n };";
var test_config = "var mq = {\n  local: {\n    host: 'localhost',\n    port: '61613',\n    connect_headers: {\n      host: '/',\n      login: 'guest',\n      password: 'guest',\n      heart_beat: '10,20'\n    },\n    queue_custom: null\n  },\n  development: {},\n  uat: {},\n  production: {}\n}\n\nmodule.exports = function(environment) {\n  var response = null;\n  switch (environment) {\n    case 'local':\n      response = mq['local'];\n      break;\n    case 'development':\n      response = mq['development'];\n      break;\n    case 'uat':\n      response = mq['uat'];\n      break;\n    case 'production':\n      response = mq['production'];\n      break;\n    default:\n      response = mq['production'];\n      break;\n  }\n  return response;\n}";
var body_zombie = "var debug = require('debug')('worker:genkidama');\n var exports = module.exports = {};\n var config = null;\n var config_global = null;\n \n exports.set_config_global = function(config) {\n   config_global = config;\n }\n \n exports.set_config_zombie = function(environment) {\n   config = require('./config/general')(environment);\n }\n \n exports.head = function(message, callback) {\n   debug('zombie: ' + process.pid + ' message: ' + message);\n   debug(config);\n   callback(null, {\n     status: true,\n     seppuku: {\n       status: true\n     },\n     before_die: {\n       status: true,\n       params: {}\n     },\n     after_die: {\n       status: true,\n       params: {}\n     }\n   });\n }";
program
  .version('0.0.1')
  .usage('<keywords>')
  .option('-n, --name', 'The name for a zombie')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  create_zombie_directory()
}

/**
 * Method that build a structure for a zombie
 * @return {[type]} [description]
 */
function create_zombie_directory() {
  var folder = true;
  var path = __dirname;
  try {
    if (!fs.existsSync(path + path + '/../zombie')) {
      fs.mkdirSync(path + '/../zombie');
    }

    fs.mkdirSync(path + '/../zombie/' + program.args[0]);
    fs.mkdirSync(path + '/../zombie/' + program.args[0] + '/after');
    fs.mkdirSync(path + '/../zombie/' + program.args[0] + '/after/seppuku');
    fs.mkdirSync(path + '/../zombie/' + program.args[0] + '/before');
    fs.mkdirSync(path + '/../zombie/' + program.args[0] + '/before/seppuku');
    fs.mkdirSync(path + '/../zombie/' + program.args[0] + '/config');
  } catch (e) {
    if (e.code == 'EEXIST') {
      console.log('This zombie already exists');
    } else {
      console.log(e.message);
    }
    folder = false;
  }

  try {
    if (folder) {
      fs.writeFileSync(path + '/../zombie/' + program.args[0] + '/after/seppuku/index.js', after_seppuku);
      fs.writeFileSync(path + '/../zombie/' + program.args[0] + '/before/seppuku/index.js', before_seppuku);
      fs.writeFileSync(path + '/../zombie/' + program.args[0] + '/config/general.js', general_config.replace('{name}', program.args[0]));
      fs.writeFileSync(path + '/../zombie/' + program.args[0] + '/config/test.js', test_config);
      fs.writeFileSync(path + '/../zombie/' + program.args[0] + '/body_zombie.js', body_zombie.replace('{name}', program.args[0]));
    }
  } catch (e) {
    console.log(e.message);
  }
}