var mq = {
  local: {
    'host': 'localhost',
    'port': '61613',
    'connectHeaders': {
      'host': '/',
      'login': 'guest',
      'passcode': 'guest',
      'heart-beat': '10,20'
    },
    queue_manager: '/queue/zombie_land'
  },
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var response = null;
  switch (environment) {
    case 'local':
      response = mq['local'];
      break;
    case 'development':
      response = mq['development'];
      break;
    case 'uat':
      response = mq['uat'];
      break;
    case 'production':
      response = mq['production'];
      break;
    default:
      response = mq['production'];
      break;
  }
  return response;
}