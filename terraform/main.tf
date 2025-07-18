provider "aws" {
  region = "us-west-2"
}

# Mock VPC
resource "aws_vpc" "employee_leave_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "employee-leave-vpc"
  }
}

# Mock Public Subnets
resource "aws_subnet" "employee_leave_public_subnet_1" {
  vpc_id                  = aws_vpc.employee_leave_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-west-2a"

  tags = {
    Name = "employee-leave-public-subnet-1"
  }
}

resource "aws_subnet" "employee_leave_public_subnet_2" {
  vpc_id                  = aws_vpc.employee_leave_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-west-2b"

  tags = {
    Name = "employee-leave-public-subnet-2"
  }
}

# Mock Security Groups
resource "aws_security_group" "employee_leave_backend_sg" {
  vpc_id = aws_vpc.employee_leave_vpc.id

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "employee-leave-backend-sg"
  }
}

resource "aws_security_group" "employee_leave_frontend_sg" {
  vpc_id = aws_vpc.employee_leave_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "employee-leave-frontend-sg"
  }
}

# Mock ECS Cluster
resource "aws_ecs_cluster" "employee_leave_cluster" {
  name = "employee-leave-cluster"

  tags = {
    Name = "employee-leave-cluster"
  }
}

# Mock IAM Roles and Policies
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
        Sid = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_iam_role" "ecs_task_role" {
  name = "ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
        Sid = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.ecs_task_role.name
}

# Mock Task Definitions
resource "aws_ecs_task_definition" "employee_leave_backend_task" {
  family                   = "employee-leave-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "employee-leave-backend"
      image     = "<your_docker_username>/employee-leave-management-backend:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5001
          hostPort      = 5001
        }
      ]
      secrets = [
        {
          name      = "MONGO_URI"
          valueFrom = "arn:aws:secretsmanager:us-west-2:123456789012:secret:MongoURI-abcdef"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "arn:aws:secretsmanager:us-west-2:123456789012:secret:JWTSecret-abcdef"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/employee-leave-backend"
          "awslogs-region"        = "us-west-2"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "employee-leave-backend-task"
  }
}

resource "aws_ecs_task_definition" "employee_leave_frontend_task" {
  family                   = "employee-leave-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "employee-leave-frontend"
      image     = "<your_docker_username>/employee-leave-management-frontend:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/employee-leave-frontend"
          "awslogs-region"        = "us-west-2"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "employee-leave-frontend-task"
  }
}

# Mock ECS Services
resource "aws_ecs_service" "employee_leave_backend_service" {
  name            = "employee-leave-backend-service"
  cluster         = aws_ecs_cluster.employee_leave_cluster.id
  task_definition = aws_ecs_task_definition.employee_leave_backend_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.employee_leave_public_subnet_1.id, aws_subnet.employee_leave_public_subnet_2.id]
    security_groups  = [aws_security_group.employee_leave_backend_sg.id]
    assign_public_ip = true
  }

  tags = {
    Name = "employee-leave-backend-service"
  }
}

resource "aws_ecs_service" "employee_leave_frontend_service" {
  name            = "employee-leave-frontend-service"
  cluster         = aws_ecs_cluster.employee_leave_cluster.id
  task_definition = aws_ecs_task_definition.employee_leave_frontend_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.employee_leave_public_subnet_1.id, aws_subnet.employee_leave_public_subnet_2.id]
    security_groups  = [aws_security_group.employee_leave_frontend_sg.id]
    assign_public_ip = true
  }

  tags = {
    Name = "employee-leave-frontend-service"
  }
}

# Mock Load Balancer
resource "aws_lb" "employee_leave_load_balancer" {
  name               = "employee-leave-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.employee_leave_frontend_sg.id]
  subnets            = [aws_subnet.employee_leave_public_subnet_1.id, aws_subnet.employee_leave_public_subnet_2.id]

  tags = {
    Name = "employee-leave-load-balancer"
  }
}

resource "aws_lb_target_group" "employee_leave_backend_target_group" {
  name     = "employee-leave-backend-target-group"
  port     = 5001
  protocol = "HTTP"
  vpc_id   = aws_vpc.employee_leave_vpc.id

  tags = {
    Name = "employee-leave-backend-target-group"
  }
}

resource "aws_lb_target_group" "employee_leave_frontend_target_group" {
  name     = "employee-leave-frontend-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.employee_leave_vpc.id

  tags = {
    Name = "employee-leave-frontend-target-group"
  }
}

resource "aws_lb_listener" "employee_leave_backend_listener" {
  load_balancer_arn = aws_lb.employee_leave_load_balancer.arn
  port              = 5001
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.employee_leave_backend_target_group.arn
  }

  tags = {
    Name = "employee-leave-backend-listener"
  }
}

resource "aws_lb_listener" "employee_leave_frontend_listener" {
  load_balancer_arn = aws_lb.employee_leave_load_balancer.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.employee_leave_frontend_target_group.arn
  }

  tags = {
    Name = "employee-leave-frontend-listener"
  }
}

# Mock CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "employee_leave_backend_logs" {
  name = "/ecs/employee-leave-backend"
}

resource "aws_cloudwatch_log_group" "employee_leave_frontend_logs" {
  name = "/ecs/employee-leave-frontend"
}