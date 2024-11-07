import winston from 'winston';
import path from 'path';

const options = {
  file: {
    level: 'debug',
    filename: path.join('logs', 'app.log'),
    handleExceptions: true,
    maxsize: 5242880,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  },
  console: {
    level: 'info',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      winston.format.align(),
      winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.File(options.file)],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(options.console));
}

export default logger;
