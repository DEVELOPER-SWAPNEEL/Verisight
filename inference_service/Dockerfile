FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (required for insightface + onnxruntime)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    cmake \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

# Upgrade pip
RUN pip install --upgrade pip

# 🔥 CRITICAL FIX: force numpy < 2 BEFORE installing other deps
RUN pip install --no-cache-dir "numpy<2.0"

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run worker
CMD ["python", "worker/main.py"]