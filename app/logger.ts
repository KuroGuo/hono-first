import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const commonRotateOptions = {
  datePattern: 'YYYY-MM-DD',
  // zippedArchive: true, // 启用压缩归档的旧日志
  maxSize: '20m', // 每个日志文件最大20MB
  maxFiles: '30d', // 保留30天的日志
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json({ space: 2 })
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      ...commonRotateOptions,
    }),
    new DailyRotateFile({
      filename: 'logs/warn-%DATE%.log',
      level: 'warn',
      ...commonRotateOptions,
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      ...commonRotateOptions,
    }),
  ],
})

export default logger

export const blockchainLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json({ space: 2 })
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/blockchain-error-%DATE%.log',
      level: 'error',
      ...commonRotateOptions,
    }),
    new DailyRotateFile({
      filename: 'logs/blockchain-combined-%DATE%.log',
      ...commonRotateOptions,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, [Symbol.for('level')]: rawLevel, ...rest }) => {
        return `${timestamp} [${level}]: ${message}${rawLevel !== 'info' ? ` ${JSON.stringify(rest)}` : ''}`
      })
    )
  }))
  blockchainLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`
      })
    )
  }))
}