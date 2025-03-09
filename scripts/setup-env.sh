#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
  echo ".env file already exists. Please remove it first if you want to create a new one."
  exit 1
fi

# Create .env file from example
cp .env.example .env

echo "Created .env file from template. Please update it with your actual values."
echo "Remember: Never commit the .env file to version control!"