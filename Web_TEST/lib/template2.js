module.exports = {
  HTML:function(title, body,msg){
    return `
    <!doctype html>
    <html>
    <head>
      <style></style>
      <link type="text/css" rel="stylesheet" href="../css/idx2.css">
      <script type="text/javascript">
        function back_board(){
          window.history.back();
        }
        var str;
        var length;
        str=document.getElementById("textarea2").value;
        function keyup(){
          if(document.getElementById("textarea").value.length>=100){
            alert("최대 100자 이내로 작성해주세요.");
            cleartext();
          }
        }
        function gen_qr(str,size){
          var googleqr = "http://chart.apis.google.com/chart?cht=qr&chs="+size+"&choe=UTF-8&chid=H10"
          var text = "http://vision20.ga/manage/inform?id="+str;
          if(str=='pass'){
            var time = new Date().toLocaleString();
            var rand2 = Math.floor(Math.random() * 100);
            time= time+'/'+rand2;
            text="http://vision20.ga/login_access?id="+time;
          }
          if(text!=""){
          var qrchl = googleqr+"&chl="+encodeURIComponent(text);
          var imgtag = document.createElement("img");
          var br = document.createElement("br");
          imgtag.setAttribute("id","qrcodeimg");
          imgtag.setAttribute("src",qrchl);
          imgtag.setAttribute("style","display:inline-block;");
          document.getElementById("qr_result").removeChild(document.getElementById("qrcodeimg"));
          document.getElementById("qr_result").appendChild(imgtag);
          document.getElementById("qqr").value="출입 QR 코드 새로고침";
          }else{
              alert("생성할 정보가 없습니다.");
          }
        }
        
      </script>
      <title>EMMas</title>
      <meta charset="utf-8">
    </head>
    ${body}
    </html>
    `;
  },list:function(flist){
    var list = '<ul>';
    var i = 0;
    while(i<flist.length){
      list=list+`<li><a href="/?id=${flist[i].eq_name}">${flist[i].eq_name}</a></li>`;
      i=i+1;
    }list= list+'</ul>';
    return list;
  },create_table:function(list,rank){
    var i=0;
    var tmpt = `<table class="check" border="1" collapse:"true"><tr><th>기자재 번호</th><th>분류</th><th>등급</th>
    <th>상태</th><th>제조사</th><th>장소</th><th>종류</th>,<th>기자재명</th>
    <th>링크</th></tr>`;
    if(rank==-1){
      tmpt=tmpt+'</table><p class="notice">현재 사용 불가능한 ID입니다.</p>';
      return tmpt; 
    }
    while(i<list.length){
      tmpt=tmpt+'<tr>'
      var stat='';  //상태 관리 조건문
      var tmp1=list[i]['eq_status'];
      var tmp2=list[i]['eq_RANK'];
      var tmp3 = list[i]['eq_number'];
      // console.log(rank,tmp2);
      if(rank<tmp2){
        i=i+1;
        continue;
      }
      if(tmp1=='in_use'){
        stat='in_use';
      }else if(tmp1=='available'){
        stat='avail';
      }else if(tmp1=='unavail'){
        stat='x';
      }else{
        stat='o';
      }
      for(var key in list[i]){
        if(key=='note'||key=='acquisition'){
          continue;
        }else{
          tmpt=tmpt+`<td class="${stat}">${list[i][key]}</td>`;
      }
      }tmpt+=`<td><a href="/manage/inform?id=${tmp3}">상세정보</a></td></tr>`;//수정 하이퍼링크
      i=i+1;
    }tmpt= tmpt+'</table>';
    return tmpt;
  },create_menu:function(rank){
    var i=0;
    var tmpt='<div class="nav_menu">';
    if(rank>=4){
      tmpt=tmpt+'<li><a href="/manage/table">기자재 조회</a></li><hr>'
      +'<li><a href="/manage/regist">기자재 등록</a></li><hr>'
      +'<li><a href="/manage/board">요청사항</a></li><hr>'
      // +'<li><a href="/manage/qrcode">QR코드생성</a></li><hr>'
      +'<li><a href="/">한 눈에 보기</a></li><hr></ul>'
      +'<li><a href="/manage/setting">환경설정</a></li><hr>';
    }else{
      tmpt=tmpt+'<li><a href="/manage/table">사용 및 대여</a></li><hr>'
      +'<li><a href="/manage/board">요청사항</a></li><hr>'
      +'<li><a href="/manage/setting">환경설정</a></li><hr></ul>';
    }
    return tmpt;
  },create_infm:function(list,rank,eq_log){
      var tmpt='<br>';
      var eq_rank = list[0]['eq_RANK'];
      var btn =true;
      if(rank<eq_rank){
        tmpt=tmpt+`<script> alert("접근 권한이 없습니다.");</script>`;
        return tmpt;
      }
      tmpt=tmpt+'<table id="detail" border="1" >'
            +`<caption>${list[0]['eq_name']} </caption>`;
      if(list[0]['eq_status']=='in_use'){
        tmpt=tmpt+`<tr><td>사용자</td><td>${list[0]['eq_name']}</td></tr>`;
        btn =false;
      }else{
        tmpt=tmpt+`<tr><td>사용자</td><td>없음</td></tr>`;
      }
            
      tmpt=tmpt  +`<tr><td rowspan="1">비고</td><td rowspan="1">${list[0]['note']}</td></tr>`;
      tmpt=tmpt  +`<tr><td rowspan="5">최근 기록</td>`;
      if(eq_log.length==0){
        tmpt=tmpt+`<td>최근 기록 없음</td></tr>`;
      }
      for(var i=0;i<eq_log.length;i++){ //b!!!!!!!!파일 열어서 내용 써주기
        
        tmpt=tmpt+`<td>${eq_log[i]['log_file']}</td></tr>`;
      }
      tmpt=tmpt+'</table>';
      if(rank>=4){
        tmpt=tmpt+`<input type="button" value="QR 생성" onclick="gen_qr(${list[0]['eq_number']},200);">`
        +'<div id="qr_result"><br><img id="qrcodeimg" style="display:none;"></div>';
      }
      tmpt=tmpt+'</article>';

      
      if(rank>=4){
        //관리자 버튼 ( 관리, 정보 수정)
          tmpt=tmpt+`<article="flex1"><form>
          <p>
            <textarea id="textarea" rows="5" cols="50" onKeyUp="keyup()" placeholder="관리 내역을 작성하여 주십시오."></textarea>
          </p>
          <p>
            <input type="button" value="관리 기록" onclick="submit();">
            
            <input type="button" value="취소" onclick="back_board();">
          </p>
          </form></article>
          <script type="text/javascript">
          
          </script>`;

        }else{
          //사용자 버튼 ( 사용, 반납 --> 본인일 때)
          // <p>
          //   <textarea id="textarea" rows="5" cols="50" onKeyUp="keyup()"></textarea>
          // </p>
          if(btn){
          tmpt=tmpt+`<article="flex1"><form>
          <p>
            <input type="button" value="사용" onclick="submit">
            <input type="button" value="취소" onclick="back_board();">
          </p>
          </form></article>`;
          }else{ //in_use 상태
          tmpt=tmpt+`<article="flex1"><form>
          <p>
            <input type="button" value="취소" onclick="back_board();">
          </p>
        </form></article>`;
        }
      }
    return tmpt;
  },create_profile: function(list){
    var tmpt='<table class="profile">';
    // console.log(list[0]['user_number']);
    var expd ='jpg';
    if(list[0]['user_RANK']==4){
      expd='gif';
    }
    // console.log(expd);
    tmpt=tmpt+`<caption>사용자 프로필</caption>`
    +`<tr><td rowspan="3" id="img"><img src="../pic/${list[0]['user_number']}.${expd}" width="100" height="110" alt="이미지를 등록하세요"></td><td>사용자명   : ${list[0]['userName']}</td></tr>`
    +`<tr><td>등급 : ${list[0]['user_RANK']}</td></tr>`;
    var stat = list[0]['status'];
    var stat2 ='';
    if(stat =='normal'){
      stat2='사용 가능';
    }else if(stat=='sanctioned'){
      stat2='제재된 ID';
    }else if(stat=='wating_ap'){
      stat2='승인 대기중';
    }else if(stat=='in_use'){
      stat2='사용 중';
    }
    tmpt=tmpt+`<tr><td>상태 : ${stat2}</td></tr>`;
    tmpt=tmpt+`</table>`; 
    return tmpt;
  },create_qr: function(list){
    var rank = list[0]['user_RANK'];
    var stat = list[0]['status'];
    var tmpt=`<div id="qr_result">`;
    if(rank>-1){
      if(stat=='sanctioned'){
        tmpt=tmpt+`<p class="notice">사용 불가한 기능입니다.</p>`;
      }else{
        tmpt=tmpt+`<input type="button" id="qqr" value="출입 QR 코드 생성" onclick="gen_qr('pass',120);"><br>`;
      }
    }else{
      tmpt=tmpt+`<p class="notice">사용 불가한 기능입니다.</p>`;
    }
      
    tmpt=tmpt+`<img id="qrcodeimg" style="display:none;"></div>`;
    

    return tmpt;
  }
}
