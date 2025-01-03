locals {
    insight_name   = "insight"
    insight_prefix = "${module.common.app_name}-${local.insight_name}"
    insight_env_vars = merge(
        module.common.environment_variables,
        {
            DB_DEV_SECRET = module.db_dev_secret.secret_name,
            OPENAI_SECRET = module.openai_secret.secret_name
        }
    )

    insight_policy_statements = merge(
        module.common.inline_policy,
        {}
    )
}

module "insight_sg" {
    source = "../../modules/security-group/"
    name   = local.insight_name
    vpc_id = module.common.vpc_id
    tags   = module.common.tags
}

module "db_dev_secret" {
    source = "../../modules/secret-manager/"
    name   = "${module.common.app_name}-db-dev"
    tags   = module.common.tags
    secret = {
        DB_HOST             = "${var.dev_db_host}"
        DB_PORT             = "${var.dev_db_port}"
        DB_USER_NAME        = "${var.dev_db_user_name}"
        DB_PWD              = "${var.dev_db_pwd}"
        DB_QUERY_STRING     = "${var.dev_db_query_string}"
        DB_CERT             = "${var.dev_db_cert}"
        DB_NAME             = "${var.dev_db_name}"
        DB_COLLECTION_EVENT = "${var.dev_db_collection_event}"
    }
}

module "openai_secret" {
    source = "../../modules/secret-manager/"
    name   = "${module.common.app_name}-openai"
    tags   = module.common.tags
    secret = {
        AZURE_OPENAI_API_INSTANCE_NAME    = "${var.azure_openai_api_instance_name}"
        AZURE_OPENAI_API_DEPLOYMENT_NAME  = "${var.azure_openai_api_deployment_name}"
        AZURE_OPENAI_API_VERSION          = "${var.azure_openai_api_version}"
        AZURE_AUTHORITY_HOST              = "${var.azure_authority_host}"
        AZURE_FEDERATED_TOKEN_FILE        = "${var.azure_federated_token_file}"
        AZURE_TENANT_ID                   = "${var.azure_tenant_id}"
        AZURE_CLIENT_ID                   = "${var.azure_client_id}"
        AZURE_CLIENT_SECRET               = "${var.azure_client_secret}"
    }
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
    environment_variables             = local.insight_env_vars
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
