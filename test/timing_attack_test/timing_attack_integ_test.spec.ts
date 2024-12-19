import {QueryCommandOutput} from "@aws-sdk/client-dynamodb";
import {validateUserCredentials} from "../../src/utils/validateUserCredentials";
import * as argon2 from 'argon2';
import jstat from 'test/integtest/jstat';

const NUMBER_OF_ITERATIONS = 1000;
const CORRECT_PASSWORD = "correct_pass";
describe('validateUserCredentials timing test', () => {
    const NON_MATCHING_PASSWORDS: number[] = [];
    const MATCHING_PASSWORDS: number[] = [];

    afterAll(() => {
        // eslint-disable-next-line security-node/detect-crlf
        console.log("p-Value", calculateChiSquare(NON_MATCHING_PASSWORDS, MATCHING_PASSWORDS))
    });

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

        for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
            const incorrect_pass = generateRandomString(125)
            const startMatching = performance.now();
            const result = await validateUserCredentials('username', incorrect_pass, userData);
            const endMatching = performance.now();
            NON_MATCHING_PASSWORDS.push(endMatching - startMatching);
            expect(result).toBe(false);
        }
        console.table(NON_MATCHING_PASSWORDS);
    });

    it('running time test for correct passwords', async () => {
        const hash = await argon2.hash(CORRECT_PASSWORD, {
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

        for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
            const startMatching = performance.now();
            const result = await validateUserCredentials('username', CORRECT_PASSWORD, userData);
            const endMatching = performance.now();
            MATCHING_PASSWORDS.push(endMatching - startMatching);
            expect(result).toBe(true);
        }
        console.table(MATCHING_PASSWORDS);
    });

});

const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


const calculateChiSquare = (sample1: number[], sample2: number[]) => {
    const degreesOfFreedom = sample1.length - 1;
    const chiSquared = sample1.reduce((sum, obs, i) => {
        const exp = sample2[i];
        return sum + Math.pow(obs - exp, 2) / exp;
    }, 0);
    const pValue = 1 - jstat.chisquare.cdf(chiSquared, degreesOfFreedom);
    return {chiSquared, pValue, degreesOfFreedom};
}
