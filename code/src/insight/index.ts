import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import { appLogger } from '../common/logger';
import { SecretUtil } from '../common/secret-util';
import { MongoUtil } from '../common/mongo-util';

const logger = appLogger();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Received event', { event });
  logger.info('Received context', { context });

  const dbDevSecret = await SecretUtil.getSecret(process.env.DB_DEV_SECRET as string);
  console.log('dbDevSecret:', dbDevSecret);
  const mongoUtil = new MongoUtil(
    dbDevSecret.DB_HOST,
    dbDevSecret.DB_PORT,
    dbDevSecret.DB_QUERY_STRING,
    dbDevSecret.DB_NAME,
    dbDevSecret.DB_CERT,
    dbDevSecret.DB_USER_NAME,
    dbDevSecret.DB_PWD,
  );

  try {
    await mongoUtil.connect();
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to connect to MongoDB' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
    headers: { 'Content-Type': 'application/json' },
  };
};
