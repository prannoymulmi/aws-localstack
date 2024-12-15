import axios from 'axios';

// o6mwkkwazm - is the resapi id and this must be replaced with your own restapi-id from the output
const url = 'http://tenant1.local:4566/restapis/o4qbjcrrti/dev/_user_request_/authorize';
const headers = {
    'Content-Type': 'application/json',
};

describe('Integration testing POST /authorize', () => {
    test("test when tenant 1 and tenant 2 but when user from tenant 2 is tried to access from tenant-1 then access denied", async() => {
        const payload = {
            username: "user7@example.com",
            password: "test2",
            codeChallenge: "VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA",
            client_id: "tenant1-client-id-1"
        }

        try {
            await axios.post(url, payload, {headers, timeout: 30000});
        } catch (error) {
            console.log("Received response:", error);
            if (axios.isAxiosError(error) && error.response){
                expect(error.response.status).toBe(401);
            }
        }
    }, 50000)

    test("test when tenant 1 and tenant 2 but when client from tenant 2 is tried to access from tenant-1 host then access denied", async() => {
        const payload = {
            username: "user7@example.com",
            password: "test2",
            codeChallenge: "VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA",
            client_id: "tenant2-client-id-1"
        }

        try {
            await axios.post(url, payload, {headers, timeout: 30000});
        } catch (error) {
            console.log("Received response:", error);
            if (axios.isAxiosError(error) && error.response){
                expect(error.response.status).toBe(401);
            }
        }
    }, 50000)
});