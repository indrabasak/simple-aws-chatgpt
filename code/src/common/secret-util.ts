/**
 * Utility class to retrieve secrets from AWS Secrets Manager.
 *
 * @author Indra Basak
 * @since 2024-10-29
 */
import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import { AppLogger } from './logger';

const logger = AppLogger.getInstance().createChild();
logger.appendKeys({ executor: 'common/secret-util' });

export class SecretUtil {
  /**
   * Retrieve a secret from AWS Secrets Manager.
   * @param secretName
   */
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
