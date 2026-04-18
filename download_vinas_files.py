import json
import os
import urllib.request
import time

def main():
    base_pdb_url = "https://vinas-toolbox.com/send_pdb/"
    base_desc_url = "https://vinas-toolbox.com/send_desc/"
    
    pdb_dir = "pdb_files"
    desc_dir = "descriptor_files"
    
    os.makedirs(pdb_dir, exist_ok=True)
    os.makedirs(desc_dir, exist_ok=True)
    
    # Generate IDs from QDNP001 to QDNP034
    ids = [f"QDNP{i:03d}" for i in range(1, 35)]
    
    print(f"Starting download for {len(ids)} nanoparticles...")
    
    for vid in ids:
        pdb_url = base_pdb_url + vid
        desc_url = base_desc_url + vid
        
        pdb_path = os.path.join(pdb_dir, f"{vid}.pdb")
        desc_path = os.path.join(desc_dir, f"{vid}.txt")
        
        # Download PDB
        try:
            print(f"Downloading PDB for {vid}...")
            urllib.request.urlretrieve(pdb_url, pdb_path)
            time.sleep(0.5) # Be respectful to the server
        except Exception as e:
            print(f"Failed to download PDB for {vid}: {e}")
            
        # Download Descriptor
        try:
            print(f"Downloading Descriptor for {vid}...")
            urllib.request.urlretrieve(desc_url, desc_path)
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to download Descriptor for {vid}: {e}")

    print("Download complete!")

if __name__ == "__main__":
    main()
