import json
import os
import re
import collections
from pathlib import Path

def extract_pdb_info(pdb_path):
    if not os.path.exists(pdb_path):
        return None
    
    with open(pdb_path, "r") as f:
        lines = f.readlines()
        
    element_counts = collections.Counter()
    coords = {'x': [], 'y': [], 'z': []}
    
    for line in lines:
        if line.startswith("ATOM  ") or line.startswith("HETATM"):
            try:
                x = float(line[30:38].strip())
                y = float(line[38:46].strip())
                z = float(line[46:54].strip())
                
                elem = line[76:78].strip()
                if not elem:
                    elem = line[12:16].strip().rstrip('0123456789')
                    elem = re.sub(r'[^A-Za-z]', '', elem)
                elem = elem.capitalize()
                
                element_counts[elem] += 1
                coords['x'].append(x)
                coords['y'].append(y)
                coords['z'].append(z)
            except ValueError:
                continue
                
    result = {
        "total_atoms": sum(element_counts.values()),
        "elements": dict(element_counts),
        "dimensions_angstroms": None,
        "approximate_shape": None
    }
    
    if coords['x']:
        size_x = max(coords['x']) - min(coords['x'])
        size_y = max(coords['y']) - min(coords['y'])
        size_z = max(coords['z']) - min(coords['z'])
        result["dimensions_angstroms"] = {
            "x": round(size_x, 2),
            "y": round(size_y, 2),
            "z": round(size_z, 2)
        }
        
        # Simple shape heuristic
        sizes = sorted([size_x, size_y, size_z])
        if sizes[2] / max(sizes[0], 0.1) < 1.2:
            result["approximate_shape"] = "Spherical"
        else:
            result["approximate_shape"] = "Irregular/Elongated"
            
    return result

def main():
    # Load summary to merge assay data
    summary_file = "quantum_dots_summary.json"
    assay_data = {}
    if os.path.exists(summary_file):
        with open(summary_file, "r") as f:
            summary = json.load(f)
            for item in summary:
                if "data" in item and "data" in item["data"]:
                    for row in item["data"]["data"]:
                        if len(row) >= 5:
                            vid = row[2]
                            result = row[3]
                            try:
                                sd = float(row[4]) if row[4] != '\xad' else None
                            except (ValueError, TypeError):
                                sd = None
                                
                            assay_data[vid] = {
                                "assay_name": row[1],
                                "result": result,
                                "sd": sd
                            }

    all_nanoparticles = []
    
    pdb_dir = Path("pdb_files")
    for i in range(1, 35):
        vid = f"QDNP{i:03d}"
        pdb_path = pdb_dir / f"{vid}.pdb"
        
        info = extract_pdb_info(pdb_path)
        if info:
            record = {
                "id": vid,
                "structure": info,
                "assay": assay_data.get(vid, "no_data")
            }
            all_nanoparticles.append(record)
            
    output_path = "nanoparticles_comprehensive.json"
    with open(output_path, "w") as f:
        json.dump(all_nanoparticles, f, indent=4)
        
    print(f"Successfully processed {len(all_nanoparticles)} PDB files.")
    print(f"Data saved to {output_path}")

if __name__ == "__main__":
    main()
