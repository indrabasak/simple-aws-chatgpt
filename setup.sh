#!/bin/bash

BASE_NAME="simple-aws-chatgpt"
TARGET_REGION="us-west-2"
TARGET_ENVIRONMENT="sbx"
BUCKET_NAME="sbx-simple-aws-chatgpt-state-us-west-2"

BACKEND_DIR="./infra/state"
BACKEND_BUCKET="simple-aws-chatgpt-tfstate-sbx-us-west-2"
VAR_FILE_PATH="../environments/us-west-2/sbx.tfvars"

usage() {
    echo "<deploy|destroy>"
}

terraformDeploy() {
  echo "terraformDeploy - 1"
  echo "checking terraform backend bucket exists: ${BACKEND_BUCKET}"

  cd "$BACKEND_DIR" || exit

  aws s3api head-bucket --bucket "${BACKEND_BUCKET}" 2>/dev/null
  backendExists=$?

  echo "terraformDeploy - 2"

  if [ $backendExists -ne 0 ]; then
      echo "terraform backend bucket not exist. Creating..."
      terraform init -reconfigure
      echo "terraformDeploy - 3"
      terraform apply -auto-approve -lock=true --var "bucket=${BACKEND_BUCKET}" --var-file="${VAR_FILE_PATH}"
      echo "terraformDeploy - 4"
  else
      echo "terraform backend bucket exists."
  fi

  cd ..
  cd services/insight || exit

  echo "terraformDeploy - 5"
  terraform init -reconfigure -backend-config="bucket=${BACKEND_BUCKET}"
  echo "terraformDeploy - 6"
  terraform plan -lock=true --var-file="../${VAR_FILE_PATH}"
  echo "terraformDeploy - 7"
  terraform apply -lock=true -auto-approve --var-file="../${VAR_FILE_PATH}"
  echo "terraformDeploy - 8"
}

if [ "$1" = "deploy" ]; then
    echo "deployment started"
    terraformDeploy
    echo "deployment completed"
elif [ "$1" = "destroy" ]; then
    echo "destruction started"
    terraformDestroy
    echo "destruction completed"
else
    echo "Incorrect arguments passed"
    usage
fi
