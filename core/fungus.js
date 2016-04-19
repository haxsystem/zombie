var cluster = require('cluster');
var debug = require('debug')('worker:fungus');
var stomp = require('stompit');
var config = require('../config/general')();
var cpus = require('os').cpus().length;
var max_worker = cpus * config.cpu_factor;
var async = require('async');
var zombie = null;

// Capture the message that comes from zombie manager and get zombie the information
process.on('message', function(message) {
  zombie = message;
});

/**
 * Create all zombie clone
 */
try {
  if (cluster.isMaster) {
    for (var i = max_worker - 1; i >= 0; i--) {
      _create_zombie();
    }
  } else if (cluster.isWorker) {
    _infected_brain();
  }
} catch (e) {
  debug(e.message);
}

// Capture the event when a zombie is alive
cluster.on('online', function(worker) {
  debug('Zombie Clone ' + zombie.zombie_name + ' and Pid ' + worker.process.pid + ' is online');
  worker.send({
    type: 'infected',
    name: zombie.zombie_name
  });
});

// Capture the event when a zombie invoking the seppuku
cluster.on('exit', function(worker, code, signal) {
  debug('Zombie ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
  debug('Starting a new zombie: ' + zombie.zombie_name);
  _create_zombie();
});

process.on("uncaughtException", function(error) {
  if (error.toString() !== 'Error: IPC channel is already disconnected') {
    process.stderr.write(error.stack);
    process.exit(1);
  }
});

/**
 * Function that create a zombie from to fork
 * @return void
 */
function _create_zombie() {
  worker = cluster.fork();
  worker.on('message', function(message) {
    // This use switch for that in a future if is need add more case
    switch (message.action_type) {
      case 'seppuku':
        process.kill(message.pid, 'SIGHUP');

        try {
          if (message.after_die.status) {
            require('../zombie/' + message.zombie.name + '/after/seppuku/index.js')(message.after_die.params, function(callback) {
              debug(callback);
            });
          }
        } catch (e) {
          debug('Error after die for ' + message.zombie.name);
          debug(e.message);
          response = 'Error';
        }
        break;
    }
  });
};

/**
 * Function that infected the brain of zombie
 * @return void
 */
function _infected_brain() {
  process.on('message', function(message) {
    // This use switch for that in a future if is need add more case 
    switch (message.type) {
      case 'infected':
        stomp.connect(config.mq, function(error, client) {

          if (error) {
            debug('Unable to connect: ' + error.message);
            return;
          }

          var subscribeParams = {
            'destination': '/queue/zombie:' + zombie.name,
            'ack': 'client-individual'
          };

          var consuming = false;

          client.subscribe(subscribeParams, function(error, message) {
            // Don't consume more than one message
            if (consuming || message == undefined) {
              return;
            }

            consuming = true;

            message.ack();

            message.readString('utf-8', function(error, body) {

              if (error) {
                debug('read message error ' + error.message);
                return;
              }

              var zombie_body = require('../zombie/' + zombie.name + '/body_zombie');

              zombie_body.set_config_global(config);
              zombie_body.set_config_zombie(config.environment);

              zombie_body.head(body, function(err, message) {
                async.series({
                  'before_die': function(callback) {
                    var response = 'Not launch';

                    if (message.before_die.status) {
                      try {
                      require('../zombie/' + zombie.name + '/before/seppuku/index.js')(message.before_die.params, function(callback) {
                          debug(callback);
                          response = 'ok';
                        });
                      } catch (e) {
                        debug('Error befor edie for ' + zombie.name);
                        debug(e.message);
                        response = 'Error';
                      }
                    }
                    callback(null, response);
                  },
                  'seppuku': function(callback) {
                    var response = 'Not launch';
                    var response_message = {
                      after_die: {
                        status: null,
                        params: null
                      },
                      zombie: {
                        name: null
                      }
                    };

                    if (message.seppuku.status) {
                      response_message.action_type = 'seppuku';
                      response_message.pid = process.pid;

                      response_message.after_die.status = message.after_die.status;
                      response_message.zombie.name = zombie.name;
                      response_message.after_die.params = message.after_die.params;

                      process.send(response_message);
                      response = 'ok';
                    }
                    callback(null, response);
                  }
                }, function(err, results) {
                  debug('_before_die: ' + results.before_die);
                  debug('_seppuku: ' + results.seppuku);
                });
              });
            });
          });
        });
        break;
    }
  });
};