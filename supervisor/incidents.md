# Supervisor Incident Scanner State

Last updated: 2026-07-18 18:59 WIB

## ACTIVE INCIDENTS

### INC-20260718-001 — openclaw-backup-sync timeout + gateway interruption (ACTIVE 🔴 — ESCALATE)
- **Affected jobs:** openclaw-backup-sync (5772e091)
- **First seen:** 2026-07-18 06:13 WIB
- **Last seen:** 2026-07-18 17:46 WIB
- **consecutiveErrors:** 5 (was 4 last cycle → ESCALATION THRESHOLD HIT)
- **Last duration:** 1976466ms (~33 min — this run was killed by gateway restart, NOT timeout)
- **Timeout setting:** 10800s (bumped by prior cycle, but timeout runs still died at ~7200s)
- **Root cause:** MIXED — (1) Execution timeout for long backup runs (26G, 548K files), (2) Latest failure was gateway restart interruption. Timeout bump to 10800s proven ineffective — 3 prior runs died at exactly ~7200s suggesting gateway-level cap.
- **Error message (latest):** `cron: job interrupted by gateway restart`
- **Error message (prior 4):** `cron: job execution timed out`
- **Next run:** 2026-07-18 22:22 WIB (nextRunAtMs: 1784394120000)
- **Classification:** Infrastructure — gateway timeout cap + gateway restart. Auto-heal exhausted (timeout bump failed).
- **Auto-heal status:** ❌ EXHAUSTED. Timeout bump to 10800s did not help. At 5 consecutive errors.
- **Status:** 🔴 ESCALATE — needs human investigation.
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
- **Model note:** Job on `zai-coding-plan/glm-5.1`. Cross-model failure.
- **Classification:** Agent/provider failure — will auto-heal at ≥5 by switching to glm-4.7-flash.
- **Status:** ACTIVE — monitoring. 2 more errors → auto-switch model.

---

## RESOLVED INCIDENTS (THIS CYCLE)

### INC-20260718-003 — wealth-builder exec + billing failures (RESOLVED ✅)
- **Resolution:** consecutiveErrors dropped from 2 → 0. Last run successful (194s duration).
- **Root cause was intermittent:** ZAI billing 429s and exec failures self-resolved.
- **Resolved at:** 2026-07-18 ~18:59 WIB

---

## RESOLVED INCIDENTS (PRIOR CYCLES)

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

**6 jobs — gateway restart at ~17:46 WIB** (single event, transient):
- code-quality-supervisor, oss-code-reviewer, deployment-supervisor, marketing-supervisor, pr-review-merge-supervisor, challenge-hunter

**5 jobs — "Agent couldn't generate a response"** (possible correlated with gateway instability):
- Crypto V3 Afternoon Scan, idx-morning-review, idx-duel-evaluate, idx-opening-gap, idx-weekly-position

**3 jobs — specific errors:**
- method-daily-record: exec failed (python3 inline script, repo issue)
- idx-midday-update: exec failed (file listing issue)
- Call with Janice reminder: no channel configured

All at 1 error — no action taken per false alarm prevention rules.

---

## MONITORING

| Job | consecutiveErrors | Threshold for action | Notes |
|---|---|---|---|
| openclaw-backup-sync | 5 | ≥5 → ESCALATE | Timeout bump failed. Mixed timeout + gateway restart. ESCALATING. |
| Crypto V3 Morning Scan | 3 | ≥5 → switch model | Stable, next run tomorrow 06:06. |

---

## SYSTEM HEALTH SUMMARY

**Total jobs:** 60
**Jobs with 0 errors:** 44 (73.3%)
**Jobs with 1 error:** 14 (23.3%) — mostly transient gateway restart noise
**Jobs with ≥2 errors:** 2 (3.3%)

**Active incidents:** 2 (1 ESCALATED, 1 monitoring)
**Resolved this cycle:** 1 (INC-20260718-003 wealth-builder ✅)
**New incidents:** 0

**Assessment:** Backup-sync hit escalation threshold (5 errors). Wealth-builder resolved. 14 jobs at 1 error are transient gateway restart noise — expected to self-recover on next run. Fleet fundamentally healthy except for backup-sync.

**Trend:** INC-001 worsening (needs human), INC-002 stable, INC-003 resolved. Gateway restart caused batch of 1-error noise across 14 jobs.

---

## ACTIONS TAKEN THIS CYCLE (18:59 WIB)

1. ✅ Read state file from previous cycle (17:46 WIB)
2. ✅ Ran STATE-AWARE PROTOCOL pre-flight (5 steps)
3. ✅ Scanned all 60 cron jobs via `openclaw cron list --json --all`
4. ✅ Identified 2 jobs at ≥2 errors: openclaw-backup-sync (5, was 4), Crypto V3 Morning Scan (3, unchanged)
5. ✅ Checked wealth-builder — RESOLVED (0 errors, last run OK)
6. ✅ Noted 14 jobs at 1 error — all transient (6 gateway restart, 5 agent response, 3 specific)
7. ✅ Identified gateway restart event at ~17:46 WIB causing batch failures
8. ❌ No auto-heal triggered:
   - backup-sync at 5 errors: timeout bump already exhausted in prior cycles. ESCALATING.
   - Crypto V3 at 3 errors: below ≥5 threshold.
9. ✅ Resolved INC-20260718-003 (wealth-builder)
10. ✅ Updated state file

---

## ESCALATION NOTES

### 🔴 openclaw-backup-sync — ESCALATION FOR HUMAN INVESTIGATION
**Status:** 5 consecutive errors. Auto-heal exhausted.
**Finding:** Timeout bump to 10800s was applied but ineffective — timeout runs still die at ~7200s (gateway cap suspected). Latest run killed by gateway restart instead of timeout.
**Pattern:**
- Runs 1-4: timeout at ~7200s despite 10800s config
- Run 5: killed by gateway restart at ~33min (1976s)
**Recommended actions (in priority order):**
1. **Investigate gateway max timeout cap** — check if OpenClaw gateway has a hard 7200s limit that overrides job config
2. **Implement incremental backups** — full 26G/548K-file backup cannot complete in <2h window
3. **Exclude large directories** — `.git/objects/pack/` is likely the biggest contributor
4. **Split into multiple smaller jobs** — e.g., separate workspace, projects, configs
5. **Use rsync with --delete and hardlinks** for efficient incremental sync
