# Cloudflare Tunnel Setup for leboube.ai

This guide will help you set up Cloudflare tunnels to expose your AI Products Suite to the internet using your `leboube.ai` domain.

## Prerequisites

- Cloudflare account with `leboube.ai` domain added
- `cloudflared` CLI installed on your server
- Docker and Docker Compose running
- All services running locally

## Architecture Overview

```
Internet → Cloudflare → Cloudflare Tunnel → Your Server → Docker Services
```

### Domain Structure

- `leboube.ai` → Landing Page (Port 8000)
- `headshots.leboube.ai` → AI Headshot Photographer (Port 7693)
- `pdf.leboube.ai` → AI PDF Parser & Chat (Port 3951)
- `baseball.leboube.ai` → Baseball Exit Velocity (Port 8080)
- `hairstyle.leboube.ai` → AI Hairstyle Changer (Port 7912)
- `math.leboube.ai` → Socratic AI Math Tutor (Port 7834)
- `short.leboube.ai` → URL Shortener (Port 7429)

## Step 1: Install cloudflared

### On Linux/macOS:
```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Or using homebrew on macOS
brew install cloudflared
```

### On Windows:
Download from: https://github.com/cloudflare/cloudflared/releases

## Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window. Select your `leboube.ai` domain.

## Step 3: Create a Tunnel

```bash
cloudflared tunnel create ai-products
```

This creates a tunnel named `ai-products` and generates a credentials file.

**Important:** Note the Tunnel ID shown in the output. You'll need it.

## Step 4: Create Tunnel Configuration

Create a configuration file at `~/.cloudflared/config.yml`:

```yaml
tunnel: ai-products
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  # Landing Page
  - hostname: leboube.ai
    service: http://localhost:8000

  # AI Headshot Photographer
  - hostname: headshots.leboube.ai
    service: http://localhost:7693

  # AI PDF Parser & Chat
  - hostname: pdf.leboube.ai
    service: http://localhost:3951

  # Baseball Exit Velocity
  - hostname: baseball.leboube.ai
    service: http://localhost:8080

  # AI Hairstyle Changer
  - hostname: hairstyle.leboube.ai
    service: http://localhost:7912

  # Socratic AI Math Tutor
  - hostname: math.leboube.ai
    service: http://localhost:7834

  # URL Shortener
  - hostname: short.leboube.ai
    service: http://localhost:7429

  # Catch-all rule (required)
  - service: http_status:404
```

**Replace `<TUNNEL-ID>` with your actual tunnel ID.**

## Step 5: Configure DNS Records

You can do this via the Cloudflare dashboard or CLI:

```bash
# Add DNS records for each subdomain
cloudflared tunnel route dns ai-products leboube.ai
cloudflared tunnel route dns ai-products headshots.leboube.ai
cloudflared tunnel route dns ai-products pdf.leboube.ai
cloudflared tunnel route dns ai-products baseball.leboube.ai
cloudflared tunnel route dns ai-products hairstyle.leboube.ai
cloudflared tunnel route dns ai-products math.leboube.ai
cloudflared tunnel route dns ai-products short.leboube.ai
```

## Step 6: Update Your Environment Configuration

Edit your `.env` file in the AI-products directory:

```bash
cd /Users/joeleboube/Downloads/AI-products
nano .env
```

Update the following variables:

```env
# Domain Configuration
DOMAIN=leboube.ai
PROTOCOL=https

# Subdomain Configuration
SUBDOMAIN_HEADSHOT=headshots
SUBDOMAIN_PDF=pdf
SUBDOMAIN_BASEBALL=baseball
SUBDOMAIN_HAIRSTYLE=hairstyle
SUBDOMAIN_MATH=math
SUBDOMAIN_SHORTENER=short
```

## Step 7: Rebuild Landing Page with Production URLs

```bash
# Rebuild the landing page to use production URLs
docker compose up -d --build landing-page
```

## Step 8: Start the Cloudflare Tunnel

### Run as a Foreground Process (for testing):
```bash
cloudflared tunnel run ai-products
```

### Run as a System Service (recommended for production):

```bash
# Install as a system service
sudo cloudflared service install

# Start the service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

## Step 9: Verify Your Setup

1. Wait 1-2 minutes for DNS propagation
2. Visit https://leboube.ai - you should see your landing page
3. Click on each product link to verify all services are accessible
4. Check that HTTPS is working (Cloudflare provides automatic SSL)

## Troubleshooting

### Tunnel Not Starting
```bash
# Check tunnel status
cloudflared tunnel info ai-products

# Check logs
sudo journalctl -u cloudflared -f
```

### DNS Not Resolving
```bash
# Verify DNS records
dig leboube.ai
dig headshots.leboube.ai

# It should show CNAME pointing to Cloudflare
```

### Services Not Accessible

1. **Verify services are running:**
   ```bash
   docker compose ps
   ```

2. **Check service logs:**
   ```bash
   docker compose logs -f
   ```

3. **Test local connectivity:**
   ```bash
   curl http://localhost:8000
   curl http://localhost:7693
   ```

4. **Verify tunnel configuration:**
   ```bash
   cat ~/.cloudflared/config.yml
   ```

### Landing Page Shows Wrong URLs

Rebuild the landing page container:
```bash
docker compose up -d --build landing-page
```

## Advanced Configuration

### Enable Access Control

Protect your services with Cloudflare Access:

1. Go to Cloudflare Dashboard → Zero Trust → Access
2. Create an Access Policy for your domain
3. Set authentication requirements (Email OTP, Google, etc.)

### Enable Rate Limiting

1. Go to Cloudflare Dashboard → Security → WAF
2. Create rate limiting rules to prevent abuse

### Monitor Traffic

1. Go to Cloudflare Dashboard → Analytics
2. View traffic, bandwidth, and request metrics

## Updating Configuration

If you need to change tunnel settings:

1. Edit `~/.cloudflared/config.yml`
2. Restart the tunnel:
   ```bash
   sudo systemctl restart cloudflared
   ```

## Removing the Tunnel

```bash
# Stop the service
sudo systemctl stop cloudflared
sudo systemctl disable cloudflared

# Delete the tunnel
cloudflared tunnel delete ai-products

# Remove DNS records from Cloudflare dashboard
```

## Production Checklist

- [ ] All services running and accessible locally
- [ ] `.env` file updated with `DOMAIN=leboube.ai` and `PROTOCOL=https`
- [ ] Landing page rebuilt with production URLs
- [ ] Cloudflare tunnel configured and running
- [ ] DNS records created for all subdomains
- [ ] All services accessible via HTTPS
- [ ] SSL/TLS encryption verified (green padlock)
- [ ] Cloudflare tunnel running as system service
- [ ] Monitoring and logs configured

## Support

- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Cloudflare Community: https://community.cloudflare.com/

## Security Best Practices

1. **Enable Cloudflare WAF** to protect against common attacks
2. **Use Cloudflare Access** to add authentication to sensitive services
3. **Enable rate limiting** to prevent abuse
4. **Monitor logs regularly** for unusual activity
5. **Keep cloudflared updated**: `cloudflared update`
6. **Use strong API keys** in your `.env` file
7. **Don't expose sensitive ports** directly to the internet

## Cost

Cloudflare Tunnels are **FREE** for:
- Unlimited bandwidth
- Unlimited requests
- Multiple tunnels
- DDoS protection
- SSL/TLS certificates

No credit card required!
