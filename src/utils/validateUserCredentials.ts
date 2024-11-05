//import { verify } from 'argon2-wasm';
import {
    QueryCommandOutput
} from '@aws-sdk/client-dynamodb';
import { argon2Verify } from 'hash-wasm';

export const validateUserCredentials = async (username: string, password: string, userData: QueryCommandOutput): Promise<boolean> => {
    try {
        // Check if the user exists in the tenant's table
        if (!userData.Items || userData.Items.length === 0) {
            return false; // User not found
        }

        const storedPassword = userData.Items[0].password.S ? userData.Items[0].password.S : "";  // Get the stored password
        return await argon2Verify({ password: password, hash: storedPassword });
    } catch (error) {
        console.error('Error validating user credentials:', error);
        return false;
    }
};