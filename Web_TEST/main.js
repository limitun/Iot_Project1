var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
app.use(helmet.xssFilter());
app.disable("x-powered-by");
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');
var db = require('./lib/db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  store: new FileStore(),
  saveUninitialized: true
}))
app.use(flash());

var passport = require('./lib/passport')(app);

app.get('*', function (request, response, next) {
  next();
});
var indexRouter = require('./routes/index');
var manageRouter = require('./routes/manage')(passport);
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/manage', manageRouter);

app.use(function (req, res, next) {
  res.status(404).send('지정된 페이지를 찾을 수 없습니다.');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(80, function () {
  console.log('application listening on port 80!')
});

app.disable("x-powered-by");
/*pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon*/