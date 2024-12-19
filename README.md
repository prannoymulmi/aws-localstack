# aws-localstack

# Getting Started 🚀

### Prerequisites for running Application

* <a href=https://www.docker.com/>Docker for Local Stack</a>
* <a href=https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>AWS CLI</a>
* <a href=https://github.com/localstack/awscli-local>AWS CLI Local - To run commands for localstack</a>
* <a href=https://github.com/localstack/terraform-local>Terraform Local</a>
* <a href=https://nodejs.org/en/blog/release/v18.17.0>Node 18 and above</a>
* <a href=https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable>Yarn Package manager</a>
* <a href=https://docs.localstack.cloud/user-guide/tools/localstack-desktop/>Local Stack Desktop (Optional)</a>. This tool is a UI which helps visualise localstack services and read logs etc.

## Installing Local Stack

* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>
* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>


``` bash
# Validates the docker-compose.yml, if the configurations are ok
localstack config validate
```
### Dependencies 

Dependencies are managed using Yarn. To install the dependencies, run the following command:

| Dependency | Version | Description |
|------------|---------|-------------|
| argon2 | ^0.41.1 | A password hashing library implementing the Argon2 algorithm, designed for secure password storage. |
| axios | ^1.7.7 | A promise-based HTTP client for making HTTP requests in both Node.js and browsers. |
| esbuild | ^0.24.0 | A fast JavaScript and TypeScript bundler and minifier optimized for development and production builds. |
| fast-check | ^3.23.1 | A property-based testing library for generating random test cases and checking properties of your code. |
| hash-wasm | ^4.11.0 | A fast cryptographic hashing library using WebAssembly for efficiency. |
| jest-fuzz | ^0.1.2 | A fuzz testing library for Jest, used to test for unexpected edge cases. |
| jsonwebtoken | ^9.0.2 | A library to sign, verify, and decode JSON Web Tokens (JWT), commonly used for authentication and authorization. |
| uuidv4 | ^6.2.13 | A library to generate UUID (Universally Unique Identifier) version 4, primarily used for creating unique identifiers. |
| winston | ^3.15.0 | A flexible and popular logging library for Node.js, supporting multiple log transports. |
| winston-cloudwatch | ^6.3.0 | A transport for Winston that allows logging to AWS CloudWatch for centralized logging and monitoring. |
| zod | ^3.23.8 | A TypeScript-first schema validation library for parsing and validating inputs. |
| @aws-sdk/client-dynamodb | ^3.675.0 | AWS SDK Client for DynamoDB, used for interacting with Amazon DynamoDB from Node.js applications. |
| @eslint/js | ^9.14.0 | ESLint's core JavaScript configuration, used to enforce coding standards and best practices. |
| @types/aws-lambda | ^8.10.145 | TypeScript type definitions for AWS Lambda, providing type support for AWS Lambda functions. |
| @types/jest | ^29.5.14 | TypeScript type definitions for Jest, enabling type safety in Jest test cases. |
| @types/jsonwebtoken | ^9.0.7 | TypeScript type definitions for jsonwebtoken, helping with type safety when using JWTs in TypeScript code. |
| @types/node | ^22.7.7 | TypeScript type definitions for Node.js, providing type support for Node.js APIs in TypeScript projects. |
| @typescript-eslint/eslint-plugin | ^8.13.0 | ESLint plugin that provides TypeScript-specific linting rules. |
| aws-sdk-client-mock | ^4.1.0 | A mocking library for the AWS SDK, used in unit tests to mock AWS services like DynamoDB. |
| eslint | ^9.14.0 | A powerful linter for JavaScript and TypeScript that helps identify and fix coding issues. |
| eslint-plugin-security-node | ^1.1.4 | An ESLint plugin that identifies potential security vulnerabilities in Node.js code. |
| jest | ^29.7.0 | A JavaScript testing framework that supports unit tests, integration tests, and snapshot testing. |
| ts-jest | ^29.2.5 | A Jest transformer that allows Jest to run TypeScript code directly. |
| typescript | ^5.6.3 | The TypeScript programming language, which adds static types to JavaScript to improve developer productivity and code quality. |
| typescript-eslint | ^8.13.0 | A set of tools that allow ESLint to analyze TypeScript code and enforce best practices. |


## Introduction

### Adding a Service to Localstack
A ```docker-compose.yml``` file is configured to start the localstack system. If you want to use a service in
localstack this has to be explicitly defined in the docker-compose file in order to use the service. See
the example where the services used here are explicitly mentioned in the [file](docker-compose.yml).

```
     environment:
      # LocalStack configuration: https://docs.localstack.cloud/references/configuration/
      - SERVICES=s3,lambda,dynamodb,iam,apigateway,
```

### How to start localstack
```bash
export LOCAL_STACK_HOBBY_TOKEN=<YOUR_TOKEN> # replace it with your token if you have a pro or a hobby auth token

## Start Docker compose (Only if Token is there)
docker compose up

## Start Docker compose (If no token available)
docker-compose -f docker-compose-unpaid.yml up

## create private keys for token signature
./create-keys.sh # this will create private and public keys in the root folder, this is included in the build-and-run.sh script

# Builds and starts the project as Localstack community edition is not persistent
./build-and-run.sh

# Build and run th project with db script and terraform
./build-and-run.sh --run-all

# Build and run the project with only DB seeding
./build-and-run.sh --run-db

# invokes Lambda directly
awslocal lambda invoke --function-name lambda-function \
   --headers '{"Host": "tenant1.local"}' \
    --payload '{"body": "{\"name\": \"User\"}" }' output.txt
    

awslocal lambda invoke --function-name test \
    --payload '{"body": "{\"name\": \"User\"}"}' output.txt \
    --headers '{"Host": "tenant1.local"}'
awslocal lambda invoke --function-name lambda-function \
    --payload '{"username": "user7@example.com", "password": "test1", "codeChallenge": "codeChallenge"}' output.txt
        
 #Print log
awslocal lambda invoke --function-name lambda-function \
    --payload '{"body": "{\"name\": \"User\"}" }' \
    response.json && cat response.json
```

### How to call end point in API-GW

```bash

# Helpful commands: 
# Get API all APIS   
awslocal apigateway get-rest-apis

# Get resources assoiated with api-ge    
awslocal apigateway get-resources --rest-api-id o6mwkkwazm

# To test lambda without using cli
awslocal apigateway test-invoke-method \
  --rest-api-id o6mwkkwazm \
  --resource-id 0dajq28nzj \
  --http-method POST \
  --path-with-query-string "/authorize" \
  --body '{"name": "testtt"}'

# Check the integration
awslocal apigateway get-integration \
  --rest-api-id o6mwkkwazm \
  --resource-id u3shefvycy \
  --http-method POST
  
# Curl to call api-gw 
curl -X POST http://localhost:4566/restapis/o6mwkkwazm/dev/_user_request_/authorize \
-H "Content-Type: application/json" \
-H "tenant-id: tenant1" \
-d '{"username": "user-5291-8168", "password": "test1", "codeChallenge": "codeChallenge"}'

# https://developer.pingidentity.com/en/tools/pkce-code-generator.html generate code verifier and code challenge 
curl -X POST http://tenant1.local:4566/restapis/o4qbjcrrti/dev/_user_request_/authorize \
-H "Content-Type: application/json" \
-d '{"username": "user7@example.com","client_id":"tenant1-client-id-1", "password": "test1", "codeChallenge": "VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA"}'


curl -X POST http://tenant2.local:4566/restapis/o4qbjcrrti/dev/_user_request_/authorize \
-H "Content-Type: application/json" \
-d '{"username": "user7@example.com","client_id":"tenant2-client-id-1", "password": "test2", "codeChallenge": "VkTJmESMq3DOD-fXIwqnD8ENlEOd2Prm3x8zO6u67aA"}'

curl -X POST http://tenant1.local:4566/restapis/o4qbjcrrti/dev/_user_request_/token \
-H "Content-Type: application/json" \
-d '{"username": "user7@example.com","grant_type": "authorization_code","client_id":"tenant1-client-id-1", "authorizationCode": "b0ab1b8f-03da-4092-bf58-0c20af00bfd0", "codeVerifier": "wOV-nI-QSyesPpyjPpyjkBPx7PCimGUBrxOqKgc8idUNLnzeIkUq1nJI4R2hEyoolgexTqQfAd4hbX8mi7ud0BpQv16u6R9a14fWjXjj65uWDnV-nfI7Ow-YaippAChI"}'

curl -X POST http://tenant1.local:4566/restapis/o4qbjcrrti/dev/_user_request_/token \
-H "Content-Type: application/json" \
-d '{"username": "user7@example.com","client_id":"tenant1-client-id-1", "authorizationCode": "ec886d24-b2ab-460b-8730-d03f177bd081", "codeVerifier": "wOV-nI-QSyesPpyjPpyjkBPx7PCimGUBrxOqKgc8idUNLnzeIkUq1nJI4R2hEyoolgexTqQfAd4hbX8mi7ud0BpQv16u6R9a14fWjXjj65uWDnV-nfI7Ow-YaippAChI"}'

# Logs 
awslocal logs describe-log-streams --log-group-name "/aws/lambda/my_lambda_function"
awslocal logs get-log-events --log-group-name "/aws/lambda/my_lambda_function" --log-stream-name "<log_stream_name>"

# Note:In AWS API Gateway: The actual URL structure in a real API Gateway doesn't contain _user_request_. However, when you interact with API Gateway through LocalStack, _user_request_ is a placeholder that LocalStack uses to differentiate between management APIs (like defining resources) and actual user requests (interacting with your API).

```
## Testing

### Unit testing

The two lambdas are tested using jest. The tests are written in the `test/unitest` folder. The tests are run using the following command:

```bash
# to run the all the Jest tests
yarn test 

# to run the all the Jest tests with coverage
yarn test:coverage

```
### DynamoDB

```bash
awslocal dynamodb put-item \
    --table-name tenant-1-table \
    --item '{
        "id": {"S": "unique-user-id"},
        "codeChallenge": {"S": "some-code-verifier"},
        "idToken": {"S": "id-token-value"},
        "accessToken": {"S": "access-token-value"},
        "refreshToken": {"S": "refresh-token-value"},
        "expiresAt": {"N": "1700000000"},
        "userProfile": {
            "M": {
                "name": {"S": "John Doe"},
                "email": {"S": "john.doe@example.com"}
            }
        }
    }'

```

```json
{
  "FunctionName": "lambda-function",
  "FunctionArn": "arn:aws:lambda:us-east-1:000000000000:function:lambda-function",
  "Runtime": "nodejs18.x",
  "Role": "arn:aws:iam::000000000000:role/lambda-role",
  "Handler": "index.handler",
  "CodeSize": 301,
  "Description": "",
  "Timeout": 3,
  "MemorySize": 128,
  "LastModified": "2024-10-14T15:06:52.722832+0000",
  "CodeSha256": "epe9kF6Zjc3JTqyXVkxuLDanoC/wBpmBS1dUMqr4Hgo=",
  "Version": "$LATEST",
  "TracingConfig": {
    "Mode": "PassThrough"
  },
  "RevisionId": "ca5f7672-aef1-45f3-bc55-f9d38706f8fd",
  "State": "Pending",
  "StateReason": "The function is being created.",
  "StateReasonCode": "Creating",
  "PackageType": "Zip",
  "Architectures": [
    "x86_64"
  ],
  "EphemeralStorage": {
    "Size": 512
  },
  "SnapStart": {
    "ApplyOn": "None",
    "OptimizationStatus": "Off"
  },
  "RuntimeVersionConfig": {
    "RuntimeVersionArn": "arn:aws:lambda:us-east-1::runtime:8eeff65f6809a3ce81507fe733fe09b835899b99481ba22fd75b5a7338290ec1"
  },
  "LoggingConfig": {
    "LogFormat": "Text",
    "LogGroup": "/aws/lambda/hello-world"
  }
}
```

## Prowler

```bash
# Setup localstack profile for the first time use
aws configure --profile localstack

# Run Prowler'
python prowler.py -e http://localhost:4566 -p localstack

# Run Prowler with specific services
python prowler.py -e http://localhost:4566 -p localstack --services awslambda iam dynamodb s3 apigateway cloudwatch


python prowler.py aws --compliance gdpr_aws 
```