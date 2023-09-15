export interface IServerConfiguration {
    env: string;
    secret: string;
    serverId: string;
    host: string;
    port: number;
    mongodb: {
        host: string,
        db: string
    };
    sqs: {
        region: string,
        credentials: {
            secretAccessKeyId: string,
            secretAccessKey: string,
        },
        queueUrl: string
    },
    secretManager: {
        secretName : string,
        region : string,
        credentials: {
            accessKeyId: string,
            secretAccessKey: string,
        },
    },
    machineKey: string;
    appInsightsKey: string;
    swagger: {
        title: string;
    }
}
