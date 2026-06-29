#!/bin/bash
set -euo pipefail
echo "=== Rust Check ==="
cargo check --workspace
echo "=== Clippy ==="
cargo clippy --workspace -- -D warnings
echo "=== Format ==="
cargo fmt --check
echo "All Rust checks passed!"
