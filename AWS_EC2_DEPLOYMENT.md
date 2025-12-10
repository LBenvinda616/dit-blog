# AWS EC2 Deployment Guide for DIT Blog

## Prerequisites
- AWS Account (already created ✓)
- SSH client on your local machine (built-in on Mac/Linux, use PuTTY or OpenSSH on Windows)
- Docker Hub account (optional but recommended for image registry)

## Step 1: Create an EC2 Instance

### 1.1 Launch an EC2 Instance
1. Go to **AWS Console** → **EC2** → **Instances**
2. Click **Launch Instances**
3. Choose **Ubuntu Server 24.04 LTS** (free tier eligible)
4. Instance type: **t2.micro** (free tier eligible, 1GB RAM)
5. Configure:
   - **Network**: Default VPC
   - **Storage**: 20GB (free tier eligible)
   - **Key pair**: Create new → Name it `dit-blog-key` → Download the `.pem` file
6. Security group settings:
   - Add inbound rules:
     - HTTP (80) from anywhere `0.0.0.0/0`
     - HTTPS (443) from anywhere `0.0.0.0/0`
     - SSH (22) from your IP (safer) or anywhere
   - Outbound: Allow all
7. Click **Launch Instance**

### 1.2 Get Your Instance Details
1. Wait for instance status to show "running" (green)
2. Note the **Public IPv4 address** (e.g., `54.123.45.67`)

---

## Step 2: Connect to Your EC2 Instance

### 2.1 SSH into the instance (Mac/Linux)
```bash
# Navigate to where you downloaded the key
cd ~/Downloads

# Set correct permissions
chmod 400 dit-blog-key.pem

# Connect to your instance
ssh -i dit-blog-key.pem ubuntu@<YOUR_PUBLIC_IP>
# Example: ssh -i dit-blog-key.pem ubuntu@54.123.45.67
```

### 2.2 SSH into the instance (Windows - using OpenSSH)
```powershell
# Navigate to where you downloaded the key
cd $env:USERPROFILE\Downloads

# Connect
ssh -i dit-blog-key.pem ubuntu@<YOUR_PUBLIC_IP>
```

### 2.3 SSH into the instance (Windows - using PuTTY)
1. Download PuTTY and PuTTYgen
2. Use PuTTYgen to convert `.pem` to `.ppk`
3. Open PuTTY → Connection → SSH → Auth → Browse to `.ppk` file
4. Go back to Session, enter `ubuntu@<YOUR_PUBLIC_IP>`, click Open

---

## Step 3: Set Up Docker on EC2

Once connected via SSH, run these commands:

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Log out and back in for docker group change to take effect
exit
# SSH back in
```

---

## Step 4: Clone Your Project and Configure

```bash
# Clone your repository (if using Git)
git clone https://github.com/YOUR_USERNAME/dit_blog.git
cd dit_blog

# Or: Upload files manually using SCP
# scp -r -i dit-blog-key.pem ./dit_blog ubuntu@<YOUR_PUBLIC_IP>:/home/ubuntu/dit_blog
```

### 4.1 Create and Configure .env file
```bash
# Create .env from template
cp .env.example .env

# Edit with nano editor
nano .env
```

Add/update these values:
```
DB_NAME=dit_blog
DB_USER=postgres
DB_PASS=your_secure_password_here
DB_HOST=postgres

HF_TOKEN=your_huggingface_token_here

RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=300
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

---

## Step 5: Update Docker Compose for Production

Edit `docker-compose.yml` to use your public IP:

```bash
nano docker-compose.yml
```

Change the frontend build args section from:
```yaml
args:
  VITE_API_BASE_URL: http://localhost:3000/api
```

To:
```yaml
args:
  VITE_API_BASE_URL: http://<YOUR_PUBLIC_IP>:3000/api
```

Save the file.

---

## Step 6: Build and Run with Docker Compose

```bash
# Navigate to project directory
cd /home/ubuntu/dit_blog

# Build and start all services (runs in background)
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Step 7: Access Your Application

1. Open browser and go to:
   - **Frontend**: `http://<YOUR_PUBLIC_IP>`
   - **Backend API**: `http://<YOUR_PUBLIC_IP>:3000/api/articles`
   - **Database**: `<YOUR_PUBLIC_IP>:5432` (PostgreSQL)

2. Test the application:
   - Try generating an article
   - Check if rate limiting works
   - Verify the archive page

---

## Step 8: Set Up Domain Name (Optional)

If you have a domain name:

1. Go to your domain registrar (GoDaddy, Namecheap, Route53, etc.)
2. Create an **A record** pointing to your EC2 public IP
3. Wait for DNS propagation (10 minutes to 48 hours)
4. Access via your domain

---

## Step 9: Enable HTTPS with Let's Encrypt (Recommended)

Add this to your `docker-compose.yml` frontend service:

```yaml
frontend:
  # ... existing config ...
  environment:
    - CERTBOT_EMAIL=your_email@example.com
    - DOMAIN_NAME=yourdomain.com  # or your IP if no domain
```

Or use Nginx Proxy Manager in a separate container for automatic SSL.

---

## Production Best Practices

### 1. Database Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres dit_blog > backup.sql

# Download backup locally
scp -i dit-blog-key.pem ubuntu@<YOUR_PUBLIC_IP>:/home/ubuntu/dit_blog/backup.sql ./
```

### 2. Update Application
```bash
# Pull latest code (if using Git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

### 3. View Logs for Debugging
```bash
# Recent logs
docker-compose logs --tail 50

# Real-time logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend
```

### 4. Stop All Services
```bash
docker-compose down
```

### 5. Stop and Remove Data (WARNING)
```bash
docker-compose down -v
```

---

## Monitoring and Maintenance

### Check System Resources
```bash
# See container resource usage
docker stats

# See disk space
df -h

# See memory usage
free -h
```

### Monitor Service Health
```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs -f backend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## Troubleshooting

### Can't Connect to Frontend
1. Verify security group allows HTTP (80) traffic
2. Check if container is running: `docker-compose ps`
3. View logs: `docker-compose logs frontend`

### Backend API Errors
1. Check logs: `docker-compose logs backend`
2. Verify HF_TOKEN is set: `cat .env`
3. Check database connection: `docker-compose logs postgres`

### Database Connection Issues
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check DB credentials in `.env`
3. View DB logs: `docker-compose logs postgres`

### Out of Memory
- Upgrade EC2 instance type to `t2.small` or higher
- Consider removing old containers: `docker system prune`

### Port Already in Use
```bash
# Find what's using port 80
sudo lsof -i :80

# Kill process (use PID from above)
sudo kill -9 <PID>
```

---

## Cost Optimization

### Free Tier Usage (12 months)
- ✅ t2.micro instance (1 GB RAM)
- ✅ 20 GB storage
- ⚠️ 100 GB outbound bandwidth free each month

### Tips to Stay in Free Tier
1. Use `t2.micro` instance type
2. Stop instance when not in use
3. Monitor outbound data transfer
4. Set up AWS billing alerts

### AWS Billing Alerts
1. Go to **Billing Dashboard**
2. Click **Billing Preferences**
3. Enable "Receive Billing Alerts"
4. Set up alert threshold (e.g., $1.00)

---

## Next Steps

1. ✅ Create EC2 instance
2. ✅ Connect via SSH
3. ✅ Install Docker
4. ✅ Deploy with Docker Compose
5. 📊 Monitor application
6. 🔒 Set up backups
7. 🌐 Add custom domain (optional)
8. 📜 Set up SSL/HTTPS (optional)

---

## Useful Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [AWS Free Tier Details](https://aws.amazon.com/free/)

---

## Support

For issues, check:
1. CloudWatch logs: `docker-compose logs`
2. AWS Console → EC2 → Status Checks
3. Security Groups rules
4. .env file configuration
