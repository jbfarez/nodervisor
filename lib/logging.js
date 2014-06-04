/*
 * Logging module for nodervisor
 * initiate a custom logger
*/

var fs = require('fs');
var winston = require('winston');

var settings = JSON.parse(fs.readFileSync('./config/logging.json', encoding="ascii"));

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
        'timestamp': function() {return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');}
    })/*,
    new (winston.transports.File)({ 
        filename: settings.logFile 
        'timestamp': function() {return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');}
    })*/
  ]
});

exports.logger = logger;
