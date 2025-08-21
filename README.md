# Chat Application VPS Deployment

This directory contains all the files needed to deploy your Real-Time Chat Application to a VPS.

## Files Included

- `demo-0.0.1-SNAPSHOT.jar` - The main application JAR file
- `application-prod.properties` - Production configuration
- `chat-application.service` - systemd service configuration
- `deploy.sh` - Automated deployment script
- `nginx.conf` - Nginx reverse proxy configuration (optional)

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. Upload all files to your VPS
2. SSH into your VPS
3. Navigate to the deployment directory
4. Run: `sudo ./deploy.sh`

### Option 2: Manual Deployment

If you prefer to deploy manually, follow these steps:

1. **Update system and install Java:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y openjdk-21-jdk
   ```

2. **Create application user:**
   ```bash
   sudo useradd --system --shell /bin/false --home-dir /opt/chat-application --create-home chatapp
   ```

3. **Create directories:**
   ```bash
   sudo mkdir -p /opt/chat-application
   sudo mkdir -p /var/log/chat-app
   sudo chown -R chatapp:chatapp /opt/chat-application
   sudo chown -R chatapp:chatapp /var/log/chat-app
   ```

4. **Copy application files:**
   ```bash
   sudo cp demo-0.0.1-SNAPSHOT.jar /opt/chat-application/
   sudo cp application-prod.properties /opt/chat-application/
   sudo chown chatapp:chatapp /opt/chat-application/*
   ```

5. **Install systemd service:**
   ```bash
   sudo cp chat-application.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable chat-application
   sudo systemctl start chat-application
   ```

6. **Configure firewall:**
   ```bash
   sudo ufw allow 8080/tcp
   ```

## Optional: Nginx Reverse Proxy

For production use with a domain name, set up Nginx:

1. **Install Nginx:**
   ```bash
   sudo apt install -y nginx
   ```

2. **Configure Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/chat-application
   sudo ln -s /etc/nginx/sites-available/chat-application /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default  # Remove default site
   ```

3. **Edit the configuration:**
   - Replace `your-domain.com` with your actual domain
   - Test configuration: `sudo nginx -t`
   - Restart Nginx: `sudo systemctl restart nginx`

## Post-Deployment

### Check Service Status
```bash
sudo systemctl status chat-application
```

### View Logs
```bash
# Real-time logs
sudo journalctl -u chat-application -f

# Application logs (if logging to file is configured)
sudo tail -f /var/log/chat-app/chat-application.log
```

### Manage the Service
```bash
# Start
sudo systemctl start chat-application

# Stop
sudo systemctl stop chat-application

# Restart
sudo systemctl restart chat-application

# Disable auto-start
sudo systemctl disable chat-application
```

## Accessing the Application

- **Direct access:** `http://YOUR_VPS_IP:8080`
- **With Nginx:** `http://your-domain.com` (after domain configuration)

## Troubleshooting

### Service won't start
1. Check logs: `sudo journalctl -u chat-application -n 50`
2. Verify Java installation: `java -version`
3. Check file permissions: `ls -la /opt/chat-application/`

### Port 8080 not accessible
1. Check firewall: `sudo ufw status`
2. Verify service is running: `sudo netstat -tlnp | grep 8080`
3. Check VPS provider firewall rules

### Memory issues
- The application is configured to use 256MB-512MB RAM
- Adjust in the systemd service file if needed

## Security Notes

- The application runs as a non-root user (`chatapp`)
- Firewall rules limit access to necessary ports only
- Consider using HTTPS with SSL certificates for production
- Regularly update your VPS and Java runtime

## Support

If you encounter issues, check:
1. Application logs
2. System journal logs
3. Network connectivity
4. Java version compatibility (Java 21+ required)
