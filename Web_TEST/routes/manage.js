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
/*test assign */

module.exports = function (passport) {
  router.get('/', function (request, response) {
    var title = 'manage';
    var list = '';
    var html = template.HTML(title, `<body class="vbox">
    <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
    <section class="main hbox space-between">
      <article class="flex"><a href="/manage/table">기자재 조회/사용</a></article>
      <article class="flex"><a href="/manage/">설정관리</a></article>
    <!--</section>-->
    <!--<section class="hbox space-between" style="height: 40%">-->
    </section>
    
    <footer class="type1"><a href="/manage/table"><br>EMMaS 기자재 정보 관리 시스템</a></footer>
    <footer class="type1"><a href="/manage/logout">로그아웃</a></footer>
</body>`,
      '');
      response.send(html);
  });

  router.get('/table', function (request, response) {
    var title = 'manage';
    var list = '';
    connection.query('SELECT * from equipment ', function(error,results,fields){
      if(error){
        console.log(error);
        var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        ${error}<br><body>`,
          '');
        response.send(html);
      }else{
        list = template.create_table(results);   
        console.log(results);
        var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        ${list}<footer class="type1"><a href="/manage/table">EMMaS 기자재 정보 관리 시스템</a></footer>
        <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
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