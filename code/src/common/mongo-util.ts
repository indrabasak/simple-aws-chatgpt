import { Db, MongoClient } from 'mongodb';
import { appLogger } from './logger';
import fs from 'node:fs';

const logger = appLogger().createChild();
logger.appendKeys({ executor: 'common/mongo-util' });

export class MongoUtil {
  private readonly dbName: string;
  private readonly url: string;
  private client: MongoClient | undefined;
  private db: Db | undefined;

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

  async connect() {
    this.client = await MongoClient.connect(this.url);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

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
    } catch (e) {
      console.log(e);
      console.log('Encountered error while retrieving results');
    }

    return result;
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}
