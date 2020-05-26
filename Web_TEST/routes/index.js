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
  var html = template.HTML(title,
      '','/auth/login'
  );
  response.send(html);
});

module.exports = router;