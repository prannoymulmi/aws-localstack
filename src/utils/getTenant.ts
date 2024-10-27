import {APIGatewayProxyEvent} from "aws-lambda";

export const getTenant = (event: APIGatewayProxyEvent) => {
    // Parse tenant ID from headers
    // This is a work around as localstack does not support tenant specific headers
    let tenantId = null;
    if (event.headers["Host"]?.includes("tenant1")) {
        tenantId = "tenant1"
    } else if (event.headers["Host"]?.includes("tenant2")) {
        tenantId = "tenant2"
    }
    return tenantId;
};
