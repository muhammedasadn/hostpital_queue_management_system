#!/bin/bash

# Hospital Queue Management System - Installation Script

echo "======================================"
echo "Hospital Queue Management System"
echo "Installation Script"
echo "======================================"
echo ""

# Install Server Dependencies
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
  echo "Error installing server dependencies"
  exit 1
fi
cd ..

echo ""

# Install Client Dependencies
echo "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
  echo "Error installing client dependencies"
  exit 1
fi
cd ..

echo ""
echo "======================================"
echo "Installation Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the server (from the server directory):"
echo "   npm start"
echo ""
echo "2. In a new terminal, start the client (from the client directory):"
echo "   npm start"
echo ""
echo "Server will run on: http://localhost:5000"
echo "Client will run on: http://localhost:3000"
echo ""
