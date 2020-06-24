
function back_board(){
    window.history.back();
}
function up_load(id,msg){
    var str=document.getElementById("textarea").value;
    var url = "http://vision20.ga/manage/create_b?id="+id+"-n"+msg+"re: 답변:"+str;
    location.href=url;
}
function up_load2(id){
    var str=document.getElementById("textarea").value;
    var title=document.getElementById("title").value;
    var option = "width = 600, height = 300, top = 100, left = 200, location = no";
    var url = "http://vision20.ga/manage/create_process?id="+id+"-n"+title+":"+str;
    alert('요청되었습니다.');
    window.open(url,name,option).self.close();
    location.href="http://vision20.ga/manage/board";
}
function up_load3(id){//type,name,ranki,manu,note,locat,cate
    var str1=document.getElementById("type").value;
    var str2=document.getElementById("ranki").value;
    var str3=document.getElementById("manu").value;
    var str4=document.getElementById("note").value;
    var str5=document.getElementById("locat").value;
    var str6=document.getElementById("cate").value;
    var str7=document.getElementById("name").value;
    var option = "width = 600, height = 300, top = 100, left = 200, location = no";
    var name = "regist_eq";
    var url = "http://vision20.ga/manage/regist_process?id="+id+":"+str1+":"+str2+":"+str3+":"+str4+":"+str5+":"+str6+":"+str7;
    alert('등록되었습니다.');
    
    window.open(url,name,option).self.close();
    location.href="http://vision20.ga/manage/table";
}
function close_board(){
    window.close();
}
function keyup(){
    var str;
    var length;
    str=document.getElementById("textarea").value;
    if(document.getElementById("textarea").value.length>=100){
    alert("최대 100자 이내로 작성해주세요.");
    cleartext();
    }
}
function popup2(url){
    var name = "Equipment Board";
    var option = "width = 600, height = 300, top = 100, left = 200, location = no"
    window.open(url, name, option);
}
function popup(lg_filename){
    var url = "http://vision20.ga/manage/inform/log?id="+lg_filename;
    var name = "Equipment log";
    var option = "width = 700, height = 300, top = 100, left = 200, location = no"
    window.open(url, name, option);
}
function uses(user_number,eq_number){
    var url = "http://vision20.ga/manage/uses?id="+user_number+":"+eq_number;
    var option = "width = 500, height = 300, location=no";
    var name="uses";
    window.open(url,name,option).self.close();;
    alert('사용을 시작합니다.');
    location.reload(true);
}
function rtrn(user_number,eq_number){
    var msg = document.getElementById("textarea").value;
    var url = "http://vision20.ga/manage/rtrn?id="+user_number+":"+eq_number+":"+msg;
    var option = "width = 500, height = 300, location=no";
    var name="rtrn";
    window.open(url,name,option).self.close();
    alert('반납하였습니다.');
    location.reload(true);
}
function mgmt(user_number,eq_number){
    var msg = document.getElementById("textarea").value;
    var url = "http://vision20.ga/manage/mgmt?id="+user_number+":"+eq_number+":"+msg;
    var option = "width = 500, height = 300, location=no";
    var name="mgmt";
    window.open(url,name,option).self.close();
    alert('기록하였습니다.');
    location.reload(true);
}
function gen_qr(str,size){
    var googleqr = "http://chart.apis.google.com/chart?cht=qr&chs="+size+"&choe=UTF-8&chid=H10"
    var text = "http://vision20.ga/manage/inform?id="+str;
    if(str=='pass'){
    var time = new Date().toLocaleString();
    var rand2 = Math.floor(Math.random() * 100);
    time= time+'/'+rand2;
    text="http://vision20.ga/auth/login_access2?id="+time;
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
