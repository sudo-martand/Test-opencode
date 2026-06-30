import { describe, it, expect } from 'vitest';
import {
  SocialEngCoordinator, createDefaultSocialEngEnvironment,
  PhishingManager, DeepfakeManager, BecManager, PretextingManager,
  InsiderThreatManager, OsintManager, SocialEngSecurityManager,
  phishingCampaignId, deepfakeId, becIncidentId, pretextingId,
  insiderThreatId, osintTargetId, socialEngFindingId,
  PhishingType, PhishingStatus, DeepfakeType, BecType, PretextType,
  InsiderThreatType, InsiderThreatSeverity, OsintDataType,
  PsychologicalPrinciple, SocialEngineeringAttackType,
  createPhishingCampaign, createDeepfake, createBecIncident,
  createPretextingScenario, createInsiderThreat, createOsintTarget,
  createSocialEngFinding, getKnownSocialEngAttacks,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      phishingCampaignId(), deepfakeId(), becIncidentId(), pretextingId(),
      insiderThreatId(), osintTargetId(), socialEngFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => phishingCampaignId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createPhishingCampaign with defaults', () => {
    const c = createPhishingCampaign();
    expect(c.type).toBe(PhishingType.GENERIC);
    expect(c.status).toBe(PhishingStatus.PLANNED);
    expect(c.recipientsCount).toBe(100);
    expect(c.clicksCount).toBe(0);
  });
  it('createPhishingCampaign with overrides', () => {
    const c = createPhishingCampaign({ type: PhishingType.SPEAR, name: 'Test', recipientsCount: 50 });
    expect(c.type).toBe(PhishingType.SPEAR);
    expect(c.name).toBe('Test');
    expect(c.recipientsCount).toBe(50);
  });
  it('createDeepfake with defaults', () => {
    const d = createDeepfake();
    expect(d.type).toBe(DeepfakeType.VOICE_CLONE);
    expect(d.deployed).toBe(false);
    expect(d.detected).toBe(false);
  });
  it('createBecIncident with defaults', () => {
    const i = createBecIncident();
    expect(i.type).toBe(BecType.CEO_FRAUD);
    expect(i.resolved).toBe(false);
    expect(i.lossAmount).toBe(50000);
  });
  it('createPretextingScenario with defaults', () => {
    const s = createPretextingScenario();
    expect(s.type).toBe(PretextType.IT_SUPPORT);
    expect(s.successful).toBe(false);
    expect(s.duration).toBe(15);
  });
  it('createInsiderThreat with defaults', () => {
    const t = createInsiderThreat();
    expect(t.type).toBe(InsiderThreatType.DISGRUNTLED);
    expect(t.severity).toBe(InsiderThreatSeverity.MEDIUM);
    expect(t.detected).toBe(false);
  });
  it('createOsintTarget with defaults', () => {
    const t = createOsintTarget();
    expect(t.digitalFootprintSize).toBe('MINIMAL');
    expect(t.riskScore).toBe(0);
  });
  it('createSocialEngFinding with defaults', () => {
    const f = createSocialEngFinding();
    expect(f.severity).toBe('high');
    expect(f.mitigated).toBe(false);
  });
  it('getKnownSocialEngAttacks returns 18 attacks', () => {
    const attacks = getKnownSocialEngAttacks();
    expect(attacks).toHaveLength(18);
  });
});

// ─── PhishingManager ────────────────────────────────────────────
describe('PhishingManager', () => {
  it('createCampaign, getCampaign, listCampaigns', () => {
    const mgr = new PhishingManager();
    const id = mgr.createCampaign({ type: PhishingType.SPEAR, name: 'Test', targetAudience: 'Execs', platform: 'EMAIL', lureContent: 'Test', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    expect(mgr.getCampaign(id)).toBeDefined();
    expect(mgr.getCampaign(id)!.type).toBe(PhishingType.SPEAR);
    expect(mgr.listCampaigns()).toHaveLength(1);
  });
  it('getCampaign returns undefined for nonexistent', () => {
    const mgr = new PhishingManager();
    expect(mgr.getCampaign('nonexistent' as any)).toBeUndefined();
  });
  it('listByType', () => {
    const mgr = new PhishingManager();
    mgr.createCampaign({ type: PhishingType.SPEAR, name: 'S1', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    mgr.createCampaign({ type: PhishingType.WHALING, name: 'W1', targetAudience: 'B', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    expect(mgr.listByType(PhishingType.SPEAR)).toHaveLength(1);
  });
  it('listByStatus', () => {
    const mgr = new PhishingManager();
    const id = mgr.createCampaign({ type: PhishingType.GENERIC, name: 'T', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    expect(mgr.listByStatus(PhishingStatus.PLANNED)).toHaveLength(1);
    mgr.deployCampaign(id);
    expect(mgr.listByStatus(PhishingStatus.DEPLOYED)).toHaveLength(1);
  });
  it('deployCampaign and closeCampaign', () => {
    const mgr = new PhishingManager();
    const id = mgr.createCampaign({ type: PhishingType.GENERIC, name: 'T', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 100, pointsToPonder: [] });
    expect(mgr.deployCampaign(id)).toBe(true);
    expect(mgr.getCampaign(id)!.status).toBe(PhishingStatus.DEPLOYED);
    expect(mgr.deployCampaign('nonexistent' as any)).toBe(false);
    expect(mgr.closeCampaign(id)).toBe(true);
    expect(mgr.getCampaign(id)!.status).toBe(PhishingStatus.CLOSED);
    expect(mgr.getCampaign(id)!.endDate).toBeDefined();
  });
  it('recordClick and harvestCredential', () => {
    const mgr = new PhishingManager();
    const id = mgr.createCampaign({ type: PhishingType.GENERIC, name: 'T', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 100, pointsToPonder: [] });
    expect(mgr.recordClick(id)).toBe(true);
    expect(mgr.getCampaign(id)!.clicksCount).toBe(1);
    expect(mgr.getCampaign(id)!.successRate).toBe(1);
    expect(mgr.recordClick('nonexistent' as any)).toBe(false);
    expect(mgr.harvestCredential(id)).toBe(true);
    expect(mgr.getCampaign(id)!.credentialsHarvested).toBe(1);
    expect(mgr.harvestCredential('nonexistent' as any)).toBe(false);
  });
  it('getStats', () => {
    const mgr = new PhishingManager();
    const id = mgr.createCampaign({ type: PhishingType.SPEAR, name: 'S', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 100, pointsToPonder: [] });
    mgr.deployCampaign(id);
    mgr.recordClick(id);
    mgr.recordClick(id);
    mgr.harvestCredential(id);
    const stats = mgr.getStats();
    expect(stats.total).toBe(1);
    expect(stats.active).toBe(1);
    expect(stats.totalClicks).toBe(2);
    expect(stats.harvestRate).toBe(50);
  });
});

// ─── DeepfakeManager ────────────────────────────────────────────
describe('DeepfakeManager', () => {
  it('create, get, list', () => {
    const mgr = new DeepfakeManager();
    const id = mgr.create({ type: DeepfakeType.VOICE_CLONE, targetPersona: 'CEO', generatedContent: 'X', platform: 'P', authenticityScore: 90, detectionDifficulty: 'HARD' });
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.type).toBe(DeepfakeType.VOICE_CLONE);
    expect(mgr.list()).toHaveLength(1);
  });
  it('deploy and markDetected', () => {
    const mgr = new DeepfakeManager();
    const id = mgr.create({ type: DeepfakeType.FACE_SWAP, targetPersona: 'CFO', generatedContent: 'X', platform: 'V', authenticityScore: 80, detectionDifficulty: 'HARD' });
    expect(mgr.deploy(id)).toBe(true);
    expect(mgr.get(id)!.deployed).toBe(true);
    expect(mgr.deploy('nonexistent' as any)).toBe(false);
    expect(mgr.markDetected(id)).toBe(true);
    expect(mgr.get(id)!.detected).toBe(true);
    expect(mgr.markDetected('nonexistent' as any)).toBe(false);
  });
  it('getStats', () => {
    const mgr = new DeepfakeManager();
    const id1 = mgr.create({ type: DeepfakeType.VOICE_CLONE, targetPersona: 'A', generatedContent: 'X', platform: 'P', authenticityScore: 90, detectionDifficulty: 'HARD' });
    const id2 = mgr.create({ type: DeepfakeType.FACE_SWAP, targetPersona: 'B', generatedContent: 'X', platform: 'V', authenticityScore: 80, detectionDifficulty: 'HARD' });
    mgr.deploy(id1);
    mgr.markDetected(id1);
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.deployed).toBe(1);
    expect(stats.detected).toBe(1);
    expect(stats.byType[DeepfakeType.VOICE_CLONE]).toBe(1);
  });
});

// ─── BecManager ─────────────────────────────────────────────────
describe('BecManager', () => {
  it('createIncident, getIncident, listIncidents', () => {
    const mgr = new BecManager();
    const id = mgr.createIncident({ type: BecType.CEO_FRAUD, targetName: 'John', targetRole: 'CFO', targetOrganization: 'Acme', lossAmount: 50000, impersonatedPersona: 'CEO', communicationChannel: 'EMAIL', psychologicalPrinciples: [] });
    expect(mgr.getIncident(id)).toBeDefined();
    expect(mgr.getIncident(id)!.type).toBe(BecType.CEO_FRAUD);
    expect(mgr.listIncidents()).toHaveLength(1);
  });
  it('listByType', () => {
    const mgr = new BecManager();
    mgr.createIncident({ type: BecType.CEO_FRAUD, targetName: 'A', targetRole: 'CFO', targetOrganization: 'X', lossAmount: 50, impersonatedPersona: 'CEO', communicationChannel: 'E', psychologicalPrinciples: [] });
    mgr.createIncident({ type: BecType.INVOICE_FRAUD, targetName: 'B', targetRole: 'AP', targetOrganization: 'Y', lossAmount: 100, impersonatedPersona: 'Vendor', communicationChannel: 'E', psychologicalPrinciples: [] });
    expect(mgr.listByType(BecType.CEO_FRAUD)).toHaveLength(1);
  });
  it('resolveIncident', () => {
    const mgr = new BecManager();
    const id = mgr.createIncident({ type: BecType.CEO_FRAUD, targetName: 'J', targetRole: 'CFO', targetOrganization: 'X', lossAmount: 50000, impersonatedPersona: 'CEO', communicationChannel: 'E', psychologicalPrinciples: [] });
    expect(mgr.resolveIncident(id, 25000)).toBe(true);
    expect(mgr.getIncident(id)!.resolved).toBe(true);
    expect(mgr.getIncident(id)!.recoveredAmount).toBe(25000);
    expect(mgr.resolveIncident('nonexistent' as any, 0)).toBe(false);
  });
  it('getTotalLoss and getTotalRecovered', () => {
    const mgr = new BecManager();
    const id1 = mgr.createIncident({ type: BecType.CEO_FRAUD, targetName: 'A', targetRole: 'CFO', targetOrganization: 'X', lossAmount: 50000, impersonatedPersona: 'CEO', communicationChannel: 'E', psychologicalPrinciples: [] });
    const id2 = mgr.createIncident({ type: BecType.INVOICE_FRAUD, targetName: 'B', targetRole: 'AP', targetOrganization: 'Y', lossAmount: 100000, impersonatedPersona: 'Vendor', communicationChannel: 'E', psychologicalPrinciples: [] });
    mgr.resolveIncident(id1, 20000);
    expect(mgr.getTotalLoss()).toBe(150000);
    expect(mgr.getTotalRecovered()).toBe(20000);
  });
  it('getStats', () => {
    const mgr = new BecManager();
    mgr.createIncident({ type: BecType.CEO_FRAUD, targetName: 'A', targetRole: 'CFO', targetOrganization: 'X', lossAmount: 50000, impersonatedPersona: 'CEO', communicationChannel: 'E', psychologicalPrinciples: [] });
    mgr.createIncident({ type: BecType.GIFT_CARD, targetName: 'B', targetRole: 'HR', targetOrganization: 'Y', lossAmount: 5000, impersonatedPersona: 'Dir', communicationChannel: 'E', psychologicalPrinciples: [] });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.totalLoss).toBe(55000);
    expect(stats.byType[BecType.CEO_FRAUD]).toBe(1);
    expect(stats.byType[BecType.GIFT_CARD]).toBe(1);
  });
});

// ─── PretextingManager ──────────────────────────────────────────
describe('PretextingManager', () => {
  it('create, get, list', () => {
    const mgr = new PretextingManager();
    const id = mgr.create({ type: PretextType.IT_SUPPORT, persona: 'Tech', targetRole: 'Employee', goal: 'Get creds', psychologicalPrinciples: [], duration: 10 });
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.type).toBe(PretextType.IT_SUPPORT);
    expect(mgr.list()).toHaveLength(1);
  });
  it('listByType', () => {
    const mgr = new PretextingManager();
    mgr.create({ type: PretextType.IT_SUPPORT, persona: 'A', targetRole: 'E', goal: 'G', psychologicalPrinciples: [], duration: 10 });
    mgr.create({ type: PretextType.VENDOR, persona: 'B', targetRole: 'E', goal: 'G', psychologicalPrinciples: [], duration: 15 });
    expect(mgr.listByType(PretextType.IT_SUPPORT)).toHaveLength(1);
  });
  it('markSuccessful', () => {
    const mgr = new PretextingManager();
    const id = mgr.create({ type: PretextType.IT_SUPPORT, persona: 'Tech', targetRole: 'Emp', goal: 'Get creds', psychologicalPrinciples: [], duration: 10 });
    expect(mgr.markSuccessful(id)).toBe(true);
    expect(mgr.get(id)!.successful).toBe(true);
    expect(mgr.markSuccessful('nonexistent' as any)).toBe(false);
  });
  it('addGatheredInfo', () => {
    const mgr = new PretextingManager();
    const id = mgr.create({ type: PretextType.VENDOR, persona: 'Rep', targetRole: 'Eng', goal: 'Info gather', psychologicalPrinciples: [], duration: 20 });
    expect(mgr.addGatheredInfo(id, 'Firewall vendor: Palo Alto')).toBe(true);
    expect(mgr.addGatheredInfo(id, 'SIEM: Splunk')).toBe(true);
    expect(mgr.get(id)!.informationGathered).toHaveLength(2);
    expect(mgr.addGatheredInfo('nonexistent' as any, 'test')).toBe(false);
  });
  it('getStats', () => {
    const mgr = new PretextingManager();
    const id = mgr.create({ type: PretextType.IT_SUPPORT, persona: 'A', targetRole: 'E', goal: 'G', psychologicalPrinciples: [], duration: 10 });
    mgr.markSuccessful(id);
    mgr.create({ type: PretextType.LAW_ENFORCEMENT, persona: 'B', targetRole: 'E', goal: 'G', psychologicalPrinciples: [], duration: 15 });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.successful).toBe(1);
    expect(stats.byType[PretextType.IT_SUPPORT]).toBe(1);
  });
});

// ─── InsiderThreatManager ───────────────────────────────────────
describe('InsiderThreatManager', () => {
  it('create, get, list', () => {
    const mgr = new InsiderThreatManager();
    const id = mgr.create({ type: InsiderThreatType.DISGRUNTLED, severity: InsiderThreatSeverity.HIGH, role: 'Dev', department: 'Eng', accessLevel: 'CRITICAL', mitreTechniqueIds: [] });
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.type).toBe(InsiderThreatType.DISGRUNTLED);
    expect(mgr.list()).toHaveLength(1);
  });
  it('listByType', () => {
    const mgr = new InsiderThreatManager();
    mgr.create({ type: InsiderThreatType.MALICIOUS, severity: InsiderThreatSeverity.CRITICAL, role: 'A', department: 'D', accessLevel: 'C', mitreTechniqueIds: [] });
    mgr.create({ type: InsiderThreatType.NEGLIGENT, severity: InsiderThreatSeverity.MEDIUM, role: 'B', department: 'D', accessLevel: 'S', mitreTechniqueIds: [] });
    expect(mgr.listByType(InsiderThreatType.MALICIOUS)).toHaveLength(1);
  });
  it('listBySeverity', () => {
    const mgr = new InsiderThreatManager();
    mgr.create({ type: InsiderThreatType.MALICIOUS, severity: InsiderThreatSeverity.CRITICAL, role: 'A', department: 'D', accessLevel: 'C', mitreTechniqueIds: [] });
    mgr.create({ type: InsiderThreatType.NEGLIGENT, severity: InsiderThreatSeverity.LOW, role: 'B', department: 'D', accessLevel: 'S', mitreTechniqueIds: [] });
    expect(mgr.listBySeverity(InsiderThreatSeverity.CRITICAL)).toHaveLength(1);
  });
  it('addIndicator', () => {
    const mgr = new InsiderThreatManager();
    const id = mgr.create({ type: InsiderThreatType.COMPROMISED, severity: InsiderThreatSeverity.CRITICAL, role: 'Analyst', department: 'Finance', accessLevel: 'ELEVATED', mitreTechniqueIds: [] });
    expect(mgr.addIndicator(id, 'Unusual off-hours database access')).toBe(true);
    expect(mgr.addIndicator(id, 'Large data download to USB')).toBe(true);
    expect(mgr.get(id)!.indicators).toHaveLength(2);
    expect(mgr.addIndicator('nonexistent' as any, 'test')).toBe(false);
  });
  it('addTimelineEvent', () => {
    const mgr = new InsiderThreatManager();
    const id = mgr.create({ type: InsiderThreatType.DISGRUNTLED, severity: InsiderThreatSeverity.HIGH, role: 'Dev', department: 'Eng', accessLevel: 'C', mitreTechniqueIds: [] });
    expect(mgr.addTimelineEvent(id, 'Submitted resignation')).toBe(true);
    expect(mgr.get(id)!.timeline).toHaveLength(1);
    expect(mgr.addTimelineEvent('nonexistent' as any, 'test')).toBe(false);
  });
  it('markDetected and markContained', () => {
    const mgr = new InsiderThreatManager();
    const id = mgr.create({ type: InsiderThreatType.DISGRUNTLED, severity: InsiderThreatSeverity.HIGH, role: 'Dev', department: 'Eng', accessLevel: 'C', mitreTechniqueIds: [] });
    expect(mgr.markDetected(id)).toBe(true);
    expect(mgr.get(id)!.detected).toBe(true);
    expect(mgr.markDetected('nonexistent' as any)).toBe(false);
    expect(mgr.markContained(id)).toBe(true);
    expect(mgr.get(id)!.contained).toBe(true);
  });
  it('getStats', () => {
    const mgr = new InsiderThreatManager();
    mgr.create({ type: InsiderThreatType.DISGRUNTLED, severity: InsiderThreatSeverity.HIGH, role: 'A', department: 'D', accessLevel: 'C', mitreTechniqueIds: [] });
    const id2 = mgr.create({ type: InsiderThreatType.COMPROMISED, severity: InsiderThreatSeverity.CRITICAL, role: 'B', department: 'F', accessLevel: 'E', dataExfiltrated: true, mitreTechniqueIds: [] });
    mgr.markDetected(id2);
    mgr.markContained(id2);
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.detected).toBe(1);
    expect(stats.contained).toBe(1);
    expect(stats.dataExfiltrated).toBe(1);
    expect(stats.byType[InsiderThreatType.DISGRUNTLED]).toBe(1);
    expect(stats.bySeverity[InsiderThreatSeverity.CRITICAL]).toBe(1);
  });
});

// ─── OsintManager ───────────────────────────────────────────────
describe('OsintManager', () => {
  it('createTarget, getTarget, listTargets', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'John Doe' });
    expect(mgr.getTarget(id)).toBeDefined();
    expect(mgr.getTarget(id)!.targetName).toBe('John Doe');
    expect(mgr.listTargets()).toHaveLength(1);
  });
  it('addEmail, addPhone', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'Jane' });
    expect(mgr.addEmail(id, 'jane@company.com')).toBe(true);
    expect(mgr.getTarget(id)!.knownEmails).toHaveLength(1);
    expect(mgr.addEmail('nonexistent' as any, 'test')).toBe(false);
    expect(mgr.addPhone(id, '+1-555-0100')).toBe(true);
    expect(mgr.getTarget(id)!.knownPhones).toHaveLength(1);
  });
  it('addSocialProfile', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'Jane' });
    expect(mgr.addSocialProfile(id, { platform: 'LinkedIn', url: 'https://linkedin.com/in/jane', activityLevel: 'HIGH' })).toBe(true);
    expect(mgr.getTarget(id)!.socialMediaProfiles).toHaveLength(1);
  });
  it('addDarkWebMention', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'Jane' });
    expect(mgr.addDarkWebMention(id, { source: 'BreachForum', snippet: 'email found' })).toBe(true);
    expect(mgr.getTarget(id)!.darkWebMentions).toHaveLength(1);
  });
  it('calculateRiskScore', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'High Value' });
    mgr.addEmail(id, 'a@b.com');
    mgr.addEmail(id, 'c@d.com');
    mgr.addPhone(id, '+1-555-0100');
    mgr.addSocialProfile(id, { platform: 'LI', url: 'x', activityLevel: 'HIGH' });
    mgr.addSocialProfile(id, { platform: 'TW', url: 'y', activityLevel: 'LOW' });
    mgr.addDarkWebMention(id, { source: 'S', snippet: 'Z' });
    const score = mgr.calculateRiskScore(id);
    expect(score).toBeGreaterThan(0);
    expect(mgr.getTarget(id)!.riskScore).toBe(score);
  });
  it('calculateRiskScore returns 0 for nonexistent', () => {
    const mgr = new OsintManager();
    expect(mgr.calculateRiskScore('nonexistent' as any)).toBe(0);
  });
  it('getStats', () => {
    const mgr = new OsintManager();
    const id = mgr.createTarget({ targetName: 'T1' });
    mgr.addEmail(id, 'a@b.com');
    mgr.calculateRiskScore(id);
    const id2 = mgr.createTarget({ targetName: 'T2' });
    mgr.addEmail(id2, 'x@y.com');
    mgr.addEmail(id2, 'z@w.com');
    mgr.addPhone(id2, '+1-555-0100');
    mgr.addSocialProfile(id2, { platform: 'LI', url: 'x', activityLevel: 'HIGH' });
    mgr.addSocialProfile(id2, { platform: 'TW', url: 'y', activityLevel: 'LOW' });
    mgr.addDarkWebMention(id2, { source: 'S', snippet: 'Z' });
    mgr.calculateRiskScore(id2);
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.averageRiskScore).toBeGreaterThan(0);
    expect(Object.keys(stats.byFootprintSize).length).toBeGreaterThan(0);
  });
});

// ─── SocialEngSecurityManager ───────────────────────────────────
describe('SocialEngSecurityManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new SocialEngSecurityManager();
    const f = createSocialEngFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new SocialEngSecurityManager();
    const f = createSocialEngFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new SocialEngSecurityManager();
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), severity: 'critical' }));
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), severity: 'high' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
  });
  it('filterFindingsByAttackType', () => {
    const mgr = new SocialEngSecurityManager();
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), attackType: SocialEngineeringAttackType.PHISHING }));
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), attackType: SocialEngineeringAttackType.BEC }));
    expect(mgr.filterFindingsByAttackType(SocialEngineeringAttackType.PHISHING)).toHaveLength(1);
  });
  it('filterFindingsUnmitigated', () => {
    const mgr = new SocialEngSecurityManager();
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), mitigated: true }));
    mgr.addFinding(createSocialEngFinding({ id: socialEngFindingId(), mitigated: false }));
    expect(mgr.filterFindingsUnmitigated()).toHaveLength(1);
  });
  it('loadKnownScenarios / getKnownScenarios', () => {
    const mgr = new SocialEngSecurityManager();
    expect(mgr.getKnownScenarios()).toHaveLength(0);
    mgr.loadKnownScenarios();
    expect(mgr.getKnownScenarios()).toHaveLength(18);
  });
  it('setAttackTypes / getAttackTypes', () => {
    const mgr = new SocialEngSecurityManager();
    mgr.setAttackTypes([SocialEngineeringAttackType.PHISHING, SocialEngineeringAttackType.BEC]);
    expect(mgr.getAttackTypes()).toHaveLength(2);
  });
  it('getTotalFindings', () => {
    const mgr = new SocialEngSecurityManager();
    mgr.addFinding(createSocialEngFinding());
    expect(mgr.getTotalFindings()).toBe(1);
  });
});

// ─── SocialEngCoordinator ───────────────────────────────────────
describe('SocialEngCoordinator', () => {
  it('composes all managers', () => {
    const coord = new SocialEngCoordinator();
    expect(coord.phishing).toBeInstanceOf(PhishingManager);
    expect(coord.deepfakes).toBeInstanceOf(DeepfakeManager);
    expect(coord.bec).toBeInstanceOf(BecManager);
    expect(coord.pretexting).toBeInstanceOf(PretextingManager);
    expect(coord.insiderThreats).toBeInstanceOf(InsiderThreatManager);
    expect(coord.osint).toBeInstanceOf(OsintManager);
    expect(coord.security).toBeInstanceOf(SocialEngSecurityManager);
  });
  it('getStats returns zeros for empty coordinator', () => {
    const coord = new SocialEngCoordinator();
    const stats = coord.getStats();
    expect(stats.phishingCampaignCount).toBe(0);
    expect(stats.deepfakeCount).toBe(0);
    expect(stats.becCount).toBe(0);
    expect(stats.pretextingCount).toBe(0);
    expect(stats.insiderThreatCount).toBe(0);
    expect(stats.osintTargetCount).toBe(0);
  });
  it('getStats reflects added resources', () => {
    const coord = new SocialEngCoordinator();
    coord.phishing.createCampaign({ type: PhishingType.SPEAR, name: 'T', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    coord.deepfakes.create({ type: DeepfakeType.VOICE_CLONE, targetPersona: 'CEO', generatedContent: 'X', platform: 'P', authenticityScore: 90, detectionDifficulty: 'HARD' });
    coord.bec.createIncident({ type: BecType.CEO_FRAUD, targetName: 'J', targetRole: 'CFO', targetOrganization: 'X', lossAmount: 50, impersonatedPersona: 'CEO', communicationChannel: 'E', psychologicalPrinciples: [] });
    coord.pretexting.create({ type: PretextType.IT_SUPPORT, persona: 'Tech', targetRole: 'Emp', goal: 'G', psychologicalPrinciples: [], duration: 10 });
    coord.insiderThreats.create({ type: InsiderThreatType.DISGRUNTLED, severity: InsiderThreatSeverity.HIGH, role: 'Dev', department: 'Eng', accessLevel: 'C', mitreTechniqueIds: [] });
    coord.osint.createTarget({ targetName: 'T' });
    const stats = coord.getStats();
    expect(stats.phishingCampaignCount).toBe(1);
    expect(stats.deepfakeCount).toBe(1);
    expect(stats.becCount).toBe(1);
    expect(stats.pretextingCount).toBe(1);
    expect(stats.insiderThreatCount).toBe(1);
    expect(stats.osintTargetCount).toBe(1);
  });
  it('reset clears state', () => {
    const coord = new SocialEngCoordinator();
    coord.phishing.createCampaign({ type: PhishingType.GENERIC, name: 'T', targetAudience: 'A', platform: 'E', lureContent: 'L', psychologicalPrinciples: [], recipientsCount: 10, pointsToPonder: [] });
    coord.deepfakes.create({ type: DeepfakeType.VOICE_CLONE, targetPersona: 'CEO', generatedContent: 'X', platform: 'P', authenticityScore: 90, detectionDifficulty: 'HARD' });
    coord.security.addFinding(createSocialEngFinding());
    coord.reset();
    expect(coord.phishing.listByStatus(PhishingStatus.CLOSED)).toHaveLength(1);
    expect(coord.deepfakes.list().filter(d => d.detected)).toHaveLength(1);
    expect(coord.security.getTotalFindings()).toBe(0);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultSocialEngEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultSocialEngEnvironment();
    const stats = coord.getStats();
    expect(stats.phishingCampaignCount).toBe(4);
    expect(stats.deepfakeCount).toBe(2);
    expect(stats.becCount).toBe(3);
    expect(stats.pretextingCount).toBe(2);
    expect(stats.insiderThreatCount).toBe(3);
    expect(stats.osintTargetCount).toBe(2);
    expect(stats.findingCount).toBe(7);
    expect(stats.unmitigatedFindingCount).toBe(7);
  });
  it('has diverse phishing campaign types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.phishing.listByType(PhishingType.SPEAR)).toHaveLength(1);
    expect(coord.phishing.listByType(PhishingType.WHALING)).toHaveLength(1);
    expect(coord.phishing.listByType(PhishingType.VISHING)).toHaveLength(1);
    expect(coord.phishing.listByType(PhishingType.SMISHING)).toHaveLength(1);
  });
  it('has diverse deepfake types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.deepfakes.getStats().byType[DeepfakeType.VOICE_CLONE]).toBe(1);
    expect(coord.deepfakes.getStats().byType[DeepfakeType.FACE_SWAP]).toBe(1);
  });
  it('has diverse BEC types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.bec.listByType(BecType.CEO_FRAUD)).toHaveLength(1);
    expect(coord.bec.listByType(BecType.INVOICE_FRAUD)).toHaveLength(1);
    expect(coord.bec.listByType(BecType.PAYROLL_DIVERSION)).toHaveLength(1);
  });
  it('has diverse pretexting types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.pretexting.listByType(PretextType.IT_SUPPORT)).toHaveLength(1);
    expect(coord.pretexting.listByType(PretextType.VENDOR)).toHaveLength(1);
  });
  it('has diverse insider threat types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.insiderThreats.listByType(InsiderThreatType.DISGRUNTLED)).toHaveLength(1);
    expect(coord.insiderThreats.listByType(InsiderThreatType.NEGLIGENT)).toHaveLength(1);
    expect(coord.insiderThreats.listByType(InsiderThreatType.COMPROMISED)).toHaveLength(1);
  });
  it('has diverse insider threat severities', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.insiderThreats.listBySeverity(InsiderThreatSeverity.CRITICAL)).toHaveLength(1);
    expect(coord.insiderThreats.listBySeverity(InsiderThreatSeverity.MEDIUM)).toHaveLength(1);
    expect(coord.insiderThreats.listBySeverity(InsiderThreatSeverity.HIGH)).toHaveLength(1);
  });
  it('has OSINT targets with different footprint sizes', () => {
    const coord = createDefaultSocialEngEnvironment();
    const stats = coord.osint.getStats();
    expect(stats.byFootprintSize['EXTENSIVE']).toBe(1);
    expect(stats.byFootprintSize['MODERATE']).toBe(1);
  });
  it('has risk scores calculated for OSINT targets', () => {
    const coord = createDefaultSocialEngEnvironment();
    const targets = coord.osint.listTargets();
    expect(targets.every(t => t.riskScore > 0)).toBe(true);
  });
  it('has unmitigated security findings across attack types', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.security.filterFindingsByAttackType(SocialEngineeringAttackType.PHISHING).length).toBeGreaterThan(0);
    expect(coord.security.filterFindingsByAttackType(SocialEngineeringAttackType.BEC).length).toBeGreaterThan(0);
    expect(coord.security.filterFindingsByAttackType(SocialEngineeringAttackType.INSIDER_THREAT).length).toBeGreaterThan(0);
  });
  it('loads known scenarios', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.security.getKnownScenarios()).toHaveLength(18);
  });
  it('has attack types set', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.security.getAttackTypes().length).toBe(Object.values(SocialEngineeringAttackType).length);
  });
  it('has BEC total loss correctly calculated', () => {
    const coord = createDefaultSocialEngEnvironment();
    expect(coord.bec.getTotalLoss()).toBeGreaterThan(0);
    expect(coord.bec.getTotalLoss()).toBe(365000);
  });
  it('has compromised insider threat with collusion data', () => {
    const coord = createDefaultSocialEngEnvironment();
    const compromised = coord.insiderThreats.listByType(InsiderThreatType.COMPROMISED);
    expect(compromised).toHaveLength(1);
    expect(compromised[0]!.dataVolume).toBe(2500);
    expect(compromised[0]!.dataExfiltrated).toBe(true);
    expect(compromised[0]!.colludedWith).toContain('APT41');
  });
});

// ─── Enum Completeness ─────────────────────────────────────────
describe('enum completeness', () => {
  it('PhishingType has all values', () => {
    expect(Object.values(PhishingType)).toHaveLength(8);
  });
  it('PhishingStatus has all values', () => {
    expect(Object.values(PhishingStatus)).toHaveLength(7);
  });
  it('SocialEngineeringAttackType has all values', () => {
    expect(Object.values(SocialEngineeringAttackType)).toHaveLength(13);
  });
  it('PsychologicalPrinciple has all values', () => {
    expect(Object.values(PsychologicalPrinciple)).toHaveLength(7);
  });
});
