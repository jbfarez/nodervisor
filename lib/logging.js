/*
 * Logging module for nodervisor
 * initiate a custom logger
*/

var fs = require('fs');
var winston = require('winston');

var settings = JSON.parse(fs.readFileSync('../config/logging.json', encoding="ascii"));
var logFile = fs.readFileSync(settings.logFile);

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: logFile })
  ]
});

