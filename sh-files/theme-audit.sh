#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORT_DIR="$ROOT_DIR/reports"
TXT_REPORT="$REPORT_DIR/theme-audit.txt"
JSON_REPORT="$REPORT_DIR/theme-audit.json"

mkdir -p "$REPORT_DIR"

ROOT_DIR="$ROOT_DIR" python3 - <<'PY'
import json
import os
import re
from collections import Counter

root_dir = os.environ.get("ROOT_DIR") or os.getcwd()
report_dir = os.path.join(root_dir, "reports")
json_report = os.path.join(report_dir, "theme-audit.json")
text_report = os.path.join(report_dir, "theme-audit.txt")

include_exts = {".ts", ".tsx", ".css"}
exclude_dirs = {
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".git",
}
lockfiles = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",
    "npm-shrinkwrap.json",
}

rules = [
    ("TW_BG_BLACK_WHITE", re.compile(r"\bbg-(black|white)\b")),
    ("TW_TEXT_BLACK_WHITE", re.compile(r"\btext-(black|white)\b")),
    ("TW_BG_GRAY", re.compile(r"\bbg-gray-(\d{2,3})\b")),
    ("TW_TEXT_GRAY", re.compile(r"\btext-gray-(\d{2,3})\b")),
    ("TW_BORDER_GRAY", re.compile(r"\bborder-gray-(\d{2,3})\b")),
    ("TW_RING_GRAY", re.compile(r"\bring-gray-(\d{2,3})\b")),
    ("TW_SHADOW_BLACK", re.compile(r"\bshadow-black(?:/\d+)?\b")),
    ("TW_GRADIENT_BLACK_WHITE", re.compile(r"\b(?:from|via|to)-(?:black|white)\b")),
    ("TW_HEX_COLOR", re.compile(r"\b(?:bg|text|border|ring|from|via|to)-\[#?[0-9a-fA-F]{3,8}\]\b")),
    ("TW_ARBITRARY_COLOR", re.compile(r"\b(?:bg|text|border|ring|from|via|to)-\[[^\]]+\]\b")),
    ("INLINE_STYLE_COLOR", re.compile(r"\b(color|background|backgroundColor|borderColor)\s*:")),
    ("CSS_VAR_OVERRIDE", re.compile(r"--(bg|surface)\b")),
]

violations = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    rel_dir = os.path.relpath(dirpath, root_dir)
    rel_dir_posix = rel_dir.replace(os.sep, "/")

    if rel_dir == ".":
        rel_dir_posix = ""

    dirnames[:] = [
        d for d in dirnames
        if d not in exclude_dirs
        and not (rel_dir_posix.startswith("public/generated") or f"{rel_dir_posix}/{d}".startswith("public/generated"))
    ]

    for filename in filenames:
        if filename in lockfiles:
            continue
        ext = os.path.splitext(filename)[1]
        if ext not in include_exts:
            continue
        file_path = os.path.join(dirpath, filename)
        rel_path = os.path.relpath(file_path, root_dir)
        if rel_path.replace(os.sep, "/").startswith("public/generated"):
            continue
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
        except OSError:
            continue

        for idx, line in enumerate(lines, start=1):
            for rule_id, pattern in rules:
                for match in pattern.finditer(line):
                    matched_text = match.group(0)
                    if rule_id == "TW_ARBITRARY_COLOR" and "var(--" in matched_text:
                        continue
                    violations.append({
                        "file": rel_path,
                        "line": idx,
                        "column": match.start() + 1,
                        "rule": rule_id,
                        "match": matched_text,
                        "context": line.rstrip("\n"),
                    })

violations.sort(key=lambda v: (v["file"], v["line"], v["column"]))

counts_by_rule = Counter(v["rule"] for v in violations)
counts_by_file = Counter(v["file"] for v in violations)

with open(json_report, "w", encoding="utf-8") as f:
    json.dump({
        "total": len(violations),
        "by_rule": counts_by_rule,
        "by_file": counts_by_file,
        "violations": violations,
    }, f, indent=2)

with open(text_report, "w", encoding="utf-8") as f:
    f.write("Theme Audit Report\n")
    f.write("===================\n")
    f.write(f"Total violations: {len(violations)}\n\n")

    f.write("Top offending files:\n")
    for file_path, count in counts_by_file.most_common(20):
        f.write(f"  {count:4d}  {file_path}\n")

    f.write("\nViolations by rule:\n")
    for rule_id, count in counts_by_rule.most_common():
        f.write(f"  {count:4d}  {rule_id}\n")

    f.write("\nDetailed violations:\n")
    for v in violations:
        f.write(
            f"{v['file']}:{v['line']}:{v['column']} | {v['rule']} | {v['match']} | {v['context']}\n"
        )

print(f"Wrote {text_report}")
print(f"Wrote {json_report}")
PY
