import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import {getTenant} from "../utils/getTenant";
import {getCatalogData} from "../utils/getCatalogData";
import {getUserData} from "../utils/getUserData";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Parse the request body
        let body = JSON.parse(event.body ? event.body : '{}');

        // Validate input
        const { username, authorizationCode, codeVerifier } = body;

        if (!username || !authorizationCode || !codeVerifier) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing 'username', 'authorizationCode', or 'codeVerifier' in request body",
                }),
            };
        }

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


        const data = await getUserData(tenantTableName, username);

        // @ts-ignore
        console.log(JSON.stringify(data.Items[0].userAccess, null, 2));

        // Check if the authorization code is valid
        // @ts-ignore
        if (!data.Items || data.Items[0].userAccess.M.codeVerifier.S !== codeVerifier || data.Items[0].userAccess.M.authorizationCode.S !== authorizationCode) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Invalid authorization code or code verifier",
                }),
            };
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: data.Items[0].id.S
            },
            'your-secret-key', // Replace with your secret key
            { expiresIn: '1h' }
        );

        // Return the token
        return {
            statusCode: 200,
            body: JSON.stringify({
                token: token,
            }),
        };
    } catch (error) {
        // Handle any errors
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while generating the token',
                error: error,
            }),
        };
    }
};