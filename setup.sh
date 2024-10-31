#!/bin/bash

BASE_NAME="simple-aws-chatbot"
TARGET_REGION="us-west-2"
TARGET_ENVIRONMENT="dev"

BACKEND_DIR="./infra/state"
BACKEND_BUCKET="${TARGET_ENVIRONMENT}-${BASE_NAME}-state-${TARGET_REGION}"
VAR_FILE_PATH="../environments/us-west-2/${TARGET_ENVIRONMENT}.tfvars"

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

terraformDestroy() {
  echo "terraformDestroy - 1"
  echo "checking terraform backend bucket exists: ${BACKEND_BUCKET}"

    cd "$BACKEND_DIR" || exit

    aws s3api head-bucket --bucket "${BACKEND_BUCKET}" 2>/dev/null
    backendExists=$?

    echo "terraformDestroy - 2"
    echo $backendExists

    if [ $backendExists -ge 0 ]; then
        cd ..
        cd services/insight || exit
        echo "Current directory: $(pwd)"
        echo "terraformDestroy - 5"
        terraform init -reconfigure -backend-config="bucket=${BACKEND_BUCKET}"
        echo "terraformDestroy - 6"
        terraform plan -lock=true --var-file="../${VAR_FILE_PATH}"
        echo "terraformDestroy - 7"
        terraform destroy -lock=true -auto-approve --var-file="../${VAR_FILE_PATH}"
    fi

    echo "terraformDestroy - 8"
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
