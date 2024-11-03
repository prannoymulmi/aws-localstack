# Create API Gateway REST API
resource "aws_api_gateway_rest_api" "oidc_api" {
  name        = "oidc-apigw"
  description = "API Gateway for invoking Lambda"
  body = templatefile("${path.root}/../configurations/openapi.yml.tpl", {
    lambda_invoke_arn_authorize = module.pkce_authorize_lambda.aws_lambda_function.arn
    lambda_invoke_arn_token = module.pkce_token_lambda.aws_lambda_function.arn
  })
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Create deployment for API Gateway
resource "aws_api_gateway_deployment" "example_deployment" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  stage_name  = "dev"
}
