"""
Batch GNM/ANM analysis for all 34 ViNAS nanoparticles (QDNP001–QDNP034).
Outputs qdot-discover/src/data/dynamics.json.

Node selection: auto-detect the most-abundant core metal element per particle.
Node cap: particles with >MAX_NODES metal atoms are downsampled by taking every
          N-th atom (uniform stride), a standard coarse-graining strategy.
"""

import json
import os
import tempfile
from pathlib import Path
from typing import Optional, Tuple, List

from prody import GNM, ANM, parsePDB
from prody import confProDy

confProDy(verbosity="warning")

PDB_DIR = Path("pdb_files")
OUT_FILE = Path("qdot-discover/src/data/dynamics.json")

METALS = {"CD", "ZN", "IN", "PB", "CU", "AG", "GA", "HG", "BI", "SN", "SI"}
MAX_NODES = 1000       # downsample above this to keep computation tractable
GNM_CUTOFF = 6.0
ANM_CUTOFFS = [10.0, 12.0, 15.0]
N_MODES = 50


def fix_residue_numbers(pdb_path: Path) -> str:
    """Return PDB text with sequentially renumbered residues (ViNAS quirk fix)."""
    lines = pdb_path.read_text().splitlines(keepends=True)
    fixed, resnum = [], 1
    for line in lines:
        if line.startswith(("ATOM", "HETATM")):
            line = line[:22] + f"{resnum:4d}" + " " + line[27:]
            resnum = resnum + 1 if resnum < 9999 else 1
        fixed.append(line)
    return "".join(fixed)


def detect_core_metal(structure) -> Optional[str]:
    """Return the element symbol (uppercase) of the most-abundant metal."""
    counts: dict = {}
    for atom in structure:
        el = atom.getElement().upper()
        counts[el] = counts.get(el, 0) + 1
    metals_present = {el: c for el, c in counts.items() if el in METALS}
    if not metals_present:
        return None
    return max(metals_present, key=lambda el: metals_present[el])


def downsample(nodes, target: int):
    """Return every N-th atom so that len(result) <= target."""
    n = nodes.numAtoms()
    if n <= target:
        return nodes
    stride = max(1, n // target)
    indices = list(range(0, n, stride))[:target]
    return nodes[indices]


def run_gnm(nodes, particle_id: str) -> Tuple[Optional[List[float]], Optional[float]]:
    gnm = GNM(f"{particle_id}_GNM")
    gnm.buildKirchhoff(nodes, cutoff=GNM_CUTOFF)
    n_modes = min(N_MODES, nodes.numAtoms() - 1)
    try:
        gnm.calcModes(n_modes=n_modes)
        return gnm.getEigvals().tolist(), GNM_CUTOFF
    except Exception as exc:
        print(f"  GNM failed for {particle_id}: {exc}", flush=True)
        return None, None


def run_anm(nodes, particle_id: str) -> Tuple[Optional[List[float]], Optional[float]]:
    max_modes = min(N_MODES, 3 * nodes.numAtoms() - 6)
    for cutoff in ANM_CUTOFFS:
        anm = ANM(f"{particle_id}_ANM")
        anm.buildHessian(nodes, cutoff=cutoff)
        try:
            anm.calcModes(n_modes=max_modes)
            eigvals = anm.getEigvals()
            if len(eigvals) < max_modes * 0.9:
                print(f"  ANM fragmented at {cutoff} Å ({len(eigvals)} modes), retrying…", flush=True)
                continue
            return eigvals.tolist(), cutoff
        except Exception as exc:
            print(f"  ANM error at {cutoff} Å for {particle_id}: {exc}, retrying…", flush=True)
    return None, None


def analyze(particle_id: str) -> Optional[dict]:
    pdb_path = PDB_DIR / f"{particle_id}.pdb"
    if not pdb_path.exists():
        print(f"  PDB not found: {pdb_path}", flush=True)
        return None

    fixed_pdb = fix_residue_numbers(pdb_path)

    with tempfile.NamedTemporaryFile(suffix=".pdb", mode="w", delete=False) as tmp:
        tmp.write(fixed_pdb)
        tmp_path = tmp.name

    try:
        structure = parsePDB(tmp_path)
    finally:
        os.unlink(tmp_path)

    if structure is None:
        print(f"  parsePDB returned None for {particle_id}", flush=True)
        return None

    metal_el = detect_core_metal(structure)
    if metal_el is None:
        print(f"  No core metal found for {particle_id}", flush=True)
        return None

    nodes_full = structure.select(f"element {metal_el}")
    if nodes_full is None or nodes_full.numAtoms() == 0:
        print(f"  No {metal_el} atoms found in {particle_id}", flush=True)
        return None

    n_full = nodes_full.numAtoms()
    nodes = downsample(nodes_full, MAX_NODES)
    n_nodes = nodes.numAtoms()
    downsampled = n_nodes < n_full
    print(
        f"  {particle_id}: {metal_el} nodes = {n_full}"
        + (f" → downsampled to {n_nodes}" if downsampled else ""),
        flush=True,
    )

    gnm_eigvals, gnm_cutoff = run_gnm(nodes, particle_id)
    anm_eigvals, anm_cutoff = run_anm(nodes, particle_id)

    return {
        "node_element": metal_el.capitalize(),
        "n_nodes": n_full,
        "n_nodes_used": n_nodes,
        "downsampled": downsampled,
        "gnm_cutoff": gnm_cutoff,
        "anm_cutoff": anm_cutoff,
        "gnm_eigenvalues": [round(v, 6) for v in gnm_eigvals] if gnm_eigvals else [],
        "anm_eigenvalues": [round(v, 6) for v in anm_eigvals] if anm_eigvals else [],
    }


def main():
    results: dict = {}
    ids = [f"QDNP{i:03d}" for i in range(1, 35)]

    for particle_id in ids:
        print(f"Analyzing {particle_id}…", flush=True)
        result = analyze(particle_id)
        if result:
            results[particle_id] = result
        else:
            print(f"  Skipped {particle_id}", flush=True)

        # Write incrementally so partial results are not lost
        OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        OUT_FILE.write_text(json.dumps(results, indent=2))

    print(f"\nDone. {len(results)}/34 particles written to {OUT_FILE}", flush=True)


if __name__ == "__main__":
    main()
