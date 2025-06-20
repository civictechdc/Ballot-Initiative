from piccolo.apps.migrations.auto.migration_manager import MigrationManager


ID = "2025-05-29T22:17:45:719986"
VERSION = "1.26.1"
DESCRIPTION = ""


async def forwards():
    manager = MigrationManager(
        migration_id=ID, app_name="voter_records", description=DESCRIPTION
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="first_name",
        new_column_name="First_Name",
        old_db_column_name="first_name",
        new_db_column_name="First_Name",
        schema=None,
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="last_name",
        new_column_name="Last_Name",
        old_db_column_name="last_name",
        new_db_column_name="Last_Name",
        schema=None,
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="street_dir_suffix",
        new_column_name="Street_Dir_Suffix",
        old_db_column_name="street_dir_suffix",
        new_db_column_name="Street_Dir_Suffix",
        schema=None,
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="street_name",
        new_column_name="Street_Name",
        old_db_column_name="street_name",
        new_db_column_name="Street_Name",
        schema=None,
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="street_number",
        new_column_name="Street_Number",
        old_db_column_name="street_number",
        new_db_column_name="Street_Number",
        schema=None,
    )

    manager.rename_column(
        table_class_name="VoterRecord",
        tablename="voter_record",
        old_column_name="street_type",
        new_column_name="Street_Type",
        old_db_column_name="street_type",
        new_db_column_name="Street_Type",
        schema=None,
    )

    return manager
