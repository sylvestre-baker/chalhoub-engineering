import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { ISqsSecretsAwsCredentialIdentity } from "./models";
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
export class SQSQueueConnection {

    private static sqsClient: SQSClient;

    public static getConnection(sqs: { credentials: ISqsSecretsAwsCredentialIdentity, region: string },
        secretManager: { secretName: string, region: string, credentials: AwsCredentialIdentity }, result: (connection) => void) {

        if (this.sqsClient) {
            return result(this.sqsClient);
        } else {
            this.connect(sqs, secretManager, (error, sqsClient: SQSClient) => {
                this.sqsClient = sqsClient;
                return result(this.sqsClient);
            });
        }
    }

    private static async connect(sqs: { credentials: ISqsSecretsAwsCredentialIdentity, region: string },
        secretManager: { secretName: string, region: string, credentials: AwsCredentialIdentity }, result: (error, sqsClient: SQSClient) => void) {
        try {
            const client = new SecretsManagerClient({
                region: secretManager.region,
                credentials: secretManager.credentials
            });
            const responseSecret = await client.send(
                new GetSecretValueCommand({
                    SecretId: secretManager.secretName,
                    VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
                })
            );
            const secretObject = JSON.parse(responseSecret.SecretString || '{}');

            const secretCredentials: AwsCredentialIdentity = {
                accessKeyId: secretObject[sqs.credentials.secretAccessKeyId],
                secretAccessKey: secretObject[sqs.credentials.secretAccessKey],
            };
            const sqsClient = new SQSClient({ credentials: secretCredentials, region: sqs.region });
            return result(null, sqsClient);
        } catch (error) {
            throw error;
        }

    }
}