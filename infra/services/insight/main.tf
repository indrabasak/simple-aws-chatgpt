terraform {
  required_version = "1.9.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
  backend "s3" {
    key     = "insight/main.tfstate"
    encrypt = true
  }
}

variable "env" {
  type = string
}

variable "log_level" {
  type    = string
  default = "INFO"
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
variable "vpc_id" {
  type = string
}

variable "dev_db_host" {
  type = string
}

variable "dev_db_port" {
  type = number
}

variable "dev_db_user_name" {
  type = string
}

variable "dev_db_pwd" {
  type = string
}

variable "dev_db_query_string" {
  type = string
}

variable "dev_db_cert" {
  type = string
}

variable "dev_db_name" {
  type = string
}

variable "dev_db_collection_event" {
  type = string
}

variable "azure_openai_api_instance_name" {
  type = string
}

variable "azure_openai_api_deployment_name" {
  type = string
}

variable "azure_openai_api_version" {
  type = string
}

variable "azure_authority_host" {
  type = string
}

variable "azure_federated_token_file" {
  type = string
}

variable "azure_tenant_id" {
  type = string
}

variable "azure_client_id" {
  type = string
}

variable "azure_client_secret" {
  type = string
}

module "common" {
  source        = "../../modules/common"
  moniker       = var.moniker
  serviceid     = var.serviceid
  servicealias  = var.servicealias
  env           = var.env
  vpc_id        = var.vpc_id
  log_level     = var.log_level
#   dev_db_host   = var.dev_db_host
#   dev_db_port   = var.dev_db_port
#   dev_db_user_name = var.dev_db_user_name
#   dev_db_pwd    = var.dev_db_pwd
#   dev_db_query_string = var.dev_db_query_string
#   dev_db_cert   = var.dev_db_cert
#   dev_db_name   = var.dev_db_name
#   dev_db_collection_event = var.dev_db_collection_event
}
