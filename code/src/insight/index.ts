import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import { appLogger } from '../common/logger';
import { SecretUtil } from '../common/secret-util';

const logger = appLogger();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Received event', { event });
  logger.info('Received context', { context });

  const dbDevSecret = await SecretUtil.getSecret(process.env.DB_DEV_SECRET as string);
  console.log('dbDevSecret:', dbDevSecret);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
    headers: { 'Content-Type': 'application/json' },
  };
};
