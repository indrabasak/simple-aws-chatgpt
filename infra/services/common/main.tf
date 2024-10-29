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

variable "forge_client_id" {
  type = string
}

variable "forge_client_secret" {
  type = string

}

variable "faros_api_key" {
  type = string
}

variable "cloud_dna_client_id" {
  type = string
}

variable "cloud_dna_client_secret" {
  type = string
}

module "common" {
  source       = "../../modules/common"
  moniker      = var.moniker
  env          = var.env
  vpc_id       = var.vpc_id
  servicealias = var.servicealias
  serviceid    = var.serviceid
  create_layer = false
}