#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORT_JSON="$ROOT_DIR/reports/theme-audit.json"

if [[ ! -f "$REPORT_JSON" ]]; then
  "$ROOT_DIR/sh-files/theme-audit.sh" >/dev/null
fi

ROOT_DIR="$ROOT_DIR" python3 - <<'PY'
import json
import os
from collections import Counter

root_dir = os.environ.get("ROOT_DIR") or os.getcwd()
report_json = os.path.join(root_dir, "reports", "theme-audit.json")

with open(report_json, "r", encoding="utf-8") as f:
    data = json.load(f)

by_file = Counter({k: int(v) for k, v in data.get("by_file", {}).items()})

print("Top offenders (by file):")
for file_path, count in by_file.most_common(20):
    print(f"  {count:4d}  {file_path}")

print("\nSafe auto-replacement mapping (used by theme-fix-apply.sh):")
print("  bg-white -> bg-base-100")
print("  bg-gray-50 -> bg-base-100")
print("  bg-gray-100 -> bg-base-100")
print("  bg-gray-200 -> bg-base-200")
print("  text-black -> text-base-content")
print("  border-gray-200 -> border-base-300")
print("  border-black -> border-base-300")
PY
