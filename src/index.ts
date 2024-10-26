import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Adjust the region as needed

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Parse the tenant ID from the request headers
        const tenantId = event.headers['tenant-id'];
        if (!tenantId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing 'tenant-id' in request headers",
                }),
            };
        }

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

        const tenantTableName = catalogData.Item.table_name.S;  // Get the tenant's specific table name

        // Define parameters to get the user from the tenant's specific table
        const userParams = {
            TableName: tenantTableName,
            Key: {
                id: { S: body.name },  // Assuming 'id' is the primary key in the tenant's table
            },
        };

        // Fetch the user from the tenant's table
        const userCommand = new GetItemCommand(userParams);
        const userData = await dynamoDbClient.send(userCommand);

        // Check if the user exists in the tenant's table
        if (!userData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `User with ID ${body.name} not found in tenant's table`,
                }),
            };
        }

        // Return the item fetched from DynamoDB
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello, ${body.name}`,
                userProfile: userData.Item.userProfile ? userData.Item.userProfile : {},
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
