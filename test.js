
// const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
// const {LoggingBunyan} = require('@google-cloud/logging-bunyan');

const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');


const test = () => {
    const appName = 'ies-mobile';
    let logger;
    const loggingWinston = new LoggingWinston({
        prefix: appName,
        serviceContext: {
            service: appName, // required to report logged errors
            // to the Google Cloud Error Reporting
            // console
            version: '0.1',
        }
    });

    logger = winston.createLogger({
        level: 'info',
        transports: [
            new winston.transports.Console(),
            // Add Stackdriver Logging
            loggingWinston,
        ],
    });
    logger.info('GCP_LOGGER!!!')
}

test()
