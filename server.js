var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path');
var methodOverride = require('method-override')

var request = require('request');

// app.use(express.bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'))
// parse application/json
app.use(bodyParser.json());

 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

client_id = 'xxxx';
client_password = 'yyyy';

var options = {
  // url : 'https://api.github.com/users/cheloxGit',
  url : 'https://api.github.com/users',

  headers: {
    'User-Agent': 'request'
  }
};
app.get('/api/getUser', function (req,res){
  request(options, function (error, response, body){
    console.log('error: ',error);
    console.log('statusCode: ', response && response.statusCode);
    // console.log('body:', body);
    res.json(body);
  });
});

app.get('/api/getRepo/:login_name', function (req,res){
console.log(req.params.login_name);
  console.log('req.params.login_user:',req.params.login_name);
  var url_final = 'https://api.github.com/users/'+req.params.login_name+'/repos';
  var options = {
    // url : 'https://api.github.com/users/cheloxGit',
    url : url_final,
    headers: {'User-Agent': 'request'}
  };

  request(options, function (error, response, body){
    console.log('error: ',error);
    console.log('statusCode: ', response && response.statusCode);
    // console.log('body:', body);
    res.json(body);
  });
});

// app.get('/api/getRepo', function (req,res){
//   request(options, function (error, response, body){
//     console.log('error: ',error);
//     console.log('statusCode: ', response && response.statusCode);
//     console.log('body:', body);
//     res.json(body);
//   });
// });

// var querystring = require('querystring');
// var https = require('https');

// var host = 'https://api.github.com';
// var username = 'cheloxGit';
// var password = '*****';
// var apiKey = '*****';
// var sessiondId = null;
//
// function performRequest(endpoint, method, data, success){
//   var dataString = JSON.stringify(data);
//   var headers = {};
//   if (method == 'GET'){
//     endpoint += '?' + querystring.stringify(data);
//   }
//   else {
//     headers = {
//       'Content-Type': 'application/json',
//       'Content-Length': dataString.length
//     };
//   }
//
//   var options = {
//     host: host,
//     path: endpoint,
//     method: method,
//     headers: headers
//   };
//   var req = https.request(options, function(res){
//     res.setEncoding('utf-8');
//
//     var responseString = '';
//
//     res.on('data', function(data){
//       responseString += data;
//     });
//     res.on('end', function(){
//       console.log(responseString);
//       var responseObject = JSON.parse(responseString);
//       success(responseObject);
//     });
//   });
//
//   req.write(dataString);
//   req.end();
// }
//
// function getUser(){
//   performRequest('/users/cheloxGit', 'GET', {}, function (data){
//     console.log('Fetched '+data.result);
//   });
// }
// getUser();
// https.get('https://api.github.com/users/cheloxGit', (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);
//
//   res.on('data', (d) => {
//     // $scope.data_user = data;
//     process.stdout.write(d);
//     console.log(d);
//   });
//
// }).on('error', (e) => {
//   console.error(e);
// });
  app.use(express.static(__dirname + '/app'));

  app.use(morgan('dev'));

  //app.use(express.bodyParser());

  //app.use(express.methodOverride());
  //app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

// app.get('/api/data_user', function(res,req){
//   res.json(data_user);
// })

app.listen(8080, function(){
  console.log('NiceD is running on 8080');
});
