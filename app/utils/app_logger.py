import structlog
import logging
import asyncio
from typing import Optional

# Create a queue for log messages
log_queue: Optional[asyncio.Queue] = None

def get_log_queue() -> asyncio.Queue:
    global log_queue
    if log_queue is None:
        log_queue = asyncio.Queue()
    return log_queue

# Custom logger processor for SSE
def sse_processor(logger, method_name, event_dict):
    # Add the log message to the queue
    queue = get_log_queue()
    asyncio.create_task(queue.put({
        "level": method_name,
        "message": event_dict.get("event", ""),
        "timestamp": event_dict.get("timestamp", "")
    }))
    return event_dict

def configure_logging(enable_debugging: bool = False):
    # Configure structlog with our custom processor
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            sse_processor,
            structlog.processors.JSONRenderer()
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.DEBUG if enable_debugging else logging.INFO
        ),
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    global logger
    logger = structlog.get_logger("app")

# Initial configuration
configure_logging()

def enable_debug_logging(enable_debugging: bool):
    if enable_debugging:
        structlog.configure(
            wrapper_class=structlog.make_filtering_bound_logger(logging.DEBUG)
        )

    global logger
    logger = structlog.get_logger("app")
