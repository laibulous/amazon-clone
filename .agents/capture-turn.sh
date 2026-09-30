#!/bin/bash
set -e

# Antigravity CLI feeds the hook payload via stdin. We capture it to extract metadata.
PAYLOAD=$(cat)
SESSION_ID=$(echo "$PAYLOAD" | jq -r '.conversationId // empty')

# If we couldn't get a session ID, exit gracefully so we don't crash the agent
if [ -z "$SESSION_ID" ] || [ "$SESSION_ID" == "null" ]; then
    echo '{"status":"success"}'
    exit 0
fi

# Determine workspace directory
WORKSPACE_DIR=$(echo "$PAYLOAD" | jq -r '.workspacePaths[0] // empty')
if [ -z "$WORKSPACE_DIR" ] || [ ! -d "$WORKSPACE_DIR" ]; then
    WORKSPACE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

# Locate transcript file
TRANSCRIPT_FILE=$(echo "$PAYLOAD" | jq -r '.transcriptPath // empty')
if [ -z "$TRANSCRIPT_FILE" ] || [ ! -f "$TRANSCRIPT_FILE" ]; then
    TRANSCRIPT_FILE="$HOME/.gemini/antigravity-cli/brain/$SESSION_ID/.system_generated/logs/transcript_full.jsonl"
fi
if [ ! -f "$TRANSCRIPT_FILE" ]; then
    TRANSCRIPT_FILE="$HOME/.gemini/antigravity-cli/brain/$SESSION_ID/.system_generated/logs/transcript.jsonl"
fi

if [ ! -f "$TRANSCRIPT_FILE" ]; then
    echo '{"status":"success"}'
    exit 0
fi

# Model name
MODEL_NAME=$(echo "$PAYLOAD" | jq -r '.modelName // empty')
if [ -z "$MODEL_NAME" ] || [ "$MODEL_NAME" == "null" ]; then
    MODEL_NAME="gemini-3.8-flash-high"
fi

# Log directory and file (in workspace)
LOG_DIR="$WORKSPACE_DIR/.agent-logs"
LOG_DATE=$(date -u +"%Y-%m-%d")
LOG_FILE="$LOG_DIR/${LOG_DATE}_${SESSION_ID}.md"

mkdir -p "$LOG_DIR"

AUTHOR=$(git config user.name 2>/dev/null || echo "local-user")
PROJECT_NAME=$(basename "$WORKSPACE_DIR")

# If the log file doesn't exist yet, initialize it with the 8x header format
if [ ! -f "$LOG_FILE" ]; then
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    cat <<EOF > "$LOG_FILE"
---
session_id: $SESSION_ID
date: $LOG_DATE
author: $AUTHOR
model: $MODEL_NAME
tool: antigravity-cli
project: $PROJECT_NAME
first_prompt_time: $TIMESTAMP
---

# Session Log - $LOG_DATE

Session: \`${SESSION_ID:0:8}\` | Project: \`$PROJECT_NAME\` | Author: \`$AUTHOR\`

---

EOF
fi

# Parse the LAST turn from the transcript.
LAST_PROMPT_RAW=$(jq -s -r '[.[] | select(.type == "USER_INPUT" and .content != null and .content != "")] | last | .content // ""' "$TRANSCRIPT_FILE")

# Extract text within <USER_REQUEST> if present
if echo "$LAST_PROMPT_RAW" | grep -q "<USER_REQUEST>"; then
    LAST_PROMPT=$(echo "$LAST_PROMPT_RAW" | sed -n '/<USER_REQUEST>/,/<\/USER_REQUEST>/{ /<USER_REQUEST>/d; /<\/USER_REQUEST>/d; p }' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    if [ -z "$LAST_PROMPT" ]; then
        LAST_PROMPT="$LAST_PROMPT_RAW"
    fi
else
    LAST_PROMPT="$LAST_PROMPT_RAW"
fi

LAST_RESPONSE=$(jq -s -r '[.[] | select(.type == "PLANNER_RESPONSE" and .content != null and .content != "")] | last | .content // ""' "$TRANSCRIPT_FILE")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Get current turn number by counting how many PROMPT entries already exist in our log
TURN_COUNT=$(grep -c "^\[LOG_ENTRY type=PROMPT" "$LOG_FILE" 2>/dev/null || true)
if [ -z "$TURN_COUNT" ]; then
    TURN_COUNT=0
fi
TURN_NUM=$((TURN_COUNT + 1))

# Append the Prompt
{
    echo "[LOG_ENTRY type=PROMPT num=$TURN_NUM session=${SESSION_ID:0:8}]"
    echo "timestamp: $TIMESTAMP"
    echo "model: $MODEL_NAME"
    echo ""
    printf "%s\n\n" "$LAST_PROMPT"
} >> "$LOG_FILE"

# Append the Response
{
    echo "[LOG_ENTRY type=RESPONSE num=$TURN_NUM session=${SESSION_ID:0:8}]"
    echo "timestamp: $TIMESTAMP"
    echo "model: $MODEL_NAME"
    echo ""
    printf "%s\n\n" "$LAST_RESPONSE"
} >> "$LOG_FILE"

# Hooks must return a JSON response to stdout
echo '{"status":"success"}'
exit 0
