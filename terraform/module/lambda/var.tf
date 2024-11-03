variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "policies" {
  type        =  list(string)
  description = "A map of IAM policies to attach to the Lambda role"
  default = []

}

variable "log_level" {
  type        = string
  default     = "DEBUG"
  description = "The log level for the Lambda function"
}

variable "source_dir" {
  description = "The directory containing the Lambda function source code"
  type        = string
}