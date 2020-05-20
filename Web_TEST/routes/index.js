var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
 
router.get('/', function(request, response) { 
    var title = 'EMMaS';
    var description = 'EMMAS 테스트중입니다.';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      `,
      `<a href="/topic/create">create</a>`
    ); 
    response.send(html);
  });
   
  module.exports = router;