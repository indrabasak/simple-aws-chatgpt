variable "name" {
  type = string
}
variable "secret" {
  type = map(string)
}
variable "tags" {
  type = map(string)
}

locals {
  secret_name = "${var.name}-secret"
}

module "secrets_manager" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-secrets-manager?ref=6e549c20f5fe6f8b4f8c36499d1e2455ee3d695b"

  name                    = local.secret_name
  recovery_window_in_days = 0
  create_policy           = true
  block_public_policy     = true
  policy_statements = {
    lambda = {
      sid = "LambdaRead"
      principals = [{
        type        = "Service"
        identifiers = ["lambda.amazonaws.com"]
      }]
      actions = [
        "secretsmanager:GetSecretValue"
      ]
      resources = ["*"]
    }
  }
  secret_string = jsonencode(var.secret)

  tags = var.tags
}

output "secret_name" {
  value       = local.secret_name
  description = "Name of the secret"
}
