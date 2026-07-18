# Supervisor Incident Scanner State

Last updated: 2026-07-18 19:43 WIB

## ACTIVE INCIDENTS

### INC-20260718-001 — openclaw-backup-sync timeout + gateway interruption (ACTIVE 🔴 — ESCALATE)
- **Affected jobs:** openclaw-backup-sync (5772e091)
- **First seen:** 2026-07-18 06:13 WIB
- **Last seen:** 2026-07-18 17:46 WIB
- **consecutiveErrors:** 5 (unchanged — no new runs since last cycle)
- **Last duration:** 1976466ms (~33 min — killed by gateway restart, NOT timeout)
- **Timeout setting:** 7200s (was bumped to 10800s in prior cycles but apparently reverted or capped)
- **Root cause:** MIXED — (1) Execution timeout for long backup runs (26G, 548K files), (2) Latest failure was gateway restart interruption. Timeout bump proven ineffective — prior runs died at ~7200s suggesting gateway-level cap.
- **Error message (latest):** `cron: job interrupted by gateway restart`
- **Error message (prior 4):** `cron: job execution timed out`
- **Next run:** 2026-07-18 22:22 WIB
- **Classification:** Infrastructure — gateway timeout cap + gateway restart. Auto-heal exhausted.
- **Auto-heal status:** ❌ EXHAUSTED. At 5 consecutive errors.
- **Status:** 🔴 ESCALATED — awaiting human investigation.
- **Recommended human actions:**
  1. Investigate gateway max timeout cap (suspected 7200s/2h limit)
  2. Implement incremental backups (rsync with hardlinks)
  3. Exclude `.git` objects pack files from backup
  4. Split into multiple smaller cron jobs
  5. Check if gateway restart at 17:46 was planned maintenance

### INC-20260718-002 — Crypto V3 Morning Scan agent failure (ACTIVE 🟡 — STABLE)
- **Affected jobs:** Crypto V3 Morning Scan (79e66b9f)
- **First seen:** 2026-07-18 06:07 WIB
- **consecutiveErrors:** 3 (unchanged — no new runs since last scan)
- **Next run:** 2026-07-19 06:06 WIB
- **Root cause:** Agent execution failure — model couldn't generate response
- **Error message:** `⚠️ Agent couldn't generate a response. Note: some tool actions may have already been executed — please verify before retrying.`
- **Model:** zai-coding-plan/glm-5.1
- **Classification:** Agent/provider failure — will auto-heal at ≥5 by switching model.
- **Status:** ACTIVE — monitoring. 2 more errors → auto-switch to glm-4.5-air.

---

## RESOLVED INCIDENTS

### INC-20260718-003 — wealth-builder exec + billing failures (RESOLVED ✅)
- **Resolution:** consecutiveErrors dropped from 2 → 0. Last run successful.
- **Resolved at:** 2026-07-18 ~18:59 WIB

### INC-20260717-007 — Crypto V3 Morning Scan agent failure (RESOLVED → REGRESSED to INC-20260718-002)
### INC-20260717-003 — ZAI provider rate limit + timeout cluster (RESOLVED ✅)
### INC-20260717-004 — IDX daily-rankings process kill failure (RESOLVED ✅)
### INC-20260717-006 — openclaw-backup-sync execution timeout (RESOLVED → REGRESSED to INC-20260718-001)
### INC-20260717-005 — Crypto V3 Morning Scan agent failure (MERGED → INC-20260717-007)
### INC-20260717-001 — ZAI provider instability cluster (RESOLVED → EVOLVED to INC-20260717-003)
### INC-20260717-002 — Supervisor toolchain failures (RESOLVED → MERGED into INC-20260717-003)
### INC-20260716-004 — wealth-product-owner persistent failures (RESOLVED ✅)
### INC-20260716-002 — Model cascade failure cluster (RESOLVED → regressed → evolved)
### INC-20260716-005 — IDX EOD processing failures (RESOLVED → regressed → evolved)
### INC-20260716-007 — pr-review-merge-supervisor PR merge blocked (RESOLVED ✅)
### INC-20260716-006 — oss-builder exec failures (RESOLVED → regressed → INC-20260717-003)

---

## TRANSIENT NOISE (1-ERROR JOBS — BELOW THRESHOLD, NOT INCIDENTS)

**5 jobs — gateway restart at ~17:46 WIB** (single event, transient):
- deployment-supervisor, marketing-supervisor, pr-review-merge-supervisor, code-quality-supervisor, challenge-hunter

**6 jobs — "Agent couldn't generate a response"** (possible correlated with provider instability):
- Crypto V3 Afternoon Scan, idx-morning-review, idx-duel-evaluate, idx-opening-gap, idx-weekly-position, oss-code-reviewer

**3 jobs — specific errors:**
- method-daily-record: exec failed (python3 inline script, repo issue)
- idx-midday-update: exec failed (file listing issue)
- Call with Janice reminder: no channel configured

All at 1 error — no action taken per false alarm prevention rules.

---

## MONITORING

| Job | consecutiveErrors | Threshold for action | Notes |
|---|---|---|---|
| openclaw-backup-sync | 5 | ≥5 → ESCALATED | Timeout bump failed. Mixed timeout + gateway restart. ESCALATED. |
| Crypto V3 Morning Scan | 3 | ≥5 → switch model | Stable, next run tomorrow 06:06. |

---

## SYSTEM HEALTH SUMMARY

**Total jobs:** 60
**Jobs with 0 errors:** 44 (73.3%)
**Jobs with 1 error:** 14 (23.3%) — transient noise
**Jobs with ≥2 errors:** 2 (3.3%)

**Active incidents:** 2 (1 ESCALATED, 1 monitoring)
**New incidents this cycle:** 0
**Resolved this cycle:** 0

**Assessment:** No state change since last cycle (18:59 WIB). Both active incidents unchanged — backup-sync next run at 22:22, Crypto V3 next at 06:06. 14 one-error jobs remain transient noise. Fleet stable.

---

## ACTIONS TAKEN THIS CYCLE (19:43 WIB)

1. ✅ Read state file from previous cycle (18:59 WIB)
2. ✅ Ran STATE-AWARE PROTOCOL pre-flight (5 steps)
3. ✅ Scanned all 60 cron jobs — 44 healthy, 14 at 1 error (noise), 2 at ≥2 errors
4. ✅ Confirmed INC-20260718-001 unchanged (5 errors, next run 22:22)
5. ✅ Confirmed INC-20260718-002 unchanged (3 errors, next run tomorrow 06:06)
6. ✅ No new incidents — no auto-heal triggered
7. ✅ Updated state file

---

## ESCALATION NOTES

### 🔴 openclaw-backup-sync — ESCALATION FOR HUMAN INVESTIGATION
**Status:** 5 consecutive errors. Auto-heal exhausted.
**Finding:** Timeout bump to 10800s was applied but ineffective — timeout runs still die at ~7200s (gateway cap suspected). Latest run killed by gateway restart at ~33min.
**Pattern:**
- Runs 1-4: timeout at ~7200s despite 10800s config
- Run 5: killed by gateway restart at ~33min (1976s)
**Recommended actions (in priority order):**
1. **Investigate gateway max timeout cap** — check if OpenClaw gateway has a hard 7200s limit
2. **Implement incremental backups** — full 26G/548K-file backup cannot complete in <2h
3. **Exclude large directories** — `.git/objects/pack/` likely biggest contributor
4. **Split into multiple smaller jobs**
5. **Use rsync with --delete and hardlinks** for efficient incremental sync
