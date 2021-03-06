import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { TimeHelper } from './time-helper';

const localTime = TimeHelper.getLocalTime();
const utcTime = TimeHelper.getUtcTime();

const timestampOption = {
    format: () => `${utcTime} ( ${localTime} )`,
};

export const logger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
            format: winston.format.combine(
                winston.format.timestamp(timestampOption),
                nestWinstonModuleUtilities.format.nestLike('Sample', {
                    prettyPrint: true,
                }),
            ),
        }),
        new (require('winston-daily-rotate-file'))({
            format: winston.format.combine(
                winston.format.timestamp(timestampOption),
                winston.format.printf(
                    (log) => `[${log.timestamp}] ${log.level}: ${log.message}`,
                ),
            ),
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            json: true,
        }),
    ],
});
