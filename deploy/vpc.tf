# This file contains the network configuration for our ECS services.
# VPC, subnets, and security groups are foundational AWS networking resources.

# Virtual Private Cloud (VPC) configuration
resource "aws_vpc" "ecs_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "ECS VPC"
  }
}

# Subnet configuration within our VPC
resource "aws_subnet" "ecs_subnet" {
  vpc_id = aws_vpc.ecs_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "ECS Subnet"
  }
}

# Security Group configuration to control inbound and outbound traffic
resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.ecs_vpc.id

  # Outbound traffic configuration - currently allowing all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound traffic configuration - adjust according to the application's needs
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ECS Security Group"
  }
}
