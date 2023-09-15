export interface ISqsSecretsAwsCredentialIdentity {
    secretAccessKeyId: string;
    secretAccessKey: string;
}
export interface ISqsMessageParams {
    queueUrl: string;
    messageBody: string;
}
