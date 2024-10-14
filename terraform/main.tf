
# Define an IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda-execution-role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow"
      }
    ]
  })
}

# Attach the AWS managed policy for basic Lambda permissions
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Define the Lambda function
resource "aws_lambda_function" "my_lambda" {
  function_name = "my_lambda_function"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  # Reference the ZIP file
  filename      = "${path.module}/../src/lambda_function.zip"

  source_code_hash = filebase64sha256("${path.module}/../src/lambda_function.zip")

  environment {
    variables = {
      ENV_VAR = "value"
    }
  }
}

# Optional: Define a Lambda function alias
resource "aws_lambda_alias" "my_lambda_alias" {
  name             = "dev"
  description      = "Development alias"
  function_name    = aws_lambda_function.my_lambda.function_name
  function_version = aws_lambda_function.my_lambda.version
}
