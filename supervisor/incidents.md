# Supervisor Incident Scanner State

Last updated: 2026-07-15 21:57 WIB

## ACTIVE INCIDENTS

**None.** All cleared. 🎉

---

## PREVIOUSLY RESOLVED INCIDENTS

### INC-20260715-004: Model Availability - Timeout/Rate Limit (RESOLVED ✅)
**Resolved:** 2026-07-15 21:57 WIB
**First seen:** 2026-07-15 14:45 WIB
**Last seen:** 2026-07-15 20:09 WIB
**Root cause:** All 3 models failing for halal-wealth-research-supervisor (timeout/rate limit). Auto-heal applied at 20:43 WIB switching model. Confirmed recovered at 21:57 WIB — job now reports 0 consecutive errors, lastStatus=ok.
**Resolution:** Auto-heal succeeded. Job healthy.

### INC-20260715-005: opencode-session-supervisor Agent Response Failure (RESOLVED)
**Resolved:** 2026-07-15 20:43 WIB

### INC-20260715-003: halal-wealth-research-supervisor (RESOLVED → MERGED into INC-004)
### INC-20260715-002: idx-early-boom Tool Failure (RESOLVED — SELF-HEALED)
**Resolved:** 2026-07-15 11:43 WIB
### INC-20260715-001: Supervisor Incident Scanner Provider Billing Failure (RESOLVED)
**Resolved:** 2026-07-15 05:45 WIB
### INC-20260713-006: pr-review-merge-supervisor GitHub CLI Tool Failure (RESOLVED)
**Resolved:** 2026-07-14 02:43 WIB
### INC-20260713-005: oss-code-reviewer Tool Failure (RESOLVED)
**Resolved:** 2026-07-13 20:53 WIB
### INC-20260713-004: idx-opening-gap Tool Failure (RESOLVED — SELF-HEALED)
**Resolved:** 2026-07-15 11:43 WIB
### INC-20260713-003: openclaw-backup-sync Timeout (RESOLVED)
**Resolved:** 2026-07-13 12:29 WIB
### INC-20260713-002: idx-morning-review Agent Generation Failure (RESOLVED)
**Resolved:** 2026-07-13 12:29 WIB
### INC-20260713-001: opencode-session-supervisor (RESOLVED)
**Resolved:** 2026-07-14 04:33 WIB
### INC-20260712-002: marketing-supervisor OpenClaw Command Failure (RESOLVED)
**Resolved:** 2026-07-15 04:57 WIB
### INC-20260711-002: Multi-Service Failure (RESOLVED)
**Resolved:** 2026-07-13 07:55 WIB
### INC-20260711-003: Agent Setup Timeout (RESOLVED — MERGED)
### INC-20260711-001: pr-review-merge-supervisor Provider Timeout (RESOLVED)
**Resolved:** 2026-07-11 15:46 WIB
### INC-20260709-001: WorkspaceVanishedError (RESOLVED)
**Resolved:** 2026-07-11 13:28 WIB

---

## MONITORING (6 jobs with 1 consecutive error — all transient/known)

- `IDX Daily Precompute` (d25afdee): 1 error — exec failed (ps aux grep PID). Transient.
- `method-weekly-calibrate` (46f873a0): 1 error — gateway restart interruption (old, Jul 9). Next run Jul 18.
- `Call with Janice reminder` (3af236bc): 1 error — no channels configured. **Persistent, requires human action.**
- `idx-afternoon-momentum` (7b7f45ac): 1 error — exec failed (ps aux grep). Transient.
- `idx-closing-momentum` (b97bdddd): 1 error — exec failed (process poll). Transient.
- `paper-trade-morning-eval` (9c353e13): 1 error — "Agent couldn't generate a response." Monitor.

---

## SYSTEM HEALTH

**Total jobs scanned:** 60
**Jobs with 0 errors:** 53 ✅ (88%)
**Jobs with 1 error:** 6 ⚠️ (10%)
**Jobs with ≥2 consecutive errors:** 0 ✅ (0%)
**Active incidents:** 0 ✅

**Overall system health:** HEALTHY — All active incidents resolved. halal-wealth-research-supervisor auto-heal confirmed successful (0 errors after model switch). 88% of jobs fully healthy. Remaining 1-error jobs are transient or require human config change.

**Items to watch next cycle:**
- Call with Janice reminder: persistent channel config issue (requires human)
- paper-trade-morning-eval: monitor for escalation to 2+ errors

**Current time:** 2026-07-15 21:57 WIB
**Next scan:** ~22:57 WIB (hourly)
