# Define custom domain for tenant-1
resource "aws_api_gateway_domain_name" "tenant_1_domain" {
  domain_name = "tenant1.local" # work around without ningx to have domain name with port
}

# Base path mapping for tenant-1, with tenant-header for tenant-1
resource "aws_api_gateway_base_path_mapping" "tenant_1_mapping" {
  domain_name = aws_api_gateway_domain_name.tenant_1_domain.domain_name
  stage_name  = aws_api_gateway_deployment.example_deployment.stage_name
  api_id      = aws_api_gateway_rest_api.oidc_api.id
}

# Define the method response to specify tenant-id in the response headers
resource "aws_api_gateway_method_response" "tenant_1_method_response" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  resource_id = aws_api_gateway_resource.lambda_resource.id
  http_method = aws_api_gateway_method.lambda_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.tenant-id" = true
  }
}


# Integration response with tenant-1 header
resource "aws_api_gateway_integration_response" "tenant_1_response" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  resource_id = aws_api_gateway_resource.lambda_resource.id
  http_method = aws_api_gateway_method.lambda_method.http_method
  status_code = "200"

  depends_on = [
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_method_response.tenant_1_method_response
  ]

  response_parameters = {
    "method.response.header.tenant-id" = "'tenant-1'"
  }
}