locals {
    insight_name   = "insight"
    insight_prefix = "${module.common.app_name}-${local.insight_name}"
#     insight_env_vars = merge(
#         module.common.environment_variables,
#         {
#             DT_TAGS = "ServiceAlias=${var.servicealias} ServiceID=${var.serviceid} Moniker=${var.moniker}",
#             AWS_LAMBDA_EXEC_WRAPPER = "/opt/dynatrace"
#             DT_TENANT = var.dyTenant,
#             DT_CLUSTER_ID = var.dtClusterId,
#             DT_CONNECTION_BASE_URL = var.dtConnectionBaseUrl,
#             DT_CONNECTION_AUTH_TOKEN = var.auth_token,
#             DT_LAYER_ARN = var.dynatraceLayer,
#             DT_OPEN_TELEMETRY_ENABLE_INTEGRATION = "false"
#         } // Add additional environment variables here
#     )
#     insight_policy_statements = merge(
#         module.common.inline_policy,
#         {
#             dynamodb = {
#                 "effect" = "Allow",
#                 "actions" = [
#                     "dynamodb:BatchGetItem",
#                     "dynamodb:GetItem",
#                     "dynamodb:Query",
#                     "dynamodb:Scan",
#                     "dynamodb:BatchWriteItem",
#                     "dynamodb:PutItem",
#                     "dynamodb:UpdateItem",
#                     "dynamodb:DeleteItem"
#                 ],
#                 "resources" = ["arn:aws:dynamodb:*:*:table/pde-exception-*"]
#             }
#         }
#     )

    insight_policy_statements = merge(
        module.common.inline_policy,
        {} // Add additional inline policy statements here
    )
}

module "insight_sg" {
    source = "../../modules/security-group/"
    name   = local.insight_name
    vpc_id = module.common.vpc_id
    tags   = module.common.tags
}

module "insight_function" {
    source = "git::https://github.com/terraform-aws-modules/terraform-aws-lambda?ref=acbd63c7f8b5e3686a24c76763522defa7716237"

    function_name                     = local.insight_prefix
    handler                           = "${local.insight_name}/index.handler"
    runtime                           = module.common.runtime
    timeout                           = 30
    source_path                       = "${module.common.source_path}/${local.insight_name}"
    artifacts_dir                     = module.common.artifacts_dir
    publish                           = true
#     environment_variables             = local.insight_env_vars
    vpc_subnet_ids                    = module.common.subnet_ids
    vpc_security_group_ids            = [module.insight_sg.id]
    role_name                         = "${local.insight_prefix}-${module.common.region}"
    role_permissions_boundary         = module.common.permissions_boundary
    attach_policy_statements          = true
    attach_policies                   = true
    policy_statements                 = local.insight_policy_statements
    layers                            = [module.common.layer_arn]
    cloudwatch_logs_retention_in_days = module.common.cw_log_expiration
    tags                              = module.common.tags
}

# resource "aws_cloudwatch_log_subscription_filter" "insight_log_subscription" {
#     name            = "${local.insight_prefix}-subscription"
#     log_group_name  = module.insight_function.lambda_cloudwatch_log_group_name
#     filter_pattern  = ""
#     destination_arn = module.common.splunk_firehose_arn
#     role_arn        = module.common.splunk_role
# }
