import {QueryCommandOutput} from "@aws-sdk/client-dynamodb";
import {validateUserCredentials, validateUserCredentialsInsecure} from "../../src/utils/validateUserCredentials";
import * as argon2 from 'argon2';

const NUMBER_OF_ITERATIONS = 30;
describe('validateUserCredentials timing test', () => {
    it('running time test for incorrect passwords', async () => {
        const hash = await argon2.hash("correct_pass", {
            type: argon2.argon2id,
            memoryCost: 65536, // 64MB in KiB
            timeCost: 3,      // iterations
            parallelism: 4,   // parallel threads
            hashLength: 32    // output length in bytes
        });
        const userData: QueryCommandOutput = {
            Items: [{
                password: {
                    S: hash
                }
            }], $metadata: {}
        };
        const nonMatchingTimes: number[] = [];
        for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
            const incorrect_pass =generateRandomString(125)
            const startMatching = performance.now();
            const result = await validateUserCredentials('username', incorrect_pass, userData);
            const endMatching = performance.now();
            nonMatchingTimes.push(endMatching - startMatching);
            expect(result).toBe(false);
        }
        console.table(nonMatchingTimes);
    });

    it('running time test for incorrect passwords with no timing safe function', async () => {
        const hash = await argon2.hash("correct_pass", {
            type: argon2.argon2id,
            memoryCost: 65536, // 64MB in KiB
            timeCost: 3,      // iterations
            parallelism: 4,   // parallel threads
            hashLength: 32    // output length in bytes
        });
        const userData: QueryCommandOutput = {
            Items: [{
                password: {
                    S: hash
                }
            }], $metadata: {}
        };
        const nonMatchingTimes: number[] = [];
        for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
            const hash_incorrect = await argon2.hash(generateRandomString(125), {
                type: argon2.argon2id,
                memoryCost: 65536, // 64MB in KiB
                timeCost: 3,      // iterations
                parallelism: 4,   // parallel threads
                hashLength: 32    // output length in bytes
            });
            const startMatching = performance.now();
            const result = await validateUserCredentialsInsecure('username', hash_incorrect, userData);
            const endMatching = performance.now();
            nonMatchingTimes.push(endMatching - startMatching);
            expect(result).toBe(false);
        }
        console.table(nonMatchingTimes);
    });

});

const generateRandomString= (length: number): string =>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
