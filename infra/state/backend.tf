terraform {
  required_version = "1.9.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.53.0"
    }
  }
}

provider "aws" {}

variable "bucket" {
  type = string
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

variable "create_layer" {
  type    = string
  default = false
}

module "common" {
  source       = "../modules/common"
  moniker      = var.moniker
  serviceid    = var.serviceid
  servicealias = var.servicealias
  env          = var.env
  vpc_id       = var.vpc_id
  create_layer = var.create_layer
}

module "bucket" {
  source      = "../modules/s3"
  bucket_name = var.bucket
  tags        = module.common.tags
}

