from piccolo.table import Table
from piccolo.columns import Varchar, Bytea


class VoterRecord(Table):
    First_Name = Varchar(length=100, null=False)
    Last_Name = Varchar(length=100, null=False)
    Street_Number = Varchar(length=20, null=False)
    Street_Name = Varchar(length=100, null=False)
    Street_Type = Varchar(length=50, null=True)
    Street_Dir_Suffix = Varchar(length=10, null=True)


class Ballot(Table):
    name = Varchar(length=255, null=False)
    pdf_data = Bytea(null=False)
