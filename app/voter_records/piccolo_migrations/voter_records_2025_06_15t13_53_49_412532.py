from piccolo.apps.migrations.auto.migration_manager import MigrationManager
from piccolo.table import Table

ID = "2025-06-15T13:53:49:412532"
VERSION = "1.26.1"
DESCRIPTION = ""

# This is just a dummy table we use to execute raw SQL with:
class RawTable(Table):
    pass

async def forwards():
    manager = MigrationManager(
        migration_id=ID, app_name="", description=DESCRIPTION
    )

    async def run():
        print(f"running {ID}")
        await RawTable.raw('CREATE UNIQUE INDEX unique_voter_record ON voter_record("First_Name", "Last_Name", "Street_Number", "Street_Name")')

    manager.add_raw(run)
    
    async def run_backwards():
        await RawTable.raw("DROP INDEX unique_voter_record")

    manager.add_raw_backwards(run_backwards)

    return manager
