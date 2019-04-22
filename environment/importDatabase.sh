#!/bin/bash

echo "Importing saltstore database "

# Edit to local path to psql
export PATH=/D/David/Programs/PostgreSQL/10/bin:$PATH

# Edit to proper username, dbname, and password
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/user_account.sql
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/session.sql
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/keywords.sql
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/documents.sql
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/searches.sql
PGPASSWORD=postgres psql --username=postgres --dbname=Group_C --file=./sql/requests.sql



echo "Import complete "

# Wait for user input to close window
read -n 1 -s -p "Hit any button to continue..."
