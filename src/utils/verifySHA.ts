import { sha256 } from 'hash-wasm';
//import crypto from 'crypto';
export const verifySHA = async (toVerify: string, expectedHash: string): Promise<boolean> => {
    const hash = await sha256(toVerify);
    // convert the hash to base64 url safe encoding without padding
    const base64Hash = Buffer.from(hash, 'hex').toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    // prevent timing attacks by using crypto.timingSafeEqual
    return base64Hash === expectedHash;
    //return crypto.timingSafeEqual(Buffer.from(base64Hash), Buffer.from(expectedHash));
};

export const isCodeChallengeValid = (data: string): boolean => {
    const validLength = data.length >= 43 && data.length <= 128;
    const validCharset = /^[A-Za-z0-9-._~]+$/.test(data);

    return validLength && validCharset;
}