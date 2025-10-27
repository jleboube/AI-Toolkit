# Baseball Exit Velocity AI

This is an AI-powered web application to estimate the exit velocity of a baseball from a live camera feed or an uploaded video. It uses the Google Gemini API for visual analysis.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

You will also need credentials from the Google Cloud Platform.

## Configuration

### 1. Get Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a new API key.
3.  Copy the API key.

### 2. Get Google OAuth Client ID

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services > Credentials**.
4.  Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
5.  Choose **Web application** as the application type.
6.  Give it a name (e.g., "Velocity AI Web App").
7.  Under **Authorized JavaScript origins**, add the URLs where your app will run. For local development and remote access, you might add:
    - `http://localhost:8080`
    - `http://<your-vm-ip-address>:8080`
8.  Click **Create**.
9.  Copy the **Client ID**.

### 3. Create `.env` file

1.  In the root of the project, create a file named `.env`.
2.  Copy the contents of `.env.example` into it.
3.  Paste your copied credentials into the `.env` file:

    ```
    API_KEY=your_gemini_api_key_here
    GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
    ```

## Running the Application

Once your `.env` file is configured, you can build and run the application with a single command:

```bash
docker-compose up --build
```

The `--build` flag is only necessary the first time you run it or if you make changes to the code.

Once the container is running, you can access the application in your browser at [http://localhost:8080](http://localhost:8080).
