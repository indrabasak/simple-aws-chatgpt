# simple-aws-chatgpt
A simple example of ChatGPT using AWS


## Getting Started

Follow the steps below to start using this project:

1.  **Environment Variables Configuration:**

    Before you proceed with Terraform, you must set up the necessary environment variables. Note that a prefix of `TF_VAR_` is required for Terraform to recognize these variables:

    ```bash
    export TF_VAR_forge_client_id="<FORGE-CLIENT-ID>"
    export TF_VAR_forge_client_secret="<FORGE-CLIENT-SECRET>"
    export TF_VAR_faros_api_key="<FAROS-API-KEY>"
    ```

2.  **Terraform Initialization:**

    Navigate to the directory containing the Terraform configuration files (for instance, /infra/services/insight) and execute the following command:

    ```bash
    terraform init -reconfigure -backend-config="bucket=simple-insight-tfstate-dev-us-west-2"
    ```

    This command will start Terraform, download the necessary providers, and synchronize the current infrastructure state from the designated S3 bucket.

3.  **Infrastructure Creation with Terraform:**

    To set up the infrastructure, execute the following commands from the corresponding service directory:

    ```bash
    terraform plan -lock=true --var-file=../../environments/us-west-2/dev.tfvars
    terraform apply -lock=true -auto-approve --var-file=../../environments/us-west-2/dev.tfvars