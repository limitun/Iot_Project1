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
var url = require('url');
var qs = require('querystring');


module.exports = function (passport) {
  router.get('/', function (request, response) {
    console.log('/',request.user);
    var title = 'manage';
    var html ='';
    if(auth.isOwner(request)==true){
    db.query(`select * from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error,results,fields){
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
          <article class="flex"><a href="/manage/uses_log">최근 기록</a></article>
          </section>
          
          <footer class="type1"><a href="/manage/"><br>EMMaS 기자재 정보 관리 시스템</a></footer>
          <footer class="type1"><a href="/manage/logout">로그아웃</a></footer>
          </body>`,
            '');
            response.send(html);
          }else{
            var profile= template.create_profile(results);
            var profile2= template.create_qr(results);
            html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <section class="hbox space-between">
          <article class="flex2">${profile}</article>
          <article class="flex2">${profile2}</article>
          </section>
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
            var list = 'settings';
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
      var _url = request.url;
      var queryData = url.parse(_url,true).query;
      var str_arr = queryData.id.split(':');
      var title= '';
      if(auth.isOwner(request)==true){
        case1= "start_use";
        var filepath="./log/";
        var time = new Date().toLocaleString();
        var str = time.replace(/:/gi,'_');
        var t = true;
        var i= str_arr[0];
        var j= str_arr[1];
        var filename='log_'+str+'_'+i+'_'+j+'_'+case1+'.log';
        sql = `insert into emmas.log (log_date, user_user_number,equipment_eq_number, log_case, log_file)
        values ('${time}', ${i}, ${j}, '${case1}', '${filename}');
        `;
        db.query(sql,function(err,results,fileds){
            if(err){
                console.log(err);
                t=false;
            }else{
            console.log(str);
            }
        });
        if(t){
            var fs=require('fs');
            var data = `userNumber: ${i} equipNumber:${j} log : ${time}, ${case1} 에 대한 사용 기록입니다. \n특이사항 없음`;       
            fs.writeFile(filepath+filename, data,'utf8', function(err, data) { console.log(data); }); 
        }
        sql = `update emmas.equipment set eq_status='in_use' where eq_number=${j}`;
        db.query(sql,function(err,results,fileds){
          if(err) console.log(err);
          });
          t=true;
          response.redirect(`/manage/inform?id=${j}`);
      }else{
        request.flash('info', 'expired session');
        response.redirect('/auth/login');
      }
    });
    /* rtrn */
    router.get('/rtrn', function (request, response) {
      var _url = request.url;
      var queryData = url.parse(_url,true).query;
      var str_arr = queryData.id.split(':');
      console.log(str_arr);
      var title= '';
      if(auth.isOwner(request)==true){
        case1= "end_of_use";
        var filepath="./log/";
        var time = new Date().toLocaleString();
        var str = time.replace(/:/gi,'_');
        var t = true;
        var i= str_arr[0];
        var j= str_arr[1];
        var msg1= str_arr[2];
        var filename='log_'+str+'_'+i+'_'+j+'_'+case1+'.log';
        sql = `insert into emmas.log (log_date, user_user_number,equipment_eq_number, log_case, log_file)
        values ('${time}', ${i}, ${j}, '${case1}', '${filename}');
        `;
        db.query(sql,function(err,results,fileds){
            if(err){
                console.log(err);
                t=false;
            }else{
            console.log(str);
            }
        });
        if(t){
            var fs=require('fs');
            var data = `userNumber: ${i} equipNumber:${j} log : ${time}, ${case1} 에 대한 사용 기록입니다. \n ${msg1}`;       
            fs.writeFile(filepath+filename, data,'utf8', function(err, data) { console.log(data); }); 
            t=true;
        }
        sql = `update emmas.equipment set eq_status='available' where eq_number=${j}`;
        db.query(sql,function(err,results,fileds){
          if(err) console.log(err);
          });
        
        response.redirect(`/manage/inform?id=${j}`);
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
          db.query(`select * from emmas.req_board as r left JOIN user as u ON  r.user_number=u.user_number order by edit_date DESC limit 10;`, function(error,results,fields){
            if(error){
              throw error;
            }else{
              var i = 0;
              var list = '<table class="board">'
              +'<colgroup><col style="width:7%;">'
              +'<col style="width:*%;">'
              +'<col style="width:30%;">'
              +'<col style="width:10%;">'
              +'<col style="width:10%;"></colgroup>'
              +'<tr><th class="no">No.</th><th>제목</th><th>게시일</th><th>작성자</th><th>답변</th></tr>';

              while(i < results.length){
                var t1 = results[i]['title'];
                var t2 = results[i]['edit_date'];
                var t3 = results[i]['userName'];
                // console.log(t2);
                var t4 = results[i]['response_id'];
                var t5 = results[i]['id_board'];
                var answer = 'yes';
                if(t4==null){
                  answer='no';
                }
                list = list + `<tr><td>${t5}</td><td><a href="/manage/board/content?id=${t5}">${t1}</a></td>`+
                          `<td>${t2}</td><td>${t3}</td><td class="${answer}">${answer}</td></tr>`;  
                i = i + 1;
              }
              list = list+'</table><p></p><p><a href="/manage/create">요청사항 작성</a></p>';
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
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  router.get('/board/content',function(request,response){
    var title='';
    var menu_list='';
    var _url = request.url;
      var queryData = url.parse(_url,true).query;
    if(auth.isOwner(request)==true){
      db.query()

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
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  // regist
  router.get('/regist',function (request, response){
    var title='';
    var menu_list='';
    if(auth.isOwner(request)==true){
      db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_rank'];
          var i = 0;
          // var list = `<form action="/manage/create_process" method="post">
          var list = `<form>
          <p> 기자재명 </p>
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
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
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
          );
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
  
  router.get('/inform',function (request, response){
    var title = 'manage';
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var list = '';
    var menu_list='';
    var infm='';
    if(auth.isOwner(request)==true){
    db.query('SELECT * from equipment where eq_number=?',[queryData.id], function(error1,results1,fields1){
      if(error1){
        console.log(error1);
        var html = template.HTML(title, `<body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        ${error1}<br><body>`,
          '');
        response.send(html);
      }else{
        db.query(`select * from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
          if(error2){
            throw error2;
          }else{
            db.query(`SELECT * FROM emmas.log where equipment_eq_number=? order by log_date desc limit 5;`,[queryData.id],function(error3,results3,fileds3){
              if(error3){
                throw error3;
              }else{
                var rank=results2[0]['user_rank'];
                // console.log(rank);
                list = template.create_table(results1,rank);
                menu_list = template.create_menu(rank);
                infm = template.create_infm(results1,results2,results3);
                // console.log(results1);
                var html = template.HTML(title, `<body class="vbox">
                <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
                <section class="main hbox space-between">
                    <article class="flex1" >
                    ${menu_list}
                    </article>
                    <article class="flex4">
                        <article class="flex1" >
                          ${list}
                        </article>
                        <article class="flex4" >
                          ${infm}
                        </article>
                </section>
                <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></footer>
                <footer class="type1"><a href="/manage/logout">로그아웃</a></footer></body>`,
                '');
                response.send(html);
               }
            });
          }
        });
      }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /*view log*/
  router.get('/inform/log', function (request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    if(auth.isOwner(request)==true){
      db.query(`select user_rank from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_rank'];
          var title=queryData.id;
          var i = 0;
          var list = 'settings';
          menu_list = template.create_menu(rank);
          fs.readFile(`./log/${queryData.id}`,'utf-8',(error,data)=>{
            if(error){
              console.log(error);
              response.status(500).send('잘못된 접근입니다.');
            }else{
              var html = template.HTML(title, `<body class="vbox">
              <section class="main hbox space-between">
                  <article class="flex1" >
                  ${data}
                  </article>`,
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