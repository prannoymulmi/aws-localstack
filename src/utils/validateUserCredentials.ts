import {
    DynamoDBClient,
    QueryCommandOutput
} from '@aws-sdk/client-dynamodb';
import logger from "./logger";

const dynamoDbClient = new DynamoDBClient({region: 'us-east-1'}); // Adjust the region as needed

export const validateUserCredentials = async (username: string, password: string, userData: QueryCommandOutput): Promise<boolean> => {
    try {


        logger.info(`User data: ${JSON.stringify(userData)}`);
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