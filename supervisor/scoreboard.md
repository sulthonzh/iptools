# Guardian Scoreboard

Last Updated: 2026-07-15T20:18:00+07:00

## Job Health Summary
- Total jobs: 60
- CE=0 (healthy): 52 ✅
- CE=1 (transient): 6 (all below escalation threshold)
- CE>=2 (failing): 2 (1 fixed, 1 watching)
- Disabled: 1 (Call with Janice reminder — no channel configured)

## System Status
- Overall: 🟢 HEALTHY (2 issues being managed)
- Provider: zai stable (glm-5.2 working well, glm-4.5-air having intermittent timeouts)

## Active Incidents

### INC-20260708-001: WorkspaceVanishedError — RECURRING (38th occurrence)
- Status: 🟡 WATCHING — 3 contaminated files cleaned this cycle
- Pattern: Attestation files from wealth-lab/oss-lab workspaces contaminate main workspace
- Root cause: Gateway-level bug — multi-agent attestation generation writes to shared directory
- Impact: Not causing job failures currently (cleanup runs each cycle)
- Last cleanup: 2026-07-15T20:18:00+07:00

### INC-20260715-014: halal-wealth-research-supervisor CE=4 — AUTO-FIXED
- Status: 🟢 FIX APPLIED — model switched to glm-5.2, awaiting recovery confirmation
- Root cause: Both glm-4.5-air and glm-4.7-flash timing out (LLM idle timeout 60s)
- Fix: Model → glm-5.2

## Jobs at CE>=2 (Current)
| Job | CE | Status | Action |
|-----|----|--------|--------|
| halal-wealth-research-supervisor | 4 | 🟢 Fixed | Model → glm-5.2, awaiting next run |
| opencode-session-supervisor | 2 | 🟡 Watching | Transient "couldn't generate response" — watching for self-recovery |

## Recently Resolved Incidents

### INC-20260714-013: Supervisor Incident Scanner CE=6 — RECOVERED ✅
- Recovery date: 2026-07-15T08:08:00+07:00
- Root cause: Provider billing cooldown
- Resolution: Swapped from glm-5.1 to glm-5.2

### INC-20260713-011: opencode-session-supervisor CE=2 — RECOVERED ✅
- Recovery date: 2026-07-13T04:01:00+07:00
- Root cause: Transient tool pipeline failures

## Auto-Fixes Applied This Cycle
| Job | Action | Details |
|-----|--------|---------|
| Attestation cleanup | Removed 3 contaminated files | 38th occurrence INC-20260708-001 |
| halal-wealth-research-supervisor | Model switched glm-4.5-air → glm-5.2 | CE=4, both fallback models timing out |

## Auto-Fixes Applied Recently
| Date | Job | Action | Outcome |
|------|-----|--------|---------|
| 2026-07-15 | Supervisor Incident Scanner | Model swapped glm-5.1→glm-5.2 | CE=6→0 recovered |
| 2026-07-13 | openclaw-backup-sync | Bumped timeout 5400→7200s | Backup growing to 16G/481K files |
| 2026-07-10 | idx-duel-record | Model switched glm-4.5-air→glm-5.1 | CE=4→0 recovered |
| 2026-07-12 | daily-report-6am | Model switched glm-5.1→glm-4.5-air | CE=5→0 recovered |
| 2026-07-12 | idx-morning-review | Model switched glm-4.5-air→glm-5.1 | CE=3→0 recovered |

## Notes
- System mostly healthy — 52/60 jobs at CE=0
- halal-wealth-research-supervisor fix applied, awaiting next run
- Attestation contamination continues (38th occurrence) but is managed
- Plugin version mismatch noted: config 2026.7.1 vs CLI 2026.6.6 — not causing failures yet
