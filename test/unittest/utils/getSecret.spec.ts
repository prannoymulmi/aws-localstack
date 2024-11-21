import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { getSecret } from '.../../../src/utils/getSecret';

jest.mock('@aws-sdk/client-secrets-manager', () => {
    const mockSend = jest.fn();
    return {
        SecretsManagerClient: jest.fn(() => ({
            send: mockSend
        })),
        GetSecretValueCommand: jest.fn(),
        __esModule: true,
    };
});

describe('getSecret', () => {
    let mockSend: jest.Mock;

    beforeEach(() => {
        const clientInstance = new SecretsManagerClient();
        mockSend = clientInstance.send as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the secret string when secret is found', async () => {
        const secretName = 'testSecret';
        const secretValue = 'mySecretValue';
        mockSend.mockResolvedValue({ SecretString: secretValue });

        const result = await getSecret(secretName);

        expect(result).toBe(secretValue);
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    });

    it('should throw an error when secret is not found', async () => {
        const secretName = 'testSecret';
        mockSend.mockResolvedValue({ SecretString: null });

        await expect(getSecret(secretName)).rejects.toThrow('Secret binary data is not supported');
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    });

    it('should throw an error when an exception occurs', async () => {
        const secretName = 'testSecret';
        const errorMessage = 'An error occurred';
        mockSend.mockRejectedValue(new Error(errorMessage));

        await expect(getSecret(secretName)).rejects.toThrow(errorMessage);
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    });

    it('should throw an error when mockSend returns undefined', async () => {
        const secretName = 'testSecret';
        mockSend.mockResolvedValue(undefined);

        await expect(getSecret(secretName)).rejects.toThrow('Secret binary data is not supported');
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    });
});