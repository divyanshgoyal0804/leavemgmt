variable "docker_username" {
  description = "Docker Hub username"
  type        = string
}

variable "docker_password" {
  description = "Docker Hub password"
  type        = string
  sensitive   = true
}

variable "aws_access_key_id" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
  type        = string
  sensitive   = true
}