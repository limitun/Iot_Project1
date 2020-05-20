module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
    <style></style>
      <title>EMMas</title>
      <meta charset="utf-8">
      <link type="text/css" rel="stylesheet" href="../css/idx.css">
    </head>
    <body>
      <h1 class="type1"><a href="/">EMMaS 기자재 정보 관리 시스템</a></h1>
      
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
