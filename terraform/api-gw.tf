# Create API Gateway REST API
resource "aws_api_gateway_rest_api" "oidc_api" {
  name        = "oidc-apigw"
  description = "API Gateway for invoking Lambda"
}

# Create the root resource
resource "aws_api_gateway_resource" "lambda_resource" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  parent_id   = aws_api_gateway_rest_api.oidc_api.root_resource_id
  path_part   = "authorize"
}

# Create method for the Lambda resource
resource "aws_api_gateway_method" "lambda_method" {
  rest_api_id   = aws_api_gateway_rest_api.oidc_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Create integration between API Gateway and Lambda
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.oidc_api.id
  resource_id             = aws_api_gateway_resource.lambda_resource.id
  http_method             = aws_api_gateway_method.lambda_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.my_lambda.invoke_arn
  # Conditional header mapping for tenant
  request_parameters = {
    "integration.request.header.tenant-header" = "method.request.header.origin" == "tenant1.local" ? "tenant-1" : "tenant-2"
  }
}

# Create deployment for API Gateway
resource "aws_api_gateway_deployment" "example_deployment" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  stage_name  = "dev"

  depends_on = [
    aws_api_gateway_integration.lambda_integration,
  ]
}

