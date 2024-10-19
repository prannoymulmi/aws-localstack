# aws-localstack

# Getting Started 🚀

### Prerequisites for running Application

* <a href=https://www.docker.com/>Docker for Local Stack</a>
* <a href=https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>AWS CLI</a>
* <a href=https://github.com/localstack/awscli-local>AWS CLI Local - To run commands for localstack</a>
* <a href=https://github.com/localstack/terraform-local>Terraform Local</a>
* <a href=https://github.com/localstack/terraform-local>Node 18 and above</a>
* <a href=https://github.com/localstack/terraform-local>Yarn Package manager</a>
* 

## Installing Local Stack

* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>
* <a href=https://docs.localstack.cloud/getting-started/installation/>How to install Localstack</a>


``` bash
# Validates the docker-compose.yml, if the configurations are ok
localstack config validate
```



## How to Start

```bash
## Start Docker compose
docker compose up

./build-and-run.sh

awslocal lambda invoke --function-name lambda-function \
    --payload '{"body": "{\"name\": \"User\"}" }' output.txt
    
    
 #Print log
awslocal lambda invoke --function-name lambda-function \
    --payload '{"body": "{\"name\": \"User\"}" }' \
    response.json && cat response.json

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

