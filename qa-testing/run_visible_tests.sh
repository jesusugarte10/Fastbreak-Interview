#!/bin/bash

# Run tests with visible browser (default behavior)
# This script ensures the browser is visible so you can watch the tests run

echo "🎬 Starting Selenium tests with VISIBLE browser..."
echo "   You will see the browser window and can watch tests execute"
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Ensure HEADLESS is set to false
export HEADLESS=false

# Check if app is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Warning: App doesn't seem to be running on http://localhost:3000"
    echo "   Please start it with: npm run dev"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to cancel..."
fi

# Create reports directory
mkdir -p reports

echo ""
echo "✅ Tests completed!"
echo "📊 Check reports/ directory for HTML reports"


