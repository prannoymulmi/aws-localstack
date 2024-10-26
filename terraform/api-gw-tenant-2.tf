# Define custom domain for tenant-2
resource "aws_api_gateway_domain_name" "tenant_2_domain" {
  domain_name = "tenant2.local"
}

# Base path mapping for tenant-2, with tenant-header for tenant-2
resource "aws_api_gateway_base_path_mapping" "tenant_2_mapping" {
  domain_name = aws_api_gateway_domain_name.tenant_2_domain.domain_name
  stage_name  = aws_api_gateway_deployment.example_deployment.stage_name
  api_id      = aws_api_gateway_rest_api.oidc_api.id
}

# Integration response with tenant-2 header
resource "aws_api_gateway_integration_response" "tenant_2_response" {
  rest_api_id = aws_api_gateway_rest_api.oidc_api.id
  resource_id = aws_api_gateway_resource.lambda_resource.id
  http_method = aws_api_gateway_method.lambda_method.http_method
  status_code = "200"

  depends_on = [
    aws_api_gateway_integration.lambda_integration
  ]
  response_parameters = {
    "method.response.header.tenant-id" = "'tenant-2'"
  }
}