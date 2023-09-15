import { injectable, inject } from 'inversify';
import { TYPES } from '../../../common';
import { MongoDBClient } from '../../../database';
import { ModelEvent } from '../../models/index';

@injectable()
export class StoreEvent {
    private collectionName: string;
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) {
        this.collectionName = 'Event';
    }


    create(name:string, body:string): Promise<ModelEvent> {
        return new Promise<ModelEvent>((resolve, reject) => {
            const event = new ModelEvent();
            event.name = name;
            event.body = body;
            event.timestamp = new Date().toISOString();
            this.mongoClient.insert(this.collectionName, event, (error, data: ModelEvent) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }
    get(id: string): Promise<ModelEvent> {
        return new Promise<ModelEvent>((resolve, reject) => {
            this.mongoClient.findOneById(this.collectionName, id, (error, data: ModelEvent) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    getAll(): Promise<ModelEvent[]> {
        return new Promise<ModelEvent[]>((resolve, reject) => {
            this.mongoClient.find(this.collectionName, {}, (error, data: ModelEvent[]) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }
}
