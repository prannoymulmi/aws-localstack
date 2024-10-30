import { createLogger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
        new WinstonCloudWatch({
            logGroupName: '/aws/lambda/my_lambda_function',
            logStreamName: 'my_lambda_stream',
            awsRegion: 'us-east-1',
            awsAccessKeyId: 'test',
            awsSecretKey: 'test',
        })
    ],
});

export default logger;
