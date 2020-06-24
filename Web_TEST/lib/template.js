module.exports = {
  HTML:function(title, body,domain){
    return `
    <!doctype html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style></style>
      <link type="text/css" rel="stylesheet" href="../css/idx.css">
      <script type="text/javascript" src="../js/func.js"></script>
      <title>EMMas</title>
      <meta charset="utf-8">
    </head>
    <body>
      <div class="all">
      <hr><hr>
        <h1 class="type1"><a href="${domain}">EMMaS 기자재 정보 관리 시스템</a></h1>
        <hr>
  
        <hr>
        ${body}
      </div>
    </body>
    </html>
    `;
  }
}
