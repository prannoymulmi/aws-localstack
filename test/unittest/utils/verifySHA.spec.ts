// src/utils/verifySHA.test.ts
import {isCodeChallengeValid, verifySHA} from '../../../src/utils/verifySHA';


describe('verifySHA', () => {
    it('should return true for matching hashes', async () => {
        const expectedHash = 'VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA';
        const toVerify = 'wOV-nI-QSyesPpyjPpyjkBPx7PCimGUBrxOqKgc8idUNLnzeIkUq1nJI4R2hEyoolgexTqQfAd4hbX8mi7ud0BpQv16u6R9a14fWjXjj65uWDnV-nfI7Ow-YaippAChI';


        const result = await verifySHA(toVerify, expectedHash);

        expect(result).toBe(true);
    });

    it('should return false for non-matching hashes', async () => {
        const data = 'test data';
        const expectedHash = 'test hash';

        try {
            const result = await verifySHA(data, expectedHash);
            expect(result).toBe(false);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            expect(error.message).toBe('Input buffers must have the same byte length');
        }
    });
});

describe('sanitizeCodeChallenge', () => {
    it('should return true for valid code challenge', () => {
        const validCodeChallenge = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
        const result = isCodeChallengeValid(validCodeChallenge);
        expect(result).toBe(true);
    });

    it('should return false for code challenge that is too short', () => {
        const shortCodeChallenge = 'short';
        const result = isCodeChallengeValid(shortCodeChallenge);
        expect(result).toBe(false);
    });

    it('should return false for code challenge that is too long', () => {
        const longCodeChallenge = 'a'.repeat(129);
        const result = isCodeChallengeValid(longCodeChallenge);
        expect(result).toBe(false);
    });

    it('should return false for code challenge with invalid characters', () => {
        const invalidCodeChallenge = 'invalid_code_challenge!';
        const result = isCodeChallengeValid(invalidCodeChallenge);
        expect(result).toBe(false);
    });
});