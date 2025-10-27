# Docker Deployment Guide

## Overview

This URL shortener application is containerized using Docker and can be deployed with Docker Compose. The application runs on port **7429** (an obscure, non-standard port).

## Prerequisites

- Docker Engine installed
- Docker Compose installed
- Gemini API key from Google

## Configuration

### Environment Variables

Create or update the `.env` file in the project root:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

## Building the Application

To build the Docker image:

```bash
docker compose build
```

This will:
1. Install Node.js dependencies
2. Build the React/Vite application with your API key baked in
3. Create a production nginx container serving the static files

## Running the Application

### Start the container:

```bash
docker compose up -d
```

The `-d` flag runs the container in detached mode (background).

### Stop the container:

```bash
docker compose down
```

### View logs:

```bash
docker compose logs -f
```

### Restart the container:

```bash
docker compose restart
```

## Accessing the Application

Once running, access the application at:

```
http://localhost:7429
```

Or from another machine on your network:

```
http://YOUR_SERVER_IP:7429
```

## Port Configuration

The application is configured to run on **port 7429**. To change this:

1. Edit `docker-compose.yml`
2. Modify the port mapping under the `ports` section:
   ```yaml
   ports:
     - "YOUR_PORT:80"
   ```

## Architecture

- **Build Stage**: Node.js 18 Alpine container compiles the TypeScript/React application
- **Production Stage**: Nginx Alpine container serves the static files
- **Network**: Custom bridge network for future expansion
- **Restart Policy**: Container automatically restarts unless explicitly stopped

## Troubleshooting

### Container won't start

Check logs:
```bash
docker compose logs
```

### Port already in use

Either:
1. Stop the conflicting service
2. Change the port in `docker-compose.yml`

### API key not working

Rebuild the container after updating `.env`:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Note: The API key is baked into the static files at build time, so changes require a rebuild.

## Security Notes

- The Gemini API key is embedded in the client-side JavaScript bundle
- For production use, consider implementing a backend proxy to secure the API key
- The application runs on a non-standard port for additional security through obscurity
- Nginx is configured with security headers (X-Frame-Options, X-Content-Type-Options, etc.)

## Production Deployment

For production deployment:

1. Use a reverse proxy (nginx, Caddy, Traefik) with HTTPS
2. Consider moving the API key to a backend service
3. Set up proper firewall rules
4. Implement rate limiting
5. Regular security updates for base images
