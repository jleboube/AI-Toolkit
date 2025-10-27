#!/bin/bash

echo "=========================================="
echo "  AI Products Suite - Rebuild Services"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Stopping all services..."
docker compose down

echo ""
echo "Removing old images..."
docker compose down --rmi local

echo ""
echo "Rebuilding all services from scratch..."
docker compose build --no-cache

echo ""
echo "Starting all services..."
docker compose up -d

echo ""
echo "=========================================="
echo "  Services Rebuilt and Starting..."
echo "=========================================="
echo ""
echo "Waiting for services to initialize..."
sleep 5

# Check service status
docker compose ps

echo ""
echo "=========================================="
echo "  Access Your Services"
echo "=========================================="
echo ""
echo "Landing Page:              http://localhost:8000"
echo "AI Headshot Photographer:  http://localhost:7693"
echo "AI PDF Parser & Chat:      http://localhost:3951"
echo "Baseball Exit Velocity:    http://localhost:8080"
echo "AI Hairstyle Changer:      http://localhost:7912"
echo "Socratic AI Math Tutor:    http://localhost:7834"
echo "URL Shortener:             http://localhost:7429"
echo ""
echo "=========================================="
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop all:  docker compose down"
echo ""
