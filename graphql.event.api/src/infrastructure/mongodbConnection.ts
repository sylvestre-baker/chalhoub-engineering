import { MongoClient, Db } from 'mongodb';
import config from '../config/mongodb';

class MongoDBConnection {
    private static instance: MongoDBConnection;
    private client: MongoClient | null = null;

    private constructor() {}

    // Singleton pattern to ensure there's a single instance of the MongoDB connection.
    public static getInstance(): MongoDBConnection {
        if (!MongoDBConnection.instance) {
            MongoDBConnection.instance = new MongoDBConnection();
        }
        return MongoDBConnection.instance;
    }

    async connect(): Promise<void> {
        if (!this.client) {
            this.client = await MongoClient.connect(config.connectionString);
        }
    }

    async getClient(): Promise<MongoClient> {
        if (!this.client) {
            await this.connect();
        }
        return this.client!;
    }
    

    async getDatabase(): Promise<Db> {
        const client = await this.getClient();
        return client.db(config.databaseName);
    }

    async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
    }
}

const mongodbConnection = MongoDBConnection.getInstance();
export { mongodbConnection };
