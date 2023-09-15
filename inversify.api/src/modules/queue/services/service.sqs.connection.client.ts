import { injectable } from 'inversify';
import { SQSQueueConnection } from '../sqs.queue.connection';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { ISqsMessageParams, ISqsSecretsAwsCredentialIdentity } from '../models';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@injectable()
export class SQSQueueClient {
    public sqsClient: SQSClient;
    public chunkSize: number;
    public queueUrl: string;

    constructor(sqs: { credentials: ISqsSecretsAwsCredentialIdentity, region: string, queueUrl: string },
        secretManager: { secretName: string, region: string, credentials: AwsCredentialIdentity  }) {
        SQSQueueConnection.getConnection(sqs, secretManager, connection => {
            this.sqsClient = connection;
            this.chunkSize = 10;
            this.queueUrl = sqs.queueUrl;
        });
    }

    public sendMessage(messageBody: string, result: (error, data) => void): void {
        const command = new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: messageBody
        });
        this.sqsClient.send(command, (error, data) => {
            return result(error, data);
        });
    }
}