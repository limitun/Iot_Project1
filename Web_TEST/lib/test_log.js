var db=require('../lib/db');
// var fs = require('fs');
var template = require('../lib/template2.js');
var auth = require('../lib/auth.js');
var url = require('url');
var qs = require('querystring');

// insert into emmas.log (log_date, user_user_number,equipment_eq_number, log_case, log_file)
// values ('2020-06-15', 5, 9, 'management', 'log_test5.log');
var sql = "";
var case1 = "";
var case_arr=["end_of_use","return","management","rent","start_use"];


for(var j=1;j<28;j++){
    var i=Math.floor(Math.random() * 15);
    var time = new Date().toLocaleString();
    var time2 = new Date(time2+5*1000*60*60*24).toLocaleString();
    // case1=case_arr[i%5];
    //case :  disposal, end_of_use, management, registration, rent, return, start_use  
    case1= "start_use";
    var filepath="../log/";
    var str = time.replace(/:/gi,'_');
    var t = true;
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
        var data = `log : ${time2}, ${case1} 에 대한 사용 기록입니다. 특이사항 없음`;       
        fs.writeFile(filepath+filename, data,'utf8', function(err, data) { console.log(data); }); 
    }
}
// }



