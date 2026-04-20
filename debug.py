import json
with open('quantum_dots_summary.json', 'r') as f:
    summary = json.load(f)
assay = {}
for item in summary:
    if "data_raw" in item and "data" in item["data_raw"]:
        for row in item["data_raw"]["data"]:
            vid = row[2]
            assay[vid] = row[3]
print((assay.keys()))
