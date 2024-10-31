variable "app_name" {
  type    = string
  default = "simple-aws-chatgpt"
}

variable "moniker" {
  type = string
}

variable "servicealias" {
  type = string
}

variable "serviceid" {
  type = string
}

variable "env" {
  type = string
}

variable "log_level" {
  type    = string
  default = "INFO"
}

variable "vpc_id" {
  type = string
}

variable "runtime" {
  type    = string
  default = "nodejs20.x"
}

variable "inline_policy" {
  type = map(any)
  default = {
    "cloud_watch" = {
      "effect"    = "Allow",
      "actions"   = ["cloudwatch:*"],
      "resources" = ["*"]
    },
    vpc_access = {
      "effect" = "Allow"
      "actions" = [
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ],
      "resources" = ["*"]
    },
    secret_manager = {
      "effect"    = "Allow",
      "actions"   = ["secretsmanager:GetSecretValue"],
      "resources" = ["*"]
    }
  }
}
variable "create_layer" {
  type    = bool
  default = true
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_iam_policy" "adsk_boundary" {
  name = "ADSK-Boundary"
}
data "aws_subnets" "selected" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "tag:Name"
#     values = ["*_app1_*", "*_app2_*", "*_app3_*"]
    values = ["*_app2_*", "*_app3_*"]
  }
}

locals {
  tags = {
    environment         = var.env
    "adsk:moniker"      = var.moniker
    "adsk:serviceid"    = var.serviceid
    "adsk:servicealias" = var.servicealias
  }
}

module "lambda_layer" {
  source       = "git::https://github.com/terraform-aws-modules/terraform-aws-lambda?ref=acbd63c7f8b5e3686a24c76763522defa7716237"
  count        = var.create_layer ? 1 : 0
  create_layer = true

  layer_name          = "${var.app_name}-layer"
  compatible_runtimes = ["${var.runtime}"]
  source_path = [{
    path = "../../../code/dist/lambda-functions/layer"
  }]
  artifacts_dir = "${path.root}/.terraform/lambda-builds/layer"
}

output "tags" {
  value = local.tags
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "region" {
  value = data.aws_region.current.name
}

output "app_name" {
  value = var.app_name
}

output "env" {
  value = var.env
}

output "permissions_boundary" {
  value = data.aws_iam_policy.adsk_boundary.arn
}

output "vpc_id" {
  value = var.vpc_id
}

output "subnet_ids" {
   value = data.aws_subnets.selected.ids
}

output "environment_variables" {
  value = {
    "APP_ENV"   = "${var.env}",
    "LOG_LEVEL" = "${var.log_level}"
  }
}

output "runtime" {
  value = var.runtime
}

output "layer_arn" {
  value = var.create_layer ? module.lambda_layer[0].lambda_layer_arn : null
}

output "inline_policy" {
  value = var.inline_policy
}

output "artifacts_dir" {
  value = "${path.root}/.terraform/lambda-builds"
}

output "source_path" {
  value = "../../../code/dist/lambda-functions"
}

output "cw_log_expiration" {
  value = 7
}

output "data_bucket_name" {
  value = "${var.app_name}-data-${var.env}-${data.aws_region.current.name}"
}

output "secret_name" {
  value = "${var.app_name}-secret"
}