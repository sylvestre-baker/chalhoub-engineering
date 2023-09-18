import { Db, MongoClient } from 'mongodb';
import { IUser, IUserRepository } from '../../core/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


export class UserRepository implements IUserRepository {
    private readonly collectionName = 'users';
    private db: Db;

    constructor(private client: MongoClient) {
        this.db = this.client.db();  // Assuming the client is already connected
    }

    async createUser(user: IUser): Promise<IUser> {
        user.passwordHash = await bcrypt.hash(user.password!, 10);
        const result = await this.db.collection(this.collectionName).insertOne(user);
        user.id = result.insertedId.toString();
        return user;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await this.db.collection(this.collectionName).findOne({ email });
        return user as IUser | null;
    }


    async getUserById(id: string): Promise<IUser | null> {
        const user = await this.db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
        return user as IUser | null;
    }

    async getAll(): Promise<IUser[] | null> {
        const users = await this.db.collection(this.collectionName).find({}).toArray();
        return users.map(user => {
            const { _id, ...rest } = user;
            return { id: _id.toHexString(), ...rest } as IUser;
        });
    }

    async updateUser(id: string, user: IUser): Promise<IUser | null> {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10); // Assuming you want to hash the updated password
        const result = await this.db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: user });
        if (result.modifiedCount > 0) {
            return this.getUserById(id);
        } else {
            return null;
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount ? true : false;
    }

    async verifyPassword(user: IUser, enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, user.passwordHash);
    }
}
