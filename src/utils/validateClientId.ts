import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export const validateClientId = async (tenantId: string, clientId: string): Promise<boolean> => {
    try {
        const params = {
            TableName: 'catalog-table',
            Key: {
                tenantId: { S: tenantId }
            }
        };

        const command = new GetItemCommand(params);
        const data = await dynamoDbClient.send(command);

        if (!data.Item || !data.Item.client_ids || !data.Item.client_ids.L) {
            return false; // Tenant or client_ids not found
        }

        const clientIds = data.Item.client_ids.L.map((item) => item.S);
        return clientIds.includes(clientId);
    } catch (error) {
        console.error('Error validating client ID:', error);
        return false;
    }
};