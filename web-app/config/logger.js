var winston = require('winston');
var path = require('path');

var logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(),winston.format.simple())
        }),
        new winston.transports.File({filename: 'link.log'})
        ]
});

module.exports = logger;


module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

/*logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};*/