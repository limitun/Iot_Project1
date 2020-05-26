var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'login';
    var html = template.HTML(title,  `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="id" placeholder="ID 입력" value=""></p>
        <p><input type="password" name="pwd" placeholder="password" value=""></p>
        <p>
          <input type="submit" value="login">
        </p>
        <p>
          <a class="option" href = "/auth/login/find_id">아이디 찾기</a>&nbsp;
          <a class="option" href = "/auth/login/find_pw">비밀번호 찾기</a>&nbsp;
          <a class="option" href = "/auth/login/signin">회원가입</a>
        </p>
        <!--<div id="fdb_msg" style="color:red;">${feedback}</div>-->
        <div id="fdb_msg" style="color:red;">${feedback}</div>
      </form>
    `,'/');
    response.send(html);
  });

  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/manage',
      failureRedirect: '/manage',
      //failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    })
    );


  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/');
    });
  });

  return router;
}