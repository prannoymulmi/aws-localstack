import {DynamoDBClient, GetItemCommand, QueryCommand} from '@aws-sdk/client-dynamodb';
import logger from "./logger";

const dynamoDbClient = new DynamoDBClient({region: 'us-east-1'}); // Adjust the region as needed

export const validateUserCredentials = async (username: string, password: string, tenantTableName: string): Promise<boolean> => {
    try {

        // Define parameters to query the user by user_email using the GSI
        const userParams = {
            TableName: tenantTableName,
            IndexName: 'user_email_index', // Name of the GSI
            KeyConditionExpression: 'user_email = :username',
            ExpressionAttributeValues: {
                ':username': {S: username},
            },
        };

        // Query the user from the tenant's table using the GSI
        const userCommand = new QueryCommand(userParams);
        const userData = await dynamoDbClient.send(userCommand);
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