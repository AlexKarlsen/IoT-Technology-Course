var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mqttHandler = require('./mqttHandler');
var cors = require('cors');

//Bind connection to error event (to get notification of connection errors)
const deviceRoutes = require('./api/routes/deviceRoutes');
const serviceRoutes = require('./api/routes/serviceRoutes');
const telemetryRoutes = require('./api/routes/telemetryRoutes');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
app.use('/api', deviceRoutes);
app.use('/api', serviceRoutes);
app.use('/api', telemetryRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var mqttClient = mqttHandler.getInstance();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
