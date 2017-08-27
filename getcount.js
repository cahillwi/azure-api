var querystring = require('querystring');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var config = {
  client_id: '3111ac5a-c013-46b3-a5cb-d79081f9f2f1',
  client_secret: 'gEHGLCFdaUVBy8y2RubLv7kzlu0htDcrVEI/528GgA4=',
  token_service: {
    host: 'login.microsoftonline.com',
    path: '/utccloud.onmicrosoft.com/oauth2/token?api-version=1.0'
  }
}
var token_input = {
  grant_type: 'client_credentials',
  resource: '',
  client_id: config.client_id,
  client_secret: config.client_secret
};
var token_body = querystring.stringify(token_input);
var token_options = {
  method: 'POST',
  host: config.token_service.host,
  path: config.token_service.path,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(token_body)
  }
};

var cur_date = new Date(new Date().setMinutes(new Date().getMinutes()-5)).toISOString();
var UserID = new Buffer('william.cahill@utc.com:21qazSE$#').toString('base64');
var proxyAuth = "Basic " + UserID;
var tempPath = encodeURI("/utccloud.microsoft.com/activities/signinEvents?api-version=beta&$filter=signinDateTime ge " + cur_date + " and loginStatus eq '0'");
var service_request_options = {
    host: 'graph.windows.net',
    path: tempPath,
    headers: {
      Authorization: '',
    }
  }
  var tempProxyPath = encodeURI("https://graph.windows.net/utccloud.microsoft.com/activities/signinEvents?api-version=beta&$filter=signinDateTime ge " + cur_date + " and loginStatus eq '0'");
var service_request_options_proxy = {
  host: 'comproxyva2.utc.com',
  port: '8080',
  path: tempProxyPath,
  headers: {
    Authorization: '',
    Host: tempProxyPath
  }
}

service_request_options_proxy.headers['Proxy-Authorization'] = proxyAuth;
service_request_options_proxy.headers['Proxy-Connection'] = 'keep-alive';
service_request_options_proxy.headers['Connection'] = 'keep-alive';

var count = 0;
function token_response_handler(resp) {
  var response = '';
  resp.on('data', function(chunk) {
    response += chunk;
  });
  resp.on('end', function() {
    token_received(response);
  });
}
function token_received(resp) {
  var resp_obj = JSON.parse(resp);
  var token = resp_obj.access_token;
  var type = resp_obj.token_type;
  service_request_options_proxy.headers.Authorization = type + ' ' + token;
  service_request(service_request_options_proxy);
}
function service_response_handler(resp) {
    var response = '';
    resp.on('data', function(chunk) {
      response += chunk;
    });
    resp.on('end', function() {
        service_response_received(response);
    });
}
function service_response_received(resp){
    try {
        var service_resp_obj = JSON.parse(resp);
    }
    catch( e ) {
        console.log(e);
    }
    count += service_resp_obj.value.length;
    if(service_resp_obj['@odata.nextLink']){
        service_request_options.path = url.parse(resp['@odata.nextLink']).path;
        service_request(service_request_options_proxy);
    }else{
        console.log(count);
    }
}
function service_request(options) {
    console.log('requesting', options.path);
  var serv_req = http.request(options, service_response_handler);
  serv_req.end();
}
    
/**
* To do:
        Get service_request through proxy
        Parse response
        Save last filter time in mem so I am only querying results I didnt get then ad to count stored in mem.
*/
var token_req = https.request(token_options, token_response_handler);
function update_count() {
  token_req.write(token_body);
  token_req.end();
}
update_count();