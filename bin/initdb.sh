#!/usr/bin/env bash
# Initializes database schema and adds default records
# - WARNING: drops the database if it already exists!
# - ASSUMES mysql container was already started with docker-compose
# - Will fail if database already exists

set -e
SCRIPT_DIR=$( dirname "$0"; )
ROOT_DIR="${SCRIPT_DIR}/.."

source "${ROOT_DIR}/.env"

SQL_SCRIPT="
   DROP DATABASE IF EXISTS ${MYSQL_DATABASE};
   CREATE DATABASE ${MYSQL_DATABASE};
   USE ${MYSQL_DATABASE}
   $( cat "${SCRIPT_DIR}/../database/schema.sql")
"

echo "${SQL_SCRIPT}" | docker-compose exec -T mysql mysql -u root --password="${MYSQL_PASSWORD}"

echo "Database schema and content should be ready!"
