#!/usr/bin/env python3
"""
Script to parse quantum dot information from downloaded HTML files
Extracts data from vinas toolbox pages for QDNP001 and QDNP034
"""

import re
import json
from pathlib import Path

def parse_quantum_dot_html(html_file):
    """Parse quantum dot HTML file and extract data"""
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Extract quantum dot ID from the page
    id_match = re.search(r'VeiNAS-ID: (QDNP\w+)', content)
    qd_id = id_match.group(1) if id_match else html_file.stem
    
    # Extract the data using regex - find the data array
    data_match = re.search(r'"data":\s*(\[[^]]*\])', content)
    
    result = {
        'id': qd_id,
        'file': str(html_file)
    }
    
    if data_match:
        data_str = data_match.group(1)
        
        try:
            data = json.loads(data_str)
            result['data'] = data
            result['status'] = 'success'
        except json.JSONDecodeError:
            result['status'] = 'error'
            result['message'] = 'Could not parse JSON data'
    else:
        result['status'] = 'error'
        result['message'] = 'Could not find data in HTML'
    
    return result

def main():
    homework_dir = Path("homework3")
    
    # Files to parse
    html_files = [
        homework_dir / "QDNP001.html",
        homework_dir / "QDNP034.html"
    ]
    
    results = []
    
    for html_file in html_files:
        if html_file.exists():
            print(f"Parsing {html_file.name}...")
            result = parse_quantum_dot_html(html_file)
            results.append(result)
            
            if result['status'] == 'success':
                data = result['data']
                print(f"  Quantum Dot ID: {result['id']}")
                print(f"  Records found: {len(data)}")
                for record in data:
                    if len(record) >= 4:
                        print(f"    - Test: {record[1]}")
                        print(f"      Value: {record[3]}")
                        if len(record) > 4:
                            print(f"      SD: {record[4]}")
            else:
                print(f"  Status: {result['status']}")
                if 'message' in result:
                    print(f"  Message: {result['message']}")
            print()
        else:
            print(f"File not found: {html_file}")
    
    # Save summary
    summary_file = homework_dir / "quantum_dots_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Summary saved to {summary_file}")
    
    # Also save individual JSON files
    for result in results:
        qd_id = result['id']
        json_file = homework_dir / f"{qd_id}_parsed.json"
        with open(json_file, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"Individual data saved to {json_file}")

if __name__ == "__main__":
    main()