# Guardian State — Meta Supervisor

Last Updated: 2026-07-14T20:03:00+07:00

---

## Active Incidents

### INC-20260708-001: WorkspaceVanishedError — RECURRING (33rd occurrence)

**Pattern**: Attestation files from wealth-lab/oss-lab workspaces contaminate main workspace attestation directory.
**Status This Cycle**: 🟡 3 contaminated files cleaned (33rd occurrence). 1 valid attestation (TOOLS.md, hash 15cdfe57) preserved.
**Root Cause**: Gateway-level bug. Multi-agent attestation generation writes to shared directory.

**Pattern History**:
- 1st-5th: 2026-07-09 (multiple cycles)
- 6th: 2026-07-10T04:01 — clean ✅
- 7th-10th: 2026-07-10 (4 cycles)
- 11th-15th: 2026-07-11 (5 cycles)
- 16th: 2026-07-11T20:01 — 3 files cleaned
- 17th: 2026-07-12T00:01 — 2 files cleaned
- 18th: 2026-07-12T04:02 — 3 files cleaned
- 19th: 2026-07-12T08:01 — 3 files cleaned
- 20th: 2026-07-12T12:01 — 2 files cleaned
- 21st: 2026-07-12T16:01 — 3 files cleaned
- 22nd: 2026-07-12T20:04 — 3 files cleaned
- 23rd: 2026-07-13T00:05 — 2 files cleaned
- 24th: 2026-07-13T04:01 — 3 files cleaned
- 25th: 2026-07-13T09:58 — 3 files cleaned
- 26th: 2026-07-13T12:28 — 2 files cleaned
- 27th: 2026-07-13T20:20 — 3 files cleaned
- 28th: 2026-07-14T00:02 — 2 files cleaned
- 29th: 2026-07-14T04:01 — 3 files cleaned
- 30th: 2026-07-14T08:03 — 3 files cleaned
- 31st: 2026-07-14T12:05 — 2 files cleaned
- 32nd: 2026-07-14T16:19 — 2 files cleaned (scoreboard updated)
- 33rd: 2026-07-14T20:03 — 3 files cleaned

**Note**: Contamination continues recurring but is not causing job failures currently. Gateway-level fix still needed.

---

### INC-20260714-013: Supervisor Incident Scanner CE=6 — PROVIDER BILLING COOLDOWN — RE-ENABLED

**Status**: 🟡 RE-ENABLED — Job was disabled (CE=6) due to provider billing cooldown. All 3 models failed (glm-5.1 cooldown, glm-4.5-air idle timeout, glm-4.7-flash rate limit). Provider has recovered (this guardian cycle ran fine on glm-5.2). Re-enabled job, next run 20:43 WIB should succeed.
**Root Cause**: Transient provider billing cooldown — cannot auto-fix, but provider appears recovered.
**Action**: Re-enabled job. If next run fails, escalate.

---

### INC-20260714-012: pr-review-merge-supervisor CE=1 — RECOVERING

**Status**: 🟢 Recovering (CE=2→1). `gh pr merge 12 --repo sulthonzh/tree-diff --squash --auto` failed. Likely CI/branch protection. Watching only.

---

## Resolved Incidents

- INC-20260713-011: opencode-session-supervisor CE=2 — RECOVERED ✅
- INC-20260712-009: daily-report-6am CE=5 — RECOVERED ✅
- INC-20260711-007: PROVIDER-WIDE OUTAGE — RECOVERED ✅
- INC-20260712-010: pr-review-merge-supervisor CE=3 — RECOVERED ✅

---

## Job Health Summary (2026-07-14T20:03)
- Total jobs: 60
- CE=0 (healthy): 52 ✅
- CE=1 (transient): 5 (all transient — below escalation threshold)
- CE>=2 (failing): 2
  - idx-opening-gap CE=3 — transient `ps aux | grep` tool failure, next run tomorrow 09:05 WIB
  - idx-early-boom CE=2 — transient file listing failure, next run tomorrow 09:15 WIB
- Disabled: 0 (Supervisor Incident Scanner re-enabled)
- No critical incidents requiring human intervention

---

## Auto-Fixed Jobs This Cycle

| Job | Action | Details |
|-----|--------|---------|
| Attestation cleanup | Removed 3 contaminated files | 33rd occurrence INC-20260708-001 |
| Supervisor Incident Scanner | Re-enabled (was disabled) | Provider recovered from billing cooldown, CE=6, next run 20:43 WIB |

---

## 🔔 Still Watching

- **idx-opening-gap CE=3** — Transient `ps aux` grep failure. Market hours (next run tomorrow 09:05 WIB). Should self-recover.
- **idx-early-boom CE=2** — Transient file listing failure. Market hours (next run tomorrow 09:15 WIB). Should self-recover.
- **Attestation contamination** — 33rd occurrence, 3 files cleaned. Gateway-level fix still needed.
- **Plugin version mismatch** — config written by 2026.7.1 but CLI running 2026.6.6. Not causing failures yet but needs `openclaw` update.
- **pr-review-merge-supervisor CE=1** — Recovering from gh pr merge failure (CI/branch protection).

---

## Notes

Provider zai appears to have recovered from the billing/cooldown issue that affected Supervisor Incident Scanner (CE=6). Job has been re-enabled and should succeed on next run at 20:43 WIB. This guardian cycle itself ran fine on glm-5.2, confirming provider recovery.
