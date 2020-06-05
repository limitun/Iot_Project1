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
var ejs = require('ejs')
var bodyParser = require('body-parser');



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
            <article class="flex"><a href="/manage/table">기자재 조회/관리</a></article>
            <article class="flex"><a href="/manage/setting">환경 설정</a></article>
          </section>
          <section class="hbox space-between" style="height: 45%">
          <article class="flex"><a href="/manage/board">요청 사항</a></article>
          <article class="flex"><a href="/manage/uses">최근 기록</a></article>
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
            <article class="flex"><a href="/manage/board">요청 사항</a></article>
            <article class="flex"><a href="/manage/setting">환경 설정</a></article>
          </section>
          
          <footer class="type1"><a href="/manage"><br>EMMaS 기자재 정보 관리 시스템</a></footer>
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
    var title = '';
    var menu_list='';
    if(auth.isOwner(request)==true){
      db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_rank'];
            var i = 0;
            var list = 'setting';
            menu_list = template.create_menu(rank);
            var html = template.HTML(title, `<body class="vbox">
            <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
            <section class="main hbox space-between">
                <article class="flex1" >
                ${menu_list}
                </article>
            <article class="flex5">${list}</article></section>
            <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
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
    /* uses */
    router.get('/uses', function (request, response) {
      var title = '';
      var menu_list='';
      if(auth.isOwner(request)==true){
        db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
          if(error2){
            throw error2;
          }else{
            var rank=results2[0]['user_rank'];
            fs.readdir('./data', function(error, filelist){
              var i = 0;
              var list = '<table class="board">'
              +'<colgroup><col style="width:10%;">'
              +'<col style="width:50%;">'
              +'<col style="width:30%;">'
              +'<col style="width:10%;"></colgroup>'
              +'<tr><th class="no">No.</th><th>제목</th><th>게시일</th><th>답변</th></tr>';

              while(i < filelist.length){
                list = list + `<tr><td>${i+1}</td><td><a href="/manage/board/${filelist[i]}">${filelist[i]}</li></td>`+
                              `<td></td><td></td></tr>`;
                i = i + 1;
              }
              list = list+'</table><p><a href="/manage/create">요청사항 작성</a>';
              menu_list = template.create_menu(rank);
              var html = template.HTML(title, `<body class="vbox">
              <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
              <section class="main hbox space-between">
                  <article class="flex1" >
                  ${menu_list}
                  </article>
              <article class="flex5">${list}</article></section>
              <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
              <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
              '');
              response.send(html);
            });
            }
        });
      }else{
        request.flash('info', 'expired session');
        response.redirect('/auth/login');
      }
    });

    /* board */
  router.get('/board', function (request, response) {
    var title = '';
    var menu_list='';
    if(auth.isOwner(request)==true){
      db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_rank'];
          fs.readdir('./data', function(error, filelist){
            var i = 0;
            var list = '<table class="board">'
            +'<colgroup><col style="width:10%;">'
            +'<col style="width:50%;">'
            +'<col style="width:30%;">'
            +'<col style="width:10%;"></colgroup>'
            +'<tr><th class="no">No.</th><th>제목</th><th>게시일</th><th>답변</th></tr>';

            while(i < filelist.length){
              list = list + `<tr><td>${i+1}</td><td><a href="/manage/board/${filelist[i]}">${filelist[i]}</li></td>`+
                            `<td></td><td></td></tr>`;
              i = i + 1;
            }
            list = list+'</table><p><a href="/manage/create">요청사항 작성</a>';
            menu_list = template.create_menu(rank);
            var html = template.HTML(title, `<body class="vbox">
            <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
            <section class="main hbox space-between">
                <article class="flex1" >
                ${menu_list}
                </article>
            <article class="flex5">${list}</article></section>
            <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
            <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
            '');
            response.send(html);
          });
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /*board_create */
  router.get('/create',function (request, response){
    var title='';
    var menu_list='';
    if(auth.isOwner(request)==true){
      db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_rank'];
          fs.readdir('./data', function(error, filelist){
            var i = 0;
            // var list = `<form action="/manage/create_process" method="post">
            var list = `<form>
            <p> 요청사항 </p>
            <p><input type="text" name="title" placeholder="title"></p>
            <p> 내용 </p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            
            <p>
              <input type="button" value="제출" onclick="submit"><input type="button" value="취소" onclick="back_board();">
            </p>
          </form>`;
            menu_list = template.create_menu(rank);
            var html = template.HTML(title, `<body class="vbox">
            <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
            <section class="main hbox space-between">
                <article class="flex1" >
                ${menu_list}
                </article>
            <article class="flex5">${list}</article></section>
            <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
            <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
            '');
            response.send(html);
          });
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /* setting */
  router.get('/setting', function (request, response) {
    var title = 'test';
    var list = '';
    var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        <br> setting menu<body>`,
          '');
      response.send(html);
  });
    /* uses */
    router.get('/uses', function (request, response) {
      var title = 'test';
      var list = '';
      var html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <br> uses menu<body>`,
            '');
        response.send(html);
    });

    /* board */
  router.get('/board', function (request, response) {
    var title = 'test';
    var list = '';
    var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        <br> board menu<body>`,
          '');
      response.send(html);
  });

  router.get('/manage/board/:id',(request,response)=>{
      var id = request.params.id;
      fs.readFile('data/'+id, 'utf-8',(err,data)=>{
        if(err){
          response.status(500).sendStatus('Internal Server Error');
        }else{
          response.render('/manage/board',{topics:files,title:id, descript:data});
        }
      });
  });
  router.post('/create_process',
    
  );

  /* table  */
  router.get('/table', function (request, response) {
    var title = 'manage';
    var list = '';
    var menu_list='';
    if(auth.isOwner(request)==true){
    db.query('SELECT * from equipment ', function(error1,results1,fields1){
      if(error1){
        console.log(error1);
        var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        ${error1}<br><body>`,
          '');
        response.send(html);
      }else{
        db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
          if(error2){
            throw error2;
          }else{
            var rank=results2[0]['user_rank'];
            // console.log(rank);
            list = template.create_table(results1,rank);
            menu_list = template.create_menu(rank);
            // console.log(results1);
            var html = template.HTML(title, `<body class="vbox">
            <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
            <section class="main hbox space-between">
                <article class="flex1" >
                ${menu_list}
                </article>
            <article class="flex4">${list}</article></section>
            <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
            <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
            '');
            response.send(html);
            }
        });
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