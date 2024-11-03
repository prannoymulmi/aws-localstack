output "aws_lambda_function" {
  value = aws_lambda_function._
  description = "AWS Lambda function"
}

output "path" {
  value = path.module
}