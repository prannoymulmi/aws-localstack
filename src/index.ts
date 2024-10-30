import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import {getTenant} from "./utils/getTenant";
import {validateUserCredentials} from "./utils/validateUserCredentials";
import { v4 as uuidv4 } from 'uuid';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Adjust the region as needed

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tenantId= getTenant(event);
        // Parse the tenant ID from the request headers
        if (!tenantId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Unknown 'tenant-id' in request headers",
                    headers: event.headers
                }),
            };
        }

        // Parse the request body
        let body = JSON.parse(event.body ? event.body : '{}');

        // Validate input
        const { username, password, codeVerifier } = body;

        if (!username || !password || !codeVerifier) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing 'username', 'password', or 'codeVerifier' in request body",
                }),
            };
        }

        // Define parameters to get tenant's table name from the catalog DynamoDB table
        const catalogParams = {
            TableName: 'catalog-table',  // Replace with your catalog DynamoDB table name
            Key: {
                tenantId: { S: tenantId },  // Assuming tenantId is the primary key in the catalog table
            },
        };

        // Fetch the tenant's table name from the catalog table
        const catalogCommand = new GetItemCommand(catalogParams);
        const catalogData = await dynamoDbClient.send(catalogCommand);

        // Check if the tenant exists in the catalog
        if (!catalogData.Item || !catalogData.Item.table_name) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Tenant with ID ${tenantId} not found in catalog`,
                }),
            };
        }

        const tenantTableName = catalogData.Item.table_name.S ? catalogData.Item.table_name.S : "";  // Get the tenant's specific table name


        const isValidUser = await validateUserCredentials(username, password, tenantTableName);
        if (!isValidUser) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Invalid username or password",
                }),
            };
        }

        const authorizationCode = uuidv4();
        const expiresAt = Math.floor(Date.now() / 1000) + 600; // Code expires in 10 minutes

        /*const putItemParams = {
            TableName: 'authorization-codes-table', // Replace with your DynamoDB table name
            Item: {
                authorizationCode: { S: authorizationCode },
                codeVerifier: { S: codeVerifier },
                username: { S: username },
                expiresAt: { N: expiresAt.toString() },
            },
        };*/
        // Return the item fetched from DynamoDB
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello, ${body.username}`,
                authorizationCode: { S: authorizationCode },
                expiresAt: { N: expiresAt.toString() },
            }),
        };
    } catch (error) {
        // Handle any errors
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while fetching the user',
                error: error,
            }),
        };
    }
};
