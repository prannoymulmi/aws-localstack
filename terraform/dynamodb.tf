resource "aws_dynamodb_table" "tenant_1" {
  name         = "tenant-1-table"
  billing_mode = "PAY_PER_REQUEST"  # or "PROVISIONED"

  attribute {
    name = "id"
    type = "S"  # String
  }

  attribute {
    name = "created_at"
    type = "N"  # Number (for timestamps or other numerical values)
  }

  attribute {
    name = "user_email"
    type = "S"  # String
  }

  hash_key = "id"

  # Global Secondary Index for created_at (optional)
  global_secondary_index {
    name               = "created_at_index"
    hash_key           = "created_at"
    projection_type    = "ALL"
  }

  # Global Secondary Index for user_email
  global_secondary_index {
    name               = "user_email_index"
    hash_key           = "user_email"
    projection_type    = "ALL"
  }

  tags = {
    Name        = "tenant_1"
    Environment = "dev"
  }
}
