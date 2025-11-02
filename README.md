# AI Products Suite

A comprehensive collection of AI-powered applications, all deployable with a single command using Docker Compose.'

[![Docker](https://img.shields.io/badge/Docker-Friendly-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

[![GitHub stars](https://img.shields.io/github/stars/jleboube/AI-Toolkit?style=social)](https://github.com/jleboube/AI-Toolkit/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jleboube/AI-Toolkit?style=social)](https://github.com/jleboube/AI-Toolkit/network/members)
[![GitHub issues](https://img.shields.io/github/issues/jleboube/AI-Toolkit)](https://github.com/jleboube/AI-Toolkit/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/jleboube/AI-Toolkit)](https://github.com/jleboube/AI-Toolkit/pulls)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CCBY--NC--SA4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/muscl3n3rd)

## Projects Included

1. **AI Headshot Photographer** (Port 7693) - Transform casual photos into professional headshots
2. **AI PDF Parser & Chat** (Port 3951) - Upload and chat with PDF documents
3. **Baseball Exit Velocity** (Port 8080) - Analyze baseball performance metrics
4. **AI Hairstyle Changer** (Port 7912) - Try different hairstyles virtually
5. **Socratic AI Math Tutor** (Port 7834) - Learn mathematics through AI-guided tutoring
6. **URL Shortener** (Port 7429) - Create short links with AI-generated aliases
7. **Landing Page** (Port 8000) - Beautiful animated landing page showcasing all projects

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- API keys (see Configuration section)

### Installation

1. Clone or navigate to the repository:
```bash
cd /Users/joeleboube/Downloads/AI-products
```

2. Copy the environment template and configure your API keys:
```bash
cp .env.example .env
```

3. Edit `.env` and add your API keys:
```bash
nano .env  # or use your preferred editor
```

4. Start all services:
```bash
docker-compose up -d
```

5. Access the landing page:
```
http://localhost:8000
```

## Production Deployment

For production deployment with your custom domain (e.g., `leboube.ai`), follow these steps:

### Quick Production Setup

1. **Configure for production:**
```bash
./switch-env.sh
# Select option 2 for Production
```

2. **Edit `.env` and add your API keys and verify domain settings:**
```bash
nano .env
```

Make sure these are set:
```env
DOMAIN=leboube.ai
PROTOCOL=https
GEMINI_API_KEY=your_actual_api_key
```

3. **Deploy to production:**
```bash
./deploy-production.sh
```

4. **Set up Cloudflare Tunnel:**
   - Follow the detailed guide in [CLOUDFLARE_TUNNEL_SETUP.md](./CLOUDFLARE_TUNNEL_SETUP.md)
   - This will expose your services to the internet with automatic HTTPS

### Production URLs

Once deployed with Cloudflare Tunnel, your services will be available at:

- **Landing Page**: https://leboube.ai
- **AI Headshot Photographer**: https://headshots.leboube.ai
- **AI PDF Parser & Chat**: https://pdf.leboube.ai
- **Baseball Exit Velocity**: https://baseball.leboube.ai
- **AI Hairstyle Changer**: https://hairstyle.leboube.ai
- **Socratic AI Math Tutor**: https://math.leboube.ai
- **URL Shortener**: https://short.leboube.ai

### Switching Between Environments

Use the environment switcher to quickly switch between local and production:

```bash
./switch-env.sh
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=your_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Landing Page Configuration

The landing page is **dynamically configured** and can be updated without rebuilding!

**To add or modify products:**
1. Edit `landing-page/products.json`
2. Refresh your browser
3. Changes appear instantly!

See [ADDING_PRODUCTS.md](./ADDING_PRODUCTS.md) for detailed instructions on:
- Adding new products
- Customizing product cards
- Changing page content
- Disabling/reordering products

**Example: Adding a new product**
```json
{
  "id": "new-app",
  "name": "My New AI App",
  "description": "Description here",
  "subdomain": "newapp",
  "port": 9000,
  "icon": "camera",
  "animationDelay": 600,
  "enabled": true
}
```

No restart needed - just refresh the page!

### Individual Project Configuration

Some projects may require additional `.env` files in their respective directories:

- **BaseballExitVelo**: Create `BaseballExitVelo/.env` with required variables

Check each project's directory for specific configuration requirements.

## Service URLs

Once all services are running, access them at:

| Service | URL |
|---------|-----|
| Landing Page | http://localhost:8000 |
| AI Headshot Photographer | http://localhost:7693 |
| AI PDF Parser & Chat | http://localhost:3951 |
| Baseball Exit Velocity | http://localhost:8080 |
| AI Hairstyle Changer | http://localhost:7912 |
| Socratic AI Math Tutor | http://localhost:7834 |
| URL Shortener | http://localhost:7429 |

## Docker Commands

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f landing-page
```

### Rebuild all services
```bash
docker-compose up -d --build
```

### Rebuild specific service
```bash
docker-compose up -d --build ai-headshot-photographer
```

### Check service status
```bash
docker-compose ps
```

## Production Deployment

### Using Your .ai Domain

1. **Update the landing page URLs**: Edit `landing-page/index.html` and replace `localhost` with your domain:
   - Change `http://localhost:7693` to `http://headshots.yourdomain.ai`
   - Change `http://localhost:3951` to `http://pdf.yourdomain.ai`
   - And so on for each service

2. **Set up reverse proxy**: Use nginx or Traefik to route subdomains to the correct ports:

Example nginx configuration:
```nginx
server {
    server_name headshots.yourdomain.ai;
    location / {
        proxy_pass http://localhost:7693;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    server_name pdf.yourdomain.ai;
    location / {
        proxy_pass http://localhost:3951;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Add similar blocks for other services
```

3. **SSL/TLS**: Use Let's Encrypt with certbot to secure your domain:
```bash
certbot --nginx -d yourdomain.ai -d headshots.yourdomain.ai -d pdf.yourdomain.ai
```

### Suggested Subdomain Structure

- `yourdomain.ai` - Landing page
- `headshots.yourdomain.ai` - AI Headshot Photographer
- `pdf.yourdomain.ai` - AI PDF Parser & Chat
- `baseball.yourdomain.ai` - Baseball Exit Velocity
- `hairstyle.yourdomain.ai` - AI Hairstyle Changer
- `math.yourdomain.ai` - Socratic AI Math Tutor
- `short.yourdomain.ai` - URL Shortener

## Architecture

All services are connected through a Docker bridge network (`ai-products-network`), allowing them to communicate with each other if needed. Each service runs in its own container with proper isolation.

## Development

### Running Individual Projects

Each project can still be run independently using its own `docker-compose.yml`:

```bash
cd ai-headshot-photographer
docker-compose up -d
```

### Modifying the Landing Page

The landing page source files are located in `landing-page/`:
- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `script.js` - Interactive JavaScript and scroll animations
- `nginx.conf` - Web server configuration

After making changes, rebuild the landing page:
```bash
docker-compose up -d --build landing-page
```

## Troubleshooting

### Port Conflicts
If you get port binding errors, check if the ports are already in use:
```bash
lsof -i :8000  # Check specific port
```

### Service Not Starting
Check the logs for the specific service:
```bash
docker-compose logs service-name
```

### API Key Issues
Ensure your `.env` file exists in the root directory and contains valid API keys.

### Rebuilding Everything
If you encounter persistent issues, try rebuilding from scratch:
```bash
docker-compose down -v
docker-compose up -d --build
```

## License

Each project may have its own license. Please check individual project directories for details.

## Contributing

Feel free to submit issues and enhancement requests for individual projects.
