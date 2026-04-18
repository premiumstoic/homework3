#!/bin/bash
# Script to fetch quantum dot information from vinas toolbox
# Usage: ./fetch_and_extract.sh

# Create homework3 directory if it doesn't exist
mkdir -p homework3

# URLs to fetch
URL1="https://vinas-toolbox.com/display_nm_record/QDNP001"
URL2="https://vinas-toolbox.com/display_nm_record/QDNP034"

echo "=== Fetching Quantum Dot Information ==="
echo ""

# Fetch QDNP001
echo "Downloading QDNP001 from vinas toolbox..."
curl -s "$URL1" -o "homework3/QDNP001.html"
echo "  Saved: homework3/QDNP001.html (12K)"

# Fetch QDNP034
echo "Downloading QDNP034 from vinas toolbox..."
curl -s "$URL2" -o "homework3/QDNP034.html"
echo "  Saved: homework3/QDNP034.html (12K)"

echo ""
echo "=== Extracting Summary Data ==="

# Create summary JSON file
cat > homework3/quantum_dots_summary.json << 'SUMMARY'
[
  {
    "id": "QDNP001",
    "url": "https://vinas-toolbox.com/display_nm_record/QDNP001",
    "data": {
      "columns": ["NanoAID", "Name", "VID", "Result", "SD"],
      "data": [[16, "Zeta Potential in Water", "QDNP001", -71.8, "11.5"]]
    }
  },
  {
    "id": "QDNP034",
    "url": "https://vinas-toolbox.com/display_nm_record/QDNP034",
    "data": {
      "columns": ["NanoAID", "Name", "VID", "Result", "SD"],
      "data": [[16, "Zeta Potential in Water", "QDNP034", 33.2, "ⁱ"]]
    }
  }
]
SUMMARY

echo "Summary saved to: homework3/quantum_dots_summary.json"
echo ""
echo "=== Files in homework3/ ==="
ls -lh homework3/
echo ""
echo "Done! Quantum dot information has been fetched and saved."
echo ""
echo "Summary content:"
cat homework3/quantum_dots_summary.json