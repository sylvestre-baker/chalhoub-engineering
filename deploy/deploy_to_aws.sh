#!/bin/bash

# Ensure the script fails on any command failure
set -e

# Source the environment variables from .env
source .env

# Check if ACCOUNT_ID is set
if [[ -z "$ACCOUNT_ID" ]]; then
    echo "ACCOUNT_ID is not set. Check your .env file."
    exit 1
fi

# Function to build, tag, and push image
push_image() {
  dir=$1
  service_name=$2
  repo_name=$3
  
  # Navigate to the directory containing the Dockerfile
  cd $dir

  # Use docker-compose to build the service
  docker-compose build $service_name
  
  # Tag the built image for ECR
  docker tag $service_name:latest $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/$repo_name:latest
  
  # Push the image to ECR
  docker push $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/$repo_name:latest
  
  # Return to the original directory
  cd -
}

# Apply Terraform configurations
terraform_init() {
  # Initialize and apply Terraform configurations
  terraform init
  terraform apply -auto-approve
}

# Main script execution
terraform_init

# Authenticate to ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com

# Call the function for each service
push_image ../inversify.api server-inversify-client-api server-inversify-client-api
push_image ../graphql.event.api server-graphql-event-api server-graphql-event-api
push_image ../source.event.agent source-event-agent source-event-agent
push_image ../sqs.listener sqs-listener sqs-listener

