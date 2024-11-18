// src/utils/validateClientId.test.ts
import { validateClientId } from '../../../src/utils/validateClientId';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DynamoDBClient);

describe('isValidClientId', () => {
    beforeEach(() => {
        ddbMock.reset();
    });

    it('should return true if clientId is valid', async () => {
        ddbMock.on(GetItemCommand).resolves({
            Item: {
                tenantId: { S: 'tenant1' },
                client_ids: { L: [{ S: 'client1' }, { S: 'client2' }] }
            }
        });

        const result = await validateClientId('tenant1', 'client1');
        expect(result).toBe(true);
    });

    it('should return false if clientId is invalid', async () => {
        ddbMock.on(GetItemCommand).resolves({
            Item: {
                tenantId: { S: 'tenant1' },
                client_ids: { L: [{ S: 'client1' }, { S: 'client2' }] }
            }
        });

        const result = await validateClientId('tenant1', 'client3');
        expect(result).toBe(false);
    });

    it('should return false if tenantId is not found', async () => {
        ddbMock.on(GetItemCommand).resolves({});

        const result = await validateClientId('tenant2', 'client1');
        expect(result).toBe(false);
    });

    it('should return false if client_ids is not found', async () => {
        ddbMock.on(GetItemCommand).resolves({
            Item: {
                tenantId: { S: 'tenant1' }
            }
        });

        const result = await validateClientId('tenant1', 'client1');
        expect(result).toBe(false);
    });

    it('should return false if there is an error', async () => {
        ddbMock.on(GetItemCommand).rejects(new Error('DynamoDB error'));

        const result = await validateClientId('tenant1', 'client1');
        expect(result).toBe(false);
    });
});