#!/bin/bash

# Real-Time Chat Application Deployment Script
# Run this script with sudo on your VPS

set -e

echo "🚀 Starting Chat Application Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Java if not present
if ! command -v java &> /dev/null; then
    print_status "Installing OpenJDK 21..."
    apt install -y openjdk-21-jdk
else
    print_status "Java is already installed: $(java -version 2>&1 | head -n 1)"
fi

# Create application user
print_status "Creating application user..."
if ! id "chatapp" &>/dev/null; then
    useradd --system --shell /bin/false --home-dir /opt/chat-application --create-home chatapp
    print_status "Created user: chatapp"
else
    print_status "User 'chatapp' already exists"
fi

# Create necessary directories
print_status "Creating application directories..."
mkdir -p /opt/chat-application
mkdir -p /var/log/chat-app
chown -R chatapp:chatapp /opt/chat-application
chown -R chatapp:chatapp /var/log/chat-app

# Copy application files
print_status "Copying application files..."
cp demo-0.0.1-SNAPSHOT.jar /opt/chat-application/
cp application-prod.properties /opt/chat-application/
chown chatapp:chatapp /opt/chat-application/*

# Install systemd service
print_status "Installing systemd service..."
cp chat-application.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable chat-application

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    ufw allow 8080/tcp
    print_status "Opened port 8080 for the chat application"
fi

# Start the service
print_status "Starting chat application service..."
systemctl start chat-application

# Check service status
sleep 3
if systemctl is-active --quiet chat-application; then
    print_status "✅ Chat application deployed successfully!"
    print_status "Service is running on port 8080"
    print_status "You can check the status with: systemctl status chat-application"
    print_status "View logs with: journalctl -u chat-application -f"
else
    print_error "❌ Service failed to start. Check logs with: journalctl -u chat-application"
    exit 1
fi

echo ""
print_status "🎉 Deployment completed!"
print_status "Your chat application is now running at: http://YOUR_VPS_IP:8080"
echo ""
