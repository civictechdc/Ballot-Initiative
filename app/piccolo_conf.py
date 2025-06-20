from piccolo.conf.apps import AppRegistry
from piccolo.engine.sqlite import SQLiteEngine
from piccolo.engine.postgres import PostgresEngine

import os
if os.getenv("POSTGRES_HOST"):
    DB = PostgresEngine(config={
        "host": os.getenv("POSTGRES_HOST"),
        "database": 'ballot_initiative',
        "user": os.getenv("POSTGRES_USER", 'postgres'),
        "password": os.getenv("POSTGRES_PASSWORD", ''),
    })
else:
    DB = SQLiteEngine()

APP_REGISTRY = AppRegistry(
    apps=["voter_records.piccolo_app", "piccolo_admin.piccolo_app"]
)
