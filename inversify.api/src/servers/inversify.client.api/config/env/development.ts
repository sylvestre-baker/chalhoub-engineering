import { IServerConfiguration } from '../../../../modules/interfaces';

const config: IServerConfiguration = {
  env: 'development',
  secret: 'test',
  appInsightsKey: '',
  host: '',
  machineKey: '',
  mongodb: {
    host: 'mongodb://127.0.0.1:27017/',
    db: 'sample-inversify-api-dev'
  },
  sqs: {
    region: 'eu-north-1',
    credentials: {
      secretAccessKeyId: 'my-queue-chalhoub-engineering-test-accessKeyId',
      secretAccessKey: 'my-queue-chalhoub-engineering-test-secretAccessKey',
    },
    queueUrl: 'https://sqs.eu-north-1.amazonaws.com/494292180059/my-queue-chalhoub-engineering-test'
  },
  secretManager:{
    secretName: 'nonprod/chalhoub-engineering-test/app',
    region: "eu-north-1",
    credentials: {
      accessKeyId: '',
      secretAccessKey: '',
    },

  },
  port: 8001,
  serverId: '',
  swagger: {
    title: 'SAMPLE INVERSIFY API DEV'
  }


};

export default config;