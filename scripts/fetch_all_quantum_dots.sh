#!/bin/bash
# Script to fetch quantum dot information from vinas toolbox
# Fetches all quantum dots from QDNP001 to QDNP034

echo "=== Fetching Quantum Dot Information (QDNP001 to QDNP034) ==="
echo ""

# Create homework3 directory if it doesn't exist
mkdir -p homework3

# Arrays to store results
declare -a successful_ids
declare -a failed_ids

# Loop through all quantum dot IDs from QDNP001 to QDNP034
for i in $(seq -w 1 34); do
    qd_id="QDNP0${i}"
    url="https://vinas-toolbox.com/display_nm_record/${qd_id}"
    output_file="homework3/${qd_id}.html"
    
    echo "Downloading ${qd_id}..."
    
    # Fetch the page
    http_code=$(curl -s -o "$output_file" -w "%{http_code}" "$url")
    
    if [ "$http_code" -eq 200 ]; then
        successful_ids+=("$qd_id")
        echo "  ✓ Saved: $output_file (HTTP $http_code)"
        
        # Extract data if available
        if grep -q "var dsData" "$output_file" 2>/dev/null; then
            echo "  ✓ Data found for ${qd_id}"
        else
            echo "  ⚠ No data found for ${qd_id}"
        fi
    else
        failed_ids+=("$qd_id")
        echo "  ✗ Failed: HTTP $http_code"
        # Remove empty file
        rm -f "$output_file"
    fi
done

echo ""
echo "=== Summary ==="
echo "Total processed: 34 quantum dots"
echo "Successfully downloaded: ${#successful_ids[@]}"
echo "Failed: ${#failed_ids[@]}"
echo ""

if [ ${#failed_ids[@]} -gt 0 ]; then
    echo "Failed IDs: ${failed_ids[*]}"
fi

# Create summary JSON file
echo "Creating summary JSON file..."

# Start building JSON
json_content='['

for qd_id in "${successful_ids[@]}"; do
    html_file="homework3/${qd_id}.html"
    
    # Extract basic info
    id_match=$(grep -o 'id.*QDN' "$html_file" | head -1 | grep -o 'QDN[0-9]*')
    
    # Extract data if available
    if grep -q "var dsData" "$html_file" 2>/dev/null; then
        data_match=$(grep "var dsData" "$html_file" | sed 's/^[[:space:]]*//' | sed 's/};.*//')
        
        if [ -n "$id_match" ]; then
            if [ "$json_content" != '[' ]; then
                json_content="$json_content,"
            fi
            json_content="$json_content\n  {\"id\": \"$id_match\", \"url\": \"$url\", \"data_raw\": $(echo $data_match | sed 's/var dsData = //')}"
        fi
    else
        if [ "$json_content" != '[' ]; then
            json_content="$json_content,"
        fi
        json_content="$json_content\n  {\"id\": \"$id_match\", \"url\": \"$url\", \"status\": \"no_data\"}"
    fi
done

json_content="$json_content\n]"

# Write JSON file
echo -e "$json_content" > homework3/quantum_dots_summary.json

echo ""
echo "Summary saved to: homework3/quantum_dots_summary.json"
echo ""
echo "=== Files in homework3/ ==="
ls -lh homework3/ | head -20
echo ""
echo "Done! All quantum dots from QDNP001 to QDNP034 have been processed."