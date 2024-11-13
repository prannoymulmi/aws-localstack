import { sha256 } from 'hash-wasm';

export const verifySHA = async (toVerify: string, expectedHash: string): Promise<boolean> => {
    const hash = await sha256(toVerify);
    // convert the hash to base64 url safe encoding without padding
    const base64Hash = Buffer.from(hash, 'hex').toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    return base64Hash === expectedHash;
};