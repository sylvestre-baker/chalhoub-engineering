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
    region: 'us-east-1',
    credentials: {
      accessKeyId: '',
      secretAccessKey: '',
    },
    queueUrl: ''
  },
  port: 8001,
  serverId: '',
  swagger: {
    title: 'SAMPLE INVERSIFY API DEV'
  }


};

export default config;