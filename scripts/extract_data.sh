#!/bin/bash
# Extract quantum dot data from HTML files

echo "Extracting QDNP001 data..."
grep -o '"data":\[[^]]*\]' QDNP001.html | sed 's/.*data: //' > QDNP001_data.txt

echo "Extracting QDNP034 data..."
grep -o '"data":\[[^]]*\]' QDNP034.html | sed 's/.*data: //' > QDNP034_data.txt

echo ""
echo "=== QDNP001 Data ==="
cat QDNP001_data.txt
echo ""
echo "=== QDNP034 Data ==="
cat QDNP034_data.txt
