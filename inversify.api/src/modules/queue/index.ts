export * from './models';
export * from './services';
export * from './sqs.queue.connection';

import { Container } from 'inversify';
import { SQSQueueClient } from './services';
import { TYPES } from '../common';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { ISqsSecretsAwsCredentialIdentity } from './models';


export function configureQueue(config: { sqs: { credentials: ISqsSecretsAwsCredentialIdentity, region: string, queueUrl: string } ,
    secretManager: { secretName: string, region: string, credentials: AwsCredentialIdentity  }}, container: Container) {
    const sqs = new SQSQueueClient(config.sqs, config.secretManager);
    container.bind<SQSQueueClient>(TYPES.SQSQueueClient).toConstantValue(sqs);
}