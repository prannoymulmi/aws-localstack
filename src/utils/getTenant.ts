import {APIGatewayProxyEvent} from "aws-lambda";

export const getTenant = (event: APIGatewayProxyEvent) => {
    // Parse tenant ID from headers
    // This is a work around as localstack does not support tenant specific headers

    /* Note: this is not a secure way to determine tenant ID in a production environment,
    this is done solely for the purpose of this project as some functions of
    the API-gw to write static headers were not working with localstack.
     */

    let tenantId = null;
    if (event.headers["Host"]?.includes("tenant1")) {
        tenantId = "tenant1"
    } else if (event.headers["Host"]?.includes("tenant2")) {
        tenantId = "tenant2"
    }
    return tenantId;
};
