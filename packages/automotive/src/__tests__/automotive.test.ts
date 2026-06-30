import { describe, it, expect } from 'vitest';
import {
  AutomotiveCoordinator, createDefaultAutomotiveEnvironment,
  VehicleManager, EcuManager, CanBusManager, CanMessageManager,
  DiagnosticManager, V2xManager, AutoSecurityManager,
  vehicleId, ecuId, canBusId, canMessageId, diagnosticSessionId,
  diagnosticTroubleCodeId, v2xMessageId, autoSecurityFindingId,
  VehicleType, EcuType, CanProtocol, CanFrameType,
  DiagnosticService, DtcStatus, DtcSeverity,
  V2xMessageType, V2xTechnology, AutoSecurityDomain,
  createVehicle, createEcu, createCanBus, createCanMessage,
  createDiagnosticSession, createDiagnosticTroubleCode,
  createV2xMessage, createAutoSecurityFinding,
  getKnownAutoAttacks,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      vehicleId(), ecuId(), canBusId(), canMessageId(),
      diagnosticSessionId(), diagnosticTroubleCodeId(),
      v2xMessageId(), autoSecurityFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => vehicleId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createVehicle with defaults', () => {
    const v = createVehicle();
    expect(v.make).toBe('Generic Motors');
    expect(v.type).toBe(VehicleType.Passenger);
    expect(v.isIgnitionOn).toBe(false);
  });
  it('createVehicle with overrides', () => {
    const v = createVehicle({ make: 'Ford', model: 'F-150', type: VehicleType.Truck, isIgnitionOn: true, speed: 60 });
    expect(v.make).toBe('Ford');
    expect(v.type).toBe(VehicleType.Truck);
    expect(v.isIgnitionOn).toBe(true);
    expect(v.speed).toBe(60);
  });
  it('createEcu with defaults', () => {
    const e = createEcu();
    expect(e.type).toBe(EcuType.Engine);
    expect(e.isOnline).toBe(true);
    expect(e.isAuthenticated).toBe(true);
  });
  it('createCanBus with defaults', () => {
    const b = createCanBus();
    expect(b.protocol).toBe(CanProtocol.CANFD);
    expect(b.isActive).toBe(true);
  });
  it('createCanMessage with defaults', () => {
    const m = createCanMessage();
    expect(m.dlc).toBe(8);
    expect(m.isSpoofed).toBe(false);
  });
  it('createDiagnosticSession with defaults', () => {
    const s = createDiagnosticSession();
    expect(s.isActive).toBe(true);
    expect(s.securityLevel).toBe(0);
  });
  it('createDiagnosticTroubleCode with defaults', () => {
    const d = createDiagnosticTroubleCode();
    expect(d.code).toBe('P0300');
    expect(d.status).toBe(DtcStatus.Active);
  });
  it('createV2xMessage with defaults', () => {
    const m = createV2xMessage();
    expect(m.type).toBe(V2xMessageType.BSM);
    expect(m.isSpoofed).toBe(false);
  });
  it('createAutoSecurityFinding with defaults', () => {
    const f = createAutoSecurityFinding();
    expect(f.severity).toBe('high');
    expect(f.mitigated).toBe(false);
  });
  it('getKnownAutoAttacks returns 10 attacks', () => {
    const attacks = getKnownAutoAttacks();
    expect(attacks).toHaveLength(10);
  });
});

// ─── VehicleManager ─────────────────────────────────────────────
describe('VehicleManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new VehicleManager();
    const v = createVehicle();
    mgr.add(v);
    expect(mgr.get(v.id)).toEqual(v);
    mgr.remove(v.id);
    expect(mgr.get(v.id)).toBeUndefined();
    mgr.add(v);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('filterByType', () => {
    const mgr = new VehicleManager();
    mgr.add(createVehicle({ id: vehicleId(), type: VehicleType.Passenger }));
    mgr.add(createVehicle({ id: vehicleId(), type: VehicleType.Truck }));
    expect(mgr.filterByType(VehicleType.Passenger)).toHaveLength(1);
  });
  it('filterByMake', () => {
    const mgr = new VehicleManager();
    mgr.add(createVehicle({ id: vehicleId(), make: 'Toyota' }));
    mgr.add(createVehicle({ id: vehicleId(), make: 'Ford' }));
    expect(mgr.filterByMake('toyota')).toHaveLength(1);
  });
  it('filterByYearRange', () => {
    const mgr = new VehicleManager();
    mgr.add(createVehicle({ id: vehicleId(), year: 2023 }));
    mgr.add(createVehicle({ id: vehicleId(), year: 2025 }));
    expect(mgr.filterByYearRange(2024, 2026)).toHaveLength(1);
  });
  it('filterIgnitionOn', () => {
    const mgr = new VehicleManager();
    mgr.add(createVehicle({ id: vehicleId(), isIgnitionOn: true }));
    mgr.add(createVehicle({ id: vehicleId(), isIgnitionOn: false }));
    expect(mgr.filterIgnitionOn()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new VehicleManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createVehicle());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── EcuManager ─────────────────────────────────────────────────
describe('EcuManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new EcuManager();
    const e = createEcu();
    mgr.add(e);
    expect(mgr.get(e.id)).toEqual(e);
    mgr.remove(e.id);
    expect(mgr.get(e.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), type: EcuType.Engine }));
    mgr.add(createEcu({ id: ecuId(), type: EcuType.ABS }));
    expect(mgr.filterByType(EcuType.Engine)).toHaveLength(1);
  });
  it('filterByVendor', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), vendor: 'Bosch' }));
    mgr.add(createEcu({ id: ecuId(), vendor: 'Continental' }));
    expect(mgr.filterByVendor('bosch')).toHaveLength(1);
  });
  it('filterOnline / filterOffline', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), isOnline: true }));
    mgr.add(createEcu({ id: ecuId(), isOnline: false }));
    expect(mgr.filterOnline()).toHaveLength(1);
    expect(mgr.filterOffline()).toHaveLength(1);
  });
  it('filterAuthenticated / filterUnauthenticated', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), isAuthenticated: true }));
    mgr.add(createEcu({ id: ecuId(), isAuthenticated: false }));
    expect(mgr.filterAuthenticated()).toHaveLength(1);
    expect(mgr.filterUnauthenticated()).toHaveLength(1);
  });
  it('filterWithActiveSession', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), session: diagnosticSessionId() }));
    mgr.add(createEcu({ id: ecuId(), session: null }));
    expect(mgr.filterWithActiveSession()).toHaveLength(1);
  });
  it('filterByService', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu({ id: ecuId(), supportedServices: [DiagnosticService.EcuReset, DiagnosticService.SecurityAccess] }));
    mgr.add(createEcu({ id: ecuId(), supportedServices: [DiagnosticService.ReadDataByIdentifier] }));
    expect(mgr.filterByService(DiagnosticService.EcuReset)).toHaveLength(1);
  });
  it('flashEcu increments counter', () => {
    const mgr = new EcuManager();
    const e = createEcu({ id: ecuId(), flashCount: 0 });
    mgr.add(e);
    expect(mgr.flashEcu(e.id)).toBe(true);
    expect(mgr.get(e.id)!.flashCount).toBe(1);
    expect(mgr.flashEcu('nonexistent' as any)).toBe(false);
  });
  it('getTotalCount', () => {
    const mgr = new EcuManager();
    mgr.add(createEcu());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── CanBusManager ──────────────────────────────────────────────
describe('CanBusManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new CanBusManager();
    const b = createCanBus();
    mgr.add(b);
    expect(mgr.get(b.id)).toEqual(b);
    mgr.remove(b.id);
    expect(mgr.get(b.id)).toBeUndefined();
  });
  it('filterByProtocol', () => {
    const mgr = new CanBusManager();
    mgr.add(createCanBus({ id: canBusId(), protocol: CanProtocol.CANFD }));
    mgr.add(createCanBus({ id: canBusId(), protocol: CanProtocol.CAN20 }));
    expect(mgr.filterByProtocol(CanProtocol.CANFD)).toHaveLength(1);
  });
  it('filterByVehicle', () => {
    const mgr = new CanBusManager();
    const vid = vehicleId();
    mgr.add(createCanBus({ id: canBusId(), vehicleId: vid }));
    expect(mgr.filterByVehicle(vid)).toHaveLength(1);
  });
  it('filterActive / filterByLoadThreshold', () => {
    const mgr = new CanBusManager();
    mgr.add(createCanBus({ id: canBusId(), isActive: true, loadPercent: 80 }));
    mgr.add(createCanBus({ id: canBusId(), isActive: false, loadPercent: 20 }));
    expect(mgr.filterActive()).toHaveLength(1);
    expect(mgr.filterByLoadThreshold(50)).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new CanBusManager();
    mgr.add(createCanBus());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── CanMessageManager ──────────────────────────────────────────
describe('CanMessageManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new CanMessageManager();
    const m = createCanMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByBus', () => {
    const mgr = new CanMessageManager();
    const bid = canBusId();
    mgr.add(createCanMessage({ id: canMessageId(), busId: bid }));
    expect(mgr.filterByBus(bid)).toHaveLength(1);
  });
  it('filterByFrameType', () => {
    const mgr = new CanMessageManager();
    mgr.add(createCanMessage({ id: canMessageId(), frameType: CanFrameType.Standard }));
    mgr.add(createCanMessage({ id: canMessageId(), frameType: CanFrameType.FD }));
    expect(mgr.filterByFrameType(CanFrameType.Standard)).toHaveLength(1);
  });
  it('filterSpoofed / spoofMessage', () => {
    const mgr = new CanMessageManager();
    const m = createCanMessage({ id: canMessageId() });
    mgr.add(m);
    expect(mgr.spoofMessage(m.id)).toBe(true);
    expect(mgr.filterSpoofed()).toHaveLength(1);
    expect(mgr.spoofMessage('nonexistent' as any)).toBe(false);
  });
  it('filterByArbitrationId', () => {
    const mgr = new CanMessageManager();
    mgr.add(createCanMessage({ id: canMessageId(), arbitrationId: 0x201 }));
    mgr.add(createCanMessage({ id: canMessageId(), arbitrationId: 0x300 }));
    expect(mgr.filterByArbitrationId(0x201)).toHaveLength(1);
  });
  it('filterErrorFrames / filterRemoteFrames', () => {
    const mgr = new CanMessageManager();
    mgr.add(createCanMessage({ id: canMessageId(), isErrorFrame: true }));
    mgr.add(createCanMessage({ id: canMessageId(), isRemoteFrame: true }));
    expect(mgr.filterErrorFrames()).toHaveLength(1);
    expect(mgr.filterRemoteFrames()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new CanMessageManager();
    mgr.add(createCanMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── DiagnosticManager ──────────────────────────────────────────
describe('DiagnosticManager', () => {
  it('session add, get, remove, list, clear', () => {
    const mgr = new DiagnosticManager();
    const s = createDiagnosticSession();
    mgr.addSession(s);
    expect(mgr.getSession(s.id)).toEqual(s);
    mgr.removeSession(s.id);
    expect(mgr.getSession(s.id)).toBeUndefined();
  });
  it('filterSessionsByEcu', () => {
    const mgr = new DiagnosticManager();
    const eid = ecuId();
    mgr.addSession(createDiagnosticSession({ id: diagnosticSessionId(), ecuId: eid }));
    expect(mgr.filterSessionsByEcu(eid)).toHaveLength(1);
  });
  it('filterActiveSessions / closeSession', () => {
    const mgr = new DiagnosticManager();
    const s = createDiagnosticSession({ id: diagnosticSessionId() });
    mgr.addSession(s);
    expect(mgr.filterActiveSessions()).toHaveLength(1);
    expect(mgr.closeSession(s.id)).toBe(true);
    expect(mgr.filterActiveSessions()).toHaveLength(0);
    expect(mgr.closeSession('nonexistent' as any)).toBe(false);
  });
  it('filterAuthenticatedSessions', () => {
    const mgr = new DiagnosticManager();
    mgr.addSession(createDiagnosticSession({ id: diagnosticSessionId(), isAuthenticated: true }));
    mgr.addSession(createDiagnosticSession({ id: diagnosticSessionId(), isAuthenticated: false }));
    expect(mgr.filterAuthenticatedSessions()).toHaveLength(1);
  });

  it('DTC add, get, remove, list, clear', () => {
    const mgr = new DiagnosticManager();
    const d = createDiagnosticTroubleCode();
    mgr.addDtc(d);
    expect(mgr.getDtc(d.id)).toEqual(d);
    mgr.removeDtc(d.id);
    expect(mgr.getDtc(d.id)).toBeUndefined();
  });
  it('filterDtcsByEcu', () => {
    const mgr = new DiagnosticManager();
    const eid = ecuId();
    mgr.addDtc(createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), ecuId: eid }));
    expect(mgr.filterDtcsByEcu(eid)).toHaveLength(1);
  });
  it('filterDtcsByStatus', () => {
    const mgr = new DiagnosticManager();
    mgr.addDtc(createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), status: DtcStatus.Active }));
    mgr.addDtc(createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), status: DtcStatus.Stored }));
    expect(mgr.filterDtcsByStatus(DtcStatus.Active)).toHaveLength(1);
  });
  it('filterDtcsBySeverity', () => {
    const mgr = new DiagnosticManager();
    mgr.addDtc(createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), severity: DtcSeverity.Major }));
    mgr.addDtc(createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), severity: DtcSeverity.Minor }));
    expect(mgr.filterDtcsBySeverity(DtcSeverity.Major)).toHaveLength(1);
  });
  it('filterActiveDtcs / clearDtc', () => {
    const mgr = new DiagnosticManager();
    const d = createDiagnosticTroubleCode({ id: diagnosticTroubleCodeId(), status: DtcStatus.Active });
    mgr.addDtc(d);
    expect(mgr.filterActiveDtcs()).toHaveLength(1);
    expect(mgr.clearDtc(d.id)).toBe(true);
    expect(mgr.getDtc(d.id)!.status).toBe(DtcStatus.Stored);
    expect(mgr.clearDtc('nonexistent' as any)).toBe(false);
  });
  it('count methods', () => {
    const mgr = new DiagnosticManager();
    mgr.addSession(createDiagnosticSession());
    mgr.addDtc(createDiagnosticTroubleCode());
    expect(mgr.getTotalSessions()).toBe(1);
    expect(mgr.getTotalDtcs()).toBe(1);
  });
});

// ─── V2xManager ─────────────────────────────────────────────────
describe('V2xManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new V2xManager();
    const m = createV2xMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new V2xManager();
    mgr.add(createV2xMessage({ id: v2xMessageId(), type: V2xMessageType.BSM }));
    mgr.add(createV2xMessage({ id: v2xMessageId(), type: V2xMessageType.CAM }));
    expect(mgr.filterByType(V2xMessageType.BSM)).toHaveLength(1);
  });
  it('filterByTechnology', () => {
    const mgr = new V2xManager();
    mgr.add(createV2xMessage({ id: v2xMessageId(), technology: V2xTechnology.CV2X }));
    mgr.add(createV2xMessage({ id: v2xMessageId(), technology: V2xTechnology.DSRC }));
    expect(mgr.filterByTechnology(V2xTechnology.CV2X)).toHaveLength(1);
  });
  it('filterSpoofed / spoofMessage', () => {
    const mgr = new V2xManager();
    const m = createV2xMessage({ id: v2xMessageId() });
    mgr.add(m);
    expect(mgr.spoofMessage(m.id)).toBe(true);
    expect(mgr.filterSpoofed()).toHaveLength(1);
    expect(mgr.spoofMessage('nonexistent' as any)).toBe(false);
  });
  it('filterAuthenticated', () => {
    const mgr = new V2xManager();
    mgr.add(createV2xMessage({ id: v2xMessageId(), isAuthenticated: true }));
    mgr.add(createV2xMessage({ id: v2xMessageId(), isAuthenticated: false }));
    expect(mgr.filterAuthenticated()).toHaveLength(1);
  });
  it('filterByRegion', () => {
    const mgr = new V2xManager();
    mgr.add(createV2xMessage({ id: v2xMessageId(), lat: 40, lon: -75 }));
    mgr.add(createV2xMessage({ id: v2xMessageId(), lat: 35, lon: -120 }));
    expect(mgr.filterByRegion(30, 45, -130, -70)).toHaveLength(2);
  });
  it('getTotalCount', () => {
    const mgr = new V2xManager();
    mgr.add(createV2xMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── AutoSecurityManager ──────────────────────────────────────
describe('AutoSecurityManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new AutoSecurityManager();
    const f = createAutoSecurityFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new AutoSecurityManager();
    const f = createAutoSecurityFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new AutoSecurityManager();
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), severity: 'critical' }));
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), severity: 'high' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
  });
  it('filterFindingsByDomain', () => {
    const mgr = new AutoSecurityManager();
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), domain: AutoSecurityDomain.InVehicle }));
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), domain: AutoSecurityDomain.V2X }));
    expect(mgr.filterFindingsByDomain(AutoSecurityDomain.InVehicle)).toHaveLength(1);
  });
  it('filterFindingsUnmitigated', () => {
    const mgr = new AutoSecurityManager();
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), mitigated: true }));
    mgr.addFinding(createAutoSecurityFinding({ id: autoSecurityFindingId(), mitigated: false }));
    expect(mgr.filterFindingsUnmitigated()).toHaveLength(1);
  });
  it('loadKnownAttacks / getKnownAttacks', () => {
    const mgr = new AutoSecurityManager();
    expect(mgr.getKnownAttacks()).toHaveLength(0);
    mgr.loadKnownAttacks();
    expect(mgr.getKnownAttacks()).toHaveLength(10);
  });
  it('getTotalFindings', () => {
    const mgr = new AutoSecurityManager();
    mgr.addFinding(createAutoSecurityFinding());
    expect(mgr.getTotalFindings()).toBe(1);
  });
});

// ─── AutomotiveCoordinator ─────────────────────────────────────
describe('AutomotiveCoordinator', () => {
  it('composes all managers', () => {
    const coord = new AutomotiveCoordinator();
    expect(coord.vehicles).toBeInstanceOf(VehicleManager);
    expect(coord.ecus).toBeInstanceOf(EcuManager);
    expect(coord.canBuses).toBeInstanceOf(CanBusManager);
    expect(coord.canMessages).toBeInstanceOf(CanMessageManager);
    expect(coord.diagnostics).toBeInstanceOf(DiagnosticManager);
    expect(coord.v2x).toBeInstanceOf(V2xManager);
    expect(coord.security).toBeInstanceOf(AutoSecurityManager);
  });
  it('getStats returns zeros for empty coordinator', () => {
    const coord = new AutomotiveCoordinator();
    const stats = coord.getStats();
    expect(stats.vehicleCount).toBe(0);
    expect(stats.ecuCount).toBe(0);
    expect(stats.canBusCount).toBe(0);
  });
  it('getStats reflects added resources', () => {
    const coord = new AutomotiveCoordinator();
    coord.vehicles.add(createVehicle());
    coord.ecus.add(createEcu());
    coord.canBuses.add(createCanBus());
    const stats = coord.getStats();
    expect(stats.vehicleCount).toBe(1);
    expect(stats.ecuCount).toBe(1);
    expect(stats.canBusCount).toBe(1);
  });
  it('reset clears all managers', () => {
    const coord = new AutomotiveCoordinator();
    coord.vehicles.add(createVehicle());
    coord.reset();
    expect(coord.vehicles.getTotalCount()).toBe(0);
    expect(coord.ecus.getTotalCount()).toBe(0);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultAutomotiveEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultAutomotiveEnvironment();
    const stats = coord.getStats();
    expect(stats.vehicleCount).toBe(1);
    expect(stats.ecuCount).toBe(6);
    expect(stats.canBusCount).toBe(4);
    expect(stats.canMessageCount).toBe(4);
    expect(stats.diagnosticSessionCount).toBe(2);
    expect(stats.dtcCount).toBe(2);
    expect(stats.v2xMessageCount).toBe(3);
    expect(stats.findingCount).toBe(6);
    expect(stats.spoofedCanCount).toBe(1);
    expect(stats.spoofedV2xCount).toBe(1);
  });
  it('has diverse ECUs', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.ecus.filterByType(EcuType.Engine)).toHaveLength(1);
    expect(coord.ecus.filterByType(EcuType.ABS)).toHaveLength(1);
    expect(coord.ecus.filterByType(EcuType.Telematics)).toHaveLength(1);
    expect(coord.ecus.filterByType(EcuType.Gateway)).toHaveLength(1);
  });
  it('has mix of authenticated and unauthenticated ECUs', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.ecus.filterAuthenticated().length).toBeGreaterThan(0);
    expect(coord.ecus.filterUnauthenticated().length).toBeGreaterThan(0);
  });
  it('has multiple CAN protocols', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.canBuses.filterByProtocol(CanProtocol.CANFD).length).toBeGreaterThan(0);
    expect(coord.canBuses.filterByProtocol(CanProtocol.CAN20).length).toBeGreaterThan(0);
  });
  it('has active DTCs', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.diagnostics.filterActiveDtcs()).toHaveLength(1);
    expect(coord.diagnostics.filterDtcsBySeverity(DtcSeverity.Major)).toHaveLength(1);
  });
  it('has spoofed V2X messages', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.v2x.filterSpoofed()).toHaveLength(1);
  });
  it('has unmitigated security findings across domains', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.security.filterFindingsByDomain(AutoSecurityDomain.InVehicle).length).toBeGreaterThan(0);
    expect(coord.security.filterFindingsByDomain(AutoSecurityDomain.V2X).length).toBeGreaterThan(0);
    expect(coord.security.filterFindingsUnmitigated().length).toBe(6);
  });
  it('loads known attacks', () => {
    const coord = createDefaultAutomotiveEnvironment();
    expect(coord.security.getKnownAttacks()).toHaveLength(10);
  });
});
