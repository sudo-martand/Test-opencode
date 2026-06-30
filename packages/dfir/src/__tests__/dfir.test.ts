import { describe, it, expect } from 'vitest';
import {
  CaseManager,
  MemoryAnalyzer,
  DiskAnalyzer,
  NetworkAnalyzer,
  TimelineBuilder,
  IocManager,
  DFIRCoordinator,
  EvidenceType,
  CaseStatus,
  EvidenceStatus,
  ArtifactCategory,
  IndicatorType,
  MemoryRegionProtection,
  NetworkProtocol,
  FileSystemType,
  caseId,
  evidenceId,
  artifactId,
  iocId,
  timelineEventId,
} from '../index';

describe('ID generators', () => {
  it('generates case IDs', () => {
    expect(caseId()).toMatch(/^case-/);
  });

  it('generates evidence IDs', () => {
    expect(evidenceId()).toMatch(/^ev-/);
  });

  it('generates artifact IDs', () => {
    expect(artifactId()).toMatch(/^art-/);
  });

  it('generates IoC IDs', () => {
    expect(iocId()).toMatch(/^ioc-/);
  });

  it('generates timeline event IDs', () => {
    expect(timelineEventId()).toMatch(/^tl-/);
  });

  it('generates unique IDs', () => {
    expect(caseId()).not.toBe(caseId());
  });
});

describe('CaseManager', () => {
  it('creates and retrieves cases', () => {
    const mgr = new CaseManager();
    const c = mgr.createCase('Test Case', 'analyst1', 'Acme Corp', 'Test description');
    expect(mgr.getCase(c.id)).toBeDefined();
    expect(mgr.getCase(c.id)!.name).toBe('Test Case');
    expect(mgr.getCase(c.id)!.analyst).toBe('analyst1');
  });

  it('lists cases', () => {
    const mgr = new CaseManager();
    mgr.createCase('Case 1', 'a1', 'org');
    mgr.createCase('Case 2', 'a2', 'org');
    expect(mgr.listCases().length).toBe(2);
  });

  it('lists cases filtered by status', () => {
    const mgr = new CaseManager();
    mgr.createCase('Case 1', 'a1', 'org');
    const c2 = mgr.createCase('Case 2', 'a2', 'org');
    mgr.updateCase(c2.id, { status: CaseStatus.Closed });
    expect(mgr.listCases(CaseStatus.Open).length).toBe(1);
    expect(mgr.listCases(CaseStatus.Closed).length).toBe(1);
  });

  it('updates case', () => {
    const mgr = new CaseManager();
    const c = mgr.createCase('Original', 'a1', 'org');
    mgr.updateCase(c.id, { name: 'Updated', description: 'New desc' });
    expect(mgr.getCase(c.id)!.name).toBe('Updated');
    expect(mgr.getCase(c.id)!.description).toBe('New desc');
  });

  it('adds evidence to case', () => {
    const mgr = new CaseManager();
    const c = mgr.createCase('Test', 'a', 'org');
    const ev = mgr.createEvidence(EvidenceType.MemoryDump, 'source', 'desc');
    expect(mgr.addEvidence(c.id, ev)).toBe(true);
    expect(mgr.listEvidence(c.id).length).toBe(1);
  });

  it('manages evidence lifecycle', () => {
    const mgr = new CaseManager();
    const ev = mgr.createEvidence(EvidenceType.DiskImage, '/dev/sda1', 'full disk image', 1024, 'abc123');
    expect(ev.type).toBe(EvidenceType.DiskImage);
    expect(ev.status).toBe(EvidenceStatus.Pending);
    expect(mgr.updateEvidence(ev.id, { status: EvidenceStatus.Analyzing })).toBe(true);
  });

  it('adds artifacts to evidence', () => {
    const mgr = new CaseManager();
    const c = mgr.createCase('Test', 'a', 'org');
    const ev = mgr.createEvidence(EvidenceType.MemoryDump, 'src', 'desc');
    mgr.addEvidence(c.id, ev);
    const art = mgr.createArtifact(ArtifactCategory.Process, 'process', 'lsass.exe', 'LSASS process', ev.id);
    expect(mgr.addArtifact(ev.id, art)).toBe(true);
    expect(mgr.listArtifacts(ev.id).length).toBe(1);
  });

  it('lists artifacts by category', () => {
    const mgr = new CaseManager();
    const ev = mgr.createEvidence(EvidenceType.MemoryDump, 'src', 'desc');
    mgr.addArtifact(ev.id, mgr.createArtifact(ArtifactCategory.Process, 'p', 'proc1', 'desc', ev.id));
    mgr.addArtifact(ev.id, mgr.createArtifact(ArtifactCategory.Network, 'n', 'conn1', 'desc', ev.id));
    expect(mgr.listArtifactsByCategory(ArtifactCategory.Process).length).toBe(1);
    expect(mgr.listArtifactsByCategory(ArtifactCategory.Network).length).toBe(1);
  });

  it('returns false for unknown case on evidence add', () => {
    const mgr = new CaseManager();
    const ev = mgr.createEvidence(EvidenceType.MemoryDump, 'src', 'desc');
    expect(mgr.addEvidence('unknown' as never, ev)).toBe(false);
  });

  it('removes case', () => {
    const mgr = new CaseManager();
    const c = mgr.createCase('Test', 'a', 'org');
    expect(mgr.removeCase(c.id)).toBe(true);
    expect(mgr.getCase(c.id)).toBeUndefined();
  });

  it('clears all cases', () => {
    const mgr = new CaseManager();
    mgr.createCase('Case 1', 'a', 'org');
    mgr.createCase('Case 2', 'a', 'org');
    mgr.clear();
    expect(mgr.listCases().length).toBe(0);
  });
});

describe('MemoryAnalyzer', () => {
  it('analyzes process list', () => {
    const analyzer = new MemoryAnalyzer();
    const dump = new Uint8Array(256 * 10);
    const processes = analyzer.analyzeProcessList(dump);
    expect(processes.length).toBeGreaterThan(0);
    expect(processes[0]!.pid).toBeGreaterThan(0);
    expect(processes[0]!.name).toBeTruthy();
  });

  it('returns empty list for empty dump', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.analyzeProcessList(new Uint8Array(0))).toEqual([]);
  });

  it('scans for specific process by PID', () => {
    const analyzer = new MemoryAnalyzer();
    const dump = new Uint8Array(256 * 10);
    const processes = analyzer.analyzeProcessList(dump);
    if (processes.length > 0) {
      const found = analyzer.scanForProcess(dump, processes[0]!.pid);
      expect(found).not.toBeNull();
      expect(found!.pid).toBe(processes[0]!.pid);
    }
  });

  it('returns null for non-existent PID', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.scanForProcess(new Uint8Array(256), 99999)).toBeNull();
  });

  it('detects hidden processes', () => {
    const analyzer = new MemoryAnalyzer();
    const dump = new Uint8Array(256 * 5);
    const hidden = analyzer.detectHiddenProcesses(dump, [99999]);
    expect(hidden.length).toBeGreaterThan(0);
  });

  it('scans memory regions', () => {
    const analyzer = new MemoryAnalyzer();
    const regions = analyzer.scanMemoryRegions(new Uint8Array(1024));
    expect(regions.length).toBeGreaterThan(0);
    expect(regions[0]!.address).toMatch(/^0x/);
    expect(regions[0]!.size).toBeGreaterThan(0);
  });

  it('returns empty memory regions for empty dump', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.scanMemoryRegions(new Uint8Array(0))).toEqual([]);
  });

  it('scans kernel modules', () => {
    const analyzer = new MemoryAnalyzer();
    const modules = analyzer.scanKernelModules(new Uint8Array(1024 * 5));
    expect(modules.length).toBeGreaterThanOrEqual(3);
    expect(modules[0]!.name).toBe('ntoskrnl.exe');
    expect(modules[0]!.signed).toBe(true);
  });

  it('returns minimum kernel modules for empty dump', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.scanKernelModules(new Uint8Array(0))).toEqual([]);
  });

  it('scans for malware indicators', () => {
    const analyzer = new MemoryAnalyzer();
    const data = new TextEncoder().encode('malicious_pattern');
    const dump = new Uint8Array(256);
    dump.set(data, 64);
    const results = analyzer.scanForMalwareIndicators(dump, ['malicious_pattern']);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.confidence).toBeGreaterThan(0);
  });

  it('returns empty for no rules', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.scanForMalwareIndicators(new Uint8Array(64), [])).toEqual([]);
  });

  it('analyzes network connections from memory', () => {
    const analyzer = new MemoryAnalyzer();
    const connections = analyzer.analyzeNetworkConnections(new Uint8Array(256));
    expect(connections.length).toBeGreaterThan(0);
    expect(connections[0]!.protocol).toBeTruthy();
    expect(connections[0]!.localPort).toBeGreaterThan(0);
  });

  it('returns empty connections for empty dump', () => {
    const analyzer = new MemoryAnalyzer();
    expect(analyzer.analyzeNetworkConnections(new Uint8Array(0))).toEqual([]);
  });
});

describe('DiskAnalyzer', () => {
  it('analyzes MBR partitions', () => {
    const analyzer = new DiskAnalyzer();
    const mbr = new Uint8Array(512);
    mbr[446] = 0x80;
    mbr[450] = 0x07;
    mbr[454] = 0x80;
    mbr[455] = 0x00;
    mbr[456] = 0x08;
    mbr[457] = 0x00;
    mbr[458] = 0x00;
    mbr[459] = 0x00;
    mbr[462] = 0x07;
    const partitions = analyzer.analyzePartitions(mbr);
    expect(partitions.length).toBeGreaterThan(0);
    expect(partitions[0]!.index).toBe(1);
  });

  it('returns empty for image < 512 bytes', () => {
    const analyzer = new DiskAnalyzer();
    expect(analyzer.analyzePartitions(new Uint8Array(100))).toEqual([]);
  });

  it('walks file system', () => {
    const analyzer = new DiskAnalyzer();
    const entries = analyzer.walkFileSystem(new Uint8Array(1024));
    expect(entries.length).toBeGreaterThan(0);
    const dirs = entries.filter((e) => e.isDirectory);
    const files = entries.filter((e) => !e.isDirectory);
    expect(dirs.length).toBeGreaterThan(0);
    expect(files.length).toBeGreaterThan(0);
  });

  it('returns empty for empty image', () => {
    const analyzer = new DiskAnalyzer();
    expect(analyzer.walkFileSystem(new Uint8Array(0))).toEqual([]);
  });

  it('parses MFT entries', () => {
    const analyzer = new DiskAnalyzer();
    const entries = analyzer.parseMft(new Uint8Array(1024 * 10));
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]!.recordNumber).toBe(0);
    expect(entries[0]!.fileName).toBeTruthy();
  });

  it('returns empty MFT for small image', () => {
    const analyzer = new DiskAnalyzer();
    expect(analyzer.parseMft(new Uint8Array(512))).toEqual([]);
  });

  it('has deleted MFT entries', () => {
    const analyzer = new DiskAnalyzer();
    const entries = analyzer.parseMft(new Uint8Array(1024 * 10));
    const deleted = entries.filter((e) => e.isDeleted);
    expect(deleted.length).toBeGreaterThan(0);
  });

  it('carves files by signature', () => {
    const analyzer = new DiskAnalyzer();
    const data = new Uint8Array(2048);
    data[0] = 0xFF; data[1] = 0xD8; data[2] = 0xFF; data[3] = 0xE0;
    data[1024] = 0x50; data[1025] = 0x4B; data[1026] = 0x03; data[1027] = 0x04;
    const carved = analyzer.carveFiles(data);
    expect(carved.length).toBeGreaterThanOrEqual(2);
    expect(carved.some((c) => c.signature === 'jpg')).toBe(true);
    expect(carved.some((c) => c.signature === 'zip')).toBe(true);
  });

  it('carves files with specific signature filter', () => {
    const analyzer = new DiskAnalyzer();
    const data = new Uint8Array(1024);
    data[0] = 0xFF; data[1] = 0xD8; data[2] = 0xFF; data[3] = 0xE0;
    data[512] = 0x89; data[513] = 0x50; data[514] = 0x4E; data[515] = 0x47;
    const carved = analyzer.carveFiles(data, ['png']);
    expect(carved.length).toBeGreaterThanOrEqual(1);
    expect(carved.every((c) => c.signature === 'png')).toBe(true);
  });

  it('returns empty for small image carve', () => {
    const analyzer = new DiskAnalyzer();
    expect(analyzer.carveFiles(new Uint8Array(16))).toEqual([]);
  });
});

describe('NetworkAnalyzer', () => {
  it('analyzes packets', () => {
    const analyzer = new NetworkAnalyzer();
    const packets = analyzer.analyzePackets(new Uint8Array(1024));
    expect(packets.length).toBeGreaterThan(0);
    expect(packets[0]!.frameNumber).toBe(1);
    expect(packets[0]!.protocol).toBeTruthy();
  });

  it('returns empty for small pcap', () => {
    const analyzer = new NetworkAnalyzer();
    expect(analyzer.analyzePackets(new Uint8Array(16))).toEqual([]);
  });

  it('extracts flows', () => {
    const analyzer = new NetworkAnalyzer();
    const flows = analyzer.extractFlows(new Uint8Array(1024));
    expect(flows.length).toBeGreaterThan(0);
    expect(flows[0]!.applicationProtocol).toBeTruthy();
    expect(flows[0]!.packets).toBeGreaterThan(0);
  });

  it('extracts DNS queries', () => {
    const analyzer = new NetworkAnalyzer();
    const queries = analyzer.extractDnsQueries(new Uint8Array(256));
    expect(queries.length).toBeGreaterThan(0);
    expect(queries[0]!.query).toBeTruthy();
    expect(queries[0]!.queryType).toBeTruthy();
  });

  it('returns empty DNS for empty pcap', () => {
    const analyzer = new NetworkAnalyzer();
    expect(analyzer.extractDnsQueries(new Uint8Array(0))).toEqual([]);
  });

  it('includes NXDOMAIN responses', () => {
    const analyzer = new NetworkAnalyzer();
    const queries = analyzer.extractDnsQueries(new Uint8Array(1024));
    const nxdomain = queries.filter((q) => q.responseCode === 'NXDOMAIN');
    expect(nxdomain.length).toBeGreaterThan(0);
  });

  it('extracts HTTP requests', () => {
    const analyzer = new NetworkAnalyzer();
    const requests = analyzer.extractHttpRequests(new Uint8Array(256));
    expect(requests.length).toBeGreaterThan(0);
    expect(requests[0]!.method).toBeTruthy();
    expect(requests[0]!.uri).toBeTruthy();
  });

  it('extracts TLS handshakes', () => {
    const analyzer = new NetworkAnalyzer();
    const handshakes = analyzer.extractTlsHandshakes(new Uint8Array(256));
    expect(handshakes.length).toBeGreaterThan(0);
    expect(handshakes[0]!.serverName).toContain('.');
    expect(handshakes[0]!.version).toMatch(/^TLSv1\.[23]$/);
  });

  it('returns empty TLS for empty pcap', () => {
    const analyzer = new NetworkAnalyzer();
    expect(analyzer.extractTlsHandshakes(new Uint8Array(0))).toEqual([]);
  });
});

describe('TimelineBuilder', () => {
  it('adds and retrieves events', () => {
    const tb = new TimelineBuilder();
    const ev = tb.addEvent({
      timestamp: new Date(),
      eventType: 'test.event',
      source: 'test',
      description: 'test event',
      severity: 'info',
      evidenceId: null,
      artifactId: null,
      tags: ['test'],
      metadata: {},
    });
    expect(tb.getEvent(ev.id)).toBeDefined();
    expect(ev.id).toMatch(/^tl-/);
  });

  it('lists events sorted by timestamp', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date('2024-01-03'), eventType: 'c', source: 's', description: 'event 3',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date('2024-01-01'), eventType: 'a', source: 's', description: 'event 1',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date('2024-01-02'), eventType: 'b', source: 's', description: 'event 2',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    const events = tb.listEvents();
    expect(events[0]!.description).toBe('event 1');
    expect(events[1]!.description).toBe('event 2');
    expect(events[2]!.description).toBe('event 3');
  });

  it('filters events by source', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date(), eventType: 't', source: 'src1', description: 'ev1',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date(), eventType: 't', source: 'src2', description: 'ev2',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    expect(tb.listEvents({ source: 'src1' }).length).toBe(1);
  });

  it('filters events by severity', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date(), eventType: 't', source: 's', description: 'ev1',
      severity: 'high', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date(), eventType: 't', source: 's', description: 'ev2',
      severity: 'low', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    expect(tb.listEvents({ severity: 'high' }).length).toBe(1);
  });

  it('filters by time range', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date('2024-06-01'), eventType: 't', source: 's', description: 'old',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date('2024-06-15'), eventType: 't', source: 's', description: 'mid',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date('2024-07-01'), eventType: 't', source: 's', description: 'new',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    expect(tb.listEvents({ startTime: new Date('2024-06-10'), endTime: new Date('2024-06-20') }).length).toBe(1);
  });

  it('limits event count', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date('2024-01-01'), eventType: 'a', source: 's', description: 'e1',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.addEvent({
      timestamp: new Date('2024-01-02'), eventType: 'b', source: 's', description: 'e2',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    expect(tb.listEvents({ limit: 1 }).length).toBe(1);
  });

  it('builds timeline from evidence', () => {
    const cm = new CaseManager();
    const c = cm.createCase('Test', 'a', 'org');
    const ev = cm.createEvidence(EvidenceType.PacketCapture, 'capture.pcap', 'Network capture', 1024);
    cm.addEvidence(c.id, ev);

    const tb = new TimelineBuilder();
    const tl = tb.buildFromEvidence(cm, ev.id);
    expect(tl.length).toBeGreaterThan(0);
    expect(tl[0]!.eventType).toBe('evidence.acquired');
  });

  it('builds memory-aware timeline', () => {
    const cm = new CaseManager();
    const c = cm.createCase('Test', 'a', 'org');
    const ev = cm.createEvidence(EvidenceType.MemoryDump, 'mem.dmp', 'Memory dump', 1024);
    cm.addEvidence(c.id, ev);

    const ma = new MemoryAnalyzer();
    const tb = new TimelineBuilder();
    const tl = tb.buildFromEvidence(cm, ev.id, ma);
    const processEvents = tl.filter((e) => e.eventType === 'memory.process');
    expect(processEvents.length).toBeGreaterThan(0);
  });

  it('returns empty for missing evidence', () => {
    const cm = new CaseManager();
    const tb = new TimelineBuilder();
    expect(tb.buildFromEvidence(cm, 'nonexistent' as never)).toEqual([]);
  });

  it('clears events', () => {
    const tb = new TimelineBuilder();
    tb.addEvent({
      timestamp: new Date(), eventType: 't', source: 's', description: 'e',
      severity: 'info', evidenceId: null, artifactId: null, tags: [], metadata: {},
    });
    tb.clear();
    expect(tb.listEvents().length).toBe(0);
  });
});

describe('IocManager', () => {
  it('adds and retrieves indicators', () => {
    const mgr = new IocManager();
    const ioc = mgr.add({
      type: IndicatorType.IpAddress,
      value: '203.0.113.50',
      description: 'Malicious C2 server',
      source: 'analysis',
      confidence: 0.9,
      severity: 'critical',
      lastSeen: new Date(),
      relatedIndicators: [],
      tags: ['c2', 'malware'],
      killChainPhase: 'command_and_control',
      mitreTechnique: 'T1071',
    });
    expect(mgr.get(ioc.id)).toBeDefined();
    expect(mgr.get(ioc.id)!.value).toBe('203.0.113.50');
  });

  it('lists indicators by type', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.IpAddress, value: '1.1.1.1', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    mgr.add({
      type: IndicatorType.Domain, value: 'evil.com', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.listByType(IndicatorType.IpAddress).length).toBe(1);
    expect(mgr.listByType(IndicatorType.Domain).length).toBe(1);
  });

  it('lists by severity', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.Hash, value: 'a', description: 'd', source: 's',
      confidence: 0.5, severity: 'critical', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.listBySeverity('critical').length).toBe(1);
  });

  it('lists by minimum confidence', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.Hash, value: 'a', description: 'd', source: 's',
      confidence: 0.9, severity: 'high', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    mgr.add({
      type: IndicatorType.Hash, value: 'b', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.listByConfidence(0.8).length).toBe(1);
  });

  it('searches by value', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.IpAddress, value: '203.0.113.50', description: 'C2 server', source: 's',
      confidence: 0.8, severity: 'high', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    const results = mgr.search('203.0');
    expect(results.length).toBe(1);
  });

  it('searches by description', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.Domain, value: 'evil.com', description: 'malicious domain for C2', source: 's',
      confidence: 0.8, severity: 'high', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    const results = mgr.search('malicious');
    expect(results.length).toBe(1);
  });

  it('relates two indicators', () => {
    const mgr = new IocManager();
    const a = mgr.add({
      type: IndicatorType.IpAddress, value: '1.1.1.1', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    const b = mgr.add({
      type: IndicatorType.Domain, value: 'evil.com', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.relate(a.id, b.id)).toBe(true);
    expect(mgr.get(a.id)!.relatedIndicators).toContain(b.id);
    expect(mgr.get(b.id)!.relatedIndicators).toContain(a.id);
  });

  it('removes indicator', () => {
    const mgr = new IocManager();
    const ioc = mgr.add({
      type: IndicatorType.Hash, value: 'abc', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.remove(ioc.id)).toBe(true);
    expect(mgr.get(ioc.id)).toBeUndefined();
  });

  it('creates IoCs from artifacts with IP', () => {
    const mgr = new IocManager();
    const art = {
      id: 'test-art' as never,
      category: ArtifactCategory.Network,
      type: 'connection',
      name: 'suspicious_connection',
      description: 'Connection to unknown host',
      discoveredAt: new Date(),
      sourceEvidence: 'ev-1' as never,
      relevance: 0.9,
      tags: ['suspicious'],
      raw: { ipAddress: '203.0.113.50', domain: 'evil.com', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    };
    const iocs = mgr.createFromArtifact(art);
    expect(iocs.length).toBe(3);
    expect(iocs.some((i) => i.type === IndicatorType.IpAddress)).toBe(true);
    expect(iocs.some((i) => i.type === IndicatorType.Domain)).toBe(true);
    expect(iocs.some((i) => i.type === IndicatorType.Hash)).toBe(true);
  });

  it('returns stats', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.IpAddress, value: '1.1.1.1', description: 'd', source: 's',
      confidence: 0.9, severity: 'critical', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    mgr.add({
      type: IndicatorType.Domain, value: 'evil.com', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.byType[IndicatorType.IpAddress]).toBe(1);
  });

  it('clears all indicators', () => {
    const mgr = new IocManager();
    mgr.add({
      type: IndicatorType.Hash, value: 'abc', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    mgr.clear();
    expect(mgr.list().length).toBe(0);
  });
});

describe('DFIRCoordinator', () => {
  it('coordinates full analysis', () => {
    const coord = new DFIRCoordinator();
    const c = coord.caseManager.createCase('Incident Response', 'analyst', 'Acme');
    const ev = coord.caseManager.createEvidence(
      EvidenceType.MemoryDump,
      'victim-pc.mem',
      'Memory dump from compromised workstation',
      1024,
    );
    coord.caseManager.addEvidence(c.id, ev);

    const analysis = coord.analyzeEvidence(ev.id);
    expect(analysis.processes.length).toBeGreaterThan(0);
    expect(analysis.modules.length).toBeGreaterThan(0);
    expect(analysis.connections.length).toBeGreaterThan(0);
    expect(analysis.timeline.length).toBeGreaterThan(0);
  });

  it('analyzes disk evidence', () => {
    const coord = new DFIRCoordinator();
    const c = coord.caseManager.createCase('Disk Analysis', 'a', 'org');
    const ev = coord.caseManager.createEvidence(
      EvidenceType.DiskImage,
      '/dev/sda1.dd',
      'Disk image of compromised server',
      2048,
    );
    coord.caseManager.addEvidence(c.id, ev);

    const analysis = coord.analyzeEvidence(ev.id);
    expect(analysis.fileEntries.length).toBeGreaterThan(0);
    expect(analysis.mftEntries.length).toBeGreaterThan(0);
  });

  it('analyzes network evidence', () => {
    const coord = new DFIRCoordinator();
    const c = coord.caseManager.createCase('Network Analysis', 'a', 'org');
    const ev = coord.caseManager.createEvidence(
      EvidenceType.PacketCapture,
      'traffic.pcap',
      'Network traffic capture',
      1024,
    );
    coord.caseManager.addEvidence(c.id, ev);

    const analysis = coord.analyzeEvidence(ev.id);
    expect(analysis.packets.length).toBeGreaterThan(0);
    expect(analysis.flows.length).toBeGreaterThan(0);
    expect(analysis.dnsQueries.length).toBeGreaterThan(0);
    expect(analysis.httpRequests.length).toBeGreaterThan(0);
  });

  it('builds enterprise timeline', () => {
    const coord = new DFIRCoordinator();
    const c = coord.caseManager.createCase('Multi-Evidence Case', 'a', 'org');
    const ev1 = coord.caseManager.createEvidence(EvidenceType.MemoryDump, 'mem.dmp', 'Memory dump', 512);
    const ev2 = coord.caseManager.createEvidence(EvidenceType.PacketCapture, 'net.pcap', 'Packet capture', 512);
    coord.caseManager.addEvidence(c.id, ev1);
    coord.caseManager.addEvidence(c.id, ev2);

    const et = coord.buildEnterpriseTimeline(c.id);
    expect(et.eventCount).toBeGreaterThan(0);
    expect(et.sources.length).toBeGreaterThan(0);
    expect(et.superTimeline.length).toBe(et.eventCount);
  });

  it('returns empty timeline for unknown case', () => {
    const coord = new DFIRCoordinator();
    const et = coord.buildEnterpriseTimeline('unknown' as never);
    expect(et.eventCount).toBe(0);
    expect(et.superTimeline).toEqual([]);
  });

  it('resets everything', () => {
    const coord = new DFIRCoordinator();
    coord.caseManager.createCase('Test', 'a', 'org');
    coord.reset();
    expect(coord.caseManager.listCases().length).toBe(0);
    expect(coord.timelineBuilder.listEvents().length).toBe(0);
    expect(coord.iocManager.list().length).toBe(0);
  });
});

describe('Evidence lifecycle', () => {
  it('transitions through statuses', () => {
    const mgr = new CaseManager();
    const ev = mgr.createEvidence(EvidenceType.MemoryDump, 'src', 'test evidence');
    expect(ev.status).toBe(EvidenceStatus.Pending);
    mgr.updateEvidence(ev.id, { status: EvidenceStatus.Acquiring });
    expect(mgr.getEvidence(ev.id)!.status).toBe(EvidenceStatus.Acquiring);
    mgr.updateEvidence(ev.id, { status: EvidenceStatus.Acquired });
    expect(mgr.getEvidence(ev.id)!.status).toBe(EvidenceStatus.Acquired);
    mgr.updateEvidence(ev.id, { status: EvidenceStatus.Analyzing });
    expect(mgr.getEvidence(ev.id)!.status).toBe(EvidenceStatus.Analyzing);
    mgr.updateEvidence(ev.id, { status: EvidenceStatus.Analyzed });
    expect(mgr.getEvidence(ev.id)!.status).toBe(EvidenceStatus.Analyzed);
    mgr.updateEvidence(ev.id, { status: EvidenceStatus.Failed });
    expect(mgr.getEvidence(ev.id)!.status).toBe(EvidenceStatus.Failed);
  });
});

describe('MemoryAnalyzer edge cases', () => {
  it('handles various memory region protections', () => {
    const analyzer = new MemoryAnalyzer();
    const regions = analyzer.scanMemoryRegions(new Uint8Array(1024 * 5));
    const protTypes = regions.map((r) => r.protection);
    expect(protTypes).toContain(MemoryRegionProtection.Read);
    expect(protTypes).toContain(MemoryRegionProtection.ReadWrite);
    expect(protTypes).toContain(MemoryRegionProtection.ReadExecute);
  });

  it('marks executable and writable regions correctly', () => {
    const analyzer = new MemoryAnalyzer();
    const regions = analyzer.scanMemoryRegions(new Uint8Array(1024 * 6));
    const rwRegions = regions.filter((r) => r.isWritable);
    const rxRegions = regions.filter((r) => r.isExecutable);
    expect(rwRegions.length).toBeGreaterThan(0);
    expect(rxRegions.length).toBeGreaterThan(0);
  });
});

describe('DiskAnalyzer MBR edge cases', () => {
  it('handles all zeros MBR', () => {
    const analyzer = new DiskAnalyzer();
    const partitions = analyzer.analyzePartitions(new Uint8Array(512));
    expect(partitions).toEqual([]);
  });

  it('detects bootable partition', () => {
    const analyzer = new DiskAnalyzer();
    const mbr = new Uint8Array(512);
    mbr[446] = 0x80;
    mbr[450] = 0x07;
    mbr[454] = 0x00; mbr[455] = 0x00; mbr[456] = 0x00; mbr[457] = 0x00;
    mbr[458] = 0x00; mbr[459] = 0x00; mbr[460] = 0x00; mbr[461] = 0x00;
    const partitions = analyzer.analyzePartitions(mbr);
    expect(partitions.length).toBeGreaterThan(0);
    expect(partitions[0]!.isBootable).toBe(true);
  });
});

describe('NetworkAnalyzer protocol variety', () => {
  it('includes multiple protocols in packet list', () => {
    const analyzer = new NetworkAnalyzer();
    const packets = analyzer.analyzePackets(new Uint8Array(1024));
    const protocols = new Set(packets.map((p) => p.protocol));
    expect(protocols.size).toBeGreaterThan(1);
  });

  it('includes various HTTP status codes', () => {
    const analyzer = new NetworkAnalyzer();
    const requests = analyzer.extractHttpRequests(new Uint8Array(1024));
    const statuses = new Set(requests.map((r) => r.statusCode));
    expect(statuses.has(200)).toBe(true);
    expect(statuses.has(404)).toBe(true);
  });
});

describe('IocManager relate edge cases', () => {
  it('returns false for non-existent source', () => {
    const mgr = new IocManager();
    const b = mgr.add({
      type: IndicatorType.Hash, value: 'abc', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.relate('nonexistent' as never, b.id)).toBe(false);
  });

  it('returns false for non-existent target', () => {
    const mgr = new IocManager();
    const a = mgr.add({
      type: IndicatorType.Hash, value: 'abc', description: 'd', source: 's',
      confidence: 0.5, severity: 'low', lastSeen: new Date(), relatedIndicators: [],
      tags: [], killChainPhase: 'r', mitreTechnique: 'T1',
    });
    expect(mgr.relate(a.id, 'nonexistent' as never)).toBe(false);
  });

  it('creates empty indicators from artifact without raw data', () => {
    const mgr = new IocManager();
    const art = {
      id: 'test-art' as never,
      category: ArtifactCategory.Log,
      type: 'event',
      name: 'windows_event',
      description: 'Event log entry',
      discoveredAt: new Date(),
      sourceEvidence: 'ev-1' as never,
      relevance: 0.5,
      tags: [],
      raw: {},
    };
    const iocs = mgr.createFromArtifact(art);
    expect(iocs).toEqual([]);
  });
});
