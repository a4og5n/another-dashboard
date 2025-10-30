#!/bin/bash
# Monitor CPU usage during test runs

echo "🔍 Starting CPU monitoring during test run..."
echo "Configuration: maxThreads=4, fileParallelism=4, happy-dom"
echo ""

# Start background CPU monitoring
(
  while true; do
    echo "$(date '+%H:%M:%S') - CPU: $(top -l 1 -n 0 | grep "CPU usage" | awk '{print $3, $5}')"
    sleep 2
  done
) &
MONITOR_PID=$!

# Run tests
pnpm test

# Stop monitoring
kill $MONITOR_PID 2>/dev/null

echo ""
echo "✅ Test run complete"
