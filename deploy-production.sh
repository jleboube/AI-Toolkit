#!/bin/bash

echo "=========================================="
echo "  AI Products Suite - Production Deploy"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env from .env.example and configure it for production."
    exit 1
fi

# Source the .env file to check configuration
export $(cat .env | grep -v '^#' | xargs)

# Verify domain is set
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "localhost" ]; then
    echo "Warning: DOMAIN is not set or is set to localhost"
    echo "For production deployment, you should set DOMAIN in your .env file"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Deployment Configuration:"
echo "  Domain:   ${DOMAIN:-localhost}"
echo "  Protocol: ${PROTOCOL:-http}"
echo ""

# Ask for confirmation
read -p "Deploy to production? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "Step 1: Stopping existing services..."
docker compose down

echo ""
echo "Step 2: Building all services for production..."
docker compose build --no-cache

echo ""
echo "Step 3: Starting all services..."
docker compose up -d

echo ""
echo "Step 4: Waiting for services to initialize..."
sleep 10

# Check service status
echo ""
echo "Service Status:"
docker compose ps

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""

if [ "$DOMAIN" = "localhost" ]; then
    echo "Local Development URLs:"
    echo "  Landing Page:              http://localhost:8000"
    echo "  AI Headshot Photographer:  http://localhost:7693"
    echo "  AI PDF Parser & Chat:      http://localhost:3951"
    echo "  Baseball Exit Velocity:    http://localhost:8080"
    echo "  AI Hairstyle Changer:      http://localhost:7912"
    echo "  Socratic AI Math Tutor:    http://localhost:7834"
    echo "  URL Shortener:             http://localhost:7429"
else
    echo "Production URLs:"
    echo "  Landing Page:              ${PROTOCOL}://${DOMAIN}"
    echo "  AI Headshot Photographer:  ${PROTOCOL}://${SUBDOMAIN_HEADSHOT:-headshots}.${DOMAIN}"
    echo "  AI PDF Parser & Chat:      ${PROTOCOL}://${SUBDOMAIN_PDF:-pdf}.${DOMAIN}"
    echo "  Baseball Exit Velocity:    ${PROTOCOL}://${SUBDOMAIN_BASEBALL:-baseball}.${DOMAIN}"
    echo "  AI Hairstyle Changer:      ${PROTOCOL}://${SUBDOMAIN_HAIRSTYLE:-hairstyle}.${DOMAIN}"
    echo "  Socratic AI Math Tutor:    ${PROTOCOL}://${SUBDOMAIN_MATH:-math}.${DOMAIN}"
    echo "  URL Shortener:             ${PROTOCOL}://${SUBDOMAIN_SHORTENER:-short}.${DOMAIN}"
    echo ""
    echo "Next Steps:"
    echo "  1. Ensure Cloudflare Tunnel is configured (see CLOUDFLARE_TUNNEL_SETUP.md)"
    echo "  2. Start the Cloudflare Tunnel: cloudflared tunnel run ai-products"
    echo "  3. Verify all services are accessible via your domain"
fi

echo ""
echo "Useful Commands:"
echo "  View logs:     docker compose logs -f"
echo "  Stop services: docker compose down"
echo "  Restart:       docker compose restart"
echo ""
