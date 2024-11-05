import { validateUserCredentials } from '../../../src/utils/validateUserCredentials';
import { QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { argon2Verify } from 'hash-wasm';

jest.mock('hash-wasm', () => ({
    argon2Verify: jest.fn(),
}));

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

    it('should return false if argon2Verify fails', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { S: 'hashedPassword' } }], $metadata: {} };
        (argon2Verify as jest.Mock).mockResolvedValue(false);
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(false);
    });

    it('should return true if argon2Verify succeeds', async () => {
        const userData: QueryCommandOutput = { Items: [{ password: { S: 'hashedPassword' } }], $metadata: {} };
        (argon2Verify as jest.Mock).mockResolvedValue(true);
        const result = await validateUserCredentials('username', 'password', userData);
        expect(result).toBe(true);
    });
});