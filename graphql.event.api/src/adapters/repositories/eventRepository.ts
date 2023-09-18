import { IEvent, IEventRepository } from '../../core/interfaces/IEventRepository';
import { Db, ObjectId } from 'mongodb';
import { mongodbConnection } from '../../infrastructure/mongodbConnection';

export class EventRepository implements IEventRepository {
    private readonly collectionName: string = 'events';

    private async getDb(): Promise<Db> {
        return await mongodbConnection.getDatabase();
    }

    async create(event: IEvent): Promise<IEvent> {
        const db = await this.getDb();
        const result = await db.collection(this.collectionName).insertOne(event);
        event.id = result.insertedId.toHexString();
        return event;
    }

    async update(eventId: string, event: IEvent): Promise<IEvent> {
        const db = await this.getDb();
        await db.collection(this.collectionName).updateOne(
            { _id: new ObjectId(eventId) },
            { $set: event }
        );
        return event;
    }

    async delete(eventId: string): Promise<void> {
        const db = await this.getDb();
        await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(eventId) });
    }

    async findById(eventId: string): Promise<IEvent | null> {
        const db = await this.getDb();
        const event = await db.collection(this.collectionName).findOne({ _id: new ObjectId(eventId) });
        if (event) {
            const { _id, ...rest } = event;
            return { id: _id.toHexString(), ...rest } as IEvent;
        }
        return null;
    }

    async findAll(): Promise<IEvent[]> {
        const db = await this.getDb();
        const events = await db.collection(this.collectionName).find().toArray();
        return events.map(event => {
            const { _id, ...rest } = event;
            return { id: _id.toHexString(), ...rest } as IEvent;
        });
    }

    async findByCriteria(criteria: any): Promise<IEvent[]> {
        const db = await this.getDb();
        const events = await db.collection(this.collectionName).find(criteria).toArray();
        return events.map(event => {
            const { _id, ...rest } = event;
            return { id: _id.toHexString(), ...rest } as IEvent;
        });
    }
}
