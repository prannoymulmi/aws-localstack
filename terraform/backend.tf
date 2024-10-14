# main.tf
terraform {
  backend "s3" {
    bucket = "state-bucket"
    key    = "terraform.tfstate"
    region = "us-east-1"
    endpoint = "http://localhost:4566"  # LocalStack S3 endpoint
    access_key = "test"                 # Default LocalStack access key
    secret_key = "test"                 # Default LocalStack secret key
    force_path_style = true
  }
}

