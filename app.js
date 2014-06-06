var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var io = require('socket.io');
var gpsclient = require('./gpsclient');
var _ = require('underscore');

var routes = require('./routes/index');
var map = require('./routes/map');

var app = express();
var clients = [];

app.set('port', process.env.PORT || 5000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/map', map);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = http.createServer(app);

var sioserver = io.listen(server);

sioserver.on('connection', function(socket) {
  console.log('connection from ' + socket.id);
  clients.push(socket.id);
});

sioserver.on('disconnect', function(socket) {
  console.log(socket.id + ' disconnected');
  clients.splice(indexOf(socket.id), 1);
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

gpsclient.start(function(data) {
  console.log(data);

  if (clients.length) {
    console.log('broadcast to ' + clients);
    sioserver.sockets.emit('tpv', { lat: data.lat, lon: data.lon });
  }
});

module.exports = app;
