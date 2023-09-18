export interface IEvent {
    id?: string;                         // Unique ID of the event
    name: string;                        // Name of the event
    body: string;                        // Content of the event
    timestamp: Date;                     // Timestamp of the event occurrence
    brand?: string;                      // Brand associated with the event
    sourceApp: string;                   // Source application of the event
    eventType: 'create' | 'update' | 'delete' | 'login' | 'logout'; // Type of event
    priority: 'low' | 'medium' | 'high'; // Priority level of the event
    metadata?: Record<string, any>;      // Additional metadata or info
    userId?: string;                     // Associated user ID (if relevant)
    location?: {                         // Geolocation (if applicable)
        latitude: number;
        longitude: number;
    };
    tags?: string[];                     // Tags or labels for categorization or filtering
    relatedEventId?: string;             // ID of a related event (if relevant)
}

export interface IEventRepository {
    create(event: IEvent): Promise<IEvent>;               // Create a new event
    update(eventId: string, event: Partial<IEvent>): Promise<IEvent>;
    delete(eventId: string): Promise<void>;              // Delete an event
    findById(eventId: string): Promise<IEvent | null>;   // Find an event by its ID
    findAll(): Promise<IEvent[]>;                        // Fetch all events
    findByCriteria(criteria: any): Promise<IEvent[]>;    // Find events based on specific criteria
}
