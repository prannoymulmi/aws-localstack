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
* 

## Installing Local Stack

* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>
* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>


``` bash
# Validates the docker-compose.yml, if the configurations are ok
localstack config validate
```



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
## Start Docker compose
docker compose up

# Builds and starts the project as Localstack community edition is not persistent
./build-and-run.sh

# invokes Lambda directly
awslocal lambda invoke --function-name lambda-function \
    --payload '{"body": "{\"name\": \"User\"}" }' output.txt
    
    
 #Print log
awslocal lambda invoke --function-name lambda-function \
    --payload '{"body": "{\"name\": \"User\"}" }' \
    response.json && cat response.json

# Get API    
awslocal apigateway get-rest-apis
    
# Replace {rest_api_id} with the ID of your deployed API Gateway.    
curl -X POST http://localhost:4566/restapis/{rest_api_id}/dev/ -d '{}'
curl -X POST http://localhost:4566/restapis/ax3dprkyzw/dev/ -d '{"body": "{\"name\": \"User\"}" }'
    
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

