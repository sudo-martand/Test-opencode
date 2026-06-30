import { describe, it, expect } from 'vitest';
import {
  CpuSimulator, FirmwareManager, TpmManager, JtagManager,
  SideChannelManager, FaultInjectionManager, BusManager,
  HardwareCoordinator, createDefaultHardwareEnvironment,
  CpuArchitecture, MicroArchitecture, CacheLevel, CacheType,
  CachePolicy, BranchPredictorType, ExecutionMode,
  SpeculativeVulnerability, PciGeneration, UsbSpeed,
  FirmwareType, SecureBootState, TpmState, SideChannelType,
  FaultInjectionType, HardwareSecurityModuleType,
  cpuId, coreId, cacheId, registerId, pciDeviceId,
  usbDeviceId, spiDeviceId, i2cDeviceId, nvmeDeviceId,
  firmwareId, uefiVariableId, tpmPcrId, jtagDeviceId,
  sideChannelTraceId, faultInjectionId, pcbComponentId,
  sdrSampleId, hardwareVulnerabilityId,
  createCacheConfig, createCpuConfig, createCpuInstance,
  createPciDevice, createUsbDevice, createFirmware,
  createTpmDevice, createJtagDevice, createSideChannelTrace,
  createFaultInjection, createPcbComponent, createSdrConfig,
  getKnownHardwareVulnerabilities,
} from '../index';

describe('Branded IDs', () => {
  it('generates with correct prefixes', () => {
    expect(cpuId()).toMatch(/^cpu-/);
    expect(coreId()).toMatch(/^core-/);
    expect(cacheId()).toMatch(/^cache-/);
    expect(registerId()).toMatch(/^reg-/);
    expect(pciDeviceId()).toMatch(/^pci-/);
    expect(usbDeviceId()).toMatch(/^usb-/);
    expect(spiDeviceId()).toMatch(/^spi-/);
    expect(i2cDeviceId()).toMatch(/^i2c-/);
    expect(nvmeDeviceId()).toMatch(/^nvme-/);
    expect(firmwareId()).toMatch(/^fw-/);
    expect(uefiVariableId()).toMatch(/^uefi-/);
    expect(tpmPcrId()).toMatch(/^pcr-/);
    expect(jtagDeviceId()).toMatch(/^jtag-/);
    expect(sideChannelTraceId()).toMatch(/^sc-/);
    expect(faultInjectionId()).toMatch(/^fi-/);
    expect(pcbComponentId()).toMatch(/^pcb-/);
    expect(sdrSampleId()).toMatch(/^sdr-/);
    expect(hardwareVulnerabilityId()).toMatch(/^hwv-/);
  });

  it('generates unique values', () => {
    expect(new Set(Array.from({ length: 10 }, () => cpuId())).size).toBe(10);
  });
});

describe('Factory functions', () => {
  it('createCacheConfig returns defaults', () => {
    const c = createCacheConfig(CacheLevel.L1, CacheType.Data, 32768);
    expect(c.level).toBe(CacheLevel.L1);
    expect(c.type).toBe(CacheType.Data);
    expect(c.size).toBe(32768);
    expect(c.lineSize).toBe(64);
    expect(c.policy).toBe(CachePolicy.WriteBack);
  });

  it('createCacheConfig applies overrides', () => {
    const c = createCacheConfig(CacheLevel.L2, CacheType.Unified, 524288, { policy: CachePolicy.WriteThrough, latency: 8 });
    expect(c.policy).toBe(CachePolicy.WriteThrough);
    expect(c.latency).toBe(8);
  });

  it('createCpuConfig returns defaults', () => {
    const c = createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4);
    expect(c.architecture).toBe(CpuArchitecture.x86_64);
    expect(c.microArch).toBe(MicroArchitecture.Zen4);
    expect(c.cores).toBe(8);
    expect(c.threadsPerCore).toBe(2);
    expect(c.executionMode).toBe(ExecutionMode.OutOfOrder);
    expect(c.branchPredictor).toBe(BranchPredictorType.TAGE);
  });

  it('createCpuConfig applies overrides', () => {
    const c = createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Skylake, { cores: 16, tdp: 150 });
    expect(c.cores).toBe(16);
    expect(c.tdp).toBe(150);
  });

  it('createCpuInstance creates correct number of cores', () => {
    const config = createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { cores: 4 });
    const cpu = createCpuInstance('Test CPU', config);
    expect(cpu.name).toBe('Test CPU');
    expect(cpu.cores).toHaveLength(4);
    expect(cpu.temperature).toBe(40);
  });

  it('createPciDevice returns defaults', () => {
    const d = createPciDevice('Intel', 'I225-V', 0x8086, 0x15F3);
    expect(d.vendor).toBe('Intel');
    expect(d.product).toBe('I225-V');
    expect(d.generation).toBe(PciGeneration.Gen4);
    expect(d.msiSupport).toBe(true);
  });

  it('createUsbDevice returns defaults', () => {
    const d = createUsbDevice('SanDisk', 'Ultra Fit', 0x0781, 0x5583);
    expect(d.speed).toBe(UsbSpeed.High);
    expect(d.interfaces).toHaveLength(0);
  });

  it('createFirmware returns UEFI defaults', () => {
    const f = createFirmware();
    expect(f.config.type).toBe(FirmwareType.UEFI);
    expect(f.config.secureBoot).toBe(SecureBootState.Enabled);
    expect(f.config.measuredBoot).toBe(true);
  });

  it('createFirmware applies overrides', () => {
    const f = createFirmware({ type: FirmwareType.BIOS, secureBoot: SecureBootState.Disabled });
    expect(f.config.type).toBe(FirmwareType.BIOS);
    expect(f.config.secureBoot).toBe(SecureBootState.Disabled);
  });

  it('createTpmDevice returns TPM 2.0 with 24 PCRs', () => {
    const t = createTpmDevice();
    expect(t.type).toBe(HardwareSecurityModuleType.TPM_2_0);
    expect(t.state).toBe(TpmState.Active);
    expect(t.pcrs).toHaveLength(24);
  });

  it('createJtagDevice returns connected device', () => {
    const j = createJtagDevice('STM32F4', 0x2BA01477);
    expect(j.name).toBe('STM32F4');
    expect(j.connected).toBe(true);
    expect(j.frequency).toBe(10000000);
  });

  it('createSideChannelTrace generates samples', () => {
    const t = createSideChannelTrace(SideChannelType.CacheTiming, 'AES', 'T-table', 'key', true);
    expect(t.type).toBe(SideChannelType.CacheTiming);
    expect(t.samples).toHaveLength(10000);
    expect(t.success).toBe(true);
    expect(t.snr).toBeGreaterThan(10);
  });

  it('createFaultInjection sets correct parameters by type', () => {
    const f = createFaultInjection(FaultInjectionType.VoltageGlitch, 'target');
    expect(f.type).toBe(FaultInjectionType.VoltageGlitch);
    expect(f.parameters).toHaveProperty('voltageDrop');
  });

  it('createPcbComponent', () => {
    const p = createPcbComponent('R1', 'resistor', '10k', 10, 20);
    expect(p.reference).toBe('R1');
    expect(p.pins).toBe(3);
  });

  it('createSdrConfig returns defaults', () => {
    const s = createSdrConfig();
    expect(s.centerFrequency).toBe(2400000000);
    expect(s.modulation).toBe('qpsk');
  });

  it('getKnownHardwareVulnerabilities returns known vulns', () => {
    const vulns = getKnownHardwareVulnerabilities();
    expect(vulns.length).toBeGreaterThanOrEqual(9);
    expect(vulns.some((v) => v.name.includes('Spectre v1'))).toBe(true);
    expect(vulns.some((v) => v.name.includes('Meltdown'))).toBe(true);
    expect(vulns.some((v) => v.name.includes('Sinkclose'))).toBe(true);
  });
});

describe('CpuSimulator', () => {
  let sim: CpuSimulator;

  beforeEach(() => {
    sim = new CpuSimulator();
  });

  it('adds and retrieves CPUs', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    const id = sim.add(cpu);
    expect(sim.get(id)).toBe(cpu);
    expect(sim.list()).toHaveLength(1);
  });

  it('removes CPU by id', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    const id = sim.add(cpu);
    expect(sim.remove(id)).toBe(true);
    expect(sim.remove(id)).toBe(false);
    expect(sim.list()).toHaveLength(0);
  });

  it('setUtilization updates power and temperature', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    const id = sim.add(cpu);
    expect(sim.setUtilization(id, 50)).toBe(true);
    expect(cpu.utilization).toBe(50);
    expect(cpu.powerDraw).toBeGreaterThan(0);
    expect(cpu.temperature).toBeGreaterThan(40);
  });

  it('setUtilization clamps to [0, 100]', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    const id = sim.add(cpu);
    sim.setUtilization(id, 150);
    expect(cpu.utilization).toBe(100);
    sim.setUtilization(id, -10);
    expect(cpu.utilization).toBe(0);
  });

  it('setUtilization returns false for missing CPU', () => {
    expect(sim.setUtilization('none' as any, 50)).toBe(false);
  });

  it('setCoreFrequency updates core frequency', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { cores: 4 }));
    const id = sim.add(cpu);
    expect(sim.setCoreFrequency(id, 0, 5.0)).toBe(true);
    expect(cpu.cores[0]!.frequency).toBe(5.0);
  });

  it('setCoreFrequency returns false for bad index', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { cores: 2 }));
    const id = sim.add(cpu);
    expect(sim.setCoreFrequency(id, 99, 5.0)).toBe(false);
  });

  it('simulateCycle increments instruction/cycle counters', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { cores: 2 }));
    const id = sim.add(cpu);
    sim.simulateCycle(id, 1000);
    for (const core of cpu.cores) {
      expect(core.instructionsRetired).toBeGreaterThan(0n);
      expect(core.cycles).toBeGreaterThan(0n);
    }
    expect(cpu.uptime).toBeGreaterThan(0);
  });

  it('checkVulnerability returns true/false', () => {
    const config = createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, {
      speculativeVulnerabilities: [SpeculativeVulnerability.SpectreV1],
    });
    const cpu = createCpuInstance('Test', config);
    const id = sim.add(cpu);
    expect(sim.checkVulnerability(id, SpeculativeVulnerability.SpectreV1)).toBe(true);
    expect(sim.checkVulnerability(id, SpeculativeVulnerability.Meltdown)).toBe(false);
  });

  it('applyMitigation adds mitigation', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    const id = sim.add(cpu);
    expect(sim.applyMitigation(id, 'Retpoline')).toBe(true);
    expect(cpu.config.mitigations).toContain('Retpoline');
  });

  it('applyMitigation deduplicates', () => {
    const config = createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { mitigations: ['Retpoline'] });
    const cpu = createCpuInstance('Test', config);
    const id = sim.add(cpu);
    sim.applyMitigation(id, 'Retpoline');
    expect(cpu.config.mitigations.filter((m) => m === 'Retpoline')).toHaveLength(1);
  });

  it('getStats returns CPU statistics', () => {
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, { cores: 8 }));
    sim.add(cpu);
    const stats = sim.getStats();
    expect(stats.total).toBe(1);
    expect(stats.totalCores).toBe(8);
  });

  it('clear removes all CPUs', () => {
    sim.add(createCpuInstance('A', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4)));
    sim.add(createCpuInstance('B', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4)));
    sim.clear();
    expect(sim.list()).toHaveLength(0);
  });
});

describe('FirmwareManager', () => {
  let mgr: FirmwareManager;

  beforeEach(() => {
    mgr = new FirmwareManager();
  });

  it('provisions firmware', () => {
    const fw = mgr.provision();
    expect(fw.config.type).toBe(FirmwareType.UEFI);
    expect(mgr.list()).toHaveLength(1);
  });

  it('provisions with custom config', () => {
    const fw = mgr.provision({ type: FirmwareType.BIOS, vendor: 'Phoenix' });
    expect(fw.config.vendor).toBe('Phoenix');
  });

  it('gets firmware by id', () => {
    const fw = mgr.provision();
    expect(mgr.get(fw.id)).toBe(fw);
    expect(mgr.get('none' as any)).toBeUndefined();
  });

  it('adds UEFI variables', () => {
    const fw = mgr.provision();
    expect(mgr.addVariable(fw.id, { id: uefiVariableId(), name: 'Test', guid: '', attributes: [], data: new Uint8Array(), vendor: false })).toBe(true);
    expect(fw.variables).toHaveLength(1);
  });

  it('adds boot entries', () => {
    const fw = mgr.provision();
    expect(mgr.addBootEntry(fw.id, { id: 'boot1', name: 'Linux', devicePath: '', filePath: '', enabled: true, bootNext: false })).toBe(true);
    expect(fw.bootEntries).toHaveLength(1);
  });

  it('adds TCG log entries', () => {
    const fw = mgr.provision();
    expect(mgr.addTcgLogEntry(fw.id, { index: 1, pcr: 0, eventType: 'EV_TEST', digest: '', description: '' })).toBe(true);
    expect(fw.tcgLog).toHaveLength(1);
  });

  it('sets secure boot state', () => {
    const fw = mgr.provision();
    expect(mgr.setSecureBootState(fw.id, SecureBootState.Broken)).toBe(true);
    expect(fw.config.secureBoot).toBe(SecureBootState.Broken);
  });

  it('returns false for methods on missing firmware', () => {
    expect(mgr.addVariable('bad' as any, null as any)).toBe(false);
    expect(mgr.addBootEntry('bad' as any, null as any)).toBe(false);
    expect(mgr.setSecureBootState('bad' as any, SecureBootState.Enabled)).toBe(false);
  });

  it('removes firmware', () => {
    const fw = mgr.provision();
    expect(mgr.remove(fw.id)).toBe(true);
    expect(mgr.list()).toHaveLength(0);
  });

  it('clear removes all firmware', () => {
    mgr.provision();
    mgr.provision();
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
});

describe('TpmManager', () => {
  let mgr: TpmManager;

  beforeEach(() => {
    mgr = new TpmManager();
  });

  it('provisions TPM device', () => {
    const tpm = mgr.provision();
    expect(tpm.state).toBe(TpmState.Unowned);
    expect(mgr.list()).toHaveLength(1);
  });

  it('provisions with specific type', () => {
    const tpm = mgr.provision(HardwareSecurityModuleType.TPM_1_2);
    expect(tpm.version).toBe('1.2');
  });

  it('takeOwnership transitions state', () => {
    const tpm = mgr.provision();
    expect(mgr.takeOwnership(tpm.id, 'auth')).toBe(true);
    expect(tpm.state).toBe(TpmState.Owned);
  });

  it('takeOwnership fails if already owned', () => {
    const tpm = mgr.provision();
    mgr.takeOwnership(tpm.id, 'auth');
    expect(mgr.takeOwnership(tpm.id, 'auth')).toBe(false);
  });

  it('clearOwnership resets state', () => {
    const tpm = mgr.provision();
    mgr.takeOwnership(tpm.id, 'auth');
    expect(mgr.clearOwnership(tpm.id)).toBe(true);
    expect(tpm.state).toBe(TpmState.Unowned);
  });

  it('seal returns true when owned', () => {
    const tpm = mgr.provision();
    mgr.takeOwnership(tpm.id, 'auth');
    expect(mgr.seal(tpm.id, 'secret', [0, 1, 2])).toBe(true);
  });

  it('seal fails when unowned', () => {
    expect(mgr.seal(mgr.provision().id, 'data', [])).toBe(false);
  });

  it('unseal returns data when owned', () => {
    const tpm = mgr.provision();
    mgr.takeOwnership(tpm.id, 'auth');
    expect(mgr.unseal(tpm.id, [0, 1])).toBe('unsealed-data');
  });

  it('unseal returns null when unowned', () => {
    expect(mgr.unseal(mgr.provision().id, [])).toBeNull();
  });

  it('remoteAttest returns quote when owned', () => {
    const tpm = mgr.provision();
    mgr.takeOwnership(tpm.id, 'auth');
    const result = mgr.remoteAttest(tpm.id, 'nonce123');
    expect(result).not.toBeNull();
    expect(result!.quote).toMatch(/^quote-/);
    expect(result!.pcrs).toHaveProperty('0');
  });

  it('remoteAttest returns null when missing', () => {
    expect(mgr.remoteAttest('bad', 'nonce')).toBeNull();
  });

  it('remove and clear', () => {
    const tpm = mgr.provision();
    expect(mgr.remove(tpm.id)).toBe(true);
    mgr.provision();
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
});

describe('JtagManager', () => {
  let mgr: JtagManager;

  beforeEach(() => {
    mgr = new JtagManager();
  });

  it('adds and retrieves JTAG devices', () => {
    const dev = createJtagDevice('Test', 0x12345678);
    mgr.add(dev);
    expect(mgr.get(dev.id)).toBe(dev);
    expect(mgr.list()).toHaveLength(1);
  });

  it('connect/disconnect toggle state', () => {
    const dev = createJtagDevice('Test', 0x0);
    mgr.add(dev);
    mgr.disconnect(dev.id);
    expect(dev.connected).toBe(false);
    mgr.connect(dev.id);
    expect(dev.connected).toBe(true);
  });

  it('readIdCode returns idcode from connected device', () => {
    const dev = createJtagDevice('Test', 0xDEADBEEF);
    mgr.add(dev);
    expect(mgr.readIdCode(dev.id)).toBe(0xDEADBEEF);
  });

  it('readIdCode returns null for disconnected device', () => {
    const dev = createJtagDevice('Test', 0x0);
    mgr.add(dev);
    mgr.disconnect(dev.id);
    expect(mgr.readIdCode(dev.id)).toBeNull();
  });

  it('readIdCode returns null for missing device', () => {
    expect(mgr.readIdCode('bad' as any)).toBeNull();
  });

  it('readRegister returns register value', () => {
    const dev = createJtagDevice('Test', 0x0);
    dev.scanChain = [{
      name: 'CPU', irLength: 4, idCode: 0x0,
      instructions: [],
      registers: [{ name: 'IDCODE', size: 32, value: [0xDE, 0xAD] }],
    }];
    mgr.add(dev);
    expect(mgr.readRegister(dev.id, 'CPU', 'IDCODE')).toEqual([0xDE, 0xAD]);
  });

  it('readRegister returns null for missing tap/register', () => {
    const dev = createJtagDevice('Test', 0x0);
    dev.scanChain = [{ name: 'CPU', irLength: 4, idCode: 0x0, instructions: [], registers: [] }];
    mgr.add(dev);
    expect(mgr.readRegister(dev.id, 'CPU', 'MISSING')).toBeNull();
    expect(mgr.readRegister(dev.id, 'MISSING', 'X')).toBeNull();
  });

  it('shiftIr and shiftDr record operations', () => {
    const dev = createJtagDevice('Test', 0x0);
    mgr.add(dev);
    mgr.shiftIr(dev.id, [0b0010]);
    mgr.shiftDr(dev.id, [0xFF]);
    expect(mgr.getOperations()).toHaveLength(2);
  });

  it('shiftIr returns null for missing device', () => {
    expect(mgr.shiftIr('bad' as any, [])).toBeNull();
  });

  it('clear resets devices and operations', () => {
    const dev = createJtagDevice('Test', 0x0);
    mgr.add(dev);
    mgr.shiftIr(dev.id, [0b0010]);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
    expect(mgr.getOperations()).toHaveLength(0);
  });
});

describe('SideChannelManager', () => {
  let mgr: SideChannelManager;

  beforeEach(() => {
    mgr = new SideChannelManager();
  });

  it('captures and retrieves traces', () => {
    const trace = mgr.capture(SideChannelType.CacheTiming, 'AES', 'T-table', 'key bytes', true);
    expect(mgr.get(trace.id)).toBe(trace);
    expect(mgr.list()).toHaveLength(1);
  });

  it('listByType filters correctly', () => {
    mgr.capture(SideChannelType.CacheTiming, 'A', 'alg', 'leak', true);
    mgr.capture(SideChannelType.PowerAnalysis, 'B', 'alg', 'leak', false);
    expect(mgr.listByType(SideChannelType.CacheTiming)).toHaveLength(1);
    expect(mgr.listByType(SideChannelType.Acoustic)).toHaveLength(0);
  });

  it('listSuccessful filters successful traces', () => {
    mgr.capture(SideChannelType.Timing, 'A', 'alg', 'leak', true);
    mgr.capture(SideChannelType.Timing, 'B', 'alg', 'leak', false);
    expect(mgr.listSuccessful()).toHaveLength(1);
  });

  it('getStats returns correct counts', () => {
    mgr.capture(SideChannelType.CacheTiming, 'A', 'alg', 'leak', true);
    mgr.capture(SideChannelType.PowerAnalysis, 'B', 'alg', 'leak', true);
    mgr.capture(SideChannelType.Timing, 'C', 'alg', 'leak', false);
    const stats = mgr.getStats();
    expect(stats.total).toBe(3);
    expect(stats.successful).toBe(2);
    expect(stats.byType['cache_timing']).toBe(1);
  });

  it('remove and clear', () => {
    const t = mgr.capture(SideChannelType.Timing, 'A', 'alg', 'leak', true);
    expect(mgr.remove(t.id)).toBe(true);
    mgr.capture(SideChannelType.Timing, 'B', 'alg', 'leak', true);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
});

describe('FaultInjectionManager', () => {
  let mgr: FaultInjectionManager;

  beforeEach(() => {
    mgr = new FaultInjectionManager();
  });

  it('injects and retrieves attempts', () => {
    const a = mgr.inject(FaultInjectionType.VoltageGlitch, 'target');
    expect(mgr.get(a.id)).toBe(a);
    expect(mgr.list()).toHaveLength(1);
  });

  it('listByType filters correctly', () => {
    mgr.inject(FaultInjectionType.VoltageGlitch, 'A');
    mgr.inject(FaultInjectionType.RowHammer, 'B');
    expect(mgr.listByType(FaultInjectionType.VoltageGlitch)).toHaveLength(1);
  });

  it('listSuccessful filters successful', () => {
    mgr.inject(FaultInjectionType.VoltageGlitch, 'A', { success: true });
    mgr.inject(FaultInjectionType.RowHammer, 'B', { success: false });
    expect(mgr.listSuccessful()).toHaveLength(1);
  });

  it('getStats returns correct counts', () => {
    mgr.inject(FaultInjectionType.VoltageGlitch, 'A', { success: true });
    mgr.inject(FaultInjectionType.ClockGlitch, 'B', { success: false });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.successful).toBe(1);
  });

  it('clear removes all attempts', () => {
    mgr.inject(FaultInjectionType.VoltageGlitch, 'A');
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
});

describe('BusManager', () => {
  let mgr: BusManager;

  beforeEach(() => {
    mgr = new BusManager();
  });

  it('adds and lists PCI devices', () => {
    const dev = createPciDevice('Intel', 'I225-V', 0x8086, 0x15F3);
    mgr.addPci(dev);
    expect(mgr.getPci(dev.id)).toBe(dev);
    expect(mgr.listPci()).toHaveLength(1);
  });

  it('adds and lists USB devices', () => {
    const dev = createUsbDevice('SanDisk', 'Ultra Fit', 0x0781, 0x5583);
    mgr.addUsb(dev);
    expect(mgr.getUsb(dev.id)).toBe(dev);
    expect(mgr.listUsb()).toHaveLength(1);
  });

  it('adds and lists SPI devices', () => {
    const dev = { id: spiDeviceId(), name: 'Flash', mode: 0, frequency: 1000000, bitsPerWord: 8, csPolarity: false, data: [] };
    mgr.addSpi(dev);
    expect(mgr.getSpi(dev.id)).toBe(dev);
    expect(mgr.listSpi()).toHaveLength(1);
  });

  it('spiTransfer pushes data and returns zeros', () => {
    const dev = { id: spiDeviceId(), name: 'Flash', mode: 0, frequency: 1000000, bitsPerWord: 8, csPolarity: false, data: [] };
    mgr.addSpi(dev);
    const result = mgr.spiTransfer(dev.id, [0x01, 0x02]);
    expect(result).toHaveLength(2);
    expect(dev.data).toContain(0x01);
  });

  it('spiTransfer returns null for missing device', () => {
    expect(mgr.spiTransfer('bad' as any, [])).toBeNull();
  });

  it('adds and lists I2C devices', () => {
    const dev = { id: i2cDeviceId(), name: 'Sensor', address: 0x76, frequency: 400000, data: [0, 0, 0] };
    mgr.addI2c(dev);
    expect(mgr.getI2c(dev.id)).toBe(dev);
    expect(mgr.listI2c()).toHaveLength(1);
  });

  it('i2cRead reads from device data', () => {
    const dev = { id: i2cDeviceId(), name: 'Sensor', address: 0x76, frequency: 400000, data: [10, 20, 30, 40] };
    mgr.addI2c(dev);
    expect(mgr.i2cRead(dev.id, 1, 2)).toEqual([20, 30]);
  });

  it('i2cRead returns null for missing device', () => {
    expect(mgr.i2cRead('bad' as any, 0, 1)).toBeNull();
  });

  it('i2cWrite writes to device data', () => {
    const dev = { id: i2cDeviceId(), name: 'Sensor', address: 0x76, frequency: 400000, data: [0, 0, 0] };
    mgr.addI2c(dev);
    expect(mgr.i2cWrite(dev.id, 1, [99])).toBe(true);
    expect(dev.data[1]).toBe(99);
  });

  it('i2cWrite returns false for missing device', () => {
    expect(mgr.i2cWrite('bad' as any, 0, [])).toBe(false);
  });

  it('adds and lists NVMe devices', () => {
    const dev = { id: nvmeDeviceId(), model: 'Samsung 990 Pro', capacity: 2000000000000, numQueues: 16, queueDepth: 256, maxSectors: 65535, firmware: '5.2.1', temperature: 45, powerState: 0 };
    mgr.addNvme(dev);
    expect(mgr.getNvme(dev.id)).toBe(dev);
    expect(mgr.listNvme()).toHaveLength(1);
  });

  it('getStats returns correct counts', () => {
    mgr.addPci(createPciDevice('A', 'B', 0, 0));
    mgr.addUsb(createUsbDevice('A', 'B', 0, 0));
    const stats = mgr.getStats();
    expect(stats.pci).toBe(1);
    expect(stats.usb).toBe(1);
    expect(stats.spi).toBe(0);
  });

  it('clear removes all devices', () => {
    mgr.addPci(createPciDevice('A', 'B', 0, 0));
    mgr.addUsb(createUsbDevice('A', 'B', 0, 0));
    mgr.addSpi({ id: spiDeviceId(), name: 'Flash', mode: 0, frequency: 1, bitsPerWord: 8, csPolarity: false, data: [] });
    mgr.addI2c({ id: i2cDeviceId(), name: 'S', address: 0, frequency: 1, data: [] });
    mgr.addNvme({ id: nvmeDeviceId(), model: 'M', capacity: 1, numQueues: 1, queueDepth: 1, maxSectors: 1, firmware: '1', temperature: 30, powerState: 0 });
    mgr.clear();
    expect(mgr.listPci()).toHaveLength(0);
    expect(mgr.listUsb()).toHaveLength(0);
    expect(mgr.listSpi()).toHaveLength(0);
    expect(mgr.listI2c()).toHaveLength(0);
    expect(mgr.listNvme()).toHaveLength(0);
  });
});

describe('HardwareCoordinator', () => {
  it('composes all sub-managers', () => {
    const coord = new HardwareCoordinator();
    expect(coord.cpuSimulator).toBeInstanceOf(CpuSimulator);
    expect(coord.firmwareManager).toBeInstanceOf(FirmwareManager);
    expect(coord.tpmManager).toBeInstanceOf(TpmManager);
    expect(coord.jtagManager).toBeInstanceOf(JtagManager);
    expect(coord.sideChannelManager).toBeInstanceOf(SideChannelManager);
    expect(coord.faultInjectionManager).toBeInstanceOf(FaultInjectionManager);
    expect(coord.busManager).toBeInstanceOf(BusManager);
  });

  it('getKnownVulnerabilities returns vuln list', () => {
    const coord = new HardwareCoordinator();
    const vulns = coord.getKnownVulnerabilities();
    expect(vulns.length).toBeGreaterThanOrEqual(9);
  });

  it('getVulnerabilitiesByArchitecture filters correctly', () => {
    const coord = new HardwareCoordinator();
    const x86Vulns = coord.getVulnerabilitiesByArchitecture(CpuArchitecture.x86_64);
    expect(x86Vulns.length).toBeGreaterThan(0);
    expect(x86Vulns.some((v) => v.name.includes('Spectre v1'))).toBe(true);
    const riscvVulns = coord.getVulnerabilitiesByArchitecture(CpuArchitecture.RISC_V_64);
    expect(riscvVulns).toHaveLength(0);
  });

  it('getStats returns zero initially', () => {
    const coord = new HardwareCoordinator();
    const stats = coord.getStats();
    expect(stats.cpus).toBe(0);
    expect(stats.vulnerabilities).toBeGreaterThanOrEqual(9);
  });

  it('getStats reflects added resources', () => {
    const coord = new HardwareCoordinator();
    const cpu = createCpuInstance('Test', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4));
    coord.cpuSimulator.add(cpu);
    coord.firmwareManager.provision();
    const stats = coord.getStats();
    expect(stats.cpus).toBe(1);
    expect(stats.firmware).toBe(1);
  });

  it('reset clears all managers', () => {
    const coord = new HardwareCoordinator();
    coord.cpuSimulator.add(createCpuInstance('T', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4)));
    coord.firmwareManager.provision();
    coord.reset();
    expect(coord.cpuSimulator.list()).toHaveLength(0);
    expect(coord.firmwareManager.list()).toHaveLength(0);
  });
});

describe('createDefaultHardwareEnvironment', () => {
  it('creates environment with two CPUs', () => {
    const coord = createDefaultHardwareEnvironment();
    expect(coord.cpuSimulator.list()).toHaveLength(2);
  });

  it('includes AMD and Intel CPUs', () => {
    const coord = createDefaultHardwareEnvironment();
    const cpus = coord.cpuSimulator.list();
    expect(cpus.some((c) => c.name.includes('AMD'))).toBe(true);
    expect(cpus.some((c) => c.name.includes('Intel'))).toBe(true);
  });

  it('includes firmware with variables, boot entries, TCG log', () => {
    const coord = createDefaultHardwareEnvironment();
    const fws = coord.firmwareManager.list();
    expect(fws.length).toBeGreaterThanOrEqual(1);
    const fw = fws[0]!;
    expect(fw.variables.length).toBeGreaterThanOrEqual(1);
    expect(fw.bootEntries.length).toBeGreaterThanOrEqual(1);
    expect(fw.tcgLog.length).toBeGreaterThanOrEqual(2);
  });

  it('includes owned TPM', () => {
    const coord = createDefaultHardwareEnvironment();
    const tpms = coord.tpmManager.list();
    expect(tpms.length).toBeGreaterThanOrEqual(1);
    expect(tpms[0]!.state).toBe(TpmState.Owned);
  });

  it('includes JTAG device with scan chain', () => {
    const coord = createDefaultHardwareEnvironment();
    const jtags = coord.jtagManager.list();
    expect(jtags.length).toBeGreaterThanOrEqual(1);
    expect(jtags[0]!.scanChain.length).toBeGreaterThanOrEqual(1);
  });

  it('includes side-channel traces (some successful, some not)', () => {
    const coord = createDefaultHardwareEnvironment();
    const traces = coord.sideChannelManager.list();
    expect(traces.length).toBeGreaterThanOrEqual(3);
    expect(coord.sideChannelManager.listSuccessful().length).toBeGreaterThanOrEqual(2);
  });

  it('includes fault injection attempts', () => {
    const coord = createDefaultHardwareEnvironment();
    const faults = coord.faultInjectionManager.list();
    expect(faults.length).toBeGreaterThanOrEqual(2);
  });

  it('includes PCI and USB devices on buses', () => {
    const coord = createDefaultHardwareEnvironment();
    expect(coord.busManager.listPci().length).toBeGreaterThanOrEqual(1);
    expect(coord.busManager.listUsb().length).toBeGreaterThanOrEqual(1);
  });

  it('getStats reflects populated environment', () => {
    const coord = createDefaultHardwareEnvironment();
    const stats = coord.getStats();
    expect(stats.cpus).toBe(2);
    expect(stats.vulnerabilities).toBeGreaterThanOrEqual(9);
  });
});

describe('Enum completeness', () => {
  it('CpuArchitecture covers key values', () => {
    expect(CpuArchitecture.x86_64).toBe('x86_64');
    expect(CpuArchitecture.ARMv8_A).toBe('armv8_a');
    expect(CpuArchitecture.RISC_V_64).toBe('risc_v_64');
  });

  it('SpeculativeVulnerability covers key CVEs', () => {
    expect(SpeculativeVulnerability.SpectreV1).toBe('spectre_v1');
    expect(SpeculativeVulnerability.Meltdown).toBe('meltdown');
    expect(SpeculativeVulnerability.Zenbleed).toBe('zenbleed');
    expect(SpeculativeVulnerability.Sinkclose).toBe('sinkclose');
  });

  it('SideChannelType covers key types', () => {
    expect(SideChannelType.CacheTiming).toBe('cache_timing');
    expect(SideChannelType.PowerAnalysis).toBe('power_analysis');
    expect(SideChannelType.Electromagnetic).toBe('electromagnetic');
  });

  it('FaultInjectionType covers key types', () => {
    expect(FaultInjectionType.VoltageGlitch).toBe('voltage_glitch');
    expect(FaultInjectionType.RowHammer).toBe('row_hammer');
    expect(FaultInjectionType.ElectromagneticPulse).toBe('electromagnetic_pulse');
  });
});
