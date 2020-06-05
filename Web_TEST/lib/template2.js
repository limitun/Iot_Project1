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
      }tmpt+=`<td><a href="/">상세정보</a></td></tr>`;//수정 하이퍼링크
      i=i+1;
    }tmpt= tmpt+'</table>';
    return tmpt;
  },create_menu:function(rank){
    var i=0;
    var tmpt='<div class="nav_menu">';
    if(rank>=4){
      tmpt=tmpt+'<li><a href="/manage/table">기자재 조회</a></li><hr>'
      +'<li><a href="/manage/board">요청사항</a></li><hr>'
      +'<li><a href="/manage/qrcode">QR코드생성</a></li><hr>'
      +'<li><a href="/">한 눈에 보기</a></li><hr></ul>'
      +'<li><a href="/manage/setting">환경설정</a></li><hr>';
    }else{
      tmpt=tmpt+'<li><a href="/manage/table">사용 및 대여</a></li><hr>'
      +'<li><a href="/manage/board">요청사항</a></li><hr>'
      +'<li><a href="/manage/setting">환경설정</a></li><hr></ul>';
    }
    return tmpt;
  }
}
