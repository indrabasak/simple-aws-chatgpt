import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import { appLogger } from '../common/logger';
import { SecretUtil } from '../common/secret-util';
import { MongoUtil } from '../common/mongo-util';
import { EventChatbot } from '../common/event-chatbot';
import axios from 'axios';

const logger = appLogger();

let bot: EventChatbot;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.info('Received event', { event });
  logger.info('Received context', { context });

  if (!bot) {
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
    await mongoUtil.connect();

    const openaiSecret = await SecretUtil.getSecret(process.env.OPENAI_SECRET as string);
    bot = new EventChatbot(
      openaiSecret.AZURE_TENANT_ID,
      openaiSecret.AZURE_CLIENT_ID,
      openaiSecret.AZURE_CLIENT_SECRET,
      openaiSecret.AZURE_AUTHORITY_HOST,
      openaiSecret.AZURE_OPENAI_API_INSTANCE_NAME,
      openaiSecret.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      openaiSecret.AZURE_OPENAI_API_VERSION,
      mongoUtil,
      dbDevSecret.DB_COLLECTION_EVENT,
    );
  }

  try {
    const response = await axios.get('https://api.github.com/users/mapbox');
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  } catch (error) {
    // Handle error
    console.error(error);
  }

  const payload = event.body ? JSON.parse(event.body) : null;
  console.log(payload);
  let answer = 'We are unable to answer your question at this time. - 2';
  if (payload && payload.question) {
    answer = await bot.answerQuestion(payload.question);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: answer }),
    headers: { 'Content-Type': 'application/json' },
  };
};
