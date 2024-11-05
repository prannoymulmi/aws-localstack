import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Adjust the region as needed

export const getUserData = async (tenantTableName:string, username:string) => {
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
    return await dynamoDbClient.send(userCommand);
};
