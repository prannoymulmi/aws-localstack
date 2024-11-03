import {
    QueryCommandOutput
} from '@aws-sdk/client-dynamodb';


export const validateUserCredentials = async (username: string, password: string, userData: QueryCommandOutput): Promise<boolean> => {
    try {


        console.log(`User data: ${JSON.stringify(userData)}`);
        // Check if the user exists in the tenant's table
        if (!userData.Items || userData.Items.length === 0) {
            return false; // User not found
        }

        const storedPassword = userData.Items[0].password.S;
        return storedPassword === password; // Check if the password matches
    } catch (error) {
        console.error('Error validating user credentials:', error);
        return false;
    }
};