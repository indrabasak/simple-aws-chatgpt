
locals {
  oc_lambda_name         = module.insight_function.lambda_function_name
  oc_lambda_invoke_arn   = module.insight_function.lambda_function_invoke_arn
}

resource "aws_api_gateway_rest_api" "api" {
  name = "${local.insight_prefix}-api"
}

resource "aws_api_gateway_resource" "v1" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "v1"
}

resource "aws_api_gateway_resource" "service" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.v1.id
  path_part   = "insight"
}

resource "aws_api_gateway_resource" "service_id" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.service.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "service_post" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.service.id
  http_method          = "POST"
  authorization        = "NONE"
#   authorizer_id        = aws_api_gateway_authorizer.apigw_authorizer.id
#   request_validator_id = aws_api_gateway_request_validator.post_request_validator.id
#   request_models = {
#     "application/json" = aws_api_gateway_model.post_model.name
#   }
}

resource "aws_api_gateway_method_response" "service_post_response_200" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.service.id
    http_method   = aws_api_gateway_method.service_post.http_method
    status_code   = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = ["aws_api_gateway_method.service_post"]
}

resource "aws_api_gateway_integration" "service_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.service.id
  http_method             = aws_api_gateway_method.service_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.oc_lambda_invoke_arn
}

resource "aws_api_gateway_method" "options_method" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.service.id
    http_method   = "OPTIONS"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.service.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = "200"
    
    response_models = {
        "application/json" = "Empty"
    }
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.options_method]
}

resource "aws_api_gateway_integration" "options_integration" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.service.id
    http_method   = aws_api_gateway_method.options_method.http_method
    type          = "MOCK"

    request_templates = {
        "application/json" = "{ \"statusCode\": 200 }"
    }
    depends_on = [aws_api_gateway_method.options_method]
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
    rest_api_id   = aws_api_gateway_rest_api.api.id
    resource_id   = aws_api_gateway_resource.service.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = aws_api_gateway_method_response.options_200.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS'",
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [aws_api_gateway_method_response.options_200]
}

# resource "aws_api_gateway_request_validator" "post_request_validator" {
#   name                        = "post-request-validator"
#   rest_api_id                 = aws_api_gateway_rest_api.api.id
#   validate_request_body       = true
#   validate_request_parameters = false
# }
#
# resource "aws_api_gateway_model" "post_model" {
#   rest_api_id  = aws_api_gateway_rest_api.api.id
#   name         = "postModel"
#   description  = "POST model"
#   content_type = "application/json"
#   schema       = file("${path.module}/schemas/post-schema.json")
# }
#
# resource "aws_api_gateway_request_validator" "put_request_validator" {
#   name                        = "put-request-validator"
#   rest_api_id                 = aws_api_gateway_rest_api.api.id
#   validate_request_body       = true
#   validate_request_parameters = false
# }

resource "aws_lambda_permission" "apigw_insight_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = local.oc_lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}

# resource "aws_lambda_permission" "apigw_auth_lambda" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = local.auth_lambda_name
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/authorizers/${aws_api_gateway_authorizer.apigw_authorizer.id}"
# }

# resource "aws_api_gateway_authorizer" "apigw_authorizer" {
#   name                             = "${module.common.app_name}-apigw-authorizer"
#   rest_api_id                      = aws_api_gateway_rest_api.api.id
#   authorizer_uri                   = local.auth_lambda_invoke_arn
#   authorizer_result_ttl_in_seconds = 0
# }

resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    aws_api_gateway_integration.service_post_integration,
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.env
}

resource "aws_api_gateway_method_settings" "general_settings" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.env
  method_path = "*/*"

  settings {
    logging_level      = "INFO"
    metrics_enabled    = true
    data_trace_enabled = true
  }

  depends_on = [aws_api_gateway_stage.api_stage, aws_cloudwatch_log_group.api_gateway_logs]
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.api.id}/${var.env}"
  retention_in_days = module.common.cw_log_expiration
}



output "api_name" {
  value = aws_api_gateway_rest_api.api.name
}

output "api_url" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}${var.env}"
}