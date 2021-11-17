const winston = require('winston');
const { format } = require('winston');
const { combine, colorize, prettyPrint, printf } = format;
require('express-async-errors');

module.exports = function () {
    const myFormat = printf(({ level, message }) => {
        return `${level} : ${message}`;
    });
    const myExcFormat = printf(({ level, message }) => {
        return `${level} : ${message}`;
    });
    winston.exceptions.handle(
        new winston.transports.Console({
            format: combine(
                colorize({
                    level: true,
                    message: true
                }),
                prettyPrint({ colorize: true }),
                myFormat
            )
        }),
        new winston.transports.File({
            filename: 'uncaughtExceptions.log',
            format: combine(
                colorize({
                    level: true,
                    message: true,
                    colors:{ info: 'blue', error: 'red' }
                }),
                prettyPrint({ colorize: true })),
                myExcFormat
        })
    );

    process.on('unhandledRejection', ex => {
        throw ex;
    });

    winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'error' }));
    winston.add(new winston.transports.Console({
        level: 'debug',
        format: combine(
            colorize({
                level: true,
                message: true
            }),
            prettyPrint({ colorize: true }),
            myFormat
        )
    }));
}