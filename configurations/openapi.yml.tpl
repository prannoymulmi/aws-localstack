openapi: 3.0.1
info:
  title: OIDC API Gateway
  description: API Gateway for invoking Lambda
  version: 1.0.0
paths:
  /authorize:
    post:
      summary: Invoke Lambda function
      operationId: invokeLambda
      responses:
        '200':
          description: Successful response
      x-amazon-apigateway-integration:
        uri: ${lambda_invoke_arn_authorize}
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
        requestParameters:
          integration.request.header.tenant-header: method.request.header.origin
  /token:
      post:
        summary: Invoke Lambda function
        operationId: invokeLambda token
        responses:
          '200':
            description: Successful response
        x-amazon-apigateway-integration:
          uri: ${lambda_invoke_arn_token}
          passthroughBehavior: when_no_match
          httpMethod: POST
          type: aws_proxy
          requestParameters:
            integration.request.header.tenant-header: method.request.header.origin
components:
  securitySchemes:
    none:
      type: http
      scheme: none