# Guardian State — Meta Supervisor

Last Updated: 2026-07-15T00:04:00+07:00

---

## Active Incidents

### INC-20260708-001: WorkspaceVanishedError — RECURRING (34th occurrence)

**Pattern**: Attestation files from wealth-lab/oss-lab workspaces contaminate main workspace attestation directory.
**Status This Cycle**: 🟡 3 contaminated files cleaned (34th occurrence). Directory now clean.
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
- 32nd: 2026-07-14T16:19 — 2 files cleaned
- 33rd: 2026-07-14T20:03 — 3 files cleaned
- 34th: 2026-07-15T00:04 — 3 files cleaned

**Note**: Contamination continues recurring but is not causing job failures currently. Gateway-level fix still needed.

---

### INC-20260714-013: Supervisor Incident Scanner CE=2 — PROVIDER BILLING COOLDOWN (CONTINUING)

**Status**: 🟡 Provider billing cooldown still affecting this job. Last run failed with all 3 models failing (glm-5.1 billing cooldown, glm-4.5-air idle timeout, glm-4.7-flash idle timeout). Swapped primary model to glm-4.5-air. This guardian cycle ran fine on glm-5.2, so provider may have recovered — next run at 00:43 WIB should be watched.
**Root Cause**: Transient provider billing cooldown — cannot auto-fix, but provider appears to be recovering.
**Action**: Swapped model to glm-4.5-air. If next run still fails, escalate.

---

### INC-20260714-012: pr-review-merge-supervisor CE=0 — RECOVERED ✅

**Status**: 🟢 Recovered (CE=1→0). Job running normally.

---

## Resolved Incidents

- INC-20260713-011: opencode-session-supervisor CE=2 — RECOVERED ✅
- INC-20260712-009: daily-report-6am CE=5 — RECOVERED ✅
- INC-20260711-007: PROVIDER-WIDE OUTAGE — RECOVERED ✅
- INC-20260712-010: pr-review-merge-supervisor CE=3 — RECOVERED ✅

---

## Job Health Summary (2026-07-15T00:04)
- Total jobs: 60
- CE=0 (healthy): 52 ✅
- CE=1 (transient): 5 (all below escalation threshold)
- CE>=2 (failing): 3
  - Supervisor Incident Scanner CE=2 — provider billing cooldown, model swapped to glm-4.5-air
  - idx-opening-gap CE=3 — platform-level setup timeout, next run tomorrow 09:05 WIB
  - idx-early-boom CE=2 — platform-level setup timeout, next run tomorrow 09:15 WIB
- Disabled: 1 (Call with Janice reminder — unrelated to system health)

---

## Auto-Fixed Jobs This Cycle

| Job | Action | Details |
|-----|--------|---------|
| Attestation cleanup | Removed 3 contaminated files | 34th occurrence INC-20260708-001 |
| Supervisor Incident Scanner | Model swap glm-5.1→glm-4.5-air | Provider billing cooldown on glm-5.1 |

---

## 🔔 Still Watching

- **Supervisor Incident Scanner CE=2** — Provider billing cooldown. Model swapped. If next run fails, escalate.
- **idx-opening-gap CE=3** — Platform-level setup timeout. Market hours (next run tomorrow 09:05 WIB). Should self-recover.
- **idx-early-boom CE=2** — Platform-level setup timeout. Market hours (next run tomorrow 09:15 WIB). Should self-recover.
- **Attestation contamination** — 34th occurrence, 3 files cleaned. Gateway-level fix still needed.
- **Plugin version mismatch** — config written by 2026.7.1 but CLI running 2026.6.6. Not causing failures yet but needs `openclaw` update.

---

## Notes

Provider zai still experiencing intermittent billing cooldown on glm-5.1. This guardian cycle ran fine on glm-5.2, indicating partial provider recovery. Supervisor Incident Scanner model swapped to glm-4.5-air as primary — but glm-4.5-air was also timing out during the last failure. Next run at 00:43 WIB will be the real test.
