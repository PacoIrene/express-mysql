var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : '127.0.0.1',
  port: '3306',
  user : 'root',
  password: 'root',
  database: 'apk'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

/**
 * GET /apks/:id
 * Returns detailed character information.
 */
app.get('/apks/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = 'SELECT * FROM apk WHERE id = ?';
  connection.query(sql, [id], function (error, results, fields) {
            if (error) return next(error);

            if (!results) {
              return res.status(404).send({ message: 'Apk not found.' });
            }

            res.send(results);
    });
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

