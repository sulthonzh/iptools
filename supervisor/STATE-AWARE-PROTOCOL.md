# STATE-AWARE PROTOCOL — Mole Agent

## 5-Step Pre-Flight (MANDATORY First Action)

1. Read STATE file: `/Users/sulthonzh/.openclaw/workspace/supervisor/mole-state.md`
2. Read DECISIONS log: `/Users/sulthonzh/.openclaw/workspace/supervisor/mole-decisions.log`
3. Pick ONE task from the task list (rotate tasks)
4. Execute task with autonomous fixes where allowed
5. Update STATE + append decision to DECISIONS log

## Required Emission

End each cycle with one of:
- `DECISION: <task> on <item>` + action + outcome
- `NO_ACTION_WITH_REASON: <evidence>`
- `❌ mole-optimize-hourly failed — <error>`

## Tasks (pick ONE, rotate)

### Task 1: CRON HEALTH
- `openclaw cron list --json --all > /tmp/cron-health.json`
- For each job with consecutiveErrors > 0:
  - Read last 3 error messages
  - FIX autonomously if: WorkspaceVanishedError, Timeout, Model unavailable
  - ESCALATE if: data/network/credentials

### Task 2: STALE SESSIONS
- `find /Users/sulthonzh/.openclaw/tmp/ -type d -mtime +7 -exec rm -rf {} + 2>/dev/null`
- Log count removed

### Task 3: DISK USAGE
- `du -sh /Users/sulthonzh/.openclaw/`
- If >2GB: find biggest, clean junk, escalate if essential data

### Task 4: AGENT WORKSPACE VALIDATION
- Check each agent workspace exists
- Log missing, flag in decisions

### Task 5: STATE FILE HYGIENE
- Update mole-state.md
- Append to mole-decisions.log