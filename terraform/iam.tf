
# IAM Policy to allow Lambda to access DynamoDB
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "lambda-dynamodb-policy"
  description = "IAM policy for Lambda to access DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Effect = "Allow",
        Resource = [
          aws_dynamodb_table.tenant_1.arn,
          aws_dynamodb_table.tenant_2.arn,
          aws_dynamodb_table.catalog_table.arn
        ]
      }
    ]
  })
}


# Lambda permission for API Gateway
resource "aws_lambda_permission" "pkce_authorize_lambda_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.pkce_authorize_lambda.aws_lambda_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.oidc_api.execution_arn}/*/*"
}


# IAM Policy for Lambda to log to CloudWatch
resource "aws_iam_policy" "lambda_cloudwatch_policy" {
  name        = "lambda_cloudwatch_logs_policy"
  description = "IAM policy to allow Lambda to write logs to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:*"
        ],
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}
