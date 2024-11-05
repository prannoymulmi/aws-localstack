import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { getUserData } from "../../../src/utils/getUserData";

jest.mock("@aws-sdk/client-dynamodb");

describe("getUserData", () => {
    const tenantTableName = "testTable";
    const username = "testUser";
    const mockDynamoDbClient = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;

    beforeEach(() => {
        mockDynamoDbClient.mockClear();
    });

    it("should query the user data from DynamoDB", async () => {
        const mockSend = jest.fn().mockResolvedValue({ Items: [{ user_email: { S: username } }] });
        mockDynamoDbClient.prototype.send = mockSend;

        const result = await getUserData(tenantTableName, username);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand));
        expect(result).toEqual({ Items: [{ user_email: { S: username } }] });
    });
});