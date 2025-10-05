#!/bin/bash
set -e

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Copy environment variables from repo root
if [ -f "$CONDUCTOR_ROOT_PATH/.env.local" ]; then
    echo "Copying .env.local from repo root..."
    cp "$CONDUCTOR_ROOT_PATH/.env.local" .env.local
elif [ -f "$CONDUCTOR_ROOT_PATH/.env" ]; then
    echo "Copying .env from repo root..."
    cp "$CONDUCTOR_ROOT_PATH/.env" .env
else
    echo "Warning: No .env or .env.local file found in repo root."
    echo "Supabase and other services may not work without proper environment variables."
fi

echo "Setup complete! 🚀"
