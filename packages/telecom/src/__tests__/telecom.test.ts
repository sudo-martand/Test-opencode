import { describe, it, expect } from 'vitest';
import {
  TelecomCoordinator, createDefaultTelecomEnvironment,
  NetworkFunctionManager, RanManager, ImsManager,
  SignalingManager, TelecomSecurityManager,
  telecomNetworkFunctionId, telecomRanNodeId, telecomImsSessionId,
  telecomSignalingMessageId, telecomSubscriberId, telecomSliceId,
  telecomSecurityFindingId,
  NetworkFunctionType, RanNodeType, RanTechnology,
  SignalingProtocol, ImsNodeType,
  TelecomSecurityFindingSeverity, TelecomAttackType,
  NetworkSliceType, NfStatus,
  createNetworkFunction, createRanNode, createImsSession,
  createSignalingMessage, createSubscriber, createNetworkSlice,
  createTelecomSecurityFinding,
  getKnownTelecomAttacks,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      telecomNetworkFunctionId(), telecomRanNodeId(), telecomImsSessionId(),
      telecomSignalingMessageId(), telecomSubscriberId(), telecomSliceId(),
      telecomSecurityFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => telecomNetworkFunctionId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createNetworkFunction with defaults', () => {
    const nf = createNetworkFunction();
    expect(nf.type).toBe(NetworkFunctionType.AMF);
    expect(nf.vendor).toBe('Ericsson');
    expect(nf.status).toBe(NfStatus.ACTIVE);
    expect(nf.cpuUtilization).toBe(35);
  });
  it('createNetworkFunction with overrides', () => {
    const nf = createNetworkFunction({ type: NetworkFunctionType.SMF, vendor: 'Nokia', status: NfStatus.DEGRADED, cpuUtilization: 80 });
    expect(nf.type).toBe(NetworkFunctionType.SMF);
    expect(nf.vendor).toBe('Nokia');
    expect(nf.status).toBe(NfStatus.DEGRADED);
    expect(nf.cpuUtilization).toBe(80);
  });
  it('createRanNode with defaults', () => {
    const r = createRanNode();
    expect(r.type).toBe(RanNodeType.GNB_CU);
    expect(r.technology).toBe(RanTechnology.NR);
    expect(r.userLoad).toBe(30);
  });
  it('createRanNode with overrides', () => {
    const r = createRanNode({ type: RanNodeType.ENB, technology: RanTechnology.LTE, userLoad: 90 });
    expect(r.type).toBe(RanNodeType.ENB);
    expect(r.technology).toBe(RanTechnology.LTE);
    expect(r.userLoad).toBe(90);
  });
  it('createImsSession with defaults', () => {
    const s = createImsSession();
    expect(s.sessionState).toBe('INITIATING');
    expect(s.encrypted).toBe(true);
    expect(s.mediaType).toBe('AUDIO');
  });
  it('createImsSession with overrides', () => {
    const s = createImsSession({ sessionState: 'ANSWERED', mediaType: 'VIDEO', encrypted: false });
    expect(s.sessionState).toBe('ANSWERED');
    expect(s.mediaType).toBe('VIDEO');
    expect(s.encrypted).toBe(false);
  });
  it('createSignalingMessage with defaults', () => {
    const m = createSignalingMessage();
    expect(m.protocol).toBe(SignalingProtocol.SS7_MAP);
    expect(m.integrity).toBe('VALID');
    expect(m.inspectedByFirewall).toBe(true);
  });
  it('createSignalingMessage with overrides', () => {
    const m = createSignalingMessage({ protocol: SignalingProtocol.GTP_C, integrity: 'SPOOFED', inspectedByFirewall: false });
    expect(m.protocol).toBe(SignalingProtocol.GTP_C);
    expect(m.integrity).toBe('SPOOFED');
    expect(m.inspectedByFirewall).toBe(false);
  });
  it('createSubscriber with defaults', () => {
    const s = createSubscriber();
    expect(s.registered).toBe(true);
    expect(s.roaming).toBe(false);
    expect(s.homeNetwork).toBe('310150');
  });
  it('createSubscriber with overrides', () => {
    const s = createSubscriber({ roaming: true, visitedNetwork: '23450', homeNetwork: '310150' });
    expect(s.roaming).toBe(true);
    expect(s.visitedNetwork).toBe('23450');
  });
  it('createNetworkSlice with defaults', () => {
    const s = createNetworkSlice();
    expect(s.type).toBe(NetworkSliceType.ENHANCED_MOBILE_BROADBAND);
    expect(s.sst).toBe(1);
    expect(s.latency).toBe(20);
  });
  it('createNetworkSlice with overrides', () => {
    const s = createNetworkSlice({ type: NetworkSliceType.ULTRA_RELIABLE_LOW_LATENCY, sst: 2, latency: 5, allocatedBandwidth: 50000 });
    expect(s.type).toBe(NetworkSliceType.ULTRA_RELIABLE_LOW_LATENCY);
    expect(s.sst).toBe(2);
    expect(s.latency).toBe(5);
    expect(s.allocatedBandwidth).toBe(50000);
  });
  it('createTelecomSecurityFinding with defaults', () => {
    const f = createTelecomSecurityFinding();
    expect(f.type).toBe(TelecomAttackType.SS7_IMSI_CAPTURE);
    expect(f.severity).toBe(TelecomSecurityFindingSeverity.HIGH);
    expect(f.mitigated).toBe(false);
  });
  it('createTelecomSecurityFinding with overrides', () => {
    const f = createTelecomSecurityFinding({ type: TelecomAttackType.SIGNALING_STORM, severity: TelecomSecurityFindingSeverity.MEDIUM, mitigated: true });
    expect(f.type).toBe(TelecomAttackType.SIGNALING_STORM);
    expect(f.severity).toBe(TelecomSecurityFindingSeverity.MEDIUM);
    expect(f.mitigated).toBe(true);
  });
  it('getKnownTelecomAttacks returns 12 attacks', () => {
    const attacks = getKnownTelecomAttacks();
    expect(attacks).toHaveLength(12);
  });
});

// ─── NetworkFunctionManager ─────────────────────────────────────
describe('NetworkFunctionManager', () => {
  it('deploy, get, remove', () => {
    const mgr = new NetworkFunctionManager();
    const id = mgr.deploy();
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.type).toBe(NetworkFunctionType.AMF);
    mgr.remove(id);
    expect(mgr.get(id)).toBeUndefined();
  });
  it('list returns all', () => {
    const mgr = new NetworkFunctionManager();
    mgr.deploy();
    mgr.deploy();
    expect(mgr.list()).toHaveLength(2);
  });
  it('list with filter', () => {
    const mgr = new NetworkFunctionManager();
    mgr.deploy({ type: NetworkFunctionType.AMF, region: 'us-east-1' });
    mgr.deploy({ type: NetworkFunctionType.SMF, region: 'us-east-1' });
    mgr.deploy({ type: NetworkFunctionType.UPF, region: 'eu-west-1' });
    expect(mgr.list({ type: NetworkFunctionType.AMF })).toHaveLength(1);
    expect(mgr.list({ region: 'us-east-1' })).toHaveLength(2);
  });
  it('listByType', () => {
    const mgr = new NetworkFunctionManager();
    mgr.deploy({ type: NetworkFunctionType.AMF });
    mgr.deploy({ type: NetworkFunctionType.SMF });
    expect(mgr.listByType(NetworkFunctionType.AMF)).toHaveLength(1);
    expect(mgr.listByType(NetworkFunctionType.UPF)).toHaveLength(0);
  });
  it('listByStatus', () => {
    const mgr = new NetworkFunctionManager();
    mgr.deploy({ status: NfStatus.ACTIVE });
    mgr.deploy({ status: NfStatus.OFFLINE });
    expect(mgr.listByStatus(NfStatus.ACTIVE)).toHaveLength(1);
    expect(mgr.listByStatus(NfStatus.OFFLINE)).toHaveLength(1);
  });
  it('listByRegion', () => {
    const mgr = new NetworkFunctionManager();
    mgr.deploy({ region: 'us-east-1' });
    mgr.deploy({ region: 'eu-west-1' });
    expect(mgr.listByRegion('us-east-1')).toHaveLength(1);
    expect(mgr.listByRegion('us-east-2')).toHaveLength(0);
  });
  it('connect / disconnect', () => {
    const mgr = new NetworkFunctionManager();
    const id1 = mgr.deploy();
    const id2 = mgr.deploy();
    expect(mgr.connect(id1, id2)).toBe(true);
    expect(mgr.get(id1)!.connectedFunctions).toContain(id2);
    expect(mgr.get(id2)!.connectedFunctions).toContain(id1);
    expect(mgr.connect(id1, 'nonexistent' as any)).toBe(false);
    expect(mgr.disconnect(id1, id2)).toBe(true);
    expect(mgr.get(id1)!.connectedFunctions).not.toContain(id2);
    expect(mgr.disconnect(id1, 'nonexistent' as any)).toBe(false);
  });
  it('updateStatus', () => {
    const mgr = new NetworkFunctionManager();
    const id = mgr.deploy();
    expect(mgr.updateStatus(id, NfStatus.COMPROMISED)).toBe(true);
    expect(mgr.get(id)!.status).toBe(NfStatus.COMPROMISED);
    expect(mgr.updateStatus('nonexistent' as any, NfStatus.ACTIVE)).toBe(false);
  });
  it('updateHeartbeat', () => {
    const mgr = new NetworkFunctionManager();
    const id = mgr.deploy();
    const before = mgr.get(id)!.lastHeartbeat;
    mgr.updateHeartbeat(id);
    expect(mgr.get(id)!.lastHeartbeat).toBeGreaterThanOrEqual(before);
  });
  it('getStats', () => {
    const mgr = new NetworkFunctionManager();
    expect(mgr.getStats().total).toBe(0);
    mgr.deploy({ type: NetworkFunctionType.AMF, status: NfStatus.ACTIVE, region: 'us-east-1' });
    mgr.deploy({ type: NetworkFunctionType.SMF, status: NfStatus.ACTIVE, region: 'us-east-1' });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.byType[NetworkFunctionType.AMF]).toBe(1);
    expect(stats.byStatus[NfStatus.ACTIVE]).toBe(2);
    expect(stats.byRegion['us-east-1']).toBe(2);
  });
});

// ─── RanManager ─────────────────────────────────────────────────
describe('RanManager', () => {
  it('deploy, get, remove', () => {
    const mgr = new RanManager();
    const id = mgr.deploy();
    expect(mgr.get(id)).toBeDefined();
    expect(mgr.get(id)!.type).toBe(RanNodeType.GNB_CU);
    mgr.remove(id);
    expect(mgr.get(id)).toBeUndefined();
  });
  it('list returns all', () => {
    const mgr = new RanManager();
    mgr.deploy();
    mgr.deploy();
    expect(mgr.list()).toHaveLength(2);
  });
  it('listByType', () => {
    const mgr = new RanManager();
    mgr.deploy({ type: RanNodeType.GNB_CU });
    mgr.deploy({ type: RanNodeType.ENB });
    expect(mgr.listByType(RanNodeType.GNB_CU)).toHaveLength(1);
    expect(mgr.listByType(RanNodeType.ENB)).toHaveLength(1);
  });
  it('listByTechnology', () => {
    const mgr = new RanManager();
    mgr.deploy({ technology: RanTechnology.NR });
    mgr.deploy({ technology: RanTechnology.LTE });
    expect(mgr.listByTechnology(RanTechnology.NR)).toHaveLength(1);
  });
  it('listByStatus', () => {
    const mgr = new RanManager();
    mgr.deploy({ status: NfStatus.ACTIVE });
    mgr.deploy({ status: NfStatus.OFFLINE });
    expect(mgr.listByStatus(NfStatus.ACTIVE)).toHaveLength(1);
  });
  it('addCell / removeCell', () => {
    const mgr = new RanManager();
    const id = mgr.deploy();
    expect(mgr.addCell(id, { cellId: 'c1', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 500, active: true })).toBe(true);
    expect(mgr.get(id)!.cells).toHaveLength(1);
    expect(mgr.addCell('nonexistent' as any, { cellId: 'c1', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 500, active: true })).toBe(false);
    expect(mgr.removeCell(id, 'c1')).toBe(true);
    expect(mgr.get(id)!.cells).toHaveLength(0);
    expect(mgr.removeCell(id, 'nonexistent')).toBe(false);
  });
  it('connectToNf', () => {
    const mgr = new RanManager();
    const rid = mgr.deploy();
    const nfid = 'nf-1' as any;
    expect(mgr.connectToNf(rid, nfid)).toBe(true);
    expect(mgr.get(rid)!.connectedTo).toContain(nfid);
    expect(mgr.connectToNf('nonexistent' as any, nfid)).toBe(false);
  });
  it('updateLoad', () => {
    const mgr = new RanManager();
    const id = mgr.deploy();
    expect(mgr.updateLoad(id, 95)).toBe(true);
    expect(mgr.get(id)!.userLoad).toBe(95);
    expect(mgr.updateLoad(id, -10)).toBe(true);
    expect(mgr.get(id)!.userLoad).toBe(0);
    expect(mgr.updateLoad('nonexistent' as any, 50)).toBe(false);
  });
  it('setCellActive', () => {
    const mgr = new RanManager();
    const id = mgr.deploy();
    mgr.addCell(id, { cellId: 'c1', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 500, active: true });
    expect(mgr.setCellActive(id, 'c1', false)).toBe(true);
    expect(mgr.get(id)!.cells[0]!.active).toBe(false);
    expect(mgr.setCellActive(id, 'nonexistent', false)).toBe(false);
    expect(mgr.setCellActive('nonexistent' as any, 'c1', false)).toBe(false);
  });
  it('getStats', () => {
    const mgr = new RanManager();
    expect(mgr.getStats().total).toBe(0);
    const id = mgr.deploy({ type: RanNodeType.GNB_CU, technology: RanTechnology.NR, status: NfStatus.ACTIVE });
    mgr.addCell(id, { cellId: 'c1', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 500, active: true });
    mgr.addCell(id, { cellId: 'c2', frequency: '4700', band: 'n79', bandwidth: 100, coverage: 300, active: false });
    const stats = mgr.getStats();
    expect(stats.total).toBe(1);
    expect(stats.totalCells).toBe(2);
    expect(stats.activeCells).toBe(1);
    expect(stats.byType[RanNodeType.GNB_CU]).toBe(1);
    expect(stats.byTechnology[RanTechnology.NR]).toBe(1);
  });
});

// ─── ImsManager ─────────────────────────────────────────────────
describe('ImsManager', () => {
  it('createSession, getSession', () => {
    const mgr = new ImsManager();
    const id = mgr.createSession();
    expect(mgr.getSession(id)).toBeDefined();
    expect(mgr.getSession(id)!.sessionState).toBe('INITIATING');
  });
  it('listSessions returns all', () => {
    const mgr = new ImsManager();
    mgr.createSession();
    mgr.createSession();
    expect(mgr.listSessions()).toHaveLength(2);
  });
  it('listSessions with filter', () => {
    const mgr = new ImsManager();
    mgr.createSession({ sessionState: 'ANSWERED' });
    mgr.createSession({ sessionState: 'TERMINATED' });
    expect(mgr.listSessions({ sessionState: 'ANSWERED' })).toHaveLength(1);
    expect(mgr.listSessions({ mediaType: 'AUDIO' })).toHaveLength(2);
  });
  it('updateSessionState', () => {
    const mgr = new ImsManager();
    const id = mgr.createSession();
    expect(mgr.updateSessionState(id, 'RINGING')).toBe(true);
    expect(mgr.getSession(id)!.sessionState).toBe('RINGING');
    expect(mgr.updateSessionState('nonexistent' as any, 'ANSWERED')).toBe(false);
  });
  it('terminateSession', () => {
    const mgr = new ImsManager();
    const id = mgr.createSession();
    expect(mgr.terminateSession(id)).toBe(true);
    expect(mgr.getSession(id)!.sessionState).toBe('TERMINATED');
    expect(mgr.getSession(id)!.endTime).toBeDefined();
    expect(mgr.terminateSession('nonexistent' as any)).toBe(false);
  });
  it('getActiveSessionCount', () => {
    const mgr = new ImsManager();
    expect(mgr.getActiveSessionCount()).toBe(0);
    mgr.createSession({ sessionState: 'ANSWERED' });
    mgr.createSession({ sessionState: 'TERMINATED' });
    expect(mgr.getActiveSessionCount()).toBe(1);
  });
  it('getStats', () => {
    const mgr = new ImsManager();
    mgr.createSession({ sessionState: 'ANSWERED', mediaType: 'AUDIO' });
    mgr.createSession({ sessionState: 'RINGING', mediaType: 'VIDEO' });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(2);
    expect(stats.byState['ANSWERED']).toBe(1);
    expect(stats.byMediaType['AUDIO']).toBe(1);
    expect(stats.byMediaType['VIDEO']).toBe(1);
  });
});

// ─── SignalingManager ───────────────────────────────────────────
describe('SignalingManager', () => {
  it('sendMessage, getMessage', () => {
    const mgr = new SignalingManager();
    const id = mgr.sendMessage();
    expect(mgr.getMessage(id)).toBeDefined();
    expect(mgr.getMessage(id)!.protocol).toBe(SignalingProtocol.SS7_MAP);
  });
  it('listMessages returns all', () => {
    const mgr = new SignalingManager();
    mgr.sendMessage();
    mgr.sendMessage();
    expect(mgr.listMessages()).toHaveLength(2);
  });
  it('listMessages with filter', () => {
    const mgr = new SignalingManager();
    mgr.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'MME-01' });
    mgr.sendMessage({ protocol: SignalingProtocol.GTP_C, source: 'SGW-01' });
    expect(mgr.listMessages({ protocol: SignalingProtocol.SS7_MAP })).toHaveLength(1);
    expect(mgr.listMessages({ source: 'MME-01' })).toHaveLength(1);
  });
  it('listByProtocol', () => {
    const mgr = new SignalingManager();
    mgr.sendMessage({ protocol: SignalingProtocol.SS7_MAP });
    mgr.sendMessage({ protocol: SignalingProtocol.GTP_C });
    expect(mgr.listByProtocol(SignalingProtocol.SS7_MAP)).toHaveLength(1);
    expect(mgr.listByProtocol(SignalingProtocol.DIAMETER_S6A)).toHaveLength(0);
  });
  it('listByIntegrity', () => {
    const mgr = new SignalingManager();
    mgr.sendMessage({ integrity: 'VALID' });
    mgr.sendMessage({ integrity: 'SPOOFED' });
    expect(mgr.listByIntegrity('VALID')).toHaveLength(1);
    expect(mgr.listByIntegrity('SPOOFED')).toHaveLength(1);
  });
  it('getStats tracks blocked and tampered counts', () => {
    const mgr = new SignalingManager();
    mgr.sendMessage({ integrity: 'VALID', securityAction: 'ALLOW' });
    mgr.sendMessage({ integrity: 'TAMPERED', securityAction: 'BLOCK' });
    mgr.sendMessage({ integrity: 'SPOOFED', securityAction: 'BLOCK' });
    const stats = mgr.getStats();
    expect(stats.total).toBe(3);
    expect(stats.blockedCount).toBe(2);
    expect(stats.tamperedCount).toBe(2);
    expect(stats.byIntegrity['VALID']).toBe(1);
    expect(stats.byIntegrity['TAMPERED']).toBe(1);
    expect(stats.byIntegrity['SPOOFED']).toBe(1);
  });
});

// ─── TelecomSecurityManager ─────────────────────────────────────
describe('TelecomSecurityManager', () => {
  it('addFinding, getFinding', () => {
    const mgr = new TelecomSecurityManager();
    const id = mgr.addFinding();
    expect(mgr.getFinding(id)).toBeDefined();
    expect(mgr.getFinding(id)!.type).toBe(TelecomAttackType.SS7_IMSI_CAPTURE);
  });
  it('listFindings returns all', () => {
    const mgr = new TelecomSecurityManager();
    mgr.addFinding();
    mgr.addFinding();
    expect(mgr.listFindings()).toHaveLength(2);
  });
  it('listFindings with filter', () => {
    const mgr = new TelecomSecurityManager();
    mgr.addFinding({ severity: TelecomSecurityFindingSeverity.HIGH });
    mgr.addFinding({ severity: TelecomSecurityFindingSeverity.CRITICAL });
    expect(mgr.listFindings({ severity: TelecomSecurityFindingSeverity.HIGH })).toHaveLength(1);
    expect(mgr.listFindings({ mitigated: false })).toHaveLength(2);
    expect(mgr.listFindings({ mitigated: true })).toHaveLength(0);
  });
  it('listBySeverity', () => {
    const mgr = new TelecomSecurityManager();
    mgr.addFinding({ severity: TelecomSecurityFindingSeverity.CRITICAL });
    mgr.addFinding({ severity: TelecomSecurityFindingSeverity.HIGH });
    expect(mgr.listBySeverity(TelecomSecurityFindingSeverity.CRITICAL)).toHaveLength(1);
    expect(mgr.listBySeverity(TelecomSecurityFindingSeverity.LOW)).toHaveLength(0);
  });
  it('listByType', () => {
    const mgr = new TelecomSecurityManager();
    mgr.addFinding({ type: TelecomAttackType.SS7_IMSI_CAPTURE });
    mgr.addFinding({ type: TelecomAttackType.IMSI_CATCHER });
    expect(mgr.listByType(TelecomAttackType.SS7_IMSI_CAPTURE)).toHaveLength(1);
    expect(mgr.listByType(TelecomAttackType.SS7_SMS_INTERCEPT)).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new TelecomSecurityManager();
    const id = mgr.addFinding();
    expect(mgr.mitigateFinding(id)).toBe(true);
    expect(mgr.getFinding(id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('getStats', () => {
    const mgr = new TelecomSecurityManager();
    mgr.addFinding({ type: TelecomAttackType.SS7_IMSI_CAPTURE, severity: TelecomSecurityFindingSeverity.HIGH, mitigated: false });
    mgr.addFinding({ type: TelecomAttackType.SIGNALING_STORM, severity: TelecomSecurityFindingSeverity.MEDIUM, mitigated: true });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.bySeverity[TelecomSecurityFindingSeverity.HIGH]).toBe(1);
    expect(stats.byType[TelecomAttackType.SS7_IMSI_CAPTURE]).toBe(1);
  });
  it('loadKnownAttacks / getKnownAttacks', () => {
    const mgr = new TelecomSecurityManager();
    expect(mgr.getKnownAttacks()).toHaveLength(0);
    mgr.loadKnownAttacks();
    expect(mgr.getKnownAttacks()).toHaveLength(12);
  });
});

// ─── TelecomCoordinator ─────────────────────────────────────────
describe('TelecomCoordinator', () => {
  it('composes all managers', () => {
    const coord = new TelecomCoordinator();
    expect(coord.networkFunctions).toBeInstanceOf(NetworkFunctionManager);
    expect(coord.ran).toBeInstanceOf(RanManager);
    expect(coord.ims).toBeInstanceOf(ImsManager);
    expect(coord.signaling).toBeInstanceOf(SignalingManager);
    expect(coord.security).toBeInstanceOf(TelecomSecurityManager);
    expect(coord.subscribers).toBeInstanceOf(Map);
    expect(coord.slices).toBeInstanceOf(Map);
  });
  it('addSubscriber / addSlice / getSubscriber / getSlice', () => {
    const coord = new TelecomCoordinator();
    const sid = coord.addSubscriber();
    const slid = coord.addSlice();
    expect(coord.getSubscriber(sid)).toBeDefined();
    expect(coord.getSlice(slid)).toBeDefined();
    expect(coord.getSubscriber('nonexistent' as any)).toBeUndefined();
  });
  it('getStats returns zeros for empty coordinator', () => {
    const coord = new TelecomCoordinator();
    const stats = coord.getStats();
    expect(stats.nfCount).toBe(0);
    expect(stats.ranCount).toBe(0);
    expect(stats.imsTotal).toBe(0);
    expect(stats.signalingTotal).toBe(0);
    expect(stats.findingCount).toBe(0);
    expect(stats.subscriberCount).toBe(0);
    expect(stats.sliceCount).toBe(0);
  });
  it('getStats reflects added resources', () => {
    const coord = new TelecomCoordinator();
    coord.networkFunctions.deploy();
    coord.ran.deploy();
    coord.ims.createSession();
    coord.signaling.sendMessage();
    coord.security.addFinding();
    coord.addSubscriber();
    coord.addSlice();
    const stats = coord.getStats();
    expect(stats.nfCount).toBe(1);
    expect(stats.ranCount).toBe(1);
    expect(stats.imsTotal).toBe(1);
    expect(stats.signalingTotal).toBe(1);
    expect(stats.findingCount).toBe(1);
    expect(stats.subscriberCount).toBe(1);
    expect(stats.sliceCount).toBe(1);
  });
  it('reset clears subscribers and slices', () => {
    const coord = new TelecomCoordinator();
    coord.addSubscriber();
    coord.addSlice();
    expect(coord.subscribers.size).toBe(1);
    expect(coord.slices.size).toBe(1);
    coord.reset();
    expect(coord.subscribers.size).toBe(0);
    expect(coord.slices.size).toBe(0);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultTelecomEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultTelecomEnvironment();
    const stats = coord.getStats();
    expect(stats.nfCount).toBe(10);
    expect(stats.ranCount).toBe(3);
    expect(stats.imsTotal).toBe(3);
    expect(stats.imsActive).toBe(2);
    expect(stats.signalingTotal).toBe(10);
    expect(stats.signalingBlocked).toBe(2);
    expect(stats.signalingTampered).toBe(3);
    expect(stats.findingCount).toBe(6);
    expect(stats.activeFindingCount).toBe(6);
    expect(stats.subscriberCount).toBe(2);
    expect(stats.sliceCount).toBe(2);
  });
  it('has diverse network function types', () => {
    const coord = createDefaultTelecomEnvironment();
    expect(coord.networkFunctions.listByType(NetworkFunctionType.AMF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.SMF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.UPF)).toHaveLength(2);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.UDM)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.AUSF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.PCF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.NRF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.NSSF)).toHaveLength(1);
    expect(coord.networkFunctions.listByType(NetworkFunctionType.SEPP)).toHaveLength(1);
  });
  it('has multiple regions', () => {
    const coord = createDefaultTelecomEnvironment();
    expect(coord.networkFunctions.listByRegion('us-east-1').length).toBeGreaterThan(0);
    expect(coord.networkFunctions.listByRegion('eu-west-1').length).toBeGreaterThan(0);
  });
  it('has RAN nodes of different types', () => {
    const coord = createDefaultTelecomEnvironment();
    expect(coord.ran.listByType(RanNodeType.GNB_CU)).toHaveLength(1);
    expect(coord.ran.listByType(RanNodeType.GNB_DU)).toHaveLength(1);
    expect(coord.ran.listByType(RanNodeType.ENB)).toHaveLength(1);
  });
  it('has cells across RAN nodes', () => {
    const coord = createDefaultTelecomEnvironment();
    const ranStats = coord.ran.getStats();
    expect(ranStats.totalCells).toBe(5);
    expect(ranStats.activeCells).toBe(4);
  });
  it('has IMS sessions with mixed states', () => {
    const coord = createDefaultTelecomEnvironment();
    const imsStats = coord.ims.getStats();
    expect(imsStats.total).toBe(3);
    expect(imsStats.active).toBe(2);
    expect(imsStats.byState['ANSWERED']).toBe(1);
    expect(imsStats.byState['RINGING']).toBe(1);
    expect(imsStats.byState['TERMINATED']).toBe(1);
  });
  it('has signaling messages across protocols', () => {
    const coord = createDefaultTelecomEnvironment();
    const sigStats = coord.signaling.getStats();
    expect(sigStats.byProtocol[SignalingProtocol.SS7_MAP]).toBe(5);
    expect(sigStats.byProtocol[SignalingProtocol.DIAMETER_S6A]).toBe(1);
    expect(sigStats.byProtocol[SignalingProtocol.DIAMETER_GX]).toBe(1);
    expect(sigStats.byProtocol[SignalingProtocol.DIAMETER_GY]).toBe(1);
    expect(sigStats.byProtocol[SignalingProtocol.GTP_C]).toBe(1);
    expect(sigStats.byProtocol[SignalingProtocol.GTP_U]).toBe(1);
  });
  it('has tampered and blocked signaling messages', () => {
    const coord = createDefaultTelecomEnvironment();
    const sigStats = coord.signaling.getStats();
    expect(sigStats.byIntegrity['SPOOFED']).toBe(1);
    expect(sigStats.byIntegrity['TAMPERED']).toBe(2);
    expect(sigStats.blockedCount).toBe(2);
    expect(sigStats.tamperedCount).toBe(3);
  });
  it('has subscribers with different roaming states', () => {
    const coord = createDefaultTelecomEnvironment();
    const subs = Array.from(coord.subscribers.values());
    expect(subs.find(s => s.roaming)).toBeDefined();
    expect(subs.find(s => !s.roaming)).toBeDefined();
    expect(subs.every(s => s.servingNode)).toBe(true);
    expect(subs.every(s => s.authenticationVector)).toBe(true);
  });
  it('has slices of different types', () => {
    const coord = createDefaultTelecomEnvironment();
    const slices = Array.from(coord.slices.values());
    expect(slices.find(s => s.type === NetworkSliceType.ENHANCED_MOBILE_BROADBAND)).toBeDefined();
    expect(slices.find(s => s.type === NetworkSliceType.ULTRA_RELIABLE_LOW_LATENCY)).toBeDefined();
  });
  it('has unmitigated security findings across attack types', () => {
    const coord = createDefaultTelecomEnvironment();
    expect(coord.security.listBySeverity(TelecomSecurityFindingSeverity.CRITICAL).length).toBeGreaterThan(0);
    expect(coord.security.listBySeverity(TelecomSecurityFindingSeverity.HIGH).length).toBeGreaterThan(0);
    expect(coord.security.listBySeverity(TelecomSecurityFindingSeverity.MEDIUM).length).toBeGreaterThan(0);
    expect(coord.security.listFindings({ mitigated: false }).length).toBe(6);
  });
  it('loads known attacks', () => {
    const coord = createDefaultTelecomEnvironment();
    expect(coord.security.getKnownAttacks()).toHaveLength(12);
  });
});
