# Guardian Scoreboard

Last Updated: 2026-07-14T20:03:00+07:00

## Job Health Summary
- Total jobs: 60
- CE=0 (healthy): 52 ✅
- CE=1 (transient): 5 (all transient — below escalation threshold)
- CE>=2 (failing): 2
  - idx-opening-gap CE=3 — transient `ps aux | grep` tool failure, next run tomorrow 09:05 WIB
  - idx-early-boom CE=2 — transient file listing tool failure, next run tomorrow 09:15 WIB
- Disabled: 0 (Supervisor Incident Scanner re-enabled)
- Running: 0

## System Status
- Overall: 🟢 STABLE
- System load: 6.66 5.25 4.31 (last check)
- Provider: zai appears recovered from billing cooldown

## Active Incidents

### INC-20260708-001: WorkspaceVanishedError — RECURRING (31st occurrence)
- Status: 🟡 WATCHING — 2 contaminated files cleaned this cycle
- Pattern: Attestation files from wealth-lab/oss-lab workspaces contaminate main workspace
- Root cause: Gateway-level bug — multi-agent attestation generation writes to shared directory
- Impact: Not causing job failures currently (attribution cleaned promptly)
- Fix needed: Gateway-level investigation
- Last cleanup: 2026-07-14T12:05:00+07:00

### INC-20260714-013: Supervisor Incident Scanner CE=6 — PROVIDER BILLING COOLDOWN — RE-ENABLED
- Status: 🟡 RE-ENABLED — Provider recovered from billing cooldown
- Details: All 3 models failed (glm-5.1 cooldown, glm-4.5-air idle timeout, glm-4.7-flash rate limit)
- Action taken: Re-enabled job (was disabled). Next run 20:43 WIB should succeed.

### INC-20260714-012: pr-review-merge-supervisor CE=2→1 — RECOVERING
- Status: 🟢 Recovering
- Details: `gh pr merge 12 --repo sulthonzh/tree-diff --squash --auto` failed
- Likely cause: CI/branch protection issues
- Action: Watching only (transient)

## Recently Resolved Incidents

### INC-20260713-011: opencode-session-supervisor CE=2 — RECOVERED ✅
- Recovery date: 2026-07-13T04:01:00+07:00
- Root cause: Transient tool pipeline failures (show/run jq commands)

### INC-20260712-009: daily-report-6am CE=5 — RECOVERED ✅
- Recovery date: 2026-07-13T04:01:00+07:00
- Root cause: Tool execution failure + provider outage legacy

### INC-20260711-007: PROVIDER-WIDE OUTAGE — RECOVERED ✅
- Recovery date: 2026-07-11T16:05:00+07:00
- Root cause: zai-coding-plan timing out across ALL models
- Affected: 11 jobs at CE>=2

## Jobs at CE>=2 (Current)
| CE | Job | Root Cause | Action | Status |
|----|-----|------------|--------|--------|
| 5 | Supervisor Incident Scanner | Provider billing cooldown | Watching | Should self-recover |
| 3 | idx-opening-gap | Transient `ps aux | grep` failure | Watching | Market hours, transient |
| 2 | idx-early-boom | Transient file listing failure | Watching | Market hours, transient |

## Auto-Fixes Applied This Cycle
| Job | Action | Details |
|-----|--------|---------|
| Attestation cleanup | Removed 3 contaminated files | 33rd occurrence INC-20260708-001 |
| Supervisor Incident Scanner | Re-enabled (was disabled) | Provider recovered, CE=6, next run 20:43 WIB |

## Auto-Fixes Applied Recently
| Date | Job | Action | Outcome |
|------|-----|--------|---------|
| 2026-07-13 | openclaw-backup-sync | Bumped timeout 5400→7200s | Backup growing to 16G/481K files |
| 2026-07-10 | idx-duel-record | Model switched glm-4.5-air→glm-5.1 | CE=4→0 recovered |
| 2026-07-12 | daily-report-6am | Model switched glm-5.1→glm-4.5-air | CE=5→0 recovered |
| 2026-07-12 | idx-morning-review | Model switched glm-4.5-air→glm-5.1 | CE=3→0 recovered |

## Notes
- Attestation contamination continues recurring but is not causing job failures
- Plugin version mismatch noted: config written by 2026.7.1 but CLI running 2026.6.6 — not causing failures yet
- System is otherwise healthy with 51/60 jobs running without errors