var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template2.js');
var auth = require('../lib/auth.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');


module.exports = function (passport) {
  router.get('/', function (request, response) {
    console.log('/',request.user);
    var title = 'manage';
    var html ='';
    if(auth.isOwner(request)==true){
    db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error,results,fields){
      if(error){
          throw error;
      }else{
          var rank=results[0]['user_rank'];
          if(rank>=4){
            html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <section class="main hbox space-between">
            <article class="flex"><a href="/manage/table">기자재 조회</a></article>
          </section>
          <section class="hbox space-between" style="height: 45%">
            <article class="flex"><a href="/manage/setting">설정 및 관리</a></article>
          </section>
          
          <footer class="type1"><a href="/manage/"><br>EMMaS 기자재 정보 관리 시스템</a></footer>
          <footer class="type1"><a href="/manage/logout">로그아웃</a></footer>
          </body>`,
            '');
            response.send(html);
          }else{
      
            html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <section class="main hbox space-between">
            <article class="flex"><a href="/manage/table">기자재 조회 및 사용</a></article>
          </section>
          <section class="main hbox space-between">
            <article class="flex"><a href="/manage/board">건의사항 게시판</a></article>
            <article class="flex"><a href="/manage/setting">사용자 정보 관리</a></article>
          </section>
          
          <footer class="type1"><a href="/manage/table"><br>EMMaS 기자재 정보 관리 시스템</a></footer>
          <footer class="type1"><a href="/manage/logout">로그아웃</a></footer>
          </body>`,
            '');
            response.send(html);
          }
        }
    });}else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /* setting */
  router.get('/setting', function (request, response) {
    var title = 'test';
    var list = '';
    if(auth.isOwner(request)==true){
      var html = template.HTML(title, `<body class="vbox">
      <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
      <br> setting menu<body>`,
        '');
      response.send(html);
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
    /* uses */
    router.get('/uses', function (request, response) {
      var title = 'test';
      var list = '';
      if(auth.isOwner(request)==true){
        var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        <br> uses menu<body>`,
          '');
        response.send(html);
      }else{
        request.flash('info', 'expired session');
        response.redirect('/auth/login');
      }
    });

    /* board */
  router.get('/board', function (request, response) {
    var title = 'test';
    var list = '';
    if(auth.isOwner(request)==true){
      var html = template.HTML(title, `<body class="vbox">
      <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
      <br> board menu<body>`,
        '');
      response.send(html);
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });

  /* table  */
  router.get('/table', function (request, response) {
    var title = 'manage';
    var list = '';
    if(auth.isOwner(request)==true){
    db.query('SELECT * from equipment ', function(error,results,fields){
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
        <section class="main hbox space-between">
            <article class="flex" ><p>menu</p></article>
        <article class="flex4">${list}</article></section>
        <footer class="type1"><a href="/manage/table">EMMaS 기자재 정보 관리 시스템</a></footer>
        <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
        '');
        response.send(html);
      }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    } 
  });

  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/auth/login');
    });
  });
  
  return router;
}