var mysql = {
  local: {},
  development: {},
  uat: {},
  production: {}
}

module.exports = function(environment) {
  var response = null;
  switch (environment) {
    case 'local':
      response = mysql['local'];
      break;
    case 'development':
      response = mysql['development'];
      break;
    case 'uat':
      response = mysql['uat'];
      break;
    case 'production':
      response = mysql['production'];
      break;
    default:
      response = mysql['production'];
      break;
  }
  return response;
}