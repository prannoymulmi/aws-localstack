import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Adjust the region as needed

export const  getCatalogData = async (tenantId:string) => {
    // Define parameters to get tenant's table name from the catalog DynamoDB table
    const catalogParams = {
        TableName: 'catalog-table',  // Replace with your catalog DynamoDB table name
        Key: {
            tenantId: { S: tenantId },  // Assuming tenantId is the primary key in the catalog table
        },
    };

    // Fetch the tenant's table name from the catalog table
    const catalogCommand = new GetItemCommand(catalogParams);
    return await dynamoDbClient.send(catalogCommand);
};
