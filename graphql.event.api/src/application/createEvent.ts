import { IEvent, IEventRepository } from '../core/interfaces/IEventRepository';

export class CreateEventService {
    private eventRepository: IEventRepository;

    constructor(eventRepository: IEventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(eventData: Omit<IEvent, 'id'>): Promise<IEvent> {
       
        if (!eventData.name.trim()) {
            throw new Error("Le nom de l'événement ne peut pas être vide.");
        }
         
        return await this.eventRepository.create(eventData);
    }
}
