
# Define an IAM role for Lambda
resource "aws_iam_role" "_" {
  name = "lambda-execution-role-${var.lambda_function_name}"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachments" {
  for_each   = local.policy_map
  role       = aws_iam_role._.name
  policy_arn = each.value
}

locals {
  policy_map = { for idx, policy in var.policies : idx => policy }
}