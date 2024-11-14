import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand} from '@aws-sdk/client-dynamodb';
import {getTenant} from "../utils/getTenant";
import {validateUserCredentials} from "../utils/validateUserCredentials";
import { v4 as uuidv4 } from 'uuid';
import {getCatalogData} from "../utils/getCatalogData";
import {getUserData} from "../utils/getUserData";
import {isCodeChallengeValid} from "../utils/verifySHA";
import {AuthorizationRequest, authorizationSchema} from "../types/UserType";

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
        let body: AuthorizationRequest = JSON.parse(event.body ? event.body : '{}');

        // Validate input
        const { username, password, codeChallenge } = body;
        try {
            authorizationSchema.parse(body);
        } catch {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Invalid request body",
                }),
            };
        }
        if (!username || !password || !codeChallenge || !isCodeChallengeValid(codeChallenge)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing 'username', 'password', or 'codeChallenge' in request body",
                }),
            };
        }


        const catalogData = await getCatalogData(tenantId);

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

        const userData = await getUserData(tenantTableName, username);

        const isValidUser = await validateUserCredentials(username, password, userData);
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


        const updateItemParams = {
            TableName: tenantTableName,
            Key: {
                // @ts-ignore
                id: { S: userData.Items[0].id.S! },
            },
            UpdateExpression: 'SET userAccess = :userAccess',
            ExpressionAttributeValues: {
                ':userAccess': {
                    M: {
                        authorizationCode: { S: authorizationCode },
                        codeChallenge: { S: codeChallenge },
                        expiresAt: { N: expiresAt.toString() },
                    },
                },
            },
        };

        const updateItemCommand = new UpdateItemCommand(updateItemParams);
        await dynamoDbClient.send(updateItemCommand);
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
