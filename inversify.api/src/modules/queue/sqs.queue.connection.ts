import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AwsCredentialIdentity } from "@aws-sdk/types";

export class SQSQueueConnection {

    private static sqsClient: SQSClient;

    public static getConnection(sqs: { credentials: AwsCredentialIdentity, region: string }, result: (connection) => void) {

        if (this.sqsClient) {
            return result(this.sqsClient);
        } else {
            this.connect(sqs, (error, sqsClient: SQSClient) => {
                this.sqsClient = sqsClient;
                return result(this.sqsClient);
            });
        }
    }

    private static connect(sqs: { credentials: AwsCredentialIdentity, region: string }, result: (error, sqsClient: SQSClient) => void) {
        const sqsClient = new SQSClient({ credentials: sqs.credentials, region: sqs.region });
        return result(null, sqsClient);
    }
}