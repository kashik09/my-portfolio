#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ROOT_DIR="$ROOT_DIR" python3 - <<'PY'
import os
import re

root_dir = os.environ.get("ROOT_DIR") or os.getcwd()

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

replacements = [
    (re.compile(r"(?<![\w-])bg-white(?![\w/-])"), "bg-base-100"),
    (re.compile(r"(?<![\w-])bg-gray-50(?![\w/-])"), "bg-base-100"),
    (re.compile(r"(?<![\w-])bg-gray-100(?![\w/-])"), "bg-base-100"),
    (re.compile(r"(?<![\w-])bg-gray-200(?![\w/-])"), "bg-base-200"),
    (re.compile(r"(?<![\w-])text-black(?![\w/-])"), "text-base-content"),
    (re.compile(r"(?<![\w-])border-gray-200(?![\w/-])"), "border-base-300"),
    (re.compile(r"(?<![\w-])border-black(?![\w/-])"), "border-base-300"),
]

changed_files = []

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
                content = f.read()
        except OSError:
            continue

        original = content
        for pattern, replacement in replacements:
            content = pattern.sub(replacement, content)

        if content != original:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            changed_files.append(rel_path)

if changed_files:
    print("Updated files:")
    for path in sorted(changed_files):
        print(f"  {path}")
else:
    print("No files updated.")
PY
