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
          var rank=results[0]['user_RANK'];
          if(rank>=4){
            var profile= template.create_profile(results);
            var profile2= template.create_qr(results);
            db.query(`select * from emmas.log order by log_date desc limit 20;`,function(err3,res3,fileds){
              if(err3){
                throw err3;
              }else{
                var log_list = template.cr_log_list(res3);
                html = template.HTML(title, `<body class="vbox">
              <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
              <section class="hbox space-between">
              <article class="flex2">${profile}</article>
              <article class="flex2">${profile2}</article>
              </section>
              <section class="main hbox space-between">
                <article class="flex"><a href="/manage/table">기자재 조회/관리</a></article>
                <article class="flex"><a href="/manage/board">요청 사항</a></article>
                
              </section>
              <section class="hbox space-between" style="height: 30%">
              <article class="flex7">${log_list}</article>
              </section>
              
              <footer class="type1"><a href="/manage/"><br>EMMaS 기자재 정보 관리 시스템</a></br>
              <a href="/manage/logout">로그아웃</a></footer>
              </body>`,
                '');
              response.send(html);
              }
            });
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
          <section class="hbox space-between" style="height: 30%">
            <article class="flex"><a href="/manage/board">요청 사항</a></article>
          </section>
          
          <footer class="type1"><a href="/manage"><br>EMMaS 기자재 정보 관리 시스템</a></br>
          <a href="/manage/logout">로그아웃</a></footer>
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
          var rank=results2[0]['user_RANK'];
            var i = 0;
            var list = 'settings';
            menu_list = template.create_menu(rank);
            var html = template.HTML(title, `<body class="vbox">
            <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
            <section class="main hbox space-between">
                <article class="flex6" >
                ${menu_list}
                </article>
            <article class="flex5">${list}</article></section>
            <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br>
            <a href="/manage/logout">로그아웃</a></footer></body>`,
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
                alert('처리중 입니다. 잠시 후 시도해주세요.');
                t=false;
            }else{

            }
        });
        if(t){
            var fs=require('fs');
            var data = `userNumber: ${i} equipNumber:${j} log : ${time}, ${case1} 에 대한 사용 기록입니다. \n특이사항 없음`;       
            fs.writeFile(filepath+filename, data,'utf8', function(err, data) { console.log(data); }); 
        }
        sql = `update emmas.equipment set eq_status='in_use' where eq_number=${j}`;
        db.query(sql,function(err,results,fileds){
          if(err){ console.log(err);
          alert('처리중 입니다. 잠시 후 시도해주세요.');}
          });
          t=true;
          response.redirect(`/manage/inform?id=${j}`);
      }else{
        request.flash('info', 'expired session');
        response.redirect('/auth/login');
      }
    });
    /*mgmt */
    router.get('/mgmt', function (request, response) {
      var _url = request.url;
      var queryData = url.parse(_url,true).query;
      var str_arr = queryData.id.split(':');
      console.log(str_arr);
      var title= '';
      if(auth.isOwner(request)==true){
        case1= "management";
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
                alert('처리중 입니다. 잠시 후 시도해주세요.');
            }else{
            console.log(str);
            }
        });
        if(t){
            var fs=require('fs');
            var data = `userNumber: ${i} equipNumber:${j} log : ${time}, ${case1} 에 대한 관리 기록입니다. \n ${msg1}`;       
            fs.writeFile(filepath+filename, data,'utf8', function(err, data) { console.log(data); }); 
            t=true;
        }
        sql = `update emmas.equipment set eq_status='management' where eq_number=${j}`;
        db.query(sql,function(err,results,fileds){
          if(err) {
            console.log(err);
            alert('처리중 입니다. 잠시 후 시도해주세요.');}
          });
        
        response.redirect(`/manage/table`);
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
              alert('처리중 입니다. 잠시 후 시도해주세요.');
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
          if(err) {
            console.log(err);
            alert('처리중 입니다. 잠시 후 시도해주세요.');
          }
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
          db.query(`select * from emmas.req_board as r left JOIN user as u ON  r.user_number=u.user_number order by edit_date DESC `, function(error,results,fields){
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
                list = list + `<tr><td>${t5}</td><td><a href="#" onclick="popup2('/manage/board/content?id=${t5}:${rank}');">${t1}</a></td>`+
                          `<td>${t2}</td><td>${t3}</td><td class="${answer}">${answer}</td></tr>`;  
                i = i + 1;
              }
              list = list+'</table><p><button class="btn1" style="font-size:medium;"><a href="/manage/create">요청사항 작성</a> </button></p>';
              menu_list = template.create_menu(rank);
              var html = template.HTML(title, `<body class="vbox">
              <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
              <section class="main hbox space-between">
                  <article class="flex6" >
                  ${menu_list}
                  </article>
              <article class="flex5">${list}</article></section>
              <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br>
              <a href="/manage/logout">로그아웃</a></footer></body>`,
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
      var _url = request.url;
      var queryData = url.parse(_url,true).query;
      var s_id = queryData.id.split(":");
    if(auth.isOwner(request)==true){
      db.query(`select * from emmas.req_board as r where r.id_board = ?`,[s_id[0]], function(error1,results1, fileds1){
        if(error1){
          throw error1;
        }
        var title=results1[0]['title'];
        var description = results1[0]['descript'];
        var id = results1[0]['id_board'];
        var edit_date = results1[0]['edit_date'];
        var Q_A = description.split("답변:");
        if(Q_A.length==2){
          var html=template.HTML(title,`<body class="vbox">
        <section class="main hbox space-between">
          <article class="flex"><a href="/manage/setting">제목 : ${title}</a></article>
        </section>
        <section class="hbox space-between" style="height: 45%">
        <article class="flex">작성 날짜 : ${edit_date}</article>
        <article class="flex">작성 내용 : ${Q_A[0]}</article>
        <article class="flex">답변 내용 : ${Q_A[1]}</article>
        <article class="flex"><p> <input class="btn1" type="button" value="취소" onclick="close_board();">
      </p></article>
        </section>
        `,'');
        }
        else{
          var btn1 ='';
          if(s_id[1]==4){
            btn1 =`<p>
            <textarea id="textarea" rows="5" cols="50" onKeyUp="keyup()"></textarea>
            </p>
            <p>
            <input class="btn1" type="button" value="답변" onclick="up_load('${id}','${description}');">
            <input class="btn1" type="button" value="취소" onclick="close_board();">
          </p>`;
          }
        var html=template.HTML(title,`<body class="vbox">
        <section class="main hbox space-between">
          <article class="flex">제목 : ${title}</article>
        </section>
        <section class="hbox space-between" style="height: 45%">
        <article class="flex">작성 날짜 : ${edit_date}</article>
        <article class="flex">작성 내용 : ${description}</article>
        <article class="flex">${btn1}</article>
        </section>
        `,'');
        }
        response.send(html);
      });

    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /*board_Question*/
  router.get('/create_process', function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var str_arr = queryData.id.split('-n');
    var t1 = str_arr[1].split(':');
    
    if(auth.isOwner(request)==true){
      var t = true;
      var time = new Date().toLocaleString();
      // insert into emmas.req_board (title,descript,edit_date,user_number,response_id)
      // values ('제목입니다.','내용입니다.','2020-06-08',4,null);
      sql = `insert into emmas.req_board (title,descript,edit_date,user_number,response_id)
      values ('${t1[0]}','${t1[1]}','${time}',${str_arr[0]},null);`;
      db.query(sql,function(err,results,fileds){
        if(err) console.log(err);
        });
      response.header(200);
      response.send('<script type="text/javascript">alert("요청되었습니다.");self.close();</script>');
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  /*board_answer*/
  router.get('/create_b', function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var str_arr = queryData.id.split('-n');
    
    if(auth.isOwner(request)==true){
      var t = true;
      sql = `update emmas.req_board set descript='${str_arr[1]}' where id_board=${str_arr[0]}`;
      db.query(sql,function(err,results,fileds){
        if(err) console.log(err);
        });
      sql = `update emmas.req_board set response_id=1 where id_board=${str_arr[0]}`;
      db.query(sql,function(err,results,fileds){
          if(err) console.log(err);
          });
      response.header(200);
      response.send('<script type="text/javascript">alert("답변을 완료하였습니다.");self.close();</script>');
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
      db.query(`select * from emmas.user where user_number=(select user_number from emmas.signin where id='${request.user}');`, function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_RANK'];
          var i = 0;
          // var list = `<form action="/manage/create_process" method="post">
          var list = `<form>
          <p style="color:white"> 요청사항 </p>
          <p><input type="text" id="title" size="45" placeholder="title"></p>
          <p style="color:white"> 내용 </p>
          <p>
            <textarea id="textarea" rows="15" cols="50" onKeyUp="keyup()"></textarea>
          </p>
          <p>
            <input class="btn1" type="button" value="요청" onclick="up_load2('${results2[0]['user_number']}');"><input class="btn1" type="button" value="취소" onclick="back_board();">
          </p>
        </form>`;
          menu_list = template.create_menu(rank);
          var html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <section class="main hbox space-between">
              <article class="flex6" >
              ${menu_list}
              </article>
          <article class="flex5">${list}</article></section>
          <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br>
          <a href="/manage/logout">로그아웃</a></footer></body>`,
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
      db.query(`select * from emmas.user where user_number=(select user_number from emmas.signin where id=?);`,[request.user], function(error2,results2,fields2){
        if(error2){
          throw error2;
        }else{
          var rank=results2[0]['user_RANK'];
          var i = 0;
//           // var list = `<form action="/manage/create_process" method="post">
//           insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
// values ('opertation',0,'in_use','2020-06-03','Super','IP:220.68.27.255, 로그파일 기록용','CVML 연구실','computer','Test_Se_LOG');
          var list = `<div class="box1"><form action="/manage/regist_process" method="post">
          <table class="txc-table">
          <tr>
          <td> 기자재 타입 </td>
          <td><input type="text" id="type" value="opertation"></td></tr><tr> 
          <td> 기자재명 </td>
          <td><input type="text" id="name" value="테스트 기자재"></td></tr><tr>
          <td> 기자재 등급 </td>
          <td><input type="text" id="ranki" value="3"></td></tr><tr>
          <td> 제조사 </td>
          <td><input type="text" id="manu" value="삼성"></td></tr><tr>
          <td> 비고 </td>
          <td><input type="text" id="note" value="테스트용으로 생성"></td></tr><tr>
          <td> 장소 </td>
          <td><input type="text" id="locat" value="디지털정보관 151-101호실"></td></tr><tr>
          <td> 분류 </td>
          <td><input type="text" id="cate" value="computer"></td></tr>
          <tr><td>&nbsp; </td><td> </td></tr>
          <tr><td colspan="2"><input class="btn1" type="button" value="제출" onclick="up_load3(${results2[0]['user_number']});">
          &nbsp;<input class ="btn1" type="button" value="취소" onclick="back_board();"></div></td></tr></table>
        </form></div>`;
          menu_list = template.create_menu(rank);
          var html = template.HTML(title, `<body class="vbox">
          <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
          <section class="main hbox space-between">
              <article class="flex6" >
              ${menu_list}
              </article>
          <article class="flex3">${list}</article></section>
          <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br><a href="/manage/logout">로그아웃</a></footer></body>`,
          '');
          response.send(html);
          }
      });
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
  });
  router.get('/regist_process', function (request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    
    if(auth.isOwner(request)==true){
      var str = queryData.id.split(':');
      var time = new Date().toLocaleString();
      // console.log(str1);
      sql = `insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) `+
         `values ('${str[1]}',${str[2]},'available','${time}','${str[3]}','${str[4]}','${str[5]}','${str[6]}','${str[7]}');`;
      db.query(sql,function(err,results,fields){
        if(err) throw err;
      });
      response.redirect('/manage/table');
    }else{
      request.flash('info', 'expired session');
      response.redirect('/auth/login');
    }
});


  /* table  */
  router.get('/table', function (request, response) {
    var title = 'manage';
    var list = '';
    var menu_list='';
    
    
    if(auth.isOwner(request)==true){
        db.query('SELECT * from equipment order by eq_status', function(error1,results1,fields1){
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
                list = template.create_table2(results1,rank);
                menu_list = template.create_menu(rank);
                // console.log(results1);
                var html = template.HTML(title, `<body class="vbox">
                <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
                <section class="main hbox space-between">
                    <article class="flex6">
                    ${menu_list}
                    </article>
                <article class="flex4"><form class="form1"><select id="srch1">
                <option value="등급">등급</option>
                <option value="상태">상태</option>
                <option value="장소">장소</option>
                <option value="종류">종류</option>
                <option value="이름">이름</option>
                </select>&nbsp;`+
                `<input type="text" name="name" id="search" onkeydown="Enter_Check()";>
                <input type="text" style="display: none;" />
                <input type="button" onclick="search_s()" value="검색"></form>
                ${list}</article></section>
                <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br><a href="/manage/logout">로그아웃</a></footer></body>`,
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

  router.get('/table_c', function (request, response) {
    var title = 'manage';
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    if(queryData.name){
      
    }
    var list = '';
    var menu_list='';
    var str = queryData.id.split(':');
    
    if(auth.isOwner(request)==true){
      if(!str[1]){
        db.query('SELECT * from equipment order by eq_status', function(error1,results1,fields1){
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
                list = template.create_table2(results1,rank);
                menu_list = template.create_menu(rank);
                // console.log(results1);
                var html = template.HTML(title, `<body class="vbox">
                <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
                <section class="main hbox space-between">
                    <article class="flex6">
                    ${menu_list}
                    </article>
                <article class="flex4">
                <form class="form1"><select id="srch1">
                    <option value="등급">등급</option>
                    <option value="상태">상태</option>
                    <option value="장소">장소</option>
                    <option value="종류">종류</option>
                    <option value="이름">이름</option>
                    </select>&nbsp;
                    <script >
                    var cond = document.getElementById('srch1');
                    for(var j=0;j<cond.length;j++){
                      if(cond[j].value=='${str[0]}'){
                        cond[j].selected=true;
                      }else{
                        cond[j].selected=false;
                      }
                    }
                    </script>
                    <input type="text" name="name" id="search" onkeydown="Enter_Check()";>
                    <input type="text" style="display: none;" />
                    <input type="button" onclick="search_s()" value="검색"></form> 
                ${list}</article></section>
                <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br><a href="/manage/logout">로그아웃</a></footer></body>`,
                '');
                response.send(html);
                }
            });
          }
          });
      }else{
        var condition = str[0];
        switch(condition){
          case '등급':
            condition='eq_RANK';
            break;
          case '상태':
            condition='eq_status';
            break;
          case '장소':
            condition='location';
            break;
          case '종류':
            condition='categori';
            break;
          default:
            condition='eq_name';
            break;
        }
        db.query(`SELECT * from equipment where ${condition} like '%${str[1]}%' order by eq_status`, function(error1,results1,fields1){
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
                list = template.create_table2(results1,rank);
                menu_list = template.create_menu(rank);
                // console.log(results1);
                var html = template.HTML(title, `<body class="vbox">
                <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
                <section class="main hbox space-between">
                    <article class="flex6">
                    ${menu_list}
                    </article>
                <article class="flex4">
                <form class="form1"><select id="srch1">
                    <option value="등급">등급</option>
                    <option value="상태">상태</option>
                    <option value="장소">장소</option>
                    <option value="종류">종류</option>
                    <option value="이름">이름</option>
                    </select>&nbsp;`+
                    `<script >
                    var cond = document.getElementById('srch1');
                    for(var j=0;j<cond.length;j++){
                      if(cond[j].value=='${str[0]}'){
                        cond[j].selected=true;
                      }else{
                        cond[j].selected=false;
                      }
                    }
                    </script>
                    <input type="text" name="name" id="search" onkeydown="Enter_Check()";>
                    <input type="button" onclick="search_s()" value="검색">
                    <input type="text" style="display: none;" />
                    </form>
                    
                ${list}</article></section>
                <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br><a href="/manage/logout">로그아웃</a></footer></body>`,
                '');
                response.send(html);
                }
            });
          }
          });
      }
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
                var rank=results2[0]['user_RANK'];
                // console.log(rank);
                list = template.create_table(results1,rank);
                menu_list = template.create_menu(rank);
                infm = template.create_infm(results1,results2,results3);
                // console.log(results1);
                var html = template.HTML(title, `<body class="vbox">
                <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
                <section class="main hbox space-between">
                    <article class="flex6" >
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
                <footer class="type1"><a href="/manage">EMMaS 기자재 정보 관리 시스템</a></br><a href="/manage/logout">로그아웃</a></footer></body>`,
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
          var rank=results2[0]['user_RANK'];
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