FROM python:3.12-slim

WORKDIR /app

# 🔥 ADD THIS LINE (libgl1)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    cmake \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip

# This deployment uses CPU inference. Install the official CPU wheels so pip
# does not pull hundreds of megabytes of unused CUDA libraries from PyPI.
RUN pip install --no-cache-dir torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

# yt-dlp relies on the ffmpeg executable for stream processing. Keep this
# after dependency installation so adding the system package does not invalidate
# the larger Python/PyTorch image layers on subsequent builds.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

CMD ["python", "worker/main.py"]
