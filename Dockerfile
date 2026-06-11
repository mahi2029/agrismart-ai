FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application
COPY . /app

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["uvicorn","backend.main:app","--host","0.0.0.0","--port","8000"]
