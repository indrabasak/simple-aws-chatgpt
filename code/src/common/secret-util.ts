import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import { appLogger } from './logger';

const logger = appLogger().createChild();
logger.appendKeys({ executor: 'common/secret-util' });

export class SecretUtil {
  static async getSecret(secretName: string): Promise<any> {
    try {
      logger.debug(`Retrieving secret ${secretName}`);
      const secretString = (await getSecret(secretName)) as string;
      return JSON.parse(secretString);
    } catch (error) {
      logger.error(`Failed to retrieve secret ${secretName}:`, { error });
      throw error;
    }
  }
}
