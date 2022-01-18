const winston = require('winston');
const { combine, timestamp, prettyPrint, colorize, errors, printf, label} = winston.format;
const { LoggingWinston } = require("@google-cloud/logging-winston");

const logger = (filename) => {
    const myFormat = printf(info => {
        if(info instanceof Error) {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${info.stack}`;
        }
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    });

    const logger = winston.createLogger({
        level: 'info',
        format: combine(
            winston.format.splat(),
            label({ label: filename}),
            timestamp(),
            myFormat,
        ),
        // defaultMeta: { service: 'user-service' },
        transports: [
        ]
    });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
    if (process.env.NODE_ENV === 'production') {
        logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
        logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
        logger.add( new LoggingWinston({
            serviceContext: {
                service: 'ies-integration', // required to report logged errors
                // to the Google Cloud Error Reporting
                // console
                version: '0.01'
            },
            // should truncate logs to match quotas: https://github.com/googleapis/nodejs-logging-winston/issues/190
            maxEntrySize: 250000, // see: https://cloud.google.com/logging/quotas
        }));
    } else {
        logger.add(new winston.transports.Console());
    }

    return logger
};

logger().info('GCP_LOGGER_1')
