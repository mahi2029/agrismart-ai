# AgriSmart AI

This project is a simple FastAPI backend with a static frontend (HTML/CSS/JS) for crop disease detection and advice.

## Run locally

1. Create a Python virtual environment and install dependencies:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ../requirements.txt
```

2. Start the backend (it will serve the frontend static files):

```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Open the app in your browser:

- http://127.0.0.1:8000/

## Notes

- The backend currently contains placeholder detection logic. Replace with your ML model or API integration.
- `results.html` uses `localStorage` to read/display the last analysis result when navigated from the frontend.

## What I changed

- Translated UI to English
- Standardized frontend script behavior
- Mounted frontend static files in the FastAPI backend so the app can be opened at `/`
- Extended `/voice-analyze` to return consistent JSON (disease, confidence, advice, fertilizer)

If you'd like, I can also add a Dockerfile and GitHub Actions workflow to run tests and deploy automatically.
 
## Docker and CI

This repository now includes a `Dockerfile` to build a container image and a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies and runs a smoke test on push.

### Docker build (local)

```powershell
docker build -t agrismart-ai:local .
docker run -p 8000:8000 agrismart-ai:local
```

### Demo page

Open `demo.html` (served by the backend at `/demo.html`) and click "Run demo" to POST `test.jpg` to `/analyze` and see the JSON response.
