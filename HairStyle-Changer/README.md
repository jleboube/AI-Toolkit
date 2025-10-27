# AI Hairstyle Try-On

This is a web application that allows users to take a picture with their camera or upload a photo to try on various hairstyles and colors using the Gemini AI model. The application is containerized using Docker and orchestrated with Docker Compose for easy setup and deployment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (This is included with Docker Desktop)

You will also need a **Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Getting Started

Follow these steps to get the application running locally.

### 1. Create the Environment File

In the root directory of the project, create a new file named `.env`.

### 2. Add Your API Key

Open the `.env` file and add your Gemini API key in the following format:

```env
API_KEY=YOUR_GEMINI_API_KEY
```

Replace `YOUR_GEMINI_API_KEY` with your actual key. This file is included in `.dockerignore` and should not be committed to version control.

### 3. Build and Run the Container

Open your terminal in the project's root directory and run the following command:

```bash
docker-compose up --build
```

This command will:
-   Build the Docker image for the application based on the `Dockerfile`.
-   Pass your `API_KEY` securely from the `.env` file into the build process.
-   Create and start a container to serve the web app on port 8080.

To run the container in the background (detached mode), you can add the `-d` flag:
```bash
docker-compose up --build -d
```

### 4. Access the Application

Once the build is complete and the container is running, open your web browser and navigate to:

[http://localhost:8080](http://localhost:8080)

## Stopping the Application

To stop the running application and remove the container, press `Ctrl + C` in the terminal where Docker Compose is running. If you are running in detached mode, use the following command from the project root:

```bash
docker-compose down
```
