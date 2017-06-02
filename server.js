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

    var options = {
      url : 'https://api.github.com/users',
      headers: {
        'User-Agent': 'request'
        ,'Authorization': ' token 01932c44087594f07462d6b539d4bba0551e40c7'
      }
    };

    app.get('/api/getUser', function (req,res){
      request(options, function (error, response, body){
        res.json(body);
      });
    });

    app.get('/api/getRepo/:login_name', function (req,res){
      var url_final = 'https://api.github.com/users/'+req.params.login_name+'/repos';
      var options = {
        url : url_final,
        headers: {'User-Agent': 'request'
        ,'Authorization': ' token 01932c44087594f07462d6b539d4bba0551e40c7'
        }
      };

      request(options, function (error, response, body){
        res.json(body);
      });
    });

    app.get('/api/getDetailUser/:resp', function (req,res){
      obj = JSON.parse(decodeURIComponent(req.params.resp));
      obj_full = [];

      for (var i=0; i <= obj.length-1; i++){
        var url_final = 'https://api.github.com/users/'+obj[i].login;
        var options = {
          url : url_final,
          headers: {'User-Agent': 'request'
          ,'Authorization': ' token 01932c44087594f07462d6b539d4bba0551e40c7'
          }
        };

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
