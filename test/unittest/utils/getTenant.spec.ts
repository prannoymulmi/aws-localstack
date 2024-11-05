import { APIGatewayProxyEvent } from "aws-lambda";
import { getTenant } from ".../../../src/utils/getTenant";

describe("getTenant", () => {
    it("should return tenant1 when Host header includes tenant1", () => {
        const event: APIGatewayProxyEvent = {
            headers: {
                Host: "example.tenant1.com"
            }
        } as any;

        const tenantId = getTenant(event);
        expect(tenantId).toBe("tenant1");
    });

    it("should return tenant2 when Host header includes tenant2", () => {
        const event: APIGatewayProxyEvent = {
            headers: {
                Host: "example.tenant2.com"
            }
        } as any;

        const tenantId = getTenant(event);
        expect(tenantId).toBe("tenant2");
    });

    it("should return null when Host header does not include tenant1 or tenant2", () => {
        const event: APIGatewayProxyEvent = {
            headers: {
                Host: "example.other.com"
            }
        } as any;

        const tenantId = getTenant(event);
        expect(tenantId).toBeNull();
    });

    it("should return null when Host header is missing", () => {
        const event: APIGatewayProxyEvent = {
            headers: {}
        } as any;

        const tenantId = getTenant(event);
        expect(tenantId).toBeNull();
    });
});