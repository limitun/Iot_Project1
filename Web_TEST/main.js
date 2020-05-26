var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
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
  saveUninitialized: true,
  store: new FileStore()
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
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(80, function () {
  console.log('Example app listening on port 3000!')
});


/*pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon*/