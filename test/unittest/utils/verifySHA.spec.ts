// src/utils/verifySHA.test.ts
import { verifySHA } from '../../../src/utils/verifySHA';


describe('verifySHA', () => {
    it('should return true for matching hashes', async () => {
        const expectedHash = 'VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA';
        const toVerify = 'wOV-nI-QSyesPpyjPpyjkBPx7PCimGUBrxOqKgc8idUNLnzeIkUq1nJI4R2hEyoolgexTqQfAd4hbX8mi7ud0BpQv16u6R9a14fWjXjj65uWDnV-nfI7Ow-YaippAChI';


        const result = await verifySHA(toVerify, expectedHash);

        expect(result).toBe(true);
    });

    it('should return false for non-matching hashes', async () => {
        const data = 'test data';
        const expectedHash = 'differentBase64Hash';

        const result = await verifySHA(data, expectedHash);

        expect(result).toBe(false);
    });
});