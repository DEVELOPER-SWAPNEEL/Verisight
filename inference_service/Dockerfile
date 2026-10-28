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

# This deployment runs on a CPU-only office server. Keep NumPy on the 1.x ABI
# required by the pinned ONNX Runtime, and explicitly install its CPU wheel
# after the other packages so transitive dependencies cannot leave a CUDA build.
RUN pip install --no-cache-dir --force-reinstall \
    "numpy==1.26.4" \
    "onnxruntime==1.18.0"

CMD ["python", "worker/main.py"]
