import { IEventRepository, IEvent } from '../../core/interfaces/IEventRepository';
import { IUserRepository } from '../../core/interfaces/IUserRepository';
import { EventRepository } from '../repositories/eventRepository';
import { UserRepository } from '../repositories/userRepository';
import { mongodbConnection } from '../../infrastructure/mongodbConnection';

const eventRepo: IEventRepository = new EventRepository();

let userRepo: IUserRepository | null = null;
const getUserRepo = async (): Promise<IUserRepository> => {
    if (!userRepo) {
        const client = await mongodbConnection.getClient();
        userRepo = new UserRepository(client);
    }
    return userRepo;
};

export const resolvers = {
    Query: {
        allEvents: async () => {
            return eventRepo.findAll();
        },
        getEventById: async (_: any, { id }: { id: string }) => {
            return eventRepo.findById(id);
        },
        allUsers: async () => {
            const repo = await getUserRepo();
            return repo.getAll();
        },
        getUserById: async (_: any, { id }: { id: string }) => {
            const repo = await getUserRepo();
            return repo.getUserById(id);
        },
        userByEmail: async (_: any, { email }: { email: string }) => {
            const repo = await getUserRepo();
            return repo.getUserByEmail(email);
        }
    },
    Mutation: {
        createEvent: async (_: any, eventInput: any) => {
            const event = await eventRepo.create(eventInput);
            return {
                ...event,
                //timestamp: event.timestamp.toISOString() // Conversion de Date en chaîne
            };
        },
        updateEvent: async (_: any, args: { id: string, eventInput: Partial<IEvent> }) => {
            const updatedEvent = await eventRepo.update(args.id, args.eventInput as IEvent);
            return {
                ...updatedEvent,
                //timestamp: updatedEvent.timestamp.toISOString() // Conversion de Date en chaîne
            };
        },        
        deleteEvent: async (_: any, { id }: { id: string }) => {
            await eventRepo.delete(id);
            return true; 
        },
        createUser: async (_: any, userInput: any) => {
            const repo = await getUserRepo();
            return repo.createUser(userInput);
        }
    }
};
