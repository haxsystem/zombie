var mq = {
  local: {
    host: 'localhost',
    port: '61613',
    connect_headers: {
      host: '/',
      login: 'guest',
      password: 'guest',
      heart_beat: '10,20'
    },
    queue_custom: null
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