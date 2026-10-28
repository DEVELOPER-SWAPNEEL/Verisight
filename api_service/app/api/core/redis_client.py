import os
import redis

REDIS_URL = os.getenv("REDIS_URL")
if REDIS_URL:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
else:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", "6379")),
        db=int(os.getenv("REDIS_DB", "0")),
        password=os.getenv("REDIS_PASSWORD") or None,
        decode_responses=True,
    )
