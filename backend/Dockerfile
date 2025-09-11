# Use an ARG to define the Python version.
ARG PYTHON_VERSION=3.13

# --- STAGE 1: Builder ---
# This stage installs dependencies using Poetry.
# We use a full Python image here because we need the build tools.
FROM python:${PYTHON_VERSION}-slim as builder

# Set the working directory
WORKDIR /app

# Install Poetry
# We are disabling virtualenvs for Poetry because we want the dependencies installed
# in a location that we can easily copy to the next stage.
RUN pip install poetry

# --- THIS IS THE CRITICAL NEW COMMAND ---
# This command forces Poetry to create the virtual environment inside the project directory (.venv).
# This makes its location predictable and solves our path issues.
RUN poetry config virtualenvs.in-project true

# Copy the dependency definition files
COPY pyproject.toml poetry.lock ./

# Install only the production dependencies.
# The --no-interaction and --no-ansi flags are good for CI/CD environments.
RUN poetry install --without dev --no-interaction --no-ansi


# --- STAGE 2: Final Image ---
# This stage builds the final, lean image for running the application.
FROM python:${PYTHON_VERSION}-slim

# Set the working directory
WORKDIR /app

# --- THIS IS THE FIRST MAJOR CHANGE ---
# Instead of guessing the system path, we copy from the predictable virtual environment path.
COPY --from=builder /app/.venv /app/.venv


# Copy your application code into the final image.
COPY ./app ./app

# --- Copy Alembic config and migrations ---
COPY alembic.ini ./
COPY alembic ./alembic/

# Expose the port that the application will run on.
EXPOSE 8000

# Command to run the application.
# --- THIS IS THE SECOND MAJOR CHANGE ---
# We now run the uvicorn command using the executable from inside the virtual environment.
# This ensures it uses the packages we just installed.
CMD ["/app/.venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
