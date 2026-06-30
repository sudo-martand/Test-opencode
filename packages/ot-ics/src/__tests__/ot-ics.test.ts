import { describe, it, expect } from 'vitest';
import {
  PlcManager, FieldbusManager, ScadaManager, AlarmManager, OtIcsCoordinator,
  createDefaultOtIcsEnvironment,
  PlcVendor, PlcModel, PlcStatus,
  PurdueLevel, ProtocolType, FieldbusState,
  SafetySystemType, SafetyIntegrityLevel,
  AlarmPriority, AlarmState,
  ProcessType, ScadaVendor, DcsVendor,
  createPlc, createRtu, createHmi, createScada, createDcs,
  createSafetySystem, createSensor, createActuator,
  createFieldbusNetwork, createProcess, createAlarm,
  createZone, createCell,
  getKnownIcsAttacks,
  IcsAttackType,
  alarmColor, alarmPriorityLabel,
  plcId, rtuId, hmiId, scadaId, dcsId,
  safetySystemId, alarmId, fieldbusId,
  processId, icsAttackId, cellId, zoneId,
} from '../index';

describe('Branded IDs', () => {
  it('generates unique IDs with correct prefixes', () => {
    expect(plcId()).toMatch(/^plc-/);
    expect(rtuId()).toMatch(/^rtu-/);
    expect(hmiId()).toMatch(/^hmi-/);
    expect(scadaId()).toMatch(/^scd-/);
    expect(dcsId()).toMatch(/^dcs-/);
    expect(safetySystemId()).toMatch(/^sis-/);
    expect(alarmId()).toMatch(/^alm-/);
    expect(fieldbusId()).toMatch(/^bus-/);
    expect(processId()).toMatch(/^prc-/);
    expect(icsAttackId()).toMatch(/^att-/);
    expect(cellId()).toMatch(/^cel-/);
    expect(zoneId()).toMatch(/^zne-/);
  });

  it('generates unique values each call', () => {
    const ids = Array.from({ length: 10 }, () => plcId());
    const unique = new Set(ids);
    expect(unique.size).toBe(10);
  });
});

describe('PlcManager', () => {
  let manager: PlcManager;

  beforeEach(() => {
    manager = new PlcManager();
  });

  it('deploys a PLC', () => {
    const plc = manager.deployPlc('Test PLC', PlcVendor.Siemens, PlcModel.S7_1500, { ipAddress: '10.0.0.1' });
    expect(plc.name).toBe('Test PLC');
    expect(plc.vendor).toBe(PlcVendor.Siemens);
    expect(plc.status).toBe(PlcStatus.Running);
    expect(plc.config.ipAddress).toBe('10.0.0.1');
    expect(plc.config.tcpPort).toBe(102);
  });

  it('deploys an Allen-Bradley PLC with correct defaults', () => {
    const plc = manager.deployPlc('AB PLC', PlcVendor.AllenBradley, PlcModel.ControlLogix_5580);
    expect(plc.config.tcpPort).toBe(44818);
    expect(plc.config.protocols).toContain(ProtocolType.CIP);
  });

  it('lists PLCs', () => {
    manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1200);
    manager.deployPlc('B', PlcVendor.AllenBradley, PlcModel.ControlLogix_5570);
    expect(manager.listPlcs()).toHaveLength(2);
  });

  it('filters PLCs by vendor', () => {
    manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.deployPlc('B', PlcVendor.AllenBradley, PlcModel.ControlLogix_5580);
    manager.deployPlc('C', PlcVendor.Siemens, PlcModel.S7_1200);
    expect(manager.listPlcsByVendor(PlcVendor.Siemens)).toHaveLength(2);
    expect(manager.listPlcsByVendor(PlcVendor.AllenBradley)).toHaveLength(1);
  });

  it('filters PLCs by status', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.deployPlc('B', PlcVendor.AllenBradley, PlcModel.ControlLogix_5580);
    manager.setPlcStatus(plc.id, PlcStatus.Error);
    expect(manager.listPlcsByStatus(PlcStatus.Error)).toHaveLength(1);
    expect(manager.listPlcsByStatus(PlcStatus.Running)).toHaveLength(1);
  });

  it('sets PLC status', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    expect(manager.setPlcStatus(plc.id, PlcStatus.Stopped)).toBe(true);
    expect(manager.getPlc(plc.id)!.status).toBe(PlcStatus.Stopped);
  });

  it('returns false for non-existent PLC status change', () => {
    expect(manager.setPlcStatus('fake' as any, PlcStatus.Error)).toBe(false);
  });

  it('assigns PLC to zone and cell', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    const z = zoneId();
    const c = cellId();
    expect(manager.assignPlcToZone(plc.id, z)).toBe(true);
    expect(manager.assignPlcToCell(plc.id, c)).toBe(true);
    expect(manager.getPlc(plc.id)!.zone).toBe(z);
    expect(manager.getPlc(plc.id)!.cell).toBe(c);
  });

  it('lists PLCs by zone', () => {
    const plc1 = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    const plc2 = manager.deployPlc('B', PlcVendor.AllenBradley, PlcModel.ControlLogix_5580);
    const z = zoneId();
    manager.assignPlcToZone(plc1.id, z);
    expect(manager.listPlcsByZone(z)).toHaveLength(1);
    expect(manager.listPlcsByZone(z)).not.toContain(plc2);
  });

  it('updates scan time', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    const before = plc.lastScanTime;
    manager.updateScanTime(plc.id);
    expect(manager.getPlc(plc.id)!.lastScanTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('removes a PLC', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    expect(manager.removePlc(plc.id)).toBe(true);
    expect(manager.listPlcs()).toHaveLength(0);
  });

  it('deploys RTUs', () => {
    const rtu = manager.deployRtu('Remote A');
    expect(rtu.name).toBe('Remote A');
    expect(rtu.config.vendor).toBe('Schweitzer');
    expect(rtu.config.protocols).toContain(ProtocolType.DNP3);
    expect(manager.listRtus()).toHaveLength(1);
  });

  it('manages field devices', () => {
    const sensor = createSensor('PT-101', ProcessType.ChemicalReactor);
    const actuator = createActuator('CV-301', ProcessType.ChemicalReactor);

    manager.addFieldDevice(sensor);
    manager.addFieldDevice(actuator);
    expect(manager.listFieldDevices()).toHaveLength(2);

    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.attachFieldDeviceToController(sensor.id, plc.id);
    expect(manager.getFieldDevice(sensor.id)!.plId).toBe(plc.id);
  });

  it('lists field devices by controller', () => {
    const plc = manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    const s1 = createSensor('S1', ProcessType.ChemicalReactor);
    const s2 = createSensor('S2', ProcessType.ChemicalReactor);
    manager.addFieldDevice(s1);
    manager.addFieldDevice(s2);
    manager.attachFieldDeviceToController(s1.id, plc.id);
    expect(manager.listFieldDevicesByController(plc.id)).toHaveLength(1);
  });

  it('gets stats', () => {
    manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.deployRtu('R1');
    const stats = manager.getStats();
    expect(stats.plcs).toBe(1);
    expect(stats.rtus).toBe(1);
    expect(stats.running).toBe(1);
    expect(stats.error).toBe(0);
  });

  it('clears all', () => {
    manager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.clear();
    expect(manager.listPlcs()).toHaveLength(0);
    expect(manager.listRtus()).toHaveLength(0);
  });
});

describe('FieldbusManager', () => {
  let manager: FieldbusManager;

  beforeEach(() => {
    manager = new FieldbusManager();
  });

  it('creates and lists networks', () => {
    const net = manager.createNetwork('Profibus 1', ProtocolType.Profibus_DP);
    expect(net.name).toBe('Profibus 1');
    expect(net.config.protocol).toBe(ProtocolType.Profibus_DP);
    expect(manager.listNetworks()).toHaveLength(1);
  });

  it('filters networks by protocol', () => {
    manager.createNetwork('A', ProtocolType.ModbusTCP);
    manager.createNetwork('B', ProtocolType.Profibus_DP);
    manager.createNetwork('C', ProtocolType.ModbusTCP);
    expect(manager.listNetworksByProtocol(ProtocolType.ModbusTCP)).toHaveLength(2);
  });

  it('sets network state', () => {
    const net = manager.createNetwork('A', ProtocolType.ModbusTCP);
    expect(manager.setNetworkState(net.id, FieldbusState.Offline)).toBe(true);
    expect(manager.getNetwork(net.id)!.state).toBe(FieldbusState.Offline);
  });

  it('sends and stores messages', () => {
    const net = manager.createNetwork('A', ProtocolType.ModbusTCP);
    const msg = manager.sendMessage(net.id, ProtocolType.ModbusTCP, 'PLC1', 'SCADA', 3, [0x01, 0x02]);
    expect(msg).not.toBeNull();
    expect(msg!.source).toBe('PLC1');
    expect(msg!.destination).toBe('SCADA');
    expect(msg!.functionCode).toBe(3);
    expect(msg!.data).toEqual([0x01, 0x02]);
    expect(manager.getMessages(net.id)).toHaveLength(1);
  });

  it('returns null when network is offline', () => {
    const net = manager.createNetwork('A', ProtocolType.ModbusTCP);
    manager.setNetworkState(net.id, FieldbusState.Offline);
    expect(manager.sendMessage(net.id, ProtocolType.ModbusTCP, 'A', 'B', 1, [])).toBeNull();
  });

  it('gets stats', () => {
    manager.createNetwork('A', ProtocolType.ModbusTCP);
    manager.createNetwork('B', ProtocolType.Profibus_DP);
    const stats = manager.getStats();
    expect(stats.total).toBe(2);
    expect(stats.online).toBe(2);
    expect(stats.offline).toBe(0);
    expect(stats.messages).toBe(0);
  });
});

describe('ScadaManager', () => {
  let manager: ScadaManager;

  beforeEach(() => {
    manager = new ScadaManager();
  });

  it('deploys and lists HMIs', () => {
    const hmi = manager.deployHmi('Console 1');
    expect(hmi.name).toBe('Console 1');
    expect(manager.listHmis()).toHaveLength(1);
  });

  it('connects HMI to PLC', () => {
    const pm = new PlcManager();
    manager.setPlcManager(pm);
    const plc = pm.deployPlc('PLC1', PlcVendor.Siemens, PlcModel.S7_1500);
    const hmi = manager.deployHmi('Console 1');
    expect(manager.connectHmiToPlc(hmi.id, plc.id)).toBe(true);
    expect(manager.getHmi(hmi.id)!.connectedPlcs).toContain(plc.id);
  });

  it('deploys and lists SCADAs', () => {
    const scada = manager.deployScada('Main SCADA');
    expect(scada.config.vendor).toBe(ScadaVendor.Wonderware);
    expect(manager.listScadas()).toHaveLength(1);
  });

  it('connects SCADA to HMI and PLC', () => {
    const scada = manager.deployScada('SCADA');
    const hmi = manager.deployHmi('HMI');
    manager.connectScadaToHmi(scada.id, hmi.id);
    expect(manager.getScada(scada.id)!.connectedHmis).toContain(hmi.id);

    const pm = new PlcManager();
    manager.setPlcManager(pm);
    const plc = pm.deployPlc('PLC1', PlcVendor.Siemens, PlcModel.S7_1500);
    manager.connectScadaToPlc(scada.id, plc.id);
    expect(manager.getScada(scada.id)!.connectedPlcs).toContain(plc.id);
  });

  it('deploys and lists DCS', () => {
    const dcsSys = manager.deployDcs('DeltaV');
    expect(dcsSys.config.vendor).toBe(DcsVendor.EmersonDeltaV);
    expect(manager.listDcs()).toHaveLength(1);
  });

  it('deploys and lists safety systems', () => {
    const sis = manager.deploySafetySystem('ESD-101', SafetySystemType.EmergencyShutdown, SafetyIntegrityLevel.SIL3);
    expect(sis.config.sil).toBe(SafetyIntegrityLevel.SIL3);
    expect(manager.listSafetySystems()).toHaveLength(1);
  });

  it('gets stats', () => {
    manager.deployHmi('HMI1');
    manager.deployScada('SCADA1');
    manager.deployDcs('DCS1');
    const stats = manager.getStats();
    expect(stats.hmis).toBe(1);
    expect(stats.scadas).toBe(1);
    expect(stats.dcs).toBe(1);
    expect(stats.safetySystems).toBe(0);
  });

  it('clears all', () => {
    manager.deployHmi('HMI');
    manager.deployScada('SCADA');
    manager.clear();
    expect(manager.listHmis()).toHaveLength(0);
    expect(manager.listScadas()).toHaveLength(0);
  });
});

describe('AlarmManager', () => {
  let manager: AlarmManager;

  beforeEach(() => {
    manager = new AlarmManager();
  });

  it('creates alarm with normal state', () => {
    const alarm = manager.createAlarm({ tag: 'TANK-101_HI', description: 'Tank 101 high level', priority: AlarmPriority.Critical, type: 'hi', limitValue: 80, deadband: 2, onDelay: 0, offDelay: 0, shelveDuration: 30, requiresAck: true });
    expect(alarm.state).toBe(AlarmState.Normal);
    expect(alarm.config.tag).toBe('TANK-101_HI');
  });

  it('raises, acknowledges, and returns alarm to normal', () => {
    const alarm = manager.createAlarm({ tag: 'TEMP_HI', description: 'Temp high', priority: AlarmPriority.Urgent, type: 'hi', limitValue: 250, deadband: 2, onDelay: 0, offDelay: 0, shelveDuration: 30, requiresAck: true });

    expect(manager.raiseAlarm(alarm.id)).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.Active);

    expect(manager.acknowledgeAlarm(alarm.id, 'operator1')).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.Acknowledged);
    expect(manager.getAlarm(alarm.id)!.acknowledgedBy).toBe('operator1');

    expect(manager.returnToNormal(alarm.id)).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.ReturnedToNormal);
  });

  it('shelves and unshelves alarms', () => {
    const alarm = manager.createAlarm({ tag: 'FLOW_LO', description: 'Flow low', priority: AlarmPriority.Warning, type: 'lo', limitValue: 20, deadband: 1, onDelay: 5, offDelay: 5, shelveDuration: 60, requiresAck: false });
    manager.raiseAlarm(alarm.id);
    expect(manager.shelveAlarm(alarm.id, 30)).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.Shelved);

    expect(manager.unshelveAlarm(alarm.id)).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.Active);
  });

  it('suppresses alarms', () => {
    const alarm = manager.createAlarm({ tag: 'TAG', description: 'Test', priority: AlarmPriority.Journal, type: 'hi', limitValue: 100, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 0, requiresAck: false });
    manager.raiseAlarm(alarm.id);
    expect(manager.suppressAlarm(alarm.id)).toBe(true);
    expect(manager.getAlarm(alarm.id)!.state).toBe(AlarmState.Suppressed);
  });

  it('lists active alarms', () => {
    const a1 = manager.createAlarm({ tag: 'A', description: 'A', priority: AlarmPriority.Critical, type: 'hi', limitValue: 80, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 0, requiresAck: true });
    const a2 = manager.createAlarm({ tag: 'B', description: 'B', priority: AlarmPriority.Urgent, type: 'hi', limitValue: 70, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 0, requiresAck: true });
    manager.raiseAlarm(a1.id);
    expect(manager.listActiveAlarms()).toHaveLength(1);
  });

  it('manages zones and cells', () => {
    const zone = createZone('Process Area', PurdueLevel.Level1_Control, 'Main control area');
    manager.addZone(zone);
    expect(manager.listZones()).toHaveLength(1);

    const cell = createCell('Cell 1', zone.id);
    manager.addCell(cell);
    expect(manager.listCells()).toHaveLength(1);
    expect(manager.listCellsByZone(zone.id)).toHaveLength(1);
  });

  it('manages processes and auto-creates alarms on threshold breach', () => {
    const proc = createProcess('Reactor', ProcessType.ChemicalReactor);
    manager.addProcess(proc);

    const variable = proc.variables[0]!;
    manager.updateProcessVariable(proc.id, variable.name, variable.alarmHighHigh + 1);

    const alarms = manager.listAlarms();
    expect(alarms.length).toBeGreaterThan(0);
    const hihiAlarm = alarms.find((a) => a.config.tag.includes('hihi'));
    expect(hihiAlarm).toBeDefined();
  });

  it('gets stats', () => {
    const alarm = manager.createAlarm({ tag: 'A', description: 'A', priority: AlarmPriority.Critical, type: 'hi', limitValue: 80, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 0, requiresAck: true });
    manager.raiseAlarm(alarm.id);
    const stats = manager.getStats();
    expect(stats.total).toBe(1);
    expect(stats.active).toBe(1);
    expect(stats.zones).toBe(0);
  });
});

describe('OtIcsCoordinator', () => {
  it('creates with empty state', () => {
    const coord = new OtIcsCoordinator();
    const stats = coord.getStats();
    expect(stats.totalPlcs).toBe(0);
    expect(stats.totalFieldbuses).toBe(0);
    expect(stats.totalAttacks).toBe(0);
  });

  it('registers and retrieves attacks', () => {
    const coord = new OtIcsCoordinator();
    expect(coord.getKnownAttacks()).toHaveLength(0);

    const attacks = getKnownIcsAttacks();
    for (const a of attacks) {
      coord.registerAttack(a);
    }
    expect(coord.getKnownAttacks()).toHaveLength(attacks.length);
  });

  it('resets state', () => {
    const coord = new OtIcsCoordinator();
    coord.plcManager.deployPlc('A', PlcVendor.Siemens, PlcModel.S7_1500);
    coord.reset();
    expect(coord.getStats().totalPlcs).toBe(0);
  });
});

describe('createDefaultOtIcsEnvironment', () => {
  it('creates a fully populated environment', () => {
    const env = createDefaultOtIcsEnvironment();
    const stats = env.getStats();

    expect(stats.totalPlcs).toBe(3);
    expect(stats.totalRtus).toBe(2);
    expect(stats.totalFieldDevices).toBe(4);
    expect(stats.totalFieldbuses).toBe(2);
    expect(stats.totalHmis).toBe(2);
    expect(stats.totalScadas).toBe(1);
    expect(stats.totalDcs).toBe(1);
    expect(stats.totalSafetySystems).toBe(1);
    expect(stats.totalProcesses).toBe(2);
    expect(stats.totalZones).toBe(4);
    expect(stats.totalCells).toBe(2);
    expect(stats.totalAttacks).toBe(7);
  });

  it('zones are at correct Purdue levels', () => {
    const env = createDefaultOtIcsEnvironment();
    const zones = env.alarmManager.listZones();

    const zone0 = zones.find((z) => z.name === 'Process Area A');
    const zone1 = zones.find((z) => z.name === 'Control Room 1');
    const zone2 = zones.find((z) => z.name === 'Supervisory Network');
    const zone3 = zones.find((z) => z.name === 'Site Operations');

    expect(zone0?.purdueLevel).toBe(PurdueLevel.Level0_Process);
    expect(zone1?.purdueLevel).toBe(PurdueLevel.Level1_Control);
    expect(zone2?.purdueLevel).toBe(PurdueLevel.Level2_Supervisory);
    expect(zone3?.purdueLevel).toBe(PurdueLevel.Level3_SiteOperations);
  });
});

describe('Known ICS Attacks', () => {
  it('includes all defined attack types', () => {
    const attacks = getKnownIcsAttacks();
    expect(attacks.length).toBe(7);

    const types = attacks.map((a) => a.type);
    expect(types).toContain(IcsAttackType.Triton);
    expect(types).toContain(IcsAttackType.Industroyer);
    expect(types).toContain(IcsAttackType.Stuxnet);
    expect(types).toContain(IcsAttackType.Havex);
    expect(types).toContain(IcsAttackType.BlackEnergy);
    expect(types).toContain(IcsAttackType.Pipedream);
    expect(types).toContain(IcsAttackType.COSMICENERGY);
  });

  it('each attack has MITRE ICS techniques', () => {
    for (const attack of getKnownIcsAttacks()) {
      expect(attack.mitreIcsTechniques.length).toBeGreaterThan(0);
      for (const t of attack.mitreIcsTechniques) {
        expect(t).toMatch(/^T\d{4}$/);
      }
    }
  });
});

describe('Alarm utilities', () => {
  it('returns color for each priority', () => {
    expect(alarmColor(AlarmPriority.Emergency)).toBe('magenta');
    expect(alarmColor(AlarmPriority.Critical)).toBe('red');
    expect(alarmColor(AlarmPriority.Journal)).toBe('gray');
  });

  it('returns label for each priority', () => {
    expect(alarmPriorityLabel(AlarmPriority.Critical)).toBe('Critical');
    expect(alarmPriorityLabel(AlarmPriority.Warning)).toBe('Warning');
  });
});

describe('Factory functions', () => {
  it('creates PLC with correct defaults per vendor', () => {
    const plc = createPlc('Test', PlcVendor.Schneider, PlcModel.Modicon_M580);
    expect(plc.config.tcpPort).toBe(502);
    expect(plc.purdueLevel).toBe(PurdueLevel.Level1_Control);
  });

  it('creates RTU', () => {
    const rtu = createRtu('RTU-1');
    expect(rtu.config.protocols).toContain(ProtocolType.DNP3);
  });

  it('creates HMI with correct defaults', () => {
    const hmi = createHmi('Console');
    expect(hmi.purdueLevel).toBe(PurdueLevel.Level2_Supervisory);
    expect(hmi.config.screenCount).toBe(12);
  });

  it('creates SCADA', () => {
    const scada = createScada('Main', { vendor: ScadaVendor.Ignition });
    expect(scada.config.vendor).toBe(ScadaVendor.Ignition);
  });

  it('creates DCS', () => {
    const dcsSys = createDcs('DeltaV');
    expect(dcsSys.config.vendor).toBe(DcsVendor.EmersonDeltaV);
  });

  it('creates safety system', () => {
    const sis = createSafetySystem('ESD', SafetySystemType.FireAndGas, SafetyIntegrityLevel.SIL2);
    expect(sis.config.type).toBe(SafetySystemType.FireAndGas);
    expect(sis.config.sil).toBe(SafetyIntegrityLevel.SIL2);
  });

  it('creates fieldbus network', () => {
    const net = createFieldbusNetwork('Profibus', ProtocolType.Profibus_PA);
    expect(net.config.protocol).toBe(ProtocolType.Profibus_PA);
  });

  it('creates process with default variables', () => {
    const proc = createProcess('Reactor', ProcessType.ChemicalReactor);
    expect(proc.variables).toHaveLength(3);
    expect(proc.state).toBe('running');
  });

  it('creates process with custom variables', () => {
    const proc = createProcess('Reactor', ProcessType.ChemicalReactor, [
      { name: 'pressure', value: 100, unit: 'psi', setpoint: 100, min: 0, max: 200, alarmHigh: 180, alarmLow: 20, alarmHighHigh: 195, alarmLowLow: 5, timestamp: new Date(), quality: 'good' },
    ]);
    expect(proc.variables).toHaveLength(1);
    expect(proc.variables[0]!.unit).toBe('psi');
  });

  it('creates alarm', () => {
    const alarm = createAlarm({ tag: 'TAG', description: 'Test', priority: AlarmPriority.Warning, type: 'hi', limitValue: 80, deadband: 2, onDelay: 0, offDelay: 0, shelveDuration: 30, requiresAck: true });
    expect(alarm.state).toBe(AlarmState.Normal);
  });

  it('creates zone and cell', () => {
    const z = createZone('Zone A', PurdueLevel.Level1_Control);
    const c = createCell('Cell A', z.id);
    expect(c.zoneId).toBe(z.id);
    expect(z.name).toBe('Zone A');
  });

  it('creates sensor with sensor defaults', () => {
    const sensor = createSensor('PT-101', ProcessType.ChemicalReactor);
    expect((sensor.config as any).measurementRange).toBeDefined();
    expect((sensor.config as any).unit).toBe('bar');
  });

  it('creates actuator with actuator defaults', () => {
    const actuator = createActuator('CV-301', ProcessType.ChemicalReactor);
    expect((actuator.config as any).actuationType).toBe('analog');
    expect((actuator.config as any).responseTime).toBe(100);
  });
});
