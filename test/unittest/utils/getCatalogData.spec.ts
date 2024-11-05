import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getCatalogData } from "../../../src/utils/getCatalogData";  // replace with the correct path to your function file
import { mockClient } from "aws-sdk-client-mock";

// Mock the DynamoDB client
const dynamoDbMock = mockClient(DynamoDBClient);

describe("getCatalogData", () => {
    beforeEach(() => {
        dynamoDbMock.reset();
    });

    it("should fetch tenant's table name from catalog table", async () => {
        // Mock the DynamoDB response
        const tenantId = "tenant-123";
        const expectedResponse = {
            Item: {
                tenantId: { S: tenantId },
                tableName: { S: "tenant-table" },
            },
        };
        dynamoDbMock.on(GetItemCommand, {
            TableName: "catalog-table",
            Key: { tenantId: { S: tenantId } },
        }).resolves(expectedResponse);

        const result = await getCatalogData(tenantId);

        // Assertions
        expect(result).toEqual(expectedResponse);
    });

    it("should handle errors when DynamoDB client fails", async () => {
        // Mock DynamoDB to throw an error
        const tenantId = "tenant-123";
        dynamoDbMock.on(GetItemCommand).rejects(new Error("DynamoDB Error"));

        await expect(getCatalogData(tenantId)).rejects.toThrow("DynamoDB Error");
    });
});
