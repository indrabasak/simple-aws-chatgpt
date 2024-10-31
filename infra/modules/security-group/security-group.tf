variable "name" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "tags" {
  type = map(string)
}

resource "aws_security_group" "lambda_sg" {
  name        = "${var.name}-lambda-sg"
  description = "Allow all outbound traffic, no inbound"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

output "id" {
  value = aws_security_group.lambda_sg.id
}
