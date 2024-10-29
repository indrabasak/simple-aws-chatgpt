
variable "bucket_name" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "create_bucket" {
  type    = bool
  default = true
}

data "aws_caller_identity" "current" {}

module "s3_bucket" {
  source                   = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket?ref=8a0b697adfbc673e6135c70246cff7f8052ad95a"
  bucket                   = var.bucket_name
  acl                      = "private"
  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"
  expected_bucket_owner    = data.aws_caller_identity.current.account_id

  versioning = {
    enabled = true
  }
  force_destroy = true

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  create_bucket = var.create_bucket
  tags          = var.tags
}

output "bucket_arn" {
  value = module.s3_bucket.s3_bucket_arn
}

output "bucket_id" {
  value = module.s3_bucket.s3_bucket_id
}
