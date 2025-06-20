from piccolo.apps.migrations.auto.migration_manager import MigrationManager
from piccolo.columns.column_types import Bytea
from piccolo.columns.column_types import Varchar
from piccolo.columns.indexes import IndexMethod


ID = "2025-05-29T21:06:47:805879"
VERSION = "1.26.1"
DESCRIPTION = ""


async def forwards():
    manager = MigrationManager(
        migration_id=ID, app_name="voter_records", description=DESCRIPTION
    )

    manager.add_table(
        class_name="Ballot", tablename="ballot", schema=None, columns=None
    )

    manager.add_column(
        table_class_name="Ballot",
        tablename="ballot",
        column_name="name",
        db_column_name="name",
        column_class_name="Varchar",
        column_class=Varchar,
        params={
            "length": 255,
            "default": "",
            "null": False,
            "primary_key": False,
            "unique": False,
            "index": False,
            "index_method": IndexMethod.btree,
            "choices": None,
            "db_column_name": None,
            "secret": False,
        },
        schema=None,
    )

    manager.add_column(
        table_class_name="Ballot",
        tablename="ballot",
        column_name="pdf_data",
        db_column_name="pdf_data",
        column_class_name="Bytea",
        column_class=Bytea,
        params={
            "default": b"",
            "null": False,
            "primary_key": False,
            "unique": False,
            "index": False,
            "index_method": IndexMethod.btree,
            "choices": None,
            "db_column_name": None,
            "secret": False,
        },
        schema=None,
    )

    return manager
