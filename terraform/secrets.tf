resource "aws_secretsmanager_secret" "private_key" {
  name = "private_key"
}

resource "aws_secretsmanager_secret_version" "private_key_version" {
  secret_id     = aws_secretsmanager_secret.private_key.id
  secret_string = file("${path.module}/keys/private.pem")
}

resource "aws_secretsmanager_secret" "public_key" {
  name = "public_key"
}

resource "aws_secretsmanager_secret_version" "public_key_version" {
  secret_id     = aws_secretsmanager_secret.public_key.id
  secret_string = file("${path.module}/keys/public.pem")
}