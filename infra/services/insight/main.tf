terraform {
  required_version = "1.9.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
  backend "s3" {
    key     = "exceptions/main.tfstate"
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

# variable "domain_name" {
#   type = string
# }
#
# variable "route53_weight" {
#   type = number
# }
#
# variable "dyTenant" {
#   type = string
# }
#
# variable "dtClusterId" {
#   type = string
# }
#
# variable "dtConnectionBaseUrl" {
#   type = string
# }
#
# variable "auth_token" {
#   type = string
# }

# variable "dynatraceLayer" {
#   type = string
# }

module "common" {
  source        = "../../modules/common"
  moniker       = var.moniker
  serviceid     = var.serviceid
  servicealias  = var.servicealias
  env           = var.env
  vpc_id        = var.vpc_id
  log_level     = var.log_level
}
