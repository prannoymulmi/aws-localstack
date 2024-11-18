import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from "../../../src/entrypoints/authorizePKCE";
import { getTenant } from '../../../src/utils/getTenant';
import { validateUserCredentials } from '../../../src/utils/validateUserCredentials';
import { getCatalogData } from '../../../src/utils/getCatalogData';
import { validateClientId } from '../../../src/utils/validateClientId';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import {getUserData} from "../../../src/utils/getUserData";

jest.mock('../../../src/utils/getTenant');
jest.mock('../../../src/utils/validateClientId');
jest.mock('../../../src/utils/validateUserCredentials');
jest.mock('../../../src/utils/getCatalogData');
jest.mock('../../../src/utils/getUserData');
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('uuid');

describe('authorizePKCE handler', () => {
    const mockEvent: APIGatewayProxyEvent = {
        headers: { 'tenant-id': 'test-tenant' },
        body: JSON.stringify({ username: 'testuser', password: 'testpass', codeChallenge: '1GqTy6v3zj0Cevx8xNrhFRIULvEzbmd_tpmlV2PCb6c', client_id: 'client1' }),
        // other properties can be added as needed
    } as any;

    beforeEach(() => {
        (getTenant as jest.Mock).mockReturnValue('test-tenant');
        (getCatalogData as jest.Mock).mockResolvedValue({ Item: { table_name: { S: 'test-table' } } });
        (getUserData as jest.Mock).mockResolvedValue({ Items: [{ id: { S: 'test-id' } }] });
        (validateUserCredentials as jest.Mock).mockResolvedValue(true);
        (validateClientId as jest.Mock).mockResolvedValue(true);
        (uuidv4 as jest.Mock).mockReturnValue('test-authorization-code');
        (DynamoDBClient.prototype.send as jest.Mock).mockResolvedValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if tenant-id is missing', async () => {
        (getTenant as jest.Mock).mockReturnValue(null);
        const eventWithoutTenantId = { ...mockEvent, headers: {} };
        const response = await handler(eventWithoutTenantId);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe("Unknown 'tenant-id' in request headers");
    });

    it('should return 400 if username, password, or codeChallenge is missing', async () => {
        const eventWithoutBody = { ...mockEvent, body: JSON.stringify({}) };
        const response = await handler(eventWithoutBody);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe("Invalid request body");
    });

    it('should return 400 if code challenge is short', async () => {
        const mockEventShort: APIGatewayProxyEvent = {
            headers: { 'tenant-id': 'test-tenant' },
            body: JSON.stringify({ username: 'testuser', password: 'testpass', codeChallenge: '1GqTy6v3asdasdasdasd', client_id: 'client1' }),
            // other properties can be added as needed
        } as any;
        const event = { ...mockEventShort};
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe("Missing 'username', 'password', or 'codeChallenge' in request body");
    });

    it('should return 404 if tenant is not found in catalog', async () => {
        (getCatalogData as jest.Mock).mockResolvedValue({});
        const response = await handler(mockEvent);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).message).toBe("Tenant with ID test-tenant not found in catalog");
    });

    it('should return 401 if user credentials are invalid', async () => {
        (validateClientId as jest.Mock).mockResolvedValue(true);
        (validateUserCredentials as jest.Mock).mockResolvedValue(false);
        const response = await handler(mockEvent);
        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).message).toBe("Invalid username or password");
    });

    it('should return 401 if client_id are invalid', async () => {
        (validateClientId as jest.Mock).mockResolvedValue(false);
        const response = await handler(mockEvent);
        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).message).toBe("Invalid client ID");
    });

    it('should return 200 and authorization code if all inputs are valid', async () => {
        const response = await handler(mockEvent);
        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.message).toBe("Hello, testuser");
        expect(responseBody.authorizationCode.S).toBe("test-authorization-code");
        expect(responseBody.expiresAt.N).toBe((Math.floor(Date.now() / 1000) + 600).toString());
    });
});