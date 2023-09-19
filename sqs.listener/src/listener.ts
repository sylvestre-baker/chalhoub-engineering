import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv';
import axios from 'axios';
import { randomItem } from "./helpers";

const config = require('../config.json');

dotenv.config({ override: true });

class ModelEvent {
    _id: string;
    name: string;
    body: string;
    timestamp: string;

    constructor(_id: string, name: string, body: string, timestamp: string) {
        this._id = _id;
        this.name = name;
        this.body = body;
        this.timestamp = timestamp;
    }
}



interface EnrichedEvent extends ModelEvent {
    brand: string;
    sourceApp: string;
    eventType: string;
    priority: string;
    tags: string[];
}

async function enrichEvent(event: ModelEvent): Promise<EnrichedEvent> {
    return {
        ...event,
        brand: randomItem(config.brands),
        sourceApp: randomItem(config.sourceApps),
        eventType: randomItem(config.eventTypes),
        priority: randomItem(config.priorities),
        tags: randomItem(config.tags),
    };
}

async function sendToGraphQL(event: EnrichedEvent) {
    const mutation = `
        mutation Mutation($body: String!, $timestamp: String!, $sourceApp: String!, $eventType: EventType!, $priority: Priority!, $name: String!, $brand: String, $tags: [String!]) {
            createEvent(body: $body, timestamp: $timestamp, sourceApp: $sourceApp, eventType: $eventType, priority: $priority, name: $name, brand: $brand, tags: $tags) {
                id
                name
                body
                timestamp
                brand
                sourceApp
                eventType
                priority
                tags
            }
        }
    `;

    const response = await axios.post('http://server.graphql.event.api:4000/graphql', {
        query: mutation,
        variables: {
            body: event.body,
            timestamp: event.timestamp,
            sourceApp: event.sourceApp,
            eventType: event.eventType,
            priority: event.priority,
            name: event.name,
            brand: event.brand,
            tags: event.tags
        }
    });

    if (response.data.errors) {
        console.log(response.data.errors);
        throw new Error(`GraphQL Error: ${response.data.errors.map((e: any) => e.message).join(', ')}`);
    }

    return response.data.data;
}

const client = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
});

async function handleMessage(message: any) {
    console.log("Received message:", message.Body);
    const event: ModelEvent = JSON.parse(message.Body || '');

    const enrichedEvent = await enrichEvent(event);
    console.log(enrichedEvent)
    const gqlResponse = await sendToGraphQL(enrichedEvent);

    console.log("Sent to GraphQL:", gqlResponse);

    const deleteCommand = new DeleteMessageCommand({
        QueueUrl: process.env.QUEUE_URL!,
        ReceiptHandle: message.ReceiptHandle!
    });

    await client.send(deleteCommand);
}

async function listenForMessages() {
    while (true) {
        const command = new ReceiveMessageCommand({
            QueueUrl: process.env.QUEUE_URL!,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20
        });

        try {
            const response = await client.send(command);

            if (response.Messages) {
                for (const message of response.Messages) {
                    await handleMessage(message);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

listenForMessages();

