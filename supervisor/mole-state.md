# Mole State

## Last Cycle
- Time: 2026-08-25T10:24+07:00 (UTC: 2026-08-25T03:24Z)
- Task: HEARTBEAT_POLL
- Outcomes:
  - Re-checked cron health: 3 jobs in error (same as 09:24)
    - idx-predict-premarket — error, last run 2h ago (escalated at 09:24)
    - business-validator — error, last run 18h ago (escalated at 09:24)
    - idx-daily-swing — error, last run 18h ago (escalated at 09:24)
  - No new errors since 09:24; all escalated jobs unchanged
  - idx-backfill-monitor self-deadlock reported at 10:15 (requires code change, not autonomous)

## Current Cycle
- Task: HEARTBEAT_POLL
- Status: NO_ACTION
- Finding: No new errors; escalated jobs unchanged; backfill monitor needs code change

## Cron Health History
- 2026-08-25T05:00: OK — dockervis round 228 fix completed
- 2026-08-25T05:30: OK — dockervis round 229 follow-up completed
- 2026-08-25T06:00: ERROR — gh API failed on fastapi (1 consecutiveError)
- 2026-08-25T08:08: OK — 0/60 jobs with errors; code-quality-supervisor recovered
- 2026-08-25T08:31: STUCK — IDX daily precompute blocked by ScanGuard (later confirmed resolved)
- 2026-08-25T08:54: ESCALATE — idx-predict-premarket & idx-daily-swing ambiguous errors
- 2026-08-25T09:24: ESCALATE — business-validator new error; 3 weekly jobs old (monitor only)
- 2026-08-25T10:24: NO_ACTION — 3 jobs in error (same as 09:24); no new issues

## Active Issues
- 🔴 **ESCALATED**: idx-predict-premarket — Agent couldn't generate a response at 08:00 (ambiguous, guardian attention pending)
- 🔴 **ESCALATED**: idx-daily-swing — Exec failed at 24 Aug 16:21 (ambiguous, guardian attention pending)
- 🔴 **ESCALATED**: business-validator — Process failed at 24 Aug 16:01 (ambiguous errors: process failed, agent aborted, timeout)
- 🔴 **MONITOR**: idx-backfill-monitor — Self-deadlocks at 10:15; orphaned procs killed; requires code change (not autonomous)
- 🟡 **MONITOR**: idx-weekly-calibration — error at 21 Aug 16:43 (old weekly error, runs Friday)
- 🟡 **MONITOR**: idx-weekly-position — error at 4d ago (old weekly error, runs Friday)
- 🟡 **MONITOR**: method-weekly-calibrate — error at 3d ago (old weekly error, runs Saturday)
- ✅ **RESOLVED**: IDX Daily Precompute — no stuck PID, last run ok; stuck issue self-cleared

## Details
- Disk: 10G (stable)
- tmp: 163M (stable from last scan)
- Discovery Refresh: ≥ 2026-08-31