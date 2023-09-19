# This file contains the base configuration and the provider definition.
# Terraform uses this to determine which cloud provider and region we're working with.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.45.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1" # Specifying the AWS region where resources will be provisioned.
}
