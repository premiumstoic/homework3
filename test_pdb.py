import re
import collections
from pathlib import Path

pdb_file = Path("pdb_files/QDNP001.pdb")
if pdb_file.exists():
    with open(pdb_file, "r") as f:
        lines = f.readlines()
    
    atoms = []
    element_counts = collections.Counter()
    coords = {'x': [], 'y': [], 'z': []}
    
    for line in lines:
        if line.startswith("ATOM  ") or line.startswith("HETATM"):
            # According to PDB format, element is usually at cols 77-78
            # or we can extract X, Y, Z from 31-38, 39-46, 47-54
            x = float(line[30:38].strip())
            y = float(line[38:46].strip())
            z = float(line[46:54].strip())
            
            # Element symbol from cols 77-78, or substring 12-16 if empty
            elem = line[76:78].strip()
            if not elem:
                elem = line[12:16].strip().rstrip('0123456789')
                elem = re.sub(r'[^A-Za-z]', '', elem)
                
            element_counts[elem] += 1
            coords['x'].append(x)
            coords['y'].append(y)
            coords['z'].append(z)
            
    if coords['x']:
        size_x = max(coords['x']) - min(coords['x'])
        size_y = max(coords['y']) - min(coords['y'])
        size_z = max(coords['z']) - min(coords['z'])
        print(f"Elements: {dict(element_counts)}")
        print(f"Dimensions: {size_x:.1f} x {size_y:.1f} x {size_z:.1f} Å")
