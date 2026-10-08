#!/usr/bin/env bash
# Forced command for the CI deploy key (authorized_keys `command=`; deployment.md host ops).
# sshd ignores whatever the client asked to run, runs this instead, and exposes the request
# as $SSH_ORIGINAL_COMMAND. The only request accepted is an image tag in the exact shape
# deploy.yml sends (the 12-char commit sha), so the key can deploy a CI build and nothing
# else — no shell, no other tags, no injected arguments.
set -euo pipefail

tag="${SSH_ORIGINAL_COMMAND:-}"
if [[ ! "$tag" =~ ^[0-9a-f]{12}$ ]]; then
  echo "✗ rejected: expected a 12-char image tag, got '${tag:0:80}'" >&2
  exit 1
fi

IMAGE_TAG="$tag" exec "$(dirname "$0")/deploy.sh"
