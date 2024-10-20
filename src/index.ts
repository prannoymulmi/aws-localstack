import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Adjust the region as needed

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Parse the request body
        let body = JSON.parse(event.body ? event.body : '{}');

        // Validate input
        if (!body.name) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing 'name' in request body",
                }),
            };
        }

        // Define parameters for DynamoDB GetItemCommand
        const params = {
            TableName: 'tenant-1-table',  // Replace with your DynamoDB table name
            Key: {
                id: { S: body.name },  // Assuming userId is the primary key
            },
        };

        // Fetch the item from DynamoDB
        const command = new GetItemCommand(params);
        const data = await dynamoDbClient.send(command);

        // Check if the item exists in DynamoDB
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `User with ID ${body.name} not found`,
                }),
            };
        }

        // Return the item fetched from DynamoDB
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello, ${body.name}`,
                userProfile: data.Item.userProfile ? data.Item.userProfile.M : {},
            }),
        };
    } catch (error: any) {
        // Handle any errors
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while fetching the user from DynamoDB',
                error: error.message,
            }),
        };
    }
};
