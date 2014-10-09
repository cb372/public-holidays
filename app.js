var express = require('express');
var service = require('./service.js');
var app = express();

var router = express.Router();

function badRequest(res, message) {
  res.writeHead(400, message, {'content-type' : 'text/plain'});
  res.end(message);
}

// Register routes
router.get('/:country/today', function(req, res) {
  res.json(service.checkDate(req.params.country, new Date()));
});

router.get('/:country/yesterday', function(req, res) {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  res.json(service.checkDate(req.params.country, date));
});

router.get('/:country/tomorrow', function(req, res) {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  res.json(service.checkDate(req.params.country, date));
});

router.get('/:country/:year/:month/:day', function(req, res) {
  var date = new Date(req.params.year, req.params.month - 1, req.params.day);
  res.json(service.checkDate(req.params.country, date));
});

router.get('/', function(req, res) {
  var routes = router.stack.map(function(o){return o.route.path});
  var countries = service.listCountries();
  res.json({routes: routes, countries: countries});
});

// Param validation
router.param('year', function(req, res, next, year) {
  if (year.match(/\d{4}/)) {
    req.year = year;
    next();
  } else {
    badRequest(res, 'Invalid year: ' + year);
  }
});

router.param('month', function(req, res, next, month) {
  if (month.match(/\d{1,2}/) && month >= 1 && month <= 12) {
    req.month = month;
    next();
  } else {
    badRequest(res, 'Invalid month: ' + month);
  }
});

router.param('day', function(req, res, next, day) {
  if (day.match(/\d{1,2}/) && day >= 1 && day <= 31) {
    req.day = day;
    next();
  } else {
    badRequest(res, 'Invalid day: ' + day);
  }
});

app.use('/', router);

var server = app.listen((process.env.PORT || 3000), function() {
  console.log('Listening on port %d', server.address().port);
});
