var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
// 全局方法
require('./middleware/global/global');
// 路由
var HomeRouter = require('./routes/index');  // 首页
var WechatyRouter = require('./routes/wechaty.js');  // wechaty
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',ejs.renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCors);//使用跨域中间件
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', HomeRouter);
app.use('/wechaty', WechatyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.header('Content-Type', 'text/html;charset=utf-8');
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;