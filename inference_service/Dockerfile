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

COPY . /app

RUN pip install --upgrade pip

# keep numpy fix
RUN pip install --no-cache-dir "numpy<2.0"

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "worker/main.py"]