import axios from 'axios';
import * as fc from 'fast-check';

// o6mwkkwazm - is the resapi id and this must be replaced with your own restapi-id from the output
const url = 'http://tenant1.local:4566/restapis/o6mwkkwazm/dev/_user_request_/authorize';
const headers = {
    'Content-Type': 'application/json',
};

describe('Fuzz testing POST /authorize', () => {
    test('should handle fuzzed payloads', async () => {
        const username = "user7@example.com";
        const password = "test1";
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    username: fc.constant(username),
                    password: fc.constant(password),
                    codeChallenge: fc.string(),
                }),
                async (payload) => {
                    console.log("Sending request with payload:");
                    try {
                        console.log(`Fuzzing with username: ${username}, password: ${password}, codeChallenge: ${payload.codeChallenge}`);
                        const response = await axios.post(url, payload, {headers, timeout: 30000});
                        console.log("Received response:", response.status);
                        expect(response.status).toBe(200);
                    } catch (error) {
                        console.log("Error occurred:", error);
                        // Handle expected errors
                        if (axios.isAxiosError(error) && error.response) {
                            console.log("Axios error response:", error.response);
                            expect(error.response.status).toBeGreaterThanOrEqual(400);
                            expect(error.response.status).toBeLessThan(500);
                        } else {
                            throw error;
                        }
                    }
                }
            )
        );

    }, 3000000); // Increase timeout to 50 Minutes


    test('should handle fuzzed payloads for codeChallenge', async () => {
        for (let i = 0; i < 10; i++) {
            const username = fc.sample(fc.string(), 1)[0];
            const password = fc.sample(fc.string(), 1)[0];
            const codeChallenge = fc.sample(fc.string(), 1)[0];
            console.log(`Fuzzing iteration ${i} with username: ${username}, password: ${password}, codeChallenge: ${codeChallenge}`);
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        username: fc.constant(username),
                        password: fc.constant(password),
                        codeChallenge: fc.constant(codeChallenge),
                    }),
                    async (payload) => {
                        console.log("Sending request with payload:", payload);
                        try {
                            const response = await axios.post(url, payload, {headers, timeout: 30000});
                            console.log("Received response:", response.status);
                            expect(response.status).toBe(200);
                        } catch (error) {
                            console.log("Error occurred:", error);
                            // Handle expected errors
                            if (axios.isAxiosError(error) && error.response) {
                                console.log("Axios error response:", error.response);
                                if (error.response.status === 401) {
                                    console.log("Received 401 Unauthorized");
                                    expect(error.response.status).toBe(401);
                                } else {
                                    expect(error.response.status).toBeGreaterThanOrEqual(400);
                                    expect(error.response.status).toBeLessThan(500);
                                }
                            } else {
                                throw error;
                            }
                        }
                    }
                )
            );
        }
    }, 300000); // Increase timeout to 5 Minutes

    test('should handle fuzzed payloads when all inputs are random', async () => {
        for (let i = 0; i < 10; i++) {
            const username = fc.sample(fc.string(), 1)[0];
            const password = fc.sample(fc.string(), 1)[0];
            const codeChallenge = fc.sample(fc.string(), 1)[0];
            console.log(`Fuzzing iteration ${i} with username: ${username}, password: ${password}, codeChallenge: ${codeChallenge}`);
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        username: fc.constant(username),
                        password: fc.constant(password),
                        codeChallenge: fc.constant(codeChallenge),
                    }),
                    async (payload) => {
                        console.log("Sending request with payload:", payload);
                        try {
                            await axios.post(url, payload, {headers, timeout: 30000});
                        } catch (error) {
                            //console.log("Error occurred:", error);
                            // Handle expected errors
                            if (axios.isAxiosError(error) && error.response) {
                                if (error.response.status === 401) {
                                    console.log("Received 401 Unauthorized");
                                    expect(error.response.status).toBe(401);
                                } else {
                                    expect(error.response.status).toBeGreaterThanOrEqual(400);
                                    expect(error.response.status).toBeLessThan(500);
                                }
                            } else {
                                throw error;
                            }
                        }
                    }
                )
            );
        }
    }, 300000); // Increase timeout to 5 Minutes
});