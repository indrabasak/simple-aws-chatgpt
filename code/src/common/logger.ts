import { Logger } from '@aws-lambda-powertools/logger';
import { LogLevel } from '@aws-lambda-powertools/logger/types';

export const appLogger = () =>
  new Logger({
    serviceName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'INFO',
    persistentLogAttributes: {
      env: process.env.APP_ENV,
      region: process.env.AWS_REGION,
    },
  });
