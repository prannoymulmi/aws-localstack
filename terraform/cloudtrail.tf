resource "aws_cloudtrail" "my_trail" {
  name                          = "oidc-cloud-trail"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket.bucket
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true
}

resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket = "cloud-trail-bucket"
}