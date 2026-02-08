#!/bin/bash

echo "SafeNav Backend Setup"
echo "======================="
echo ""

if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install Node.js first."
  exit 1
fi

echo "Node.js detected"

if ! command -v psql &> /dev/null; then
  echo "PostgreSQL CLI not found. Make sure PostgreSQL is installed."
fi

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "Failed to install dependencies"
  exit 1
fi

echo "Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "Failed to generate Prisma client"
  exit 1
fi

echo "Running migrations..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
  echo "Failed to run migrations"
  exit 1
fi

echo "Seeding database..."
node prisma/seed.js

echo "Setup complete. Start the server with: npm run dev"
