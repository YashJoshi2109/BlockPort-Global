from functools import wraps
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import threading
from collections import defaultdict
from core.config import settings

# In-memory rate limiting as fallback


class InMemoryRateLimiter:
    def __init__(self):
        self._store = defaultdict(lambda: {"count": 0, "reset_time": None})
        self._lock = threading.Lock()

    def is_rate_limited(self, key: str, limit: int, period: int) -> bool:
        with self._lock:
            now = datetime.utcnow()
            data = self._store[key]

            if data["reset_time"] is None or now > data["reset_time"]:
                data["count"] = 1
                data["reset_time"] = now + timedelta(seconds=period)
                return False

            if data["count"] >= limit:
                return True

            data["count"] += 1
            return False


# Initialize in-memory rate limiter
in_memory_limiter = InMemoryRateLimiter()

# Try to initialize Redis, fall back to in-memory if not available
try:
    import redis
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=0,
        decode_responses=True
    )
    # Test connection
    redis_client.ping()
    USE_REDIS = True
except (ImportError, redis.ConnectionError):
    USE_REDIS = False


def rate_limit(limit: int, period: int):
    """
    Rate limiting decorator with Redis fallback
    :param limit: Number of requests allowed
    :param period: Time period in seconds
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get client IP from request
            request = kwargs.get('request')
            if not request:
                for arg in args:
                    if hasattr(arg, 'client'):
                        request = arg
                        break

            if not request:
                return await func(*args, **kwargs)

            client_ip = request.client.host
            key = f"rate_limit:{func.__name__}:{client_ip}"

            if USE_REDIS:
                try:
                    # Get current count
                    current = redis_client.get(key)
                    if current is None:
                        # First request
                        redis_client.setex(key, period, 1)
                    elif int(current) >= limit:
                        raise HTTPException(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many requests. Please try again later."
                        )
                    else:
                        # Increment counter
                        redis_client.incr(key)
                except redis.RedisError:
                    # Fall back to in-memory if Redis fails
                    if in_memory_limiter.is_rate_limited(key, limit, period):
                        raise HTTPException(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many requests. Please try again later."
                        )
            else:
                # Use in-memory rate limiting
                if in_memory_limiter.is_rate_limited(key, limit, period):
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Too many requests. Please try again later."
                    )

            return await func(*args, **kwargs)
        return wrapper
    return decorator
