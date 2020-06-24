var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
 
router.get('/', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  var title = '';
  var description = '';
  if(auth.isOwner(request)==true){
    response.redirect('/manage');
  }else{
    if(fmsg.info){
      var html = template.HTML(title,
        '<script type="text/javascript">alert("만료된 세션입니다.\n다시 로그인하십시오.");</script>','/auth/login');
      response.send(html);  
    }else{
      var html = template.HTML(title,
        '','/auth/login');
      response.send(html);
    }
  }
});

module.exports = router;