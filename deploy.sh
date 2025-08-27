#!/bin/bash

# Real-Time Chat Application Deployment Script
# Run this script with sudo on your VPS

echo "🚀 Starting Chat Application Deployment..."

cd target
sudo java -jar demo-0.0.1-SNAPSHOT.jar
