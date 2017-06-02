var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path');
var methodOverride = require('method-override')

var request = require('request');

    app.use(methodOverride('X-HTTP-Method-Override'))
    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    var token = ' token 1c59c22d8cf7c633c46ef822d572aeadd397f3bc';
    var options;
    var is_tokenize = '1';


    if (is_tokenize == '1'){
      var options_ct = {
        url : 'https://api.github.com/users',
        headers: {
          'User-Agent': 'request'
          ,'Authorization':  token
        }
      };
      options = options_ct;
    } else {
      var options_st = {
        url : 'https://api.github.com/users',
        headers: {
          'User-Agent': 'request'
        }
      };
      options = options_st;
    }


    app.get('/api/getUser', function (req,res){
      request(options, function (error, response, body){
        res.json(body);
      });
    });

    app.get('/api/getRepo/:login_name', function (req,res){
      var url_final = 'https://api.github.com/users/'+req.params.login_name+'/repos';
      if (is_tokenize == '1'){
        var options_ct = {
          url : url_final,
          headers: {
            'User-Agent': 'request'
            ,'Authorization':  token
          }
        };
        options = options_ct;
      } else {
        var options_st = {
          url : url_final,
          headers: {
            'User-Agent': 'request'
          }
        };
        options = options_st;
      }

      request(options, function (error, response, body){
        res.json(body);
      });
    });

    app.get('/api/getDetailUser/:resp', function (req,res){
      obj = JSON.parse(decodeURIComponent(req.params.resp));
      obj_full = [];

      for (var i=0; i <= obj.length-1; i++){
        var url_final = 'https://api.github.com/users/'+obj[i].login;
        if (is_tokenize == '1'){
          var options_ct = {
            url : url_final,
            headers: {
              'User-Agent': 'request'
              ,'Authorization':  token
            }
          };
          options = options_ct;
        } else {
          var options_st = {
            url : url_final,
            headers: {
              'User-Agent': 'request'
            }
          };
          options = options_st;
        }

        request(options, function (error, response, body){
          var userDetailJson = JSON.parse(body);

          obj_full.push(userDetailJson);

          if ((obj_full.length)==i){
            res.json(obj_full);
          }
        });
      }
    });

    app.use(express.static(__dirname + '/app'));

    app.use(morgan('dev'));

    app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
      next();
    });
    app.get('*', function(req, res) {
      res.sendFile(__dirname + '/app/index.html');
    });

    app.listen(8080, function(){
      console.log('NiceD is running on 8080');
    });
