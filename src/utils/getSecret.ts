import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

export const getSecret = async (secretName: string): Promise<string> => {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const data = await client.send(command);
        if (data && data.SecretString) {
            return data.SecretString;
        } else {
            throw new Error('Secret binary data is not supported');
        }
    } catch (error) {
        console.error(`Error retrieving secret ${secretName}:`, error);
        throw error;
    }
};