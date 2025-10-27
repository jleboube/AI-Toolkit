#!/bin/bash

echo "=========================================="
echo "  AI Products Suite - Stopping Services"
echo "=========================================="
echo ""

# Stop all services
docker-compose down

echo ""
echo "All services stopped successfully!"
echo ""
echo "To start again: ./start.sh"
echo "To remove all data: docker-compose down -v"
echo ""
