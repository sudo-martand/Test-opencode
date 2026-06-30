import { describe, it, expect } from 'vitest';
import {
  SpaceAviationCoordinator, createDefaultSpaceAviationEnvironment,
  SatelliteManager, GroundStationManager, AircraftManager, UavManager,
  AvionicsManager, SpaceProtocolManager, GnssSignalManager,
  AcarsManager, AdsBManager, MavLinkManager, SecurityManager,
  satelliteId, groundStationId, aircraftId, uavId,
  avionicsSystemId, spaceProtocolMessageId, gnssSignalId,
  acarsMessageId, adsBMessageId, mavLinkMessageId,
  securityFindingId, attackScenarioId,
  SatelliteType, SatelliteStatus, SatellitePayload,
  GroundStationCapability, OrbitBand,
  AircraftType, UavFlightMode, AvionicsSystemType,
  CcsdsMessageType, GnssConstellation, GnssSignalBand,
  AcarsDataType, AdsBMessageType, MavLinkComponent, MavLinkMessageType,
  SpaceAttackType, Do326aSecurityLevel,
  createSatellite, createGroundStation, createAircraft,
  createUav, createAvionicsSystem, createSpaceProtocolMessage,
  createGnssSignal, createAcarsMessage, createAdsBMessage,
  createMavLinkMessage, createArinc429Word, createLinkBudget,
  createSecurityFinding, createAttackScenario,
  getKnownSpaceAttacks,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique satellite IDs', () => {
    const a = satelliteId(); const b = satelliteId();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
  });
  it('generate unique IDs for all types', () => {
    const ids = [
      satelliteId(), groundStationId(), aircraftId(), uavId(),
      avionicsSystemId(), spaceProtocolMessageId(), gnssSignalId(),
      acarsMessageId(), adsBMessageId(), mavLinkMessageId(),
      securityFindingId(), attackScenarioId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => satelliteId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createSatellite with defaults', () => {
    const s = createSatellite();
    expect(s.type).toBe(SatelliteType.LEO);
    expect(s.status).toBe(SatelliteStatus.Operational);
    expect(s.orbitAltitude).toBe(550);
  });
  it('createSatellite with overrides', () => {
    const s = createSatellite({ name: 'TestSat', orbitAltitude: 35786, payloads: [SatellitePayload.Comms, SatellitePayload.Navigation] });
    expect(s.name).toBe('TestSat');
    expect(s.orbitAltitude).toBe(35786);
    expect(s.payloads).toHaveLength(2);
  });
  it('createGroundStation with defaults', () => {
    const gs = createGroundStation();
    expect(gs.name).toBe('Primary-GS');
    expect(gs.uptimePercent).toBe(99.5);
    expect(gs.isCompromised).toBe(false);
  });
  it('createAircraft with defaults', () => {
    const ac = createAircraft();
    expect(ac.flight).toBe('SA123');
    expect(ac.altitude).toBe(35000);
    expect(ac.isOnGround).toBe(false);
  });
  it('createUav with defaults', () => {
    const u = createUav();
    expect(u.flightMode).toBe(UavFlightMode.Loiter);
    expect(u.insideGeofence).toBe(true);
  });
  it('createAvionicsSystem with defaults', () => {
    const sys = createAvionicsSystem();
    expect(sys.type).toBe(AvionicsSystemType.FMS);
    expect(sys.isOnline).toBe(true);
  });
  it('createSpaceProtocolMessage with defaults', () => {
    const msg = createSpaceProtocolMessage();
    expect(msg.type).toBe(CcsdsMessageType.Telemetry);
    expect(msg.isValid).toBe(true);
  });
  it('createGnssSignal with defaults', () => {
    const sig = createGnssSignal();
    expect(sig.constellation).toBe(GnssConstellation.GPS);
    expect(sig.band).toBe(GnssSignalBand.L1);
    expect(sig.signalType).toBe('civil');
    expect(sig.snr).toBe(45);
  });
  it('createAcarsMessage with defaults', () => {
    const msg = createAcarsMessage();
    expect(msg.dataType).toBe(AcarsDataType.Position);
    expect(msg.isAuthenticated).toBe(true);
    expect(msg.isInjected).toBe(false);
  });
  it('createAdsBMessage with defaults', () => {
    const msg = createAdsBMessage();
    expect(msg.messageType).toBe(AdsBMessageType.Position);
    expect(msg.isSpoofed).toBe(false);
  });
  it('createMavLinkMessage with defaults', () => {
    const msg = createMavLinkMessage();
    expect(msg.messageType).toBe(MavLinkMessageType.Heartbeat);
    expect(msg.isAuthenticated).toBe(true);
  });
  it('createArinc429Word with defaults', () => {
    const w = createArinc429Word();
    expect(w.ssm).toBe('normal');
    expect(w.data).toBe(35000);
  });
  it('createLinkBudget calculates correctly', () => {
    const lb = createLinkBudget();
    expect(lb.isFeasible).toBe(true);
    expect(lb.margin).toBeGreaterThan(0);
    expect(lb.freeSpaceLoss).toBeGreaterThan(0);
  });
  it('createSecurityFinding with defaults', () => {
    const f = createSecurityFinding();
    expect(f.severity).toBe('high');
    expect(f.mitigated).toBe(false);
  });
  it('createAttackScenario with defaults', () => {
    const s = createAttackScenario();
    expect(s.type).toBe(SpaceAttackType.GPSSpoofing);
    expect(s.isActive).toBe(false);
  });
  it('getKnownSpaceAttacks returns 10 attacks', () => {
    const attacks = getKnownSpaceAttacks();
    expect(attacks).toHaveLength(10);
    expect(attacks[0]!.type).toBe(SpaceAttackType.GPSSpoofing);
    expect(attacks[3]!.type).toBe(SpaceAttackType.CommandInjection);
    expect(attacks[9]!.type).toBe(SpaceAttackType.LinkInterception);
  });
});

// ─── SatelliteManager ───────────────────────────────────────────
describe('SatelliteManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new SatelliteManager();
    const s = createSatellite();
    mgr.add(s);
    expect(mgr.get(s.id)).toEqual(s);
    expect(mgr.list()).toHaveLength(1);
    mgr.remove(s.id);
    expect(mgr.get(s.id)).toBeUndefined();
    mgr.add(s);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('filterByType', () => {
    const mgr = new SatelliteManager();
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.GEO }));
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.LEO }));
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.LEO }));
    expect(mgr.filterByType(SatelliteType.LEO)).toHaveLength(2);
    expect(mgr.filterByType(SatelliteType.GEO)).toHaveLength(1);
    expect(mgr.filterByType(SatelliteType.HEO)).toHaveLength(0);
  });
  it('filterByStatus', () => {
    const mgr = new SatelliteManager();
    mgr.add(createSatellite({ id: satelliteId(), status: SatelliteStatus.Operational }));
    mgr.add(createSatellite({ id: satelliteId(), status: SatelliteStatus.Degraded }));
    expect(mgr.filterByStatus(SatelliteStatus.Operational)).toHaveLength(1);
  });
  it('filterByPayload', () => {
    const mgr = new SatelliteManager();
    mgr.add(createSatellite({ id: satelliteId(), payloads: [SatellitePayload.Comms] }));
    mgr.add(createSatellite({ id: satelliteId(), payloads: [SatellitePayload.Comms, SatellitePayload.Navigation] }));
    mgr.add(createSatellite({ id: satelliteId(), payloads: [SatellitePayload.SIGINT] }));
    expect(mgr.filterByPayload(SatellitePayload.Comms)).toHaveLength(2);
  });
  it('filterByBand', () => {
    const mgr = new SatelliteManager();
    mgr.add(createSatellite({ id: satelliteId(), bands: [OrbitBand.Ku] }));
    mgr.add(createSatellite({ id: satelliteId(), bands: [OrbitBand.Ka, OrbitBand.Ku] }));
    expect(mgr.filterByBand(OrbitBand.Ku)).toHaveLength(2);
    expect(mgr.filterByBand(OrbitBand.Ka)).toHaveLength(1);
  });
  it('count methods', () => {
    const mgr = new SatelliteManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.GEO }));
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.LEO }));
    mgr.add(createSatellite({ id: satelliteId(), type: SatelliteType.MEO }));
    expect(mgr.getTotalCount()).toBe(3);
    expect(mgr.getGeoCount()).toBe(1);
    expect(mgr.getLeoCcount()).toBe(1);
    expect(mgr.getMeoCount()).toBe(1);
  });
});

// ─── GroundStationManager ───────────────────────────────────────
describe('GroundStationManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new GroundStationManager();
    const gs = createGroundStation();
    mgr.add(gs);
    expect(mgr.get(gs.id)).toEqual(gs);
    mgr.remove(gs.id);
    expect(mgr.get(gs.id)).toBeUndefined();
    mgr.add(gs);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('filterByCapability', () => {
    const mgr = new GroundStationManager();
    mgr.add(createGroundStation({ id: groundStationId(), capabilities: [GroundStationCapability.TTCAntenna] }));
    mgr.add(createGroundStation({ id: groundStationId(), capabilities: [GroundStationCapability.TTCAntenna, GroundStationCapability.Ranging] }));
    expect(mgr.filterByCapability(GroundStationCapability.TTCAntenna)).toHaveLength(2);
    expect(mgr.filterByCapability(GroundStationCapability.Ranging)).toHaveLength(1);
  });
  it('filterByBand', () => {
    const mgr = new GroundStationManager();
    mgr.add(createGroundStation({ id: groundStationId(), bands: [OrbitBand.S] }));
    mgr.add(createGroundStation({ id: groundStationId(), bands: [OrbitBand.X, OrbitBand.S] }));
    expect(mgr.filterByBand(OrbitBand.S)).toHaveLength(2);
  });
  it('filterCompromised', () => {
    const mgr = new GroundStationManager();
    mgr.add(createGroundStation({ id: groundStationId(), isCompromised: true }));
    mgr.add(createGroundStation({ id: groundStationId(), isCompromised: false }));
    expect(mgr.filterCompromised()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new GroundStationManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createGroundStation());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── AircraftManager ────────────────────────────────────────────
describe('AircraftManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new AircraftManager();
    const ac = createAircraft();
    mgr.add(ac);
    expect(mgr.get(ac.id)).toEqual(ac);
    mgr.remove(ac.id);
    expect(mgr.get(ac.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new AircraftManager();
    mgr.add(createAircraft({ id: aircraftId(), type: AircraftType.Commercial }));
    mgr.add(createAircraft({ id: aircraftId(), type: AircraftType.Military }));
    expect(mgr.filterByType(AircraftType.Commercial)).toHaveLength(1);
  });
  it('filterByAltitude', () => {
    const mgr = new AircraftManager();
    mgr.add(createAircraft({ id: aircraftId(), altitude: 10000 }));
    mgr.add(createAircraft({ id: aircraftId(), altitude: 20000 }));
    mgr.add(createAircraft({ id: aircraftId(), altitude: 30000 }));
    expect(mgr.filterByAltitude(15000, 25000)).toHaveLength(1);
    expect(mgr.filterByAltitude(0, 40000)).toHaveLength(3);
  });
  it('filterByRegion', () => {
    const mgr = new AircraftManager();
    mgr.add(createAircraft({ id: aircraftId(), lat: 40, lon: -75 }));
    mgr.add(createAircraft({ id: aircraftId(), lat: 35, lon: -120 }));
    expect(mgr.filterByRegion(30, 45, -130, -70)).toHaveLength(2);
    expect(mgr.filterByRegion(38, 42, -80, -70)).toHaveLength(1);
  });
  it('filterOnGround', () => {
    const mgr = new AircraftManager();
    mgr.add(createAircraft({ id: aircraftId(), isOnGround: true }));
    mgr.add(createAircraft({ id: aircraftId(), isOnGround: false }));
    expect(mgr.filterOnGround()).toHaveLength(1);
  });
  it('count methods', () => {
    const mgr = new AircraftManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createAircraft({ id: aircraftId(), isOnGround: false }));
    mgr.add(createAircraft({ id: aircraftId(), isOnGround: true }));
    expect(mgr.getTotalCount()).toBe(2);
    expect(mgr.getInAirCount()).toBe(1);
  });
});

// ─── UavManager ─────────────────────────────────────────────────
describe('UavManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new UavManager();
    const u = createUav();
    mgr.add(u);
    expect(mgr.get(u.id)).toEqual(u);
    mgr.remove(u.id);
    expect(mgr.get(u.id)).toBeUndefined();
  });
  it('filterByMode', () => {
    const mgr = new UavManager();
    mgr.add(createUav({ id: uavId(), flightMode: UavFlightMode.Auto }));
    mgr.add(createUav({ id: uavId(), flightMode: UavFlightMode.Loiter }));
    expect(mgr.filterByMode(UavFlightMode.Auto)).toHaveLength(1);
  });
  it('filterArmed', () => {
    const mgr = new UavManager();
    mgr.add(createUav({ id: uavId(), isArmed: true }));
    mgr.add(createUav({ id: uavId(), isArmed: false }));
    expect(mgr.filterArmed()).toHaveLength(1);
  });
  it('filterInsideGeofence / filterOutsideGeofence', () => {
    const mgr = new UavManager();
    mgr.add(createUav({ id: uavId(), insideGeofence: true }));
    mgr.add(createUav({ id: uavId(), insideGeofence: false }));
    expect(mgr.filterInsideGeofence()).toHaveLength(1);
    expect(mgr.filterOutsideGeofence()).toHaveLength(1);
  });
  it('filterByBatteryThreshold', () => {
    const mgr = new UavManager();
    mgr.add(createUav({ id: uavId(), batteryPercent: 20 }));
    mgr.add(createUav({ id: uavId(), batteryPercent: 50 }));
    mgr.add(createUav({ id: uavId(), batteryPercent: 80 }));
    expect(mgr.filterByBatteryThreshold(30)).toHaveLength(1);
    expect(mgr.filterByBatteryThreshold(60)).toHaveLength(2);
  });
  it('updateGeofence', () => {
    const mgr = new UavManager();
    const u = createUav({ id: uavId(), geofenceRadius: 500 });
    mgr.add(u);
    expect(mgr.updateGeofence(u.id, 1000)).toBe(true);
    expect(mgr.get(u.id)!.geofenceRadius).toBe(1000);
    expect(mgr.updateGeofence('nonexistent' as any, 1000)).toBe(false);
  });
  it('getTotalCount', () => {
    const mgr = new UavManager();
    mgr.add(createUav());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── AvionicsManager ───────────────────────────────────────────
describe('AvionicsManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new AvionicsManager();
    const s = createAvionicsSystem();
    mgr.add(s);
    expect(mgr.get(s.id)).toEqual(s);
    mgr.remove(s.id);
    expect(mgr.get(s.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new AvionicsManager();
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), type: AvionicsSystemType.FMS }));
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), type: AvionicsSystemType.TCAS }));
    expect(mgr.filterByType(AvionicsSystemType.FMS)).toHaveLength(1);
  });
  it('filterByAircraft', () => {
    const mgr = new AvionicsManager();
    const aid = aircraftId();
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), aircraftId: aid }));
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), aircraftId: aid }));
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), aircraftId: aircraftId() }));
    expect(mgr.filterByAircraft(aid)).toHaveLength(2);
  });
  it('filterOnline / filterOffline', () => {
    const mgr = new AvionicsManager();
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), isOnline: true }));
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), isOnline: false }));
    expect(mgr.filterOnline()).toHaveLength(1);
    expect(mgr.filterOffline()).toHaveLength(1);
  });
  it('filterIntegrityWarnings', () => {
    const mgr = new AvionicsManager();
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), hasIntegrityWarning: true }));
    mgr.add(createAvionicsSystem({ id: avionicsSystemId(), hasIntegrityWarning: false }));
    expect(mgr.filterIntegrityWarnings()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new AvionicsManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createAvionicsSystem());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── SpaceProtocolManager ───────────────────────────────────────
describe('SpaceProtocolManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new SpaceProtocolManager();
    const m = createSpaceProtocolMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new SpaceProtocolManager();
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), type: CcsdsMessageType.Telemetry }));
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), type: CcsdsMessageType.Telecommand }));
    expect(mgr.filterByType(CcsdsMessageType.Telemetry)).toHaveLength(1);
  });
  it('filterBySource', () => {
    const mgr = new SpaceProtocolManager();
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), source: 'SAT-001' }));
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), source: 'SAT-002' }));
    expect(mgr.filterBySource('SAT-001')).toHaveLength(1);
  });
  it('filterEncrypted / filterInvalid', () => {
    const mgr = new SpaceProtocolManager();
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), isEncrypted: true }));
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), isEncrypted: false }));
    mgr.add(createSpaceProtocolMessage({ id: spaceProtocolMessageId(), isValid: false }));
    expect(mgr.filterEncrypted()).toHaveLength(1);
    expect(mgr.filterInvalid()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new SpaceProtocolManager();
    mgr.add(createSpaceProtocolMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── GnssSignalManager ─────────────────────────────────────────
describe('GnssSignalManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new GnssSignalManager();
    const s = createGnssSignal();
    mgr.add(s);
    expect(mgr.get(s.id)).toEqual(s);
    mgr.remove(s.id);
    expect(mgr.get(s.id)).toBeUndefined();
  });
  it('filterByConstellation', () => {
    const mgr = new GnssSignalManager();
    mgr.add(createGnssSignal({ id: gnssSignalId(), constellation: GnssConstellation.GPS }));
    mgr.add(createGnssSignal({ id: gnssSignalId(), constellation: GnssConstellation.Galileo }));
    expect(mgr.filterByConstellation(GnssConstellation.GPS)).toHaveLength(1);
    expect(mgr.filterByConstellation(GnssConstellation.Galileo)).toHaveLength(1);
  });
  it('filterByBand', () => {
    const mgr = new GnssSignalManager();
    mgr.add(createGnssSignal({ id: gnssSignalId(), band: GnssSignalBand.L1 }));
    mgr.add(createGnssSignal({ id: gnssSignalId(), band: GnssSignalBand.L5 }));
    expect(mgr.filterByBand(GnssSignalBand.L1)).toHaveLength(1);
  });
  it('filterJammed / filterSpoofed', () => {
    const mgr = new GnssSignalManager();
    mgr.add(createGnssSignal({ id: gnssSignalId(), isJammed: true }));
    mgr.add(createGnssSignal({ id: gnssSignalId(), isSpoofed: true }));
    expect(mgr.filterJammed()).toHaveLength(1);
    expect(mgr.filterSpoofed()).toHaveLength(1);
  });
  it('filterMilitary / filterCivil', () => {
    const mgr = new GnssSignalManager();
    mgr.add(createGnssSignal({ id: gnssSignalId(), signalType: 'military' }));
    mgr.add(createGnssSignal({ id: gnssSignalId(), signalType: 'civil' }));
    expect(mgr.filterMilitary()).toHaveLength(1);
    expect(mgr.filterCivil()).toHaveLength(1);
  });
  it('jamSignal sets SNR to 0', () => {
    const mgr = new GnssSignalManager();
    const s = createGnssSignal({ id: gnssSignalId(), snr: 45 });
    mgr.add(s);
    expect(mgr.jamSignal(s.id)).toBe(true);
    expect(mgr.get(s.id)!.isJammed).toBe(true);
    expect(mgr.get(s.id)!.snr).toBe(0);
    expect(mgr.jamSignal('nonexistent' as any)).toBe(false);
  });
  it('spoofSignal', () => {
    const mgr = new GnssSignalManager();
    const s = createGnssSignal({ id: gnssSignalId() });
    mgr.add(s);
    expect(mgr.spoofSignal(s.id)).toBe(true);
    expect(mgr.get(s.id)!.isSpoofed).toBe(true);
    expect(mgr.spoofSignal('nonexistent' as any)).toBe(false);
  });
  it('getTotalCount', () => {
    const mgr = new GnssSignalManager();
    mgr.add(createGnssSignal());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── AcarsManager ──────────────────────────────────────────────
describe('AcarsManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new AcarsManager();
    const m = createAcarsMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByDataType', () => {
    const mgr = new AcarsManager();
    mgr.add(createAcarsMessage({ id: acarsMessageId(), dataType: AcarsDataType.Position }));
    mgr.add(createAcarsMessage({ id: acarsMessageId(), dataType: AcarsDataType.Weather }));
    expect(mgr.filterByDataType(AcarsDataType.Position)).toHaveLength(1);
  });
  it('filterByAircraft', () => {
    const mgr = new AcarsManager();
    const aid = aircraftId();
    mgr.add(createAcarsMessage({ id: acarsMessageId(), aircraftId: aid }));
    expect(mgr.filterByAircraft(aid)).toHaveLength(1);
  });
  it('filterAuthenticated / filterUnauthenticated / filterInjected', () => {
    const mgr = new AcarsManager();
    mgr.add(createAcarsMessage({ id: acarsMessageId(), isAuthenticated: true, isInjected: false }));
    mgr.add(createAcarsMessage({ id: acarsMessageId(), isAuthenticated: false, isInjected: true }));
    expect(mgr.filterAuthenticated()).toHaveLength(1);
    expect(mgr.filterUnauthenticated()).toHaveLength(1);
    expect(mgr.filterInjected()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new AcarsManager();
    mgr.add(createAcarsMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── AdsBManager ───────────────────────────────────────────────
describe('AdsBManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new AdsBManager();
    const m = createAdsBMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new AdsBManager();
    mgr.add(createAdsBMessage({ id: adsBMessageId(), messageType: AdsBMessageType.Position }));
    mgr.add(createAdsBMessage({ id: adsBMessageId(), messageType: AdsBMessageType.Velocity }));
    expect(mgr.filterByType(AdsBMessageType.Position)).toHaveLength(1);
  });
  it('filterByAircraft', () => {
    const mgr = new AdsBManager();
    const aid = aircraftId();
    mgr.add(createAdsBMessage({ id: adsBMessageId(), aircraftId: aid }));
    expect(mgr.filterByAircraft(aid)).toHaveLength(1);
  });
  it('filterSpoofed', () => {
    const mgr = new AdsBManager();
    mgr.add(createAdsBMessage({ id: adsBMessageId(), isSpoofed: true }));
    mgr.add(createAdsBMessage({ id: adsBMessageId(), isSpoofed: false }));
    expect(mgr.filterSpoofed()).toHaveLength(1);
  });
  it('filterByRegion', () => {
    const mgr = new AdsBManager();
    mgr.add(createAdsBMessage({ id: adsBMessageId(), lat: 40, lon: -75 }));
    mgr.add(createAdsBMessage({ id: adsBMessageId(), lat: 35, lon: -120 }));
    expect(mgr.filterByRegion(30, 45, -130, -70)).toHaveLength(2);
  });
  it('getTotalCount', () => {
    const mgr = new AdsBManager();
    mgr.add(createAdsBMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── MavLinkManager ────────────────────────────────────────────
describe('MavLinkManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new MavLinkManager();
    const m = createMavLinkMessage();
    mgr.add(m);
    expect(mgr.get(m.id)).toEqual(m);
    mgr.remove(m.id);
    expect(mgr.get(m.id)).toBeUndefined();
  });
  it('filterByComponent', () => {
    const mgr = new MavLinkManager();
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), sourceComponent: MavLinkComponent.Autopilot }));
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), sourceComponent: MavLinkComponent.Battery }));
    expect(mgr.filterByComponent(MavLinkComponent.Autopilot)).toHaveLength(1);
  });
  it('filterByType', () => {
    const mgr = new MavLinkManager();
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), messageType: MavLinkMessageType.Heartbeat }));
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), messageType: MavLinkMessageType.Attitude }));
    expect(mgr.filterByType(MavLinkMessageType.Heartbeat)).toHaveLength(1);
  });
  it('filterAuthenticated / filterUnauthenticated', () => {
    const mgr = new MavLinkManager();
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), isAuthenticated: true }));
    mgr.add(createMavLinkMessage({ id: mavLinkMessageId(), isAuthenticated: false }));
    expect(mgr.filterAuthenticated()).toHaveLength(1);
    expect(mgr.filterUnauthenticated()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new MavLinkManager();
    mgr.add(createMavLinkMessage());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── SecurityManager ───────────────────────────────────────────
describe('SecurityManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new SecurityManager();
    const f = createSecurityFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    expect(mgr.listFindings()).toHaveLength(1);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('addScenario, getScenario, listScenarios, clearScenarios', () => {
    const mgr = new SecurityManager();
    const s = createAttackScenario();
    mgr.addScenario(s);
    expect(mgr.getScenario(s.id)).toEqual(s);
    mgr.clearScenarios();
    expect(mgr.listScenarios()).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new SecurityManager();
    const f = createSecurityFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('activateScenario / deactivateScenario', () => {
    const mgr = new SecurityManager();
    const s = createAttackScenario();
    mgr.addScenario(s);
    expect(mgr.activateScenario(s.id)).toBe(true);
    expect(mgr.getScenario(s.id)!.isActive).toBe(true);
    expect(mgr.deactivateScenario(s.id)).toBe(true);
    expect(mgr.getScenario(s.id)!.isActive).toBe(false);
    expect(mgr.activateScenario('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new SecurityManager();
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), severity: 'critical' }));
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), severity: 'high' }));
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), severity: 'low' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
    expect(mgr.filterFindingsBySeverity('high')).toHaveLength(1);
  });
  it('filterFindingsByDomain', () => {
    const mgr = new SecurityManager();
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), domain: 'space' }));
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), domain: 'aviation' }));
    expect(mgr.filterFindingsByDomain('space')).toHaveLength(1);
  });
  it('filterFindingsUnmitigated', () => {
    const mgr = new SecurityManager();
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), mitigated: true }));
    mgr.addFinding(createSecurityFinding({ id: securityFindingId(), mitigated: false }));
    expect(mgr.filterFindingsUnmitigated()).toHaveLength(1);
  });
  it('filterActiveScenarios', () => {
    const mgr = new SecurityManager();
    mgr.addScenario(createAttackScenario({ id: attackScenarioId(), isActive: true }));
    mgr.addScenario(createAttackScenario({ id: attackScenarioId(), isActive: false }));
    expect(mgr.filterActiveScenarios()).toHaveLength(1);
  });
  it('filterScenariosByType', () => {
    const mgr = new SecurityManager();
    mgr.addScenario(createAttackScenario({ id: attackScenarioId(), type: SpaceAttackType.GPSSpoofing }));
    mgr.addScenario(createAttackScenario({ id: attackScenarioId(), type: SpaceAttackType.ADSBSpoofing }));
    expect(mgr.filterScenariosByType(SpaceAttackType.GPSSpoofing)).toHaveLength(1);
  });
  it('count methods', () => {
    const mgr = new SecurityManager();
    expect(mgr.getTotalFindings()).toBe(0);
    mgr.addFinding(createSecurityFinding());
    expect(mgr.getTotalFindings()).toBe(1);
    expect(mgr.getTotalScenarios()).toBe(0);
    mgr.addScenario(createAttackScenario());
    expect(mgr.getTotalScenarios()).toBe(1);
  });
});

// ─── SpaceAviationCoordinator ─────────────────────────────────
describe('SpaceAviationCoordinator', () => {
  it('composes all managers', () => {
    const coord = new SpaceAviationCoordinator();
    expect(coord.satellites).toBeInstanceOf(SatelliteManager);
    expect(coord.groundStations).toBeInstanceOf(GroundStationManager);
    expect(coord.aircraft).toBeInstanceOf(AircraftManager);
    expect(coord.uavs).toBeInstanceOf(UavManager);
    expect(coord.avionics).toBeInstanceOf(AvionicsManager);
    expect(coord.spaceProtocols).toBeInstanceOf(SpaceProtocolManager);
    expect(coord.gnssSignals).toBeInstanceOf(GnssSignalManager);
    expect(coord.acars).toBeInstanceOf(AcarsManager);
    expect(coord.adsb).toBeInstanceOf(AdsBManager);
    expect(coord.mavlink).toBeInstanceOf(MavLinkManager);
    expect(coord.security).toBeInstanceOf(SecurityManager);
  });

  it('getStats returns zeros for empty coordinator', () => {
    const coord = new SpaceAviationCoordinator();
    const stats = coord.getStats();
    expect(stats.satelliteCount).toBe(0);
    expect(stats.aircraftCount).toBe(0);
    expect(stats.uavCount).toBe(0);
    expect(stats.activeScenarioCount).toBe(0);
    expect(stats.unmitigatedFindingCount).toBe(0);
  });

  it('getStats reflects added resources', () => {
    const coord = new SpaceAviationCoordinator();
    coord.satellites.add(createSatellite());
    coord.aircraft.add(createAircraft());
    coord.uavs.add(createUav());
    coord.security.addFinding(createSecurityFinding());
    coord.security.addScenario(createAttackScenario({ isActive: true }));
    const stats = coord.getStats();
    expect(stats.satelliteCount).toBe(1);
    expect(stats.aircraftCount).toBe(1);
    expect(stats.uavCount).toBe(1);
    expect(stats.findingCount).toBe(1);
    expect(stats.scenarioCount).toBe(1);
    expect(stats.activeScenarioCount).toBe(1);
    expect(stats.unmitigatedFindingCount).toBe(1);
  });

  it('reset clears all managers', () => {
    const coord = new SpaceAviationCoordinator();
    coord.satellites.add(createSatellite());
    coord.reset();
    expect(coord.satellites.getTotalCount()).toBe(0);
    expect(coord.groundStations.getTotalCount()).toBe(0);
    expect(coord.aircraft.getTotalCount()).toBe(0);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultSpaceAviationEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    const stats = coord.getStats();
    expect(stats.satelliteCount).toBe(4);
    expect(stats.groundStationCount).toBe(2);
    expect(stats.aircraftCount).toBe(3);
    expect(stats.uavCount).toBe(4);
    expect(stats.avionicsCount).toBe(4);
    expect(stats.spaceProtocolCount).toBe(3);
    expect(stats.gnssSignalCount).toBe(4);
    expect(stats.acarsCount).toBe(4);
    expect(stats.adsbCount).toBe(2);
    expect(stats.mavlinkCount).toBe(2);
    expect(stats.findingCount).toBe(5);
    expect(stats.scenarioCount).toBe(5);
  });

  it('has realistic satellite data', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    const sats = coord.satellites.list();
    expect(sats.find(s => s.name === 'Intelsat-901')!.type).toBe(SatelliteType.GEO);
    expect(sats.find(s => s.name === 'Starlink-3012')!.type).toBe(SatelliteType.LEO);
    expect(sats.find(s => s.name === 'GPS-BIIF-10')!.type).toBe(SatelliteType.MEO);
    expect(sats.find(s => s.name === 'KH-11-7')!.type).toBe(SatelliteType.SSO);
  });

  it('has satellite-ground station links', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    const sats = coord.satellites.list();
    const linked = sats.filter(s => s.station !== null);
    expect(linked.length).toBeGreaterThan(0);
  });

  it('has aircraft on ground and in air', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    expect(coord.aircraft.filterOnGround()).toHaveLength(1);
    expect(coord.aircraft.getInAirCount()).toBe(2);
  });

  it('has both armed and unarmed UAVs', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    expect(coord.uavs.filterArmed()).toHaveLength(2);
    expect(coord.uavs.filterOutsideGeofence()).toHaveLength(1);
  });

  it('has inject ACARS message', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    expect(coord.acars.filterInjected()).toHaveLength(1);
    expect(coord.acars.filterUnauthenticated()).toHaveLength(1);
  });

  it('has security findings at multiple severity levels', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    expect(coord.security.filterFindingsBySeverity('critical')).toHaveLength(2);
    expect(coord.security.filterFindingsBySeverity('high')).toHaveLength(2);
    expect(coord.security.filterFindingsBySeverity('medium')).toHaveLength(1);
  });

  it('has security findings across all domains', () => {
    const coord = createDefaultSpaceAviationEnvironment();
    expect(coord.security.filterFindingsByDomain('space')).toHaveLength(2);
    expect(coord.security.filterFindingsByDomain('aviation')).toHaveLength(2);
    expect(coord.security.filterFindingsByDomain('uav')).toHaveLength(1);
  });
});
