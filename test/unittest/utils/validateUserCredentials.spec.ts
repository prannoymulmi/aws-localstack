import { validateUserCredentials } from '../../../src/utils/validateUserCredentials';
import * as argon2 from 'argon2-browser';
import { QueryCommandOutput } from '@aws-sdk/client-dynamodb';

jest.mock('argon2-browser');

describe('validateUserCredentials', () => {
    it('should return false if userData.Items is empty', async () => {
        const userData: QueryCommandOutput = { Items: [], $metadata: {} };
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return false if userData.Items is undefined', async () => {
        const userData: QueryCommandOutput = { $metadata: {} };
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return false if userItem is undefined', async () => {
        const userData: QueryCommandOutput = { Items: [{}], $metadata: {} };
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return false if userItem.password is undefined', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { NULL: true } }], $metadata: {} };
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return false if userItem.password.S is undefined', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { NULL: true }}], $metadata: {} };
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return false if argon2.verify fails', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { S: 'hashedPassword' } }], $metadata: {} };
        (argon2.verify as jest.Mock).mockResolvedValue(false);
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return true if argon2.verify succeeds', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { S: 'hashedPassword' } }], $metadata: {} };
        (argon2.verify as jest.Mock).mockResolvedValue(true);
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(true);
    });

    it('should handle errors and return false', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { S: '$argon2id$v=19$m=65536,t=3,p=4$mmLEV97I8Z8fYE0MgGltMA$/cR3VdzRR40c9y3R0NssPNRziUWKeU4zcxkHNznl6jc' } }], $metadata: {} };
        const result = await validateUserCredentials('username', 'test1', userData);
        expect(result).toBe(false);
    });
});