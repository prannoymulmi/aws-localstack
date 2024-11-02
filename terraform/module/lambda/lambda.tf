
data "archive_file" "_" {
  type        = "zip"
  source_dir  = "${path.module}/../../../${var.source_dir}"
  output_path = "${path.module}/../../../${var.source_dir}/${var.lambda_function_name}.zip"
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role._.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Define the Lambda function
resource "aws_lambda_function" "_" {
  function_name = var.lambda_function_name
  role          = aws_iam_role._.arn
  handler       = "deployment/lambda.handler"
  runtime       = "nodejs18.x"

  # Reference the ZIP file
  filename = "${path.module}/../../../deployment/${var.lambda_function_name}/${var.lambda_function_name}.zip"

  source_code_hash = filebase64sha256("${path.module}/../../../deployment/${var.lambda_function_name}/${var.lambda_function_name}.zip")

  environment {
    variables = {
      LOG_LEVEL = var.log_level
    }
  }
  depends_on = [data.archive_file._]
}

# Optional: Define a Lambda function alias
resource "aws_lambda_alias" "_" {
  name             = "dev"
  description      = "Development alias for ${var.lambda_function_name}"
  function_name    = aws_lambda_function._.function_name
  function_version = aws_lambda_function._.version
}

# CloudWatch Log Group for Lambda logs
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function._.function_name}"
  retention_in_days = 7
}

