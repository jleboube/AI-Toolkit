#!/bin/bash

echo "=========================================="
echo "  Environment Configuration Switcher"
echo "=========================================="
echo ""
echo "Select environment:"
echo "  1) Local Development (localhost)"
echo "  2) Production (leboube.ai)"
echo ""
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo ""
        echo "Configuring for LOCAL DEVELOPMENT..."
        cat > .env << 'EOF'
# Local Development Environment Configuration

# API Keys for AI Services
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=your_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Domain Configuration - Local
DOMAIN=localhost
PROTOCOL=http

# Subdomain Configuration (not used for localhost)
SUBDOMAIN_HEADSHOT=headshots
SUBDOMAIN_PDF=pdf
SUBDOMAIN_BASEBALL=baseball
SUBDOMAIN_HAIRSTYLE=hairstyle
SUBDOMAIN_MATH=math
SUBDOMAIN_SHORTENER=short

# Local URLs:
# Landing:   http://localhost:8000
# Headshots: http://localhost:7693
# PDF:       http://localhost:3951
# Baseball:  http://localhost:8080
# Hairstyle: http://localhost:7912
# Math:      http://localhost:7834
# Shortener: http://localhost:7429
EOF
        echo "✓ Created .env for local development"
        echo ""
        echo "Remember to add your API keys to the .env file!"
        ;;
    2)
        echo ""
        echo "Configuring for PRODUCTION (leboube.ai)..."
        if [ -f .env.production ]; then
            cp .env.production .env
            echo "✓ Copied .env.production to .env"
        else
            cat > .env << 'EOF'
# Production Environment Configuration for leboube.ai

# API Keys for AI Services
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=your_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Domain Configuration - Production
DOMAIN=leboube.ai
PROTOCOL=https

# Subdomain Configuration
SUBDOMAIN_HEADSHOT=headshots
SUBDOMAIN_PDF=pdf
SUBDOMAIN_BASEBALL=baseball
SUBDOMAIN_HAIRSTYLE=hairstyle
SUBDOMAIN_MATH=math
SUBDOMAIN_SHORTENER=short
EOF
            echo "✓ Created .env for production"
        fi
        echo ""
        echo "Remember to:"
        echo "  1. Add your API keys to the .env file"
        echo "  2. Set up Cloudflare Tunnel (see CLOUDFLARE_TUNNEL_SETUP.md)"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "Next steps:"
echo "  1. Edit .env and add your API keys"
echo "  2. Run: ./deploy-production.sh"
echo ""
