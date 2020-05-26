module.exports = {
  HTML:function(title, body){
    return `
    <!doctype html>
    <html>
    <head>
      <style></style>
      <link type="text/css" rel="stylesheet" href="../css/idx2.css">
      <title>EMMas</title>
      <meta charset="utf-8">
    </head>
    <body>
      <div class="all">
      <hr><hr>
        <h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1>
        <hr>
        
        <hr>
        ${body}
      </div>
    </body>
    </html>
    `;
  }
}
