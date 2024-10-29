import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import { appLogger } from '../common/logger';

const logger = appLogger();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Received event', { event });
  logger.info('Received context', { context });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
    headers: { 'Content-Type': 'application/json' },
  };
};
