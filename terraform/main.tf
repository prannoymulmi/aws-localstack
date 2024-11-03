module "pkce_authorize_lambda" {
  source               = "./module/lambda"
  lambda_function_name = "authorizePKCE"
  source_dir           = "deployment/authorizePKCE"
  policies = [
    aws_iam_policy.lambda_dynamodb_policy.arn,
    aws_iam_policy.lambda_cloudwatch_policy.arn
  ]
}

module "pkce_token_lambda" {
  source               = "./module/lambda"
  lambda_function_name = "tokenPKCE"
  source_dir           = "deployment/tokenPKCE"
  policies = [
    aws_iam_policy.lambda_dynamodb_policy.arn,
    aws_iam_policy.lambda_cloudwatch_policy.arn
  ]
}