import { injectable } from 'inversify';
import { SQSQueueConnection } from '../sqs.queue.connection';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { ISqsMessageParams } from '../models';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@injectable()
export class SQSQueueClient {
    public sqsClient: SQSClient;
    public chunkSize: number;

    constructor(sqs: { credentials: AwsCredentialIdentity, region: string }) {
        SQSQueueConnection.getConnection(sqs, connection => {
            this.sqsClient = connection;
            this.chunkSize = 10;
        });       
    }

    public sendMessage(params: ISqsMessageParams, result: (error, data) => void): void {
        const command = new SendMessageCommand({
            QueueUrl: params.queueUrl,
            MessageBody: params.messageBody
        });
        this.sqsClient.send(command, (error, data) => {
            return result(error, data);
        });
    }
}