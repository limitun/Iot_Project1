var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template2.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
    database: 'emmas'
});

connection.connect();

//connection.end();


module.exports = function (passport) {
  router.get('/', function (request, response) {
    var title = 'manage';
    var list = '';
    var html = template.HTML(title, '',
      '');
      response.send(html);
  });

  router.get('/table', function (request, response) {
    var title = 'manage';
    var list = '';
    connection.query('SELECT * from equipment ', function(error,results,fields){
      if(error){
        console.log(error);
        var html = template.HTML(title, error,
          '');
        response.send(html);
      }else{
        list = template.list(results);    
        console.log(list);
        var html = template.HTML(title, list,
        '');
        response.send(html);
      }
    });
  });



  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/');
    });
  });
  
  return router;
}