# This file defines the Elastic Container Registry (ECR) repositories for our Docker services.
# ECR is AWS's managed Docker container registry that allows developers to store, manage, and deploy Docker images.

resource "aws_ecr_repository" "inversify_api" {
  name = "server-inversify-client-api"
  
  tags = {
    Name = "Inversify API Repository"
  }
}

resource "aws_ecr_repository" "graphql_event_api" {
  name = "server-graphql-event-api"
  
  tags = {
    Name = "GraphQL Event API Repository"
  }
}

resource "aws_ecr_repository" "source_event_agent" {
  name = "source-event-agent"
  
  tags = {
    Name = "Source Event Agent Repository"
  }
}

resource "aws_ecr_repository" "sqs_listener" {
  name = "sqs-listener"
  
  tags = {
    Name = "SQS Listener Repository"
  }
}
