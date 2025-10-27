#!/bin/bash

echo "=========================================="
echo "  AI Products Suite - Quick Start"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "Please edit the .env file and add your API keys:"
    echo "  nano .env"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "Starting all AI services..."
echo ""

# Start all services
docker-compose up -d

echo ""
echo "=========================================="
echo "  Services Starting..."
echo "=========================================="
echo ""
echo "Waiting for services to initialize..."
sleep 5

# Check service status
docker-compose ps

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
echo "To view logs: docker-compose logs -f"
echo "To stop all:  docker-compose down"
echo ""
