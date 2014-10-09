var yaml = require('js-yaml');
var fs = require('fs');
var dateFormat = require('dateformat');

var holidaysByCountry = loadHolidaysData();

function loadHolidaysData() {
  console.log('Loading holiday data from YAML files ...')

  var byCountry = {};
  var yamlFiles = fs.readdirSync('data');
  yamlFiles.forEach(function(filename) {
    if (filename.match(/.*\.yaml$/)) {
      var country = filename.replace('.yaml', '');
      var holidays = yaml.load(fs.readFileSync('data/' + filename));
      console.log('Loaded ' + Object.keys(holidays).length + ' holidays from ' + filename);
      byCountry[country] = holidays;
    }
  });
 
  return byCountry;
}

exports.checkDate = function(country, date) {
  var dateStr = dateFormat(date, 'yyyy/mm/dd');
  var saturday = (date.getDay() == 6);
  var sunday = (date.getDay() == 0);
  var weekend = saturday || sunday;
  var holidays = holidaysByCountry[country];
  if (holidays) {
    var holidayName = holidays[dateStr];
  } 
  var workday = !weekend && !holidayName;
  return { 
    date: dateStr,
    saturday: saturday, 
    sunday: sunday, 
    weekend: weekend,
    holiday: !!holidayName,
    name: holidayName,
    workday: workday
  };
};

