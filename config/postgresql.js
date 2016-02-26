var pg = {
  local: {},
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var response = null;
  switch (environment) {
    case 'local':
      response = pg['local'];
      break;
    case 'development':
      response = pg['development'];
      break;
    case 'uat':
      response = pg['uat'];
      break;
    case 'production':
      response = pg['production'];
      break;
    default:
      response = pg['production'];
      break;
  }
  return response;
}