# This file defines the AWS Elastic Container Service (ECS) configuration.
# ECS is a fully managed container management service that makes it easy to run, stop, 
# and manage Docker containers on a cluster (group of EC2 instances).

# Creating an ECS Cluster where our services will be deployed.
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "my-ecs-cluster"
  
  # The following setting allows us to run tasks without needing EC2 instances.
  # This is called Fargate, a serverless compute engine for containers.
  capacity_providers = ["FARGATE"]

  tags = {
    Name = "Main ECS Cluster"
  }
}

# Define a task definition for our service.
# This tells ECS how to run a specific service, such as the Docker image, memory, and CPU required.
resource "aws_ecs_task_definition" "graphql_event_api_task" {
  family                   = "graphql-event-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # Modify as required by your application.
  memory                   = "512"  # Modify as required by your application.
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([{
    name  = "server-graphql-event-api"
    image = "${aws_ecr_repository.graphql_event_api.repository_url}:latest"
    portMappings = [{
      containerPort = 4000
      hostPort      = 4000
    }]
  }])

  tags = {
    Name = "GraphQL Event API Task"
  }
}

# The service definition tells ECS that we want to run a specified number of instances 
# of a task definition on the cluster.
resource "aws_ecs_service" "graphql_event_api_service" {
  name            = "graphql-event-api-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.graphql_event_api_task.arn
  launch_type     = "FARGATE"

  # Network configuration for the service.
  network_configuration {
    subnets = [aws_subnet.ecs_subnet.id]
    security_groups = [aws_security_group.ecs_sg.id]
  }

  desired_count = 1  # Specify the number of instances of the task you'd like to run.

  tags = {
    Name = "GraphQL Event API Service"
  }
}

# Define a task definition for the server-inversify-client-api service.
resource "aws_ecs_task_definition" "inversify_client_api_task" {
  family                   = "inversify-client-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # Modify as required by your application.
  memory                   = "512"  # Modify as required by your application.
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([{
    name  = "server-inversify-client-api"
    image = "${aws_ecr_repository.inversify_api.repository_url}:latest"
    portMappings = [{
      containerPort = 8001
      hostPort      = 8001
    }]
    # Add other settings like environment variables if needed.
  }])

  tags = {
    Name = "Inversify Client API Task"
  }
}

# The service definition for the server-inversify-client-api.
resource "aws_ecs_service" "inversify_client_api_service" {
  name            = "inversify-client-api-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.inversify_client_api_task.arn
  launch_type     = "FARGATE"

  # Network configuration for the service.
  network_configuration {
    subnets = [aws_subnet.ecs_subnet.id]
    security_groups = [aws_security_group.ecs_sg.id]
  }

  desired_count = 1  # Specify the number of instances of the task you'd like to run.

  tags = {
    Name = "Inversify Client API Service"
  }
}

# Define a task definition for the source-event-agent service.
resource "aws_ecs_task_definition" "source_event_agent_task" {
  family                   = "source-event-agent"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # Modify as required by your application.
  memory                   = "512"  # Modify as required by your application.
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([{
    name  = "source-event-agent"
    image = "${aws_ecr_repository.source_event_agent.repository_url}:latest"
    portMappings = [{
      containerPort = 4000
      hostPort      = 4000
    }]
    # Add other settings like environment variables if needed.
  }])

  tags = {
    Name = "Source Event Agent Task"
  }
}

# The service definition for the source-event-agent.
resource "aws_ecs_service" "source_event_agent_service" {
  name            = "source-event-agent-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.source_event_agent_task.arn
  launch_type     = "FARGATE"

  # Network configuration for the service.
  network_configuration {
    subnets = [aws_subnet.ecs_subnet.id]
    security_groups = [aws_security_group.ecs_sg.id]
  }

  desired_count = 1  # Specify the number of instances of the task you'd like to run.

  tags = {
    Name = "Source Event Agent Service"
  }
}

# Define a task definition for the sqs-listener service.
resource "aws_ecs_task_definition" "sqs_listener_task" {
  family                   = "sqs-listener"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # Modify as required by your application.
  memory                   = "512"  # Modify as required by your application.
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([{
    name  = "sqs-listener"
    image = "${aws_ecr_repository.sqs_listener.repository_url}:latest"
    portMappings = [{
      containerPort = 4000
      hostPort      = 4000
    }]
    # Add other settings like environment variables if needed.
  }])

  tags = {
    Name = "SQS Listener Task"
  }
}

# The service definition for the sqs-listener.
resource "aws_ecs_service" "sqs_listener_service" {
  name            = "sqs-listener-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.sqs_listener_task.arn
  launch_type     = "FARGATE"

  # Network configuration for the service.
  network_configuration {
    subnets = [aws_subnet.ecs_subnet.id]
    security_groups = [aws_security_group.ecs_sg.id]
  }

  desired_count = 1  # Specify the number of instances of the task you'd like to run.

  tags = {
    Name = "SQS Listener Service"
  }
}

