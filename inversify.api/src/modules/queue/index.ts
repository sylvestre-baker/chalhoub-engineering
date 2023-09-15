export * from './models';
export * from './services';
export * from './sqs.queue.connection';

import { Container } from 'inversify';
import { SQSQueueClient } from './services';
import { TYPES } from '../common';
import { AwsCredentialIdentity } from '@aws-sdk/types';


export function configureQueue(config: { sqs: { credentials: AwsCredentialIdentity, region: string } }, container: Container) {
    const sqs = new SQSQueueClient(config.sqs);
    container.bind<SQSQueueClient>(TYPES.MongoDBClient).toConstantValue(sqs);
}