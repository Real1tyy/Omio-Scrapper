import { createLogger, format, transports } from 'winston';

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.splat(),
		format.json(),
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'data/logs/error.log', level: 'error' }),
		new transports.File({ filename: 'data/logs/combined.log' }),
	],
});

export default logger;
