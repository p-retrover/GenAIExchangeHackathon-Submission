#!/bin/bash

set -e

VENV_ALEMBIC="/app/.venv/bin/alembic"
VENV_PYTHON="/app/.venv/bin/python"
VENV_UVICORN="/app/.venv/bin/uvicorn"

echo "--- Running Database Migrations ---"
# The '|| exit 1' will cause the script to fail immediately if migrations fail
$VENV_ALEMBIC upgrade head || { echo "Migrations failed"; exit 1; }
echo "--- Migrations Finished ---"

echo "--- Seeding Initial Data ---"
$VENV_PYTHON -m app.scripts.seed_questionnaire || { echo "Seeding failed"; exit 1; }
echo "--- Seeding Finished ---"

# Optional: Add a small sleep to make it obvious in the logs
# that the server starts *after* the previous steps.
echo "--- Pausing for 2 seconds before starting server ---"
sleep 2

echo "--- Starting FastAPI Server ---"
exec $VENV_UVICORN app.main:app --host 0.0.0.0 --port 8000