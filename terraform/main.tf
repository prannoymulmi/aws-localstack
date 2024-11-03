module "pkce_authorize_lambda" {
  source = "./module/lambda"
  lambda_function_name = "authorizePKCE"
  source_dir = "deployment/authorizePKCE"
  policies = [
    aws_iam_policy.lambda_dynamodb_policy.arn,
    aws_iam_policy.lambda_cloudwatch_policy.arn
  ]
}