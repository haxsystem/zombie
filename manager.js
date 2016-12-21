var config = require('./config/general')();
var debug = require('debug')('worker:main');
var stomp = require('stompit');
var fork = require('child_process').fork;
var zombies = {};
var arg_fork = {
    stdio: 'pipe',
    execArgv: ['--max-old-space-size=' + config.memory]
};


var connectionManager = new stomp.ConnectFailover();
connectionManager.addServer(config.mq);
var channel = new stomp.Channel(connectionManager);

// Conexion with protocol stomp

var subscribe_params = {
    'destination': config.mq.queue_manager,
    'ack': 'client-individual'
};

debug('Conexion zombie manager with MQ');

channel.subscribe(subscribe_params, function(error, message) {
    if (error) {
        debug('read message error ' + error.message);
        return;
    }
    // acknowledge for the message
    message.ack();

    message.readString('utf-8', function(error, body) {
        try {
            var instructions = JSON.parse(body);

            if (instructions.status) {
                switch (instructions.action) {
                    case 'launch':
                        if (!zombies.hasOwnProperty(instructions.zombie_name)) {
                            zombies[instructions.zombie_name] = fork('./core/fungus', [], arg_fork);

                            debug('Launch zombie master: ' + instructions.zombie_name + ' and pid ' + zombies[instructions.zombie_name].pid);

                            zombies[instructions.zombie_name].send({
                                type: instructions.action,
                                zombie_name: instructions.zombie_name
                            });

                            zombies[instructions.zombie_name].on('message', function(message) {
                                debug('received: ' + message);
                            });

                        } else {
                            debug('This zombie is ready and you can not create.');
                        }
                        break;
                    case 'disconnect':
                        if (zombies.hasOwnProperty(instructions.zombie_name)) {
                            debug('Disconnect Zombie Master: ' + instructions.zombie_name + ' and Pid ' + zombies[instructions.zombie_name].pid);
                            zombies[instructions.zombie_name].kill('SIGHUP');
                            delete zombies[instructions.zombie_name];
                        } else {
                            debug('This zombie does not exist.');
                        }
                        break;
                    default:
                        debug('unrecognized option');
                        debug(instructions);
                        break;
                }
            }
        } catch (e) {
            debug(e.message);
            debug(e);
        }
    });
});