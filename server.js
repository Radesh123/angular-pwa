var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')
var compression = require('compression');
var httpsRedirect = require("express-https-redirect");

app.use(compression());
app.use("/", httpsRedirect());
app.use(express.static(path.join(__dirname, './dist/vidyavahini')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/vidyavahini/index.html'));
});

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


/// app runs in port
app.listen(process.env.PORT || 8080, function () {
  console.log('listening at 8080');
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, DELETE, PUT"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});