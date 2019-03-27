#!/bin/bash

echo "Importing saltstore database "

# Edit to local path to psql
export PATH=/D/David/Programs/PostgreSQL/10/bin:$PATH

# Edit to proper username, dbname, and password
PGPASSWORD=postgres psql --username=postgres --dbname=groupc_test --file=./sql/user_account.sql
PGPASSWORD=postgres psql --username=postgres --dbname=groupc_test --file=./sql/session.sql
PGPASSWORD=postgres psql --username=postgres --dbname=groupc_test --file=./sql/keywords.sql
PGPASSWORD=postgres psql --username=postgres --dbname=groupc_test --file=./sql/documents.sql



echo "Import complete "

# Wait for user input to close window
read -n 1 -s -p "Hit any button to continue..."
