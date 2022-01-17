
// const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
// const {LoggingBunyan} = require('@google-cloud/logging-bunyan');

const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');


const UNKNOWN = 'unknown'

// Creates a Bunyan Cloud Logging client
// const loggingBunyan = new LoggingBunyan();
const parseIp = (req) =>
	req.headers['x-forwarded-for'] ?
		req.headers['x-forwarded-for'].split(',').shift() :
		req.socket ?
			req.socket.remoteAddress :
			UNKNOWN;

const loggerView = async (req, res) => {
	try {
		const {messages} = req.body;
		const appName = req.headers['authorization'];
		let logger;
		if (process.env.NODE_ENV === 'production') {
			// logger = bunyan.createLogger({
			// 	// The JSON payload of the log as it appears in Cloud Logging
			// 	// will contain "name": "my-service"
			// 	name: appName,
			// 	clientIp: parseIp(req),
			// 	userAgent: req.headers['user-agent'] || UNKNOWN,
			// 	clientInfo: req.headers['client-info']  || UNKNOWN,
			// 	streams: [
			// 		// Log to the console at 'info' and above
			// 		{stream: process.stdout, level: 'info'},
			// 		// And log to Cloud Logging, logging at 'info' and above
			// 		loggingBunyan.stream('info'),
			// 	],
			// });
			const loggingWinston = new LoggingWinston({
				prefix: appName,
				labels: {
					clientIp: parseIp(req),
					userAgent: req.headers['user-agent'] || UNKNOWN,
					clientInfo: req.headers['client-info']  || UNKNOWN,
				},
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
		} else {
			logger = console;
		}

		messages.filter(({type}) => !!type).forEach(({message, type}) => {
			if (type === 'error') {
				try {
					throw Error(JSON.stringify(message))
				} catch (e) {
					logger.error(e)
				}
			} else {
				logger[type](JSON.stringify(message))
			}
		})

		res.sendStatus(200);
	} catch (e) {
		res.statusCode = 502;
		res.json(e.message);
	}
}

module.exports = loggerView
