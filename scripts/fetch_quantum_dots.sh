#!/bin/bash
# Script to fetch quantum dot information from vinas toolbox
# Fetches data for QDNP001 and QDNP034

# Create homework3 directory if it doesn't exist
mkdir -p homework3

# URLs to fetch
URL1="https://vinas-toolbox.com/display_nm_record/QDNP001"
URL2="https://vinas-toolbox.com/display_nm_record/QDNP034"

echo "Fetching quantum dot information..."

# Fetch QDNP001
echo "Downloading QDNP001..."
curl -s "$URL1" -o "homework3/QDNP001.html"
echo "  Saved to homework3/QDNP001.html"

# Fetch QDNP034
echo "Downloading QDNP034..."
curl -s "$URL2" -o "homework3/QDNP034.html"
echo "  Saved to homework3/QDNP034.html"

# Extract key information using grep
echo ""
echo "Extracting information..."
echo ""

echo "=== QDNP001 Information ==="
grep -o '"data":\[[^]]*\]' "homework3/QDNP001.html" | head -1
echo ""

echo "=== QDNP034 Information ==="
grep -o '"data":\[[^]]*\]' "homework3/QDNP034.html" | head -1
echo ""

echo "Files saved in homework3/ directory:"
ls -lh homework3/*.html

echo ""
echo "Done! Quantum dot information has been fetched and saved."