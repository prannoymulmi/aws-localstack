#! /bin/bash

cd src
zip function.zip index.js

aws --profile=localstack  lambda create-function \
    --function-name hello-world \
    --runtime nodejs18.x \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --tags '{"_custom_id_":"hello-world-lambda"}'