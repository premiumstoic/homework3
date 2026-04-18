#!/usr/bin/env python3
"""
Script to fetch quantum dot information from vinas toolbox
Fetches data for QDNP001 and QDNP034
"""

import requests
import re
import json
from pathlib import Path

def fetch_quantum_dot_info(qd_id):
    """Fetch quantum dot information from vinas toolbox"""
    url = f"https://vinas-toolbox.com/display_nm_record/{qd_id}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Extract the data using regex
        data_match = re.search(r'var dsData = (\{.*?\});', response.text, re.DOTALL)
        if data_match:
            data_str = data_match.group(1)
            # Clean up the data string for JSON parsing
            data_str = data_str.replace("\n", " ").replace("\r", "")
            # Fix any JSON issues
            data_str = re.sub(r'(\w+):', r'"\1":', data_str)
            
            try:
                data = json.loads(data_str)
                return {
                    'id': qd_id,
                    'status': 'success',
                    'data': data
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, return raw HTML snippet
                return {
                    'id': qd_id,
                    'status': 'partial',
                    'raw_data': data_match.group(0)
                }
        else:
            return {
                'id': qd_id,
                'status': 'error',
                'message': 'Could not find data in page'
            }
            
    except requests.exceptions.RequestException as e:
        return {
            'id': qd_id,
            'status': 'error',
            'message': f'Request failed: {e}'
        }

def main():
    # Create homework3 directory if it doesn't exist
    homework_dir = Path("homework3")
    homework_dir.mkdir(exist_ok=True)
    
    # Quantum dots to fetch
    quantum_dots = ["QDNP001", "QDNP034"]
    
    results = []
    
    for qd_id in quantum_dots:
        print(f"Fetching information for {qd_id}...")
        result = fetch_quantum_dot_info(qd_id)
        results.append(result)
        
        # Save to file
        output_file = homework_dir / f"{qd_id}_info.json"
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"  Saved to {output_file}")
        
        # Print summary
        if result['status'] == 'success':
            data = result['data']
            print(f"  Found {len(data.get('data', []))} records")
            for record in data.get('data', []):
                print(f"    - {record[1]}: {record[3]} (SD: {record[4]})")
        elif result['status'] == 'partial':
            print(f"  Partial data extracted")
        else:
            print(f"  Error: {result.get('message', 'Unknown error')}")
        print()
    
    # Create a summary file
    summary_file = homework_dir / "quantum_dots_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Summary saved to {summary_file}")

if __name__ == "__main__":
    main()