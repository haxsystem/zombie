var redis = {
  local: {
    host: "localhost",
    port: "6379",
    user: '',
    password: '',
    keys: {}
  },
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var response = null;
  switch (environment) {
    case 'local':
      response = redis['local'];
      break;
    case 'development':
      response = redis['development'];
      break;
    case 'uat':
      response = redis['uat'];
      break;
    case 'production':
      response = redis['production'];
      break;
    default:
      response = redis['production'];
      break;
  }
  return response;
}