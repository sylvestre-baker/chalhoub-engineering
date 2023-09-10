import { Db, MongoClient } from 'mongodb';

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;

  public static getConnection(mongodb: { host: string, db: string }, result: (connection) => void) {

    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect(mongodb, (error, db: Db) => {
        this.db = db;
        return result(this.db);
      });
    }
  }

  private static connect(mongodb: { host: string, db: string }, result: (error, db: Db) => void) {
    MongoClient.connect(mongodb.host, { useUnifiedTopology: true, poolSize: 100 }, (error, client: MongoClient) => {
      if (error) {
        this.isConnected = false;
        console.log(`failed to connect to mongodb : ${mongodb.host}${mongodb.db}`);

      }
      else {
        const db = client.db(mongodb.db);
        this.isConnected = true;
        console.log(`connected to mongodb : ${mongodb.host}${mongodb.db}`);
        return result(error, db);
      }


    });
  }
}