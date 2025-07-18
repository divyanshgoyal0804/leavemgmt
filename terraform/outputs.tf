output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.employee_leave_cluster.arn
}

output "backend_service_arn" {
  description = "ARN of the backend ECS service"
  value       = aws_ecs_service.employee_leave_backend_service.arn
}

output "frontend_service_arn" {
  description = "ARN of the frontend ECS service"
  value       = aws_ecs_service.employee_leave_frontend_service.arn
}

output "load_balancer_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.employee_leave_load_balancer.dns_name
}