export class Event {
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

    constructor(
        name: string,
        body: string,
        timestamp: Date,
        sourceApp: string,
        eventType: 'create' | 'update' | 'delete' | 'login' | 'logout',
        priority: 'low' | 'medium' | 'high',
        brand?: string,
        metadata?: Record<string, any>,
        userId?: string,
        location?: {
            latitude: number;
            longitude: number;
        },
        tags?: string[],
        relatedEventId?: string,
    ) {
        this.name = name;
        this.body = body;
        this.timestamp = timestamp;
        this.sourceApp = sourceApp;
        this.eventType = eventType;
        this.priority = priority;
        this.brand = brand;
        this.metadata = metadata;
        this.userId = userId;
        this.location = location;
        this.tags = tags;
        this.relatedEventId = relatedEventId;
    }
}
