/**
 * The class provides methods to connect to a MongoDB instance, execute
 * aggregation queries, and find a single document in a collection.
 *
 * @author Indra Basak
 * @since 2024-10-31
 */

import { Db, MongoClient } from 'mongodb';
import fs from 'node:fs';
import { AppLogger } from './logger';

const logger = AppLogger.getInstance();
logger.appendKeys({ executor: 'common/mongo-util' });

export class MongoUtil {
  private readonly dbName: string;
  private readonly url: string;
  private client: MongoClient | undefined;
  private db: Db | undefined;

  /**
   * Constructor to initialize the MongoDB connection.
   *
   * @param host  mongoDB host
   * @param port  mongoDB port
   * @param queryStr  mongoDB query string
   * @param dbName mongoDB database name
   * @param certPath mongoDB certificate path
   * @param user mongoDB user
   * @param pwd mongoDB password
   */
  constructor(
    host: string,
    port: number,
    queryStr: string,
    dbName: string,
    certPath: string,
    user: string,
    pwd: string,
  ) {
    console.log('host: ', host);
    console.log('port: ', port);
    console.log('queryStr: ', queryStr);
    console.log('dbName: ', dbName);
    console.log('certPath: ', certPath);
    console.log('user: ', user);
    console.log('pwd: ', pwd);

    if (!fs.existsSync(certPath)) {
      throw new Error(`Certificate file not found: ${certPath}`);
    }

    this.dbName = dbName;
    const userNameEncoded = encodeURIComponent(user);
    const pwdEncoded = encodeURIComponent(pwd);
    this.url = `mongodb://${userNameEncoded}:${pwdEncoded}@${host}:${port}?${queryStr}&tlsCAFile=${certPath}`;
  }

  /**
   * Connect to the MongoDB instance.
   */
  async connect() {
    this.client = await MongoClient.connect(this.url);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  /**
   * Execute an aggregation query.
   *
   * @param collection collection name
   * @param pipeline aggregation pipeline
   */
  async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
    if (!this.db) {
      await this.connect();
    }

    const result: any[] = [];
    try {
      console.log(pipeline);
      let jsonPipeline = pipeline;
      if (typeof pipeline !== 'object') {
        jsonPipeline = eval(pipeline);
      }

      // @ts-expect-error the db might not be initialized or incorrect pipeline
      const cursor = this.db.collection(collection).aggregate(jsonPipeline);
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        result.push(doc);
      }
      logger.info('*** result retrieved from the database without error');
      console.log(result);
      console.log('---------------------------');
    } catch (e) {
      logger.error(`Encountered error while retrieving results`, { error: e });
    }

    return result;
  }

  /**
   * Find a single document in a collection.
   *
   * @param collection collection name
   * @param filter filter criteria
   */
  async findOne(collection: string, filter: any) {
    if (!this.db) {
      await this.connect();
    }

    let statusCode = 200;
    let message = `Read data from ${collection} collection was successful.`;
    let result = null;

    try {
      // @ts-expect-error the db might not be initialized
      const col = this.db.collection(collection);
      result = await col.findOne(filter);
      logger.info('Read from database without error', { result });
      if (result === null) {
        message = `No record was found in ${collection} collection.`;
        statusCode = 400;
      } else {
        logger.info(message, { result });
      }
    } catch (e) {
      message = `Encountered error while trying to read with the following criteria: ${filter}`;
      logger.error(message, { error: e });
      statusCode = 400;
    }

    return {
      statusCode,
      message,
      result,
    };
  }

  /**
   * Close the MongoDB connection.
   */
  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}
