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
        ,'Authorization': ' token 8cc9726f61147163d0700977f1f8d07dd299b459'
      }
    };
    app.get('/api/getUser', function (req,res){
      request(options, function (error, response, body){
        // obj = JSON.parse(body);


        // console.log('obj[0].login: ');
        // console.log(obj[0].login);

        res.json(body);
        // obj[0].push({"namecc":"chelox"});
        // obj[0].type = "Marcelo Sanchez"
        // push({'namee':'MArcelos','last_name':'sanchez'});

        // console.log('body: ',obj[obj.length-1]);
        // jsonStr = JSON.stringify(obj);

      });
    });

    app.get('/api/getRepo/:login_name', function (req,res){
      var url_final = 'https://api.github.com/users/'+req.params.login_name+'/repos';
      var options = {
        url : url_final,
        headers: {'User-Agent': 'request'
        ,'Authorization': ' token 8cc9726f61147163d0700977f1f8d07dd299b459'
        }
      };

      request(options, function (error, response, body){
        res.json(body);
      });
    });

    app.get('/api/getDetailUser/:resp', function (req,res){
      // console.log('req.params.: ');
      // console.log(req.params);
      // var url_final = 'https://api.github.com/users/'+req.params.res;
      // var options = {
      //   url : url_final,
      //   headers: {'User-Agent': 'request'
      //   ,'Authorization': ' token 8cc9726f61147163d0700977f1f8d07dd299b459'
      //   }
      // };
      // console.log('********************data:');
      // console.log(req.params.resp);
      obj = JSON.parse(decodeURIComponent(req.params.resp));
      // req.params.resp;
      // console.log('********************data:');
      // console.log(obj[0]);

      // obj_str = '{"first_name" : "Sammy", "last_name" : "Shark", "location" : "Ocean"}';
      obj_full = [];

      for (var i=0; i <= obj.length-1; i++){
        // console.log('obj[i].i: ');
        // console.log(i);
        // console.log('obj[i].login: ');
        // console.log(obj[i].login);
        // var obj_aux = obj[i];
        // var login_name = 'mojombo';
        var url_final = 'https://api.github.com/users/'+obj[i].login;
        // console.log('url_final: ');
        // console.log(url_final);
        var options = {
          url : url_final,
          headers: {'User-Agent': 'request'
          ,'Authorization': ' token 8cc9726f61147163d0700977f1f8d07dd299b459'
          }
        };

        request(options, function (error, response, body){
          // res.json(body);
          var userDetailJson = JSON.parse(body);

          // obj[i].login = userDetailJson.name;


          // if(--waiting == 0) {
            // res.json(obj_full);
            // console.log('obj[i].obj_full ************: ');
            // console.log(obj_full);
          // }


          obj_full.push(userDetailJson);

          if ((obj_full.length)==i){
            console.log('obj[i].obj_full ************: ');
            console.log(obj_full);
            res.json(obj_full);
          }
          // console.log('obj[i].obj_full ************: ');
          // console.log(obj_full);
          // obb.push(userDetailJson);
          // console.log('body: ',obj[i]);
        });

      }
      // var flag = '1';
      // var waiting = 10000;
      // while(flag=='1') {
      //   console.log('waiting');
      //   console.log(waiting);
      //   --waiting;
      //   if (waiting == 0){
      //     // res.json(obj_full);
      //
      //     flag='0';
      //   }
      // }
      // console.log('obj[i].-----------------login ************: ');
      // console.log(obj_full);

      // request(options, function (error, response, body){

      // });
    });

    // function callback {

    // }

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
