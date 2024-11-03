resource "aws_dynamodb_table" "tenant_1" {
  name         = "tenant-1-table"
  billing_mode = "PAY_PER_REQUEST" # Use on-demand pricing (PAY_PER_REQUEST) for testing

  attribute {
    name = "id"
    type = "S" # String
  }

  attribute {
    name = "created_at"
    type = "N" # Number (for timestamps or other numerical values)
  }

  attribute {
    name = "user_email"
    type = "S" # String
  }

  hash_key = "id"

  # Global Secondary Index for created_at (optional)
  global_secondary_index {
    name            = "created_at_index"
    hash_key        = "created_at"
    projection_type = "ALL"
  }

  # Global Secondary Index for user_email
  global_secondary_index {
    name            = "user_email_index"
    hash_key        = "user_email"
    projection_type = "ALL"
  }

  tags = {
    Name        = "tenant_1"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "tenant_2" {
  name         = "tenant-2-table"
  billing_mode = "PAY_PER_REQUEST" # Use on-demand pricing (PAY_PER_REQUEST) for testing"

  attribute {
    name = "id"
    type = "S" # String
  }

  attribute {
    name = "created_at"
    type = "N" # Number (for timestamps or other numerical values)
  }

  attribute {
    name = "user_email"
    type = "S" # String
  }

  hash_key = "id"

  # Global Secondary Index for created_at (optional)
  global_secondary_index {
    name            = "created_at_index"
    hash_key        = "created_at"
    projection_type = "ALL"
  }

  # Global Secondary Index for user_email
  global_secondary_index {
    name            = "user_email_index"
    hash_key        = "user_email"
    projection_type = "ALL"
  }

  tags = {
    Name        = "tenant_2"
    Environment = "dev"
  }
}


# Create DynamoDB Table for the Tenant Catalog
resource "aws_dynamodb_table" "catalog_table" {
  name         = "catalog-table"   # Name of the catalog table
  billing_mode = "PAY_PER_REQUEST" # Use on-demand pricing (PAY_PER_REQUEST) for testing

  # Define the primary key (tenantId)
  hash_key = "tenantId"

  attribute {
    name = "tenantId"
    type = "S" # String type
  }


  # Optional tags for resource organization and cost allocation
  tags = {
    Name        = "TenantCatalog"
    Environment = "dev"
  }
}
