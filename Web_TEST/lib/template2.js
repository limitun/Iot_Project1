module.exports = {
  HTML:function(title, body,msg){
    return `
    <!doctype html>
    <html>
    <head>
      <style></style>
      <link type="text/css" rel="stylesheet" href="../css/idx2.css">
      <title>EMMas</title>
      <meta charset="utf-8">
    </head>
    <body class="vbox">
        <header><h1 class="type1"><a href="/manage/">EMMaS 기자재 정보 관리 시스템</a></h1></header>
        <section class="main hbox space-between">
          <article class="flex">flex</article>
          <article class="flex">flex</article>
        </section>
        <section class="hbox space-between" style="height: 40%">
          <article class="flex">flex</article>
          <article class="flex">flex</article>
        </section>
        
        ${body}
        
        <footer class="type1"><a href="/manage/logout">EMMaS 기자재 정보 관리 시스템</a></footer>
    </body>
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
  }
}
