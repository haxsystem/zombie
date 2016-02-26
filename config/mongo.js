var mongo = {
  local: {},
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var response = null;
  switch (environment) {
    case 'local':
      response = mongo['local'];
      break;
    case 'development':
      response = mongo['development'];
      break;
    case 'uat':
      response = mongo['uat'];
      break;
    case 'production':
      response = mongo['production'];
      break;
    default:
      response = mongo['production'];
      break;
  }
  return response;
}