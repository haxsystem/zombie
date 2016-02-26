#!/usr/bin/env node

var program = require('commander');
var async = require('async');
var fs = require('fs');
var after_seppuku = "var debug = require('debug')('worker:after_zombie');\nmodule.exports = function(environment) {\ndebug('After die');\n}";
var before_seppuku = "var debug = require('debug')('worker:before_zombie');\nmodule.exports = function(environment) {\ndebug('Before die');\n}";
var general_config = "var debug = require('debug')('worker:config_{name}');\nvar fs = require('fs');\nvar config_files = fs.readdirSync(__dirname);\nmodule.exports = function(environment) {\nvar config = {};\nfor (var i in config_files) {\nif (config_files[i] != 'general.js') {\nconfig[config_files[i].replace('\.js', '')] = require('./' + config_files[i])(environment);\ndebug(config_files[i]);\n}\n}\nreturn config;\n}";
var test_config = "var mq = {\n  local: {\n    host: 'localhost',\n    port: '61613',\n    connect_headers: {\n      host: '/',\n      login: 'guest',\n      password: 'guest',\n      heart_beat: '10,20'\n    },\n    queue_custom: null\n  },\n  development: {},\n  uat: {},\n  production: {}\n}\n\nmodule.exports = function(environment) {\n  var response = null;\n  switch (environment) {\n    case 'local':\n      response = mq['local'];\n      break;\n    case 'development':\n      response = mq['development'];\n      break;\n    case 'uat':\n      response = mq['uat'];\n      break;\n    case 'production':\n      response = mq['production'];\n      break;\n    default:\n      response = mq['production'];\n      break;\n  }\n  return response;\n}";
var body_zombie = "var debug = require('debug')('worker:{name}');\nvar exports = module.exports = {};\nvar config = null;\nvar config_global = null;\n\nexports.set_config_global = function(config) {\n  config_global = config;\n}\n\nexports.set_config_zombie = function(environment) {\n  config = require('./config/general')(environment);\n}\n\nexports.head = function(message, callback) {\n  debug('zombie: ' + process.pid + ' message: ' + message);\n  debug(config);\n  callback(null, {\n    status: true,\n    seppuku: {\n      status: true\n    },\n    before_die: {\n      status: false\n    },\n    after_die: {\n      status: false\n    }\n  });\n}"
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
    try {
        fs.mkdirSync('../zombie/' + program.args[0]);
        fs.mkdirSync('../zombie/' + program.args[0] + '/after');
        fs.mkdirSync('../zombie/' + program.args[0] + '/after/seppuku');
        fs.mkdirSync('../zombie/' + program.args[0] + '/before');
        fs.mkdirSync('../zombie/' + program.args[0] + '/before/seppuku');
        fs.mkdirSync('../zombie/' + program.args[0] + '/config');
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
            fs.writeFileSync('../zombie/' + program.args[0] + '/after/seppuku/index.js', after_seppuku);
            fs.writeFileSync('../zombie/' + program.args[0] + '/before/seppuku/index.js', before_seppuku);
            fs.writeFileSync('../zombie/' + program.args[0] + '/config/general.js', general_config.replace('{name}', program.args[0]));
            fs.writeFileSync('../zombie/' + program.args[0] + '/config/test.js', test_config);
            fs.writeFileSync('../zombie/' + program.args[0] + '/body_zombie.js', body_zombie.replace('{name}', program.args[0]));
        }
    } catch (e) {
        console.log(e.message);
    }
}