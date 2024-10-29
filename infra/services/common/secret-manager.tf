module "secrets_manager" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-secrets-manager?ref=6e549c20f5fe6f8b4f8c36499d1e2455ee3d695b"

  name                    = "${module.common.app_name}-secret"
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
  secret_string = jsonencode({
    FORGE_CLIENT_ID         = "${var.forge_client_id}"
    FORGE_CLIENT_SECRET     = "${var.forge_client_secret}"
    FAROS_API_KEY           = "${var.faros_api_key}"
    CLOUD_DNA_CLIENT_ID     = "${var.cloud_dna_client_id}"
    CLOUD_DNA_CLIENT_SECRET = "${var.cloud_dna_client_secret}"
  })

  tags = module.common.tags
}
