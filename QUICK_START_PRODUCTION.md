# Quick Start: Production Deployment for leboube.ai

This is a quick reference guide to get your AI Products Suite running on `leboube.ai` with Cloudflare Tunnels.

## Prerequisites Checklist

- [ ] Docker and Docker Compose installed
- [ ] All services tested and working locally
- [ ] Cloudflare account with leboube.ai domain
- [ ] API keys for all services

## 5-Minute Production Setup

### 1. Configure Environment (30 seconds)

```bash
cd /Users/joeleboube/Downloads/AI-products
./switch-env.sh
# Select: 2 (Production)
```

Edit `.env` and add your API keys:
```bash
nano .env
```

### 2. Deploy Services (2 minutes)

```bash
./deploy-production.sh
```

This will:
- Stop existing services
- Rebuild all containers
- Start services with production configuration
- Configure landing page with leboube.ai URLs

### 3. Install Cloudflare Tunnel (1 minute)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate
cloudflared tunnel login
```

### 4. Create and Configure Tunnel (1 minute)

```bash
# Create tunnel
cloudflared tunnel create ai-products

# Note your tunnel ID from the output
```

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: ai-products
credentials-file: /root/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: leboube.ai
    service: http://localhost:8000
  - hostname: headshots.leboube.ai
    service: http://localhost:7693
  - hostname: pdf.leboube.ai
    service: http://localhost:3951
  - hostname: baseball.leboube.ai
    service: http://localhost:8080
  - hostname: hairstyle.leboube.ai
    service: http://localhost:7912
  - hostname: math.leboube.ai
    service: http://localhost:7834
  - hostname: short.leboube.ai
    service: http://localhost:7429
  - service: http_status:404
```

### 5. Configure DNS and Start Tunnel (1 minute)

```bash
# Add DNS records
cloudflared tunnel route dns ai-products leboube.ai
cloudflared tunnel route dns ai-products headshots.leboube.ai
cloudflared tunnel route dns ai-products pdf.leboube.ai
cloudflared tunnel route dns ai-products baseball.leboube.ai
cloudflared tunnel route dns ai-products hairstyle.leboube.ai
cloudflared tunnel route dns ai-products math.leboube.ai
cloudflared tunnel route dns ai-products short.leboube.ai

# Install and start as service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

## Verify Deployment

Wait 1-2 minutes, then visit:

✓ https://leboube.ai - Should show landing page
✓ Click each product link - All should work

## Your Production URLs

| Service | URL |
|---------|-----|
| Landing Page | https://leboube.ai |
| AI Headshot Photographer | https://headshots.leboube.ai |
| AI PDF Parser & Chat | https://pdf.leboube.ai |
| Baseball Exit Velocity | https://baseball.leboube.ai |
| AI Hairstyle Changer | https://hairstyle.leboube.ai |
| Socratic AI Math Tutor | https://math.leboube.ai |
| URL Shortener | https://short.leboube.ai |

## Troubleshooting

### Services not accessible?

```bash
# Check Docker services
docker compose ps
docker compose logs -f

# Check tunnel
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f
```

### Landing page shows localhost URLs?

```bash
# Rebuild landing page with production URLs
docker compose up -d --build landing-page
```

### DNS not resolving?

```bash
# Verify DNS
dig leboube.ai
dig headshots.leboube.ai

# Wait 1-2 minutes for propagation
```

## Useful Commands

```bash
# View all service logs
docker compose logs -f

# View specific service
docker compose logs -f landing-page

# Restart all services
docker compose restart

# Stop everything
docker compose down

# Check tunnel status
cloudflared tunnel info ai-products
```

## Next Steps

1. **Enable Security**: Set up Cloudflare WAF and Access policies
2. **Monitor**: Check Cloudflare Analytics dashboard
3. **Backup**: Document your tunnel configuration
4. **Test**: Test all services thoroughly
5. **Share**: Share https://leboube.ai with users!

## Support

- Full setup guide: [CLOUDFLARE_TUNNEL_SETUP.md](./CLOUDFLARE_TUNNEL_SETUP.md)
- Main README: [README.md](./README.md)
- Cloudflare Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## Cost

**Everything is FREE:**
- ✓ Cloudflare Tunnels (unlimited bandwidth)
- ✓ SSL/TLS certificates
- ✓ DDoS protection
- ✓ DNS management
- ✓ No credit card required

Enjoy your production AI Products Suite! 🚀
