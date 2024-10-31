terraform {
  required_version = "1.8.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
  backend "s3" {
    key     = "common/main.tfstate"
    encrypt = true
  }
}

variable "env" {
  type = string
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

# variable "dev_db_host" {
#     type = string
# }
#
# variable "dev_db_port" {
#   type = number
# }
#
# variable "dev_db_user_name" {
#     type = string
# }
#
# variable "dev_db_pwd" {
#     type = string
# }
#
# variable "dev_db_query_string" {
#     type = string
# }
#
# variable "dev_db_cert" {
#     type = string
# }
#
# variable "dev_db_name" {
#     type = string
# }
#
# variable "dev_db_collection_event" {
#   type = string
# }

module "common" {
  source       = "../../modules/common"
  moniker      = var.moniker
  env          = var.env
  vpc_id       = var.vpc_id
  servicealias = var.servicealias
  serviceid    = var.serviceid
  create_layer = false
}