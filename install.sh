#!/usr/bin/env bash
# Install (or verify) the canonical github-readme-generator skill into one or
# more skills directories.
#
#   ./install.sh                          # .agents/skills and .claude/skills in the current project
#   ./install.sh ~/.claude/skills         # user-wide Claude Code
#   ./install.sh --check .claude/skills   # verify an installed copy matches the source
set -euo pipefail

SKILL_NAME="github-readme-generator"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/skills/$SKILL_NAME"

check_only=0
if [ "${1-}" = "--check" ]; then
  check_only=1
  shift
fi

targets=("$@")
if [ ${#targets[@]} -eq 0 ]; then
  targets=(".agents/skills" ".claude/skills")
fi

[ -f "$SOURCE_DIR/SKILL.md" ] || { echo "error: canonical skill not found at $SOURCE_DIR" >&2; exit 1; }

status=0
for parent in "${targets[@]}"; do
  dest="${parent/#\~/$HOME}/$SKILL_NAME"
  if [ "$check_only" -eq 1 ]; then
    if diff -r "$SOURCE_DIR" "$dest" >/dev/null 2>&1; then
      echo "ok      $dest"
    else
      echo "differs $dest"
      diff -r "$SOURCE_DIR" "$dest" || true
      status=1
    fi
  else
    mkdir -p "$dest"
    rm -rf "${dest:?}/SKILL.md" "${dest:?}/references"
    cp -R "$SOURCE_DIR/." "$dest/"
    echo "installed $dest"
  fi
done
exit $status
