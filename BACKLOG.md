# 🎯 OpenClaw Backlog

This backlog captures identified issues, improvement ideas, and pending work for prioritization.

## 🚨 High Priority

### 1. Backup Strategy for OpenClaw Configuration
- **Issue**: No automated backups of OpenClaw configuration files
- **Impact**: Loss of configuration could disrupt all automation
- **Proposed Solution**: 
  - Set up daily backup of `~/.openclaw/openclaw.json`
  - Include agent configurations and state files
  - Store backups with retention policy
- **Estimated Effort**: 2 hours

### 2. Failover Model Configuration
- **Issue**: Single model dependency across all cron jobs
- **Impact**: Model outages break entire automation pipeline
- **Proposed Solution**: 
  - Document current model assignments per job
  - Test fallback model (zai-coding-plan/glm-4.5-air) for critical jobs
  - Create model rotation strategy
- **Estimated Effort**: 3 hours

### 3. Agent Workspace Validation Automation
- **Issue**: Manual process to validate workspace directories exist
- **Impact**: Can lead to silent failures when workspace paths change
- **Proposed Solution**: 
  - Create automated validation script
  - Integrate into cron schedule (weekly)
  - Alert on workspace path issues
- **Estimated Effort**: 2 hours

## 📋 Medium Priority

### 4. Disk Usage Alerting
- **Issue**: Only reactive cleanup when disk fills up
- **Impact**: Can cause unexpected service disruption
- **Proposed Solution**:
  - Set up threshold-based alerts (e.g., 80% usage)
  - Implement proactive cleanup triggers
  - Disk growth trend analysis
- **Estimated Effort**: 2 hours

### 5. Session Cleanup Strategy Review
- **Issue**: 7-day threshold may be too aggressive/conservative
- **Impact**: Could lose useful debugging data or waste space
- **Proposed Solution**:
  - Analyze typical session lifecycle
  - Implement tiered cleanup strategy
  - Preserve error/failure sessions longer
- **Estimated Effort**: 1 hour

### 6. State File Versioning
- **Issue**: No history of state changes in mole-state.md
- **Impact**: Hard to track when issues started
- **Proposed Solution**:
  - Implement git-style versioning for state files
  - Add change tracking with timestamps
  - Enable rollback capability
- **Estimated Effort**: 3 hours

## 💡 Low Priority / Ideas

### 7. Metrics Dashboard
- **Idea**: Centralized view of OpenClaw health metrics
- **Value**: Better visibility into system state
- **Components**:
  - Cron job success rates
  - Disk usage trends
  - Model performance metrics
  - Agent activity heatmaps
- **Estimated Effort**: 6 hours

### 8. Self-Healing Documentation
- **Issue**: Auto-fix actions are scattered across files
- **Impact**: Hard to understand what fixes are available
- **Proposed Solution**: 
  - Create comprehensive self-healing catalog
  - Document all autonomous actions with triggers
  - Add success metrics for each fix type
- **Estimated Effort**: 2 hours

### 9. Backup Testing
- **Issue**: No verification that backups are restorable
- **Impact**: Could discover backup issues when it's too late
- **Proposed Solution**:
  - Monthly restore tests
  - Automated backup integrity checks
  - Alert on backup failures
- **Estimated Effort**: 2 hours

## 📝 Recent Actions (Last 7 Days)

### 2025-06-18 (Today)
- **Action**: Cleaned up stale workspace attestation files
- **Files Removed**: 8 attestation files
- **Trigger**: Proactive maintenance during cron health check

### 2025-06-17
- **Action**: Bumped timeout for idx-trading-screening job (3290f7be)
- **New Timeout**: 1800 seconds
- **Trigger**: Timeout errors observed

### 2025-06-16
- **Action**: Cleaned up old log files (>30 days)
- **Files Cleaned**: 15 log files
- **Disk Recovered**: ~250MB

---

## 🔄 Completed Items

### Backup Strategy (Completed 2025-06-10)
- Implemented daily OpenClaw config backups
- Set up 30-day retention policy
- Verified restore process

### Failover Model Testing (Completed 2025-06-12)
- Tested glm-4.5-air on idx-trading-screening
- Documented model switching process
- Updated AGENTS.md with model fallback info

---

**Last Updated**: 2025-06-18
**Maintained By**: mole-optimize-hourly cron job