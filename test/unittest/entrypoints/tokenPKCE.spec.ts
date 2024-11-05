import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/entrypoints/tokenPKCE';
import * as jwt from 'jsonwebtoken';
import { getTenant } from '../../../src/utils/getTenant';
import { getCatalogData } from '../../../src/utils/getCatalogData';
import { getUserData } from '../../../src/utils/getUserData';

jest.mock('jsonwebtoken');
jest.mock('../../../src/utils/getTenant');
jest.mock('../../../src/utils/getCatalogData');
jest.mock('../../../src/utils/getUserData');

describe('tokenPKCE handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if username, authorizationCode, or codeVerifier is missing', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).message).toBe("Missing 'username', 'authorizationCode', or 'codeVerifier' in request body");
    });

    it('should return 400 if tenant-id is missing', async () => {
        (getTenant as jest.Mock).mockReturnValue(null);

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user', authorizationCode: 'code', codeVerifier: 'verifier' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).message).toBe("Unknown 'tenant-id' in request headers");
    });

    it('should return 404 if tenant is not found in catalog', async () => {
        (getTenant as jest.Mock).mockReturnValue('tenant-id');
        (getCatalogData as jest.Mock).mockResolvedValue({});

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user', authorizationCode: 'code', codeVerifier: 'verifier' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body).message).toBe('Tenant with ID tenant-id not found in catalog');
    });

    it('should return 401 if authorization code or code verifier is invalid', async () => {
        (getTenant as jest.Mock).mockReturnValue('tenant-id');
        (getCatalogData as jest.Mock).mockResolvedValue({ Item: { table_name: { S: 'table-name' } } });
        (getUserData as jest.Mock).mockResolvedValue({ Items: [{ userAccess: { M: { codeVerifier: { S: 'wrong-verifier' }, authorizationCode: { S: 'wrong-code' } } } }] });

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user', authorizationCode: 'code', codeVerifier: 'verifier' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(401);
        expect(JSON.parse(result.body).message).toBe('Invalid authorization code or code verifier');
    });

    it('should return 200 and a token if everything is valid', async () => {
        (getTenant as jest.Mock).mockReturnValue('tenant-id');
        (getCatalogData as jest.Mock).mockResolvedValue({ Item: { table_name: { S: 'table-name' } } });
        (getUserData as jest.Mock).mockResolvedValue({ Items: [{ id: { S: 'user-id' }, userAccess: { M: { codeVerifier: { S: 'verifier' }, authorizationCode: { S: 'code' } } } }] });
        (jwt.sign as jest.Mock).mockReturnValue('token');

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user', authorizationCode: 'code', codeVerifier: 'verifier' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).token).toBe('token');
    });

    it('should return 500 if an error occurs', async () => {
        (getTenant as jest.Mock).mockImplementation(() => { throw new Error('error'); });

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ username: 'user', authorizationCode: 'code', codeVerifier: 'verifier' }),
            headers: {},
        } as any;

        const result = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('An error occurred while generating the token');
    });
});