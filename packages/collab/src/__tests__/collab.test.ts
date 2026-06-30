import { describe, it, expect } from 'vitest';
import {
  CollabCoordinator, createDefaultCollabEnvironment,
  ExerciseManager, ParticipantManager, InjectManager,
  CommunicationManager, AARManager, CollabSecurityManager,
  exerciseId, teamId, participantId, injectId,
  communicationChannelId, messageId, collabFindingId,
  ExerciseType, ExercisePhase, TeamColor, ParticipantRole,
  CommandEchelon, InjectType, CommunicationChannelType,
  MessagePriority, AARCategory,
  createExercise, createTeam, createParticipant, createInject,
  createCommunicationChannel, createMessageBatch, createCollabFinding,
  getKnownCollabChallenges,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      exerciseId(), teamId(), participantId(), injectId(),
      communicationChannelId(), messageId(), collabFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => exerciseId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createExercise with defaults', () => {
    const e = createExercise();
    expect(e.name).toBe('Cyber Exercise');
    expect(e.type).toBe(ExerciseType.RED_VS_BLUE);
    expect(e.phase).toBe(ExercisePhase.PLANNING);
    expect(e.objectives).toHaveLength(3);
  });
  it('createExercise with overrides', () => {
    const e = createExercise({
      name: 'Custom Ex',
      type: ExerciseType.TABLE_TOP,
      phase: ExercisePhase.EXECUTION,
      objectives: ['Objective 1'],
      scenario: 'Custom scenario',
    });
    expect(e.name).toBe('Custom Ex');
    expect(e.type).toBe(ExerciseType.TABLE_TOP);
    expect(e.phase).toBe(ExercisePhase.EXECUTION);
    expect(e.objectives).toEqual(['Objective 1']);
    expect(e.scenario).toBe('Custom scenario');
  });
  it('createTeam with defaults', () => {
    const t = createTeam();
    expect(t.name).toBe('Team Alpha');
    expect(t.color).toBe(TeamColor.BLUE);
    expect(t.role).toBe('SOC Team');
  });
  it('createTeam with overrides', () => {
    const t = createTeam({ name: 'Red Team', color: TeamColor.RED, role: 'Adversary Simulation' });
    expect(t.name).toBe('Red Team');
    expect(t.color).toBe(TeamColor.RED);
    expect(t.role).toBe('Adversary Simulation');
  });
  it('createParticipant with defaults', () => {
    const p = createParticipant();
    expect(p.name).toBe('John Doe');
    expect(p.role).toBe(ParticipantRole.TIER_1_ANALYST);
    expect(p.echelon).toBe(CommandEchelon.TACTICAL);
  });
  it('createParticipant with overrides', () => {
    const p = createParticipant({
      name: 'Alice',
      role: ParticipantRole.CISO,
      echelon: CommandEchelon.STRATEGIC,
      experience: 'EXPERT',
    });
    expect(p.name).toBe('Alice');
    expect(p.role).toBe(ParticipantRole.CISO);
    expect(p.echelon).toBe(CommandEchelon.STRATEGIC);
    expect(p.experience).toBe('EXPERT');
  });
  it('createInject with defaults', () => {
    const i = createInject();
    expect(i.type).toBe(InjectType.INCIDENT_ALERT);
    expect(i.responseExpected).toBe(true);
    expect(i.source).toBe('SIEM Alert');
  });
  it('createInject with overrides', () => {
    const i = createInject({
      type: InjectType.MEDIA_INQUIRY,
      source: 'Press',
      content: 'Inquiry received',
      targetRole: 'SOC Manager',
      responseExpected: false,
    });
    expect(i.type).toBe(InjectType.MEDIA_INQUIRY);
    expect(i.source).toBe('Press');
    expect(i.responseExpected).toBe(false);
  });
  it('createCommunicationChannel with defaults', () => {
    const c = createCommunicationChannel();
    expect(c.type).toBe(CommunicationChannelType.SECURE_CHAT);
    expect(c.secure).toBe(true);
    expect(c.encryptionType).toBe('END_TO_END');
  });
  it('createCommunicationChannel with overrides', () => {
    const c = createCommunicationChannel({
      type: CommunicationChannelType.IRC,
      secure: false,
      encryptionType: 'NONE',
      name: 'Public IRC',
    });
    expect(c.type).toBe(CommunicationChannelType.IRC);
    expect(c.secure).toBe(false);
    expect(c.name).toBe('Public IRC');
  });
  it('createMessageBatch with defaults', () => {
    const m = createMessageBatch();
    expect(m.priority).toBe(MessagePriority.MEDIUM);
    expect(m.edited).toBe(false);
    expect(m.attachments).toEqual([]);
    expect(m.readBy).toEqual([]);
  });
  it('createMessageBatch with overrides', () => {
    const m = createMessageBatch({
      content: 'URGENT',
      priority: MessagePriority.CRITICAL,
      attachments: ['file1.pdf'],
    });
    expect(m.content).toBe('URGENT');
    expect(m.priority).toBe(MessagePriority.CRITICAL);
    expect(m.attachments).toEqual(['file1.pdf']);
  });
  it('createCollabFinding with defaults', () => {
    const f = createCollabFinding();
    expect(f.severity).toBe('high');
    expect(f.resolved).toBe(false);
    expect(f.domain).toBe('Communications');
  });
  it('createCollabFinding with overrides', () => {
    const f = createCollabFinding({ severity: 'critical', resolved: true, domain: 'Access Control' });
    expect(f.severity).toBe('critical');
    expect(f.resolved).toBe(true);
    expect(f.domain).toBe('Access Control');
  });
  it('getKnownCollabChallenges returns 6 challenges', () => {
    const challenges = getKnownCollabChallenges();
    expect(challenges).toHaveLength(6);
  });
});

// ─── ExerciseManager ─────────────────────────────────────────────
describe('ExerciseManager', () => {
  it('createExercise, get, list', () => {
    const mgr = new ExerciseManager();
    const id = mgr.createExercise({ name: 'Test Ex', type: ExerciseType.RED_VS_BLUE, scenario: 'Test' });
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.name).toBe('Test Ex');
    expect(mgr.list()).toHaveLength(1);
  });
  it('list with filter', () => {
    const mgr = new ExerciseManager();
    mgr.createExercise({ name: 'Ex1', type: ExerciseType.RED_VS_BLUE, scenario: 'S1', phase: ExercisePhase.EXECUTION });
    mgr.createExercise({ name: 'Ex2', type: ExerciseType.TABLE_TOP, scenario: 'S2', phase: ExercisePhase.PLANNING });
    expect(mgr.list({ type: ExerciseType.RED_VS_BLUE })).toHaveLength(1);
    expect(mgr.list({ phase: ExercisePhase.PLANNING })).toHaveLength(1);
    expect(mgr.list({ type: ExerciseType.TABLE_TOP, phase: ExercisePhase.PLANNING })).toHaveLength(1);
  });
  it('updatePhase', () => {
    const mgr = new ExerciseManager();
    const id = mgr.createExercise({ name: 'Ex', type: ExerciseType.RED_VS_BLUE, scenario: 'S' });
    expect(mgr.updatePhase(id, ExercisePhase.EXECUTION)).toBe(true);
    expect(mgr.get(id)!.phase).toBe(ExercisePhase.EXECUTION);
    expect(mgr.updatePhase('nonexistent' as any, ExercisePhase.CLOSED)).toBe(false);
  });
  it('setMetrics', () => {
    const mgr = new ExerciseManager();
    const id = mgr.createExercise({ name: 'Ex', type: ExerciseType.RED_VS_BLUE, scenario: 'S' });
    const metrics = [{ objective: 'Test', achieved: true, score: 100 }];
    expect(mgr.setMetrics(id, metrics)).toBe(true);
    expect(mgr.get(id)!.metrics).toEqual(metrics);
    expect(mgr.setMetrics('nonexistent' as any, [])).toBe(false);
  });
  it('setStartTime / setEndTime', () => {
    const mgr = new ExerciseManager();
    const id = mgr.createExercise({ name: 'Ex', type: ExerciseType.RED_VS_BLUE, scenario: 'S' });
    expect(mgr.setStartTime(id, 1000)).toBe(true);
    expect(mgr.get(id)!.startTime).toBe(1000);
    expect(mgr.setEndTime(id, 2000)).toBe(true);
    expect(mgr.get(id)!.endTime).toBe(2000);
    expect(mgr.setStartTime('nonexistent' as any, 0)).toBe(false);
  });
  it('getActiveExercises', () => {
    const mgr = new ExerciseManager();
    const id1 = mgr.createExercise({ name: 'Ex1', type: ExerciseType.RED_VS_BLUE, scenario: 'S1', phase: ExercisePhase.EXECUTION });
    mgr.createExercise({ name: 'Ex2', type: ExerciseType.TABLE_TOP, scenario: 'S2', phase: ExercisePhase.PLANNING });
    const active = mgr.getActiveExercises();
    expect(active).toHaveLength(1);
    expect(active[0]!.id).toBe(id1);
  });
  it('getStats', () => {
    const mgr = new ExerciseManager();
    mgr.createExercise({ name: 'Ex1', type: ExerciseType.RED_VS_BLUE, scenario: 'S1', phase: ExercisePhase.EXECUTION });
    mgr.createExercise({ name: 'Ex2', type: ExerciseType.TABLE_TOP, scenario: 'S2', phase: ExercisePhase.PLANNING });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.byType[ExerciseType.RED_VS_BLUE]).toBe(1);
    expect(stats.byPhase[ExercisePhase.EXECUTION]).toBe(1);
  });
});

// ─── ParticipantManager ─────────────────────────────────────────
describe('ParticipantManager', () => {
  it('register, get, list', () => {
    const mgr = new ParticipantManager();
    const id = mgr.register({ name: 'Alice', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamId() });
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.name).toBe('Alice');
    expect(mgr.list()).toHaveLength(1);
  });
  it('list with filter', () => {
    const mgr = new ParticipantManager();
    const tid = teamId();
    mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid, experience: 'JUNIOR' });
    mgr.register({ name: 'B', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: teamId(), experience: 'LEAD' });
    expect(mgr.list({ role: ParticipantRole.TIER_1_ANALYST })).toHaveLength(1);
    expect(mgr.list({ echelon: CommandEchelon.STRATEGIC })).toHaveLength(1);
    expect(mgr.list({ teamId: tid })).toHaveLength(1);
    expect(mgr.list({ experience: 'LEAD' })).toHaveLength(1);
  });
  it('listByRole', () => {
    const mgr = new ParticipantManager();
    const tid = teamId();
    mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid });
    mgr.register({ name: 'B', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: tid });
    expect(mgr.listByRole(ParticipantRole.TIER_1_ANALYST)).toHaveLength(1);
    expect(mgr.listByRole(ParticipantRole.CISO)).toHaveLength(1);
  });
  it('listByEchelon', () => {
    const mgr = new ParticipantManager();
    const tid = teamId();
    mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid });
    mgr.register({ name: 'B', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: tid });
    expect(mgr.listByEchelon(CommandEchelon.TACTICAL)).toHaveLength(1);
    expect(mgr.listByEchelon(CommandEchelon.STRATEGIC)).toHaveLength(1);
  });
  it('listByTeam', () => {
    const mgr = new ParticipantManager();
    const tid = teamId();
    mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid });
    mgr.register({ name: 'B', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: teamId() });
    expect(mgr.listByTeam(tid)).toHaveLength(1);
  });
  it('assignToExercise', () => {
    const mgr = new ParticipantManager();
    const pid = mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamId() });
    const eid = exerciseId();
    expect(mgr.assignToExercise(pid, eid)).toBe(true);
    expect(mgr.get(pid)!.activeExerciseId).toBe(eid);
    expect(mgr.assignToExercise('nonexistent' as any, eid)).toBe(false);
  });
  it('updateLastActivity', () => {
    const mgr = new ParticipantManager();
    const pid = mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamId() });
    mgr.updateLastActivity(pid);
    expect(mgr.get(pid)!.lastActivity).toBeGreaterThan(0);
  });
  it('getStats', () => {
    const mgr = new ParticipantManager();
    const tid = teamId();
    mgr.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid });
    mgr.register({ name: 'B', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: tid });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.byRole[ParticipantRole.TIER_1_ANALYST]).toBe(1);
    expect(stats.byEchelon[CommandEchelon.STRATEGIC]).toBe(1);
  });
});

// ─── InjectManager ───────────────────────────────────────────────
describe('InjectManager', () => {
  it('createInject, getInject, listInjects', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    const id = mgr.createInject({
      exerciseId: eid, type: InjectType.INCIDENT_ALERT,
      content: 'Alert', source: 'SIEM', targetRole: 'Analyst',
    });
    expect(mgr.getInject(id)).toBeDefined();
    expect(mgr.getInject(id)!.content).toBe('Alert');
    expect(mgr.listInjects()).toHaveLength(1);
  });
  it('listInjects with filter', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst', responseExpected: true });
    mgr.createInject({ exerciseId: eid, type: InjectType.MEDIA_INQUIRY, content: 'B', source: 'Press', targetRole: 'Manager', responseExpected: false });
    expect(mgr.listInjects({ exerciseId: eid })).toHaveLength(2);
    expect(mgr.listInjects({ type: InjectType.INCIDENT_ALERT })).toHaveLength(1);
    expect(mgr.listInjects({ targetRole: 'Manager' })).toHaveLength(1);
    expect(mgr.listInjects({ responseExpected: false })).toHaveLength(1);
  });
  it('listByExercise / listByType / listByTargetRole', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst' });
    mgr.createInject({ exerciseId: eid, type: InjectType.TWIST, content: 'B', source: 'Controller', targetRole: 'Tier 3' });
    expect(mgr.listByExercise(eid)).toHaveLength(2);
    expect(mgr.listByType(InjectType.INCIDENT_ALERT)).toHaveLength(1);
    expect(mgr.listByTargetRole('Tier 3')).toHaveLength(1);
  });
  it('respondToInject', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    const pid = participantId();
    const id = mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst', responseExpected: true });
    expect(mgr.respondToInject(id, pid, 'Investigated')).toBe(true);
    expect(mgr.getInject(id)!.response!.content).toBe('Investigated');
    expect(mgr.respondToInject(id, pid, 'Again')).toBe(true);
    expect(mgr.respondToInject('nonexistent' as any, pid, '')).toBe(false);
  });
  it('respondToInject fails when responseExpected is false', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    const id = mgr.createInject({ exerciseId: eid, type: InjectType.MEDIA_INQUIRY, content: 'A', source: 'Press', targetRole: 'Manager', responseExpected: false });
    expect(mgr.respondToInject(id, participantId(), 'Response')).toBe(false);
  });
  it('escalateInject', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    const id = mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst' });
    const escalatedId = mgr.escalateInject(id, { exerciseId: eid, type: InjectType.EXECUTIVE_ESCALATION, content: 'Escalated', source: 'Manager', targetRole: 'CISO' });
    expect(escalatedId).toBeDefined();
    expect(mgr.getInject(id)!.escalatesTo).toBe(escalatedId);
  });
  it('escalateInject throws on missing original', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    expect(() => mgr.escalateInject('nonexistent' as any, { exerciseId: eid, type: InjectType.TWIST, content: 'X', source: 'X', targetRole: 'X' })).toThrow('not found');
  });
  it('getPendingInjects', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    const id1 = mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst', responseExpected: true });
    mgr.createInject({ exerciseId: eid, type: InjectType.MEDIA_INQUIRY, content: 'B', source: 'Press', targetRole: 'Manager', responseExpected: false });
    mgr.respondToInject(id1, participantId(), 'Done');
    const id3 = mgr.createInject({ exerciseId: eid, type: InjectType.TWIST, content: 'C', source: 'C', targetRole: 'T3', responseExpected: true });
    const pending = mgr.getPendingInjects(eid);
    expect(pending).toHaveLength(1);
    expect(pending[0]!.id).toBe(id3);
  });
  it('getStats', () => {
    const mgr = new InjectManager();
    const eid = exerciseId();
    mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'A', source: 'SIEM', targetRole: 'Analyst', responseExpected: true });
    mgr.createInject({ exerciseId: eid, type: InjectType.TWIST, content: 'B', source: 'Controller', targetRole: 'T3', responseExpected: false });
    mgr.createInject({ exerciseId: eid, type: InjectType.INCIDENT_ALERT, content: 'C', source: 'SIEM', targetRole: 'Analyst', responseExpected: true });
    const stats = mgr.getStats();
    expect(stats.total).toBe(3);
    expect(stats.byType[InjectType.INCIDENT_ALERT]).toBe(2);
    expect(stats.bySource['SIEM']).toBe(2);
    expect(stats.pendingCount).toBe(2);
    expect(stats.responseRate).toBe(0);
  });
});

// ─── CommunicationManager ───────────────────────────────────────
describe('CommunicationManager', () => {
  it('createChannel, getChannel, listChannels', () => {
    const mgr = new CommunicationManager();
    const id = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    expect(mgr.getChannel(id)).toBeDefined();
    expect(mgr.getChannel(id)!.name).toBe('Ops');
    expect(mgr.listChannels()).toHaveLength(1);
  });
  it('listChannels with filter', () => {
    const mgr = new CommunicationManager();
    mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'C1', secure: true });
    mgr.createChannel({ type: CommunicationChannelType.IRC, name: 'C2', secure: false });
    expect(mgr.listChannels({ type: CommunicationChannelType.CHAT })).toHaveLength(1);
    expect(mgr.listChannels({ secure: true })).toHaveLength(1);
    expect(mgr.listChannels({ secure: false })).toHaveLength(1);
  });
  it('addParticipant / removeParticipant', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    const pId = participantId();
    expect(mgr.addParticipant(chId, pId)).toBe(true);
    expect(mgr.getChannel(chId)!.participants).toHaveLength(1);
    expect(mgr.addParticipant(chId, pId)).toBe(true); // duplicate - still succeeds
    expect(mgr.getChannel(chId)!.participants).toHaveLength(1); // unchanged
    expect(mgr.removeParticipant(chId, pId)).toBe(true);
    expect(mgr.getChannel(chId)!.participants).toHaveLength(0);
    expect(mgr.addParticipant('nonexistent' as any, pId)).toBe(false);
    expect(mgr.removeParticipant('nonexistent' as any, pId)).toBe(false);
  });
  it('sendMessage / getMessage', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    const pId = participantId();
    const msgId = mgr.sendMessage(chId, pId, 'Hello', MessagePriority.HIGH);
    expect(msgId).toBeDefined();
    expect(mgr.getMessage(chId, msgId)).toBeDefined();
    expect(mgr.getMessage(chId, msgId)!.content).toBe('Hello');
    expect(mgr.getMessage(chId, msgId)!.priority).toBe(MessagePriority.HIGH);
    expect(mgr.getMessage('nonexistent' as any, msgId)).toBeUndefined();
  });
  it('sendMessage with attachments', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    const msgId = mgr.sendMessage(chId, participantId(), 'With file', MessagePriority.MEDIUM, ['report.pdf']);
    expect(mgr.getMessage(chId, msgId)!.attachments).toEqual(['report.pdf']);
  });
  it('sendMessage throws on invalid channel', () => {
    const mgr = new CommunicationManager();
    expect(() => mgr.sendMessage('bad' as any, participantId(), 'x', MessagePriority.LOW)).toThrow('Channel');
  });
  it('listMessages with filter', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    const p1 = participantId();
    const p2 = participantId();
    mgr.sendMessage(chId, p1, 'Hi', MessagePriority.LOW);
    mgr.sendMessage(chId, p2, 'Urgent', MessagePriority.CRITICAL);
    mgr.sendMessage(chId, p1, 'Bye', MessagePriority.LOW);
    expect(mgr.listMessages(chId)).toHaveLength(3);
    expect(mgr.listMessages(chId, { priority: MessagePriority.CRITICAL })).toHaveLength(1);
    expect(mgr.listMessages(chId, { senderId: p1 })).toHaveLength(2);
    expect(mgr.listMessages('nonexistent' as any)).toHaveLength(0);
  });
  it('markRead', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.CHAT, name: 'Ops' });
    const pId = participantId();
    const msgId = mgr.sendMessage(chId, participantId(), 'Read me', MessagePriority.MEDIUM);
    expect(mgr.markRead(chId, msgId, pId)).toBe(true);
    expect(mgr.getMessage(chId, msgId)!.readBy).toHaveLength(1);
    expect(mgr.markRead(chId, msgId, pId)).toBe(true); // idempotent
    expect(mgr.getMessage(chId, msgId)!.readBy).toHaveLength(1);
    expect(mgr.markRead('bad' as any, msgId, pId)).toBe(false);
    expect(mgr.markRead(chId, 'bad' as any, pId)).toBe(false);
  });
  it('getStats', () => {
    const mgr = new CommunicationManager();
    const chId = mgr.createChannel({ type: CommunicationChannelType.SECURE_CHAT, name: 'Secure', secure: true });
    mgr.createChannel({ type: CommunicationChannelType.IRC, name: 'Pub', secure: false });
    mgr.sendMessage(chId, participantId(), 'A', MessagePriority.HIGH);
    mgr.sendMessage(chId, participantId(), 'B', MessagePriority.LOW);
    const stats = mgr.getStats();
    expect(stats.totalChannels).toBe(2);
    expect(stats.totalMessages).toBe(2);
    expect(stats.byType[CommunicationChannelType.SECURE_CHAT]).toBe(1);
    expect(stats.byPriority[MessagePriority.HIGH]).toBe(1);
    expect(stats.secureChannelCount).toBe(1);
  });
});

// ─── AARManager ─────────────────────────────────────────────────
describe('AARManager', () => {
  it('create, get, list', () => {
    const mgr = new AARManager();
    const eid = exerciseId();
    const aar = mgr.create(eid, 'Test Exercise', 'Alice');
    expect(aar.id).toBe(eid);
    expect(aar.exerciseName).toBe('Test Exercise');
    expect(aar.createdBy).toBe('Alice');
    expect(mgr.get(eid)).toEqual(aar);
    expect(mgr.list()).toHaveLength(1);
  });
  it('get returns undefined for missing AAR', () => {
    const mgr = new AARManager();
    expect(mgr.get('nonexistent' as any)).toBeUndefined();
  });
  it('addTimelineEvent', () => {
    const mgr = new AARManager();
    const eid = exerciseId();
    mgr.create(eid, 'Ex', 'Alice');
    expect(mgr.addTimelineEvent(eid, { timestamp: 100, event: 'Start', category: AARCategory.DETECTION, decision: 'Investigate' })).toBe(true);
    expect(mgr.get(eid)!.timeline).toHaveLength(1);
    expect(mgr.addTimelineEvent('bad' as any, { timestamp: 200, event: 'End', category: AARCategory.RESPONSE, decision: 'Done' })).toBe(false);
  });
  it('addFinding', () => {
    const mgr = new AARManager();
    const eid = exerciseId();
    mgr.create(eid, 'Ex', 'Alice');
    expect(mgr.addFinding(eid, { category: AARCategory.DETECTION, finding: 'Slow detection', severity: 'medium', recommendation: 'Tune rules' })).toBe(true);
    expect(mgr.get(eid)!.keyFindings).toHaveLength(1);
    expect(mgr.addFinding('bad' as any, { category: AARCategory.DETECTION, finding: 'X', severity: 'low', recommendation: 'Y' })).toBe(false);
  });
  it('setMetrics', () => {
    const mgr = new AARManager();
    const eid = exerciseId();
    mgr.create(eid, 'Ex', 'Alice');
    const metrics = [{ metric: 'TTD', value: 10, benchmark: 30, passed: true }];
    expect(mgr.setMetrics(eid, metrics)).toBe(true);
    expect(mgr.get(eid)!.performanceMetrics).toEqual(metrics);
    expect(mgr.setMetrics('bad' as any, [])).toBe(false);
  });
  it('calculateScore', () => {
    const mgr = new AARManager();
    const eid = exerciseId();
    mgr.create(eid, 'Ex', 'Alice');
    expect(mgr.calculateScore(eid)).toBe(0); // no metrics
    mgr.setMetrics(eid, [
      { metric: 'TTD', value: 10, benchmark: 30, passed: true },
      { metric: 'TTR', value: 20, benchmark: 60, passed: true },
      { metric: 'Comms', value: 50, benchmark: 80, passed: false },
    ]);
    expect(mgr.calculateScore(eid)).toBe(67); // 2/3 = 66.6 -> 67
    expect(mgr.get(eid)!.overallScore).toBe(67);
  });
  it('calculateScore on missing AAR returns 0', () => {
    const mgr = new AARManager();
    expect(mgr.calculateScore('bad' as any)).toBe(0);
  });
});

// ─── CollabSecurityManager ─────────────────────────────────────
describe('CollabSecurityManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new CollabSecurityManager();
    const f = createCollabFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('resolveFinding', () => {
    const mgr = new CollabSecurityManager();
    const f = createCollabFinding();
    mgr.addFinding(f);
    expect(mgr.resolveFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.resolved).toBe(true);
    expect(mgr.resolveFinding('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new CollabSecurityManager();
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), severity: 'critical' }));
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), severity: 'high' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
  });
  it('filterFindingsByDomain', () => {
    const mgr = new CollabSecurityManager();
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), domain: 'Access Control' }));
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), domain: 'Communications' }));
    expect(mgr.filterFindingsByDomain('Access Control')).toHaveLength(1);
  });
  it('filterFindingsUnresolved', () => {
    const mgr = new CollabSecurityManager();
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), resolved: true }));
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), resolved: false }));
    expect(mgr.filterFindingsUnresolved()).toHaveLength(1);
  });
  it('filterFindingsByExercise', () => {
    const mgr = new CollabSecurityManager();
    const eid = exerciseId();
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), exerciseId: eid }));
    mgr.addFinding(createCollabFinding({ id: collabFindingId(), exerciseId: exerciseId() }));
    expect(mgr.filterFindingsByExercise(eid)).toHaveLength(1);
  });
  it('getTotalFindings', () => {
    const mgr = new CollabSecurityManager();
    mgr.addFinding(createCollabFinding());
    expect(mgr.getTotalFindings()).toBe(1);
  });
  it('loadKnownChallenges / getKnownChallenges', () => {
    const mgr = new CollabSecurityManager();
    expect(mgr.getKnownChallenges()).toHaveLength(0);
    mgr.loadKnownChallenges();
    expect(mgr.getKnownChallenges()).toHaveLength(6);
  });
});

// ─── CollabCoordinator ──────────────────────────────────────────
describe('CollabCoordinator', () => {
  it('composes all managers', () => {
    const coord = new CollabCoordinator();
    expect(coord.exercises).toBeInstanceOf(ExerciseManager);
    expect(coord.participants).toBeInstanceOf(ParticipantManager);
    expect(coord.injects).toBeInstanceOf(InjectManager);
    expect(coord.comms).toBeInstanceOf(CommunicationManager);
    expect(coord.aar).toBeInstanceOf(AARManager);
    expect(coord.security).toBeInstanceOf(CollabSecurityManager);
  });
  it('getStats returns zeros for empty coordinator', () => {
    const coord = new CollabCoordinator();
    const stats = coord.getStats();
    expect(stats.exerciseCount).toBe(0);
    expect(stats.participantCount).toBe(0);
    expect(stats.injectCount).toBe(0);
    expect(stats.channelCount).toBe(0);
    expect(stats.messageCount).toBe(0);
    expect(stats.aarCount).toBe(0);
    expect(stats.findingCount).toBe(0);
  });
  it('getStats reflects added resources', () => {
    const coord = new CollabCoordinator();
    coord.exercises.createExercise({ name: 'Ex', type: ExerciseType.RED_VS_BLUE, scenario: 'S' });
    const tid = teamId();
    coord.participants.register({ name: 'A', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: tid });
    const stats = coord.getStats();
    expect(stats.exerciseCount).toBe(1);
    expect(stats.participantCount).toBe(1);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultCollabEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultCollabEnvironment();
    const stats = coord.getStats();
    expect(stats.exerciseCount).toBe(2);
    expect(stats.activeExerciseCount).toBe(1);
    expect(stats.participantCount).toBe(10);
    expect(stats.injectCount).toBe(8);
    expect(stats.channelCount).toBe(3);
    expect(stats.aarCount).toBe(1);
    expect(stats.findingCount).toBe(4);
  });
  it('has both exercise types', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.exercises.list({ type: ExerciseType.RED_VS_BLUE })).toHaveLength(1);
    expect(coord.exercises.list({ type: ExerciseType.TABLE_TOP })).toHaveLength(1);
  });
  it('has participants across all echelons', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.participants.listByEchelon(CommandEchelon.TACTICAL).length).toBeGreaterThan(0);
    expect(coord.participants.listByEchelon(CommandEchelon.OPERATIONAL).length).toBeGreaterThan(0);
    expect(coord.participants.listByEchelon(CommandEchelon.STRATEGIC).length).toBeGreaterThan(0);
  });
  it('has participants across roles', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.participants.listByRole(ParticipantRole.TIER_1_ANALYST)).toHaveLength(1);
    expect(coord.participants.listByRole(ParticipantRole.CISO)).toHaveLength(1);
    expect(coord.participants.listByRole(ParticipantRole.RED_TEAM_OPERATOR)).toHaveLength(1);
    expect(coord.participants.listByRole(ParticipantRole.WHITE_CELL_CONTROLLER)).toHaveLength(1);
  });
  it('has injects across types', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.injects.listByType(InjectType.INCIDENT_ALERT).length).toBeGreaterThan(0);
    expect(coord.injects.listByType(InjectType.TWIST).length).toBeGreaterThan(0);
    expect(coord.injects.listByType(InjectType.INTELLIGENCE_REPORT).length).toBeGreaterThan(0);
  });
  it('has responded to at least one inject', () => {
    const coord = createDefaultCollabEnvironment();
    const stats = coord.injects.getStats();
    expect(stats.responseRate).toBeGreaterThan(0);
  });
  it('has communication channels with messages', () => {
    const coord = createDefaultCollabEnvironment();
    const stats = coord.comms.getStats();
    expect(stats.totalMessages).toBeGreaterThan(0);
    expect(stats.secureChannelCount).toBe(3);
  });
  it('has AAR with timeline events and findings', () => {
    const coord = createDefaultCollabEnvironment();
    const exercises = coord.exercises.list({ type: ExerciseType.RED_VS_BLUE });
    const aar = coord.aar.get(exercises[0]!.id);
    expect(aar).toBeDefined();
    expect(aar!.timeline).toHaveLength(6);
    expect(aar!.keyFindings).toHaveLength(5); // 4 via addFinding + 1 from addFindings after setMetrics
    expect(aar!.performanceMetrics).toHaveLength(4);
    expect(aar!.overallScore).toBeGreaterThan(0);
    expect(aar!.lessonsLearned).toHaveLength(3);
  });
  it('has security findings', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.security.filterFindingsBySeverity('high').length).toBeGreaterThan(0);
    expect(coord.security.filterFindingsBySeverity('critical').length).toBeGreaterThan(0);
  });
  it('loads known challenges', () => {
    const coord = createDefaultCollabEnvironment();
    expect(coord.security.getKnownChallenges()).toHaveLength(6);
  });
  it('has messages marked as read', () => {
    const coord = createDefaultCollabEnvironment();
    const channels = coord.comms.listChannels({ type: CommunicationChannelType.TEAMS });
    expect(channels).toHaveLength(1);
    const msgs = coord.comms.listMessages(channels[0]!.id);
    expect(msgs.some(m => m.readBy.length > 0)).toBe(true);
  });
  it('has messages with attachments', () => {
    const coord = createDefaultCollabEnvironment();
    const channels = coord.comms.listChannels({ type: CommunicationChannelType.TEAMS });
    const msgs = coord.comms.listMessages(channels[0]!.id);
    const msgsWithAttachments = msgs.filter(m => m.attachments.length > 0);
    expect(msgsWithAttachments.length).toBeGreaterThan(0);
  });
  it('messages have varied priorities', () => {
    const coord = createDefaultCollabEnvironment();
    const stats = coord.comms.getStats();
    expect(stats.byPriority[MessagePriority.HIGH]).toBeGreaterThan(0);
    expect(stats.byPriority[MessagePriority.CRITICAL]).toBeGreaterThan(0);
    expect(stats.byPriority[MessagePriority.MEDIUM]).toBeGreaterThan(0);
  });
  it('has messages across channels', () => {
    const coord = createDefaultCollabEnvironment();
    const stats = coord.comms.getStats();
    expect(stats.byType[CommunicationChannelType.SIGNAL]).toBeGreaterThan(0);
    expect(stats.byType[CommunicationChannelType.TEAMS]).toBeGreaterThan(0);
    expect(stats.byType[CommunicationChannelType.SECURE_CHAT]).toBeGreaterThan(0);
  });
});
