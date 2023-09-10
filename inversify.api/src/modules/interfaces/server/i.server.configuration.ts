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
    machineKey: string;
    appInsightsKey: string;
    swagger: {
        title: string;
    } 
}
