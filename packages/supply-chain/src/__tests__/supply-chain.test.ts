import { describe, it, expect } from 'vitest';
import {
  SupplyChainCoordinator, createDefaultSupplyChainEnvironment,
  SbomManager, VulnerabilityManager, AttestationManager,
  SoftwareCompositionAnalyzer, ScorecardManager, BuildManager,
  SupplyChainPolicyManager,
  PackageEcosystem, DependencyType, VulnerabilitySeverity,
  SbomFormat, SlsaLevel, AttestationType, PackageStatus,
  AttackVector, ScorecardCheck, BuildSystem, CveStatus,
  sbomId, packageId, vulnerabilityId, attestationId,
  provenanceId, sigstoreEntryId, dependencyId, buildId,
  policyId, scorecardId,
  createPackage, createDependency, createVulnerability,
  createSbom, createProvenance, createAttestation,
  createSigstoreEntry, createBuildRecord,
  createScorecardResult, createScorecardCheck,
  createSupplyChainPolicy,
  getKnownSupplyChainThreats,
  getSlsaLevelRequirements,
  cvssToSeverity, severityLabel,
} from '../index';

describe('Branded IDs', () => {
  it('generates with correct prefixes', () => {
    expect(sbomId()).toMatch(/^sbom-/);
    expect(packageId()).toMatch(/^pkg-/);
    expect(vulnerabilityId()).toMatch(/^vuln-/);
    expect(attestationId()).toMatch(/^att-/);
    expect(provenanceId()).toMatch(/^prov-/);
    expect(sigstoreEntryId()).toMatch(/^sig-/);
    expect(dependencyId()).toMatch(/^dep-/);
    expect(buildId()).toMatch(/^bld-/);
    expect(policyId()).toMatch(/^spol-/);
    expect(scorecardId()).toMatch(/^scrd-/);
  });

  it('generates unique values', () => {
    expect(new Set(Array.from({ length: 10 }, () => sbomId())).size).toBe(10);
  });
});

describe('SbomManager', () => {
  let manager: SbomManager;

  beforeEach(() => {
    manager = new SbomManager();
  });

  it('generates SBOM from packages and deps', () => {
    const pkg = createPackage('my-app', '1.0.0', PackageEcosystem.npm);
    const dep = createDependency('express', '4.18.2', PackageEcosystem.npm, DependencyType.Direct);

    const sbom = manager.generate('my-app', [pkg], [dep], SbomFormat.SPDX_2_3);
    expect(sbom.name).toBe('my-app');
    expect(sbom.format).toBe(SbomFormat.SPDX_2_3);
    expect(sbom.relationships).toHaveLength(1);
    expect(manager.list()).toHaveLength(1);
  });

  it('lists SBOMs by format', () => {
    manager.generate('a', [], [], SbomFormat.SPDX_2_3);
    manager.generate('b', [], [], SbomFormat.CycloneDX_1_5);
    expect(manager.listByFormat(SbomFormat.SPDX_2_3)).toHaveLength(1);
  });

  it('validates SBOM', () => {
    const sbom = createSbom('test');
    expect(manager.validate(sbom)).toHaveLength(1);
  });

  it('returns valid for complete SBOM', () => {
    const sbom = createSbom('test', SbomFormat.SPDX_2_3, {
      packages: [createPackage('a', '1.0.0', PackageEcosystem.npm)],
    });
    expect(manager.validate(sbom)).toHaveLength(0);
  });
});

describe('VulnerabilityManager', () => {
  let manager: VulnerabilityManager;

  beforeEach(() => {
    manager = new VulnerabilityManager();
  });

  it('registers and finds by CVE', () => {
    const vuln = createVulnerability('CVE-2021-44228', VulnerabilitySeverity.Critical, 'Log4Shell');
    manager.register(vuln);
    expect(manager.findByCve('cve-2021-44228')).toBeDefined();
    expect(manager.findByCve('CVE-2021-44228')!.severity).toBe(VulnerabilitySeverity.Critical);
  });

  it('filters by severity', () => {
    manager.register(createVulnerability('CVE-2024-001', VulnerabilitySeverity.Critical, 'c1'));
    manager.register(createVulnerability('CVE-2024-002', VulnerabilitySeverity.High, 'h1'));
    expect(manager.listBySeverity(VulnerabilitySeverity.Critical)).toHaveLength(1);
    expect(manager.listBySeverity(VulnerabilitySeverity.High)).toHaveLength(1);
  });

  it('lists exploited vulnerabilities', () => {
    manager.register(createVulnerability('CVE-2024-001', VulnerabilitySeverity.Critical, 'c1', { knownExploited: true }));
    manager.register(createVulnerability('CVE-2024-002', VulnerabilitySeverity.High, 'h1', { knownExploited: false }));
    expect(manager.listExploited()).toHaveLength(1);
  });

  it('removes by ID', () => {
    const v = createVulnerability('CVE-2024-001', VulnerabilitySeverity.Critical, 'test');
    manager.register(v);
    expect(manager.remove(v.id)).toBe(true);
    expect(manager.list()).toHaveLength(0);
  });
});

describe('AttestationManager', () => {
  let manager: AttestationManager;

  beforeEach(() => {
    manager = new AttestationManager();
  });

  it('manages attestations', () => {
    const att = createAttestation(AttestationType.Build, 'app@1.0', 'sha256:abc', 'https://slsa.dev/provenance/v1');
    manager.addAttestation(att);
    expect(manager.listAttestations()).toHaveLength(1);
    expect(manager.listAttestationsByType(AttestationType.Build)).toHaveLength(1);
  });

  it('manages provenances', () => {
    const prov = createProvenance('https://slsa.dev/provenance/v1', 'builder-id', SlsaLevel.SLSA_3);
    manager.addProvenance(prov);
    expect(manager.listProvenances()).toHaveLength(1);
    expect(manager.listProvenancesByLevel(SlsaLevel.SLSA_3)).toHaveLength(1);
  });

  it('manages sigstore entries', () => {
    const entry = createSigstoreEntry('hashedrekord', '{}');
    manager.addSigstoreEntry(entry);
    expect(manager.listSigstoreEntries()).toHaveLength(1);
  });
});

describe('SoftwareCompositionAnalyzer', () => {
  let analyzer: SoftwareCompositionAnalyzer;

  beforeEach(() => {
    analyzer = new SoftwareCompositionAnalyzer();
  });

  it('manages packages', () => {
    const pkg = createPackage('express', '4.18.2', PackageEcosystem.npm);
    analyzer.addPackage(pkg);
    expect(analyzer.listPackages()).toHaveLength(1);
  });

  it('manages dependencies', () => {
    const dep = createDependency('lodash', '4.17.21', PackageEcosystem.npm);
    analyzer.addDependency(dep);
    expect(analyzer.listDependencies()).toHaveLength(1);
  });

  it('detects typosquatting', () => {
    const suspects = analyzer.detectTyposquatting('crossenv', ['cross-env', 'crossenv', 'express']);
    expect(suspects).toContain('cross-env');
  });

  it('detects dependency confusion', () => {
    expect(analyzer.detectDependencyConfusion('internal-pkg', ['internal-pkg', 'other'])).toBe(true);
    expect(analyzer.detectDependencyConfusion('safe-pkg', ['internal-pkg'])).toBe(false);
  });
});

describe('ScorecardManager', () => {
  let manager: ScorecardManager;

  beforeEach(() => {
    manager = new ScorecardManager();
  });

  it('adds and lists results', () => {
    const r = createScorecardResult('my-app', PackageEcosystem.npm, '1.0.0', 8.5);
    manager.add(r);
    expect(manager.list()).toHaveLength(1);
  });

  it('filters by minimum score', () => {
    manager.add(createScorecardResult('a', PackageEcosystem.npm, '1.0.0', 9.0));
    manager.add(createScorecardResult('b', PackageEcosystem.npm, '1.0.0', 5.0));
    expect(manager.listByScore(7)).toHaveLength(1);
  });

  it('calculates average score', () => {
    manager.add(createScorecardResult('a', PackageEcosystem.npm, '1.0.0', 8.0));
    manager.add(createScorecardResult('b', PackageEcosystem.npm, '1.0.0', 10.0));
    expect(manager.getAverageScore()).toBe(9.0);
  });
});

describe('BuildManager', () => {
  let manager: BuildManager;

  beforeEach(() => {
    manager = new BuildManager();
  });

  it('creates and tracks builds', () => {
    const build = manager.create('https://github.com/owner/repo', 'abc123');
    expect(build.status).toBe('passed');
    expect(manager.list()).toHaveLength(1);
  });

  it('sets build status', () => {
    const build = manager.create('https://github.com/owner/repo', 'abc123');
    manager.setStatus(build.id, 'running');
    expect(manager.get(build.id)!.status).toBe('running');
  });

  it('filters by status', () => {
    const b1 = manager.create('a', 'abc');
    const b2 = manager.create('b', 'def');
    manager.setStatus(b2.id, 'running');
    expect(manager.listByStatus('running')).toHaveLength(1);
  });
});

describe('SupplyChainPolicyManager', () => {
  let manager: SupplyChainPolicyManager;

  beforeEach(() => {
    manager = new SupplyChainPolicyManager();
  });

  it('manages policies', () => {
    const policy = createSupplyChainPolicy('DepPolicy', 'Policy desc', []);
    manager.add(policy);
    expect(manager.list()).toHaveLength(1);
  });

  it('evaluates deny rules', () => {
    const policy = createSupplyChainPolicy('DenyCritical', 'Deny critical vulns', [
      { type: 'vulnerability', resource: 'CVE-.*', condition: 'critical', effect: 'deny', priority: 1 },
    ]);
    manager.add(policy);

    const result = manager.evaluate(policy.id, 'CVE-2024-001', 'vulnerability');
    expect(result.allowed).toBe(false);
    expect(result.matchedRules).toHaveLength(1);
  });

  it('allows when no rules match', () => {
    const policy = createSupplyChainPolicy('AllowAll', 'Allow all', [
      { type: 'dependency', resource: 'express', condition: 'ok', effect: 'deny', priority: 1 },
    ]);
    manager.add(policy);

    const result = manager.evaluate(policy.id, 'lodash', 'dependency');
    expect(result.allowed).toBe(true);
    expect(result.matchedRules).toHaveLength(0);
  });
});

describe('Known supply chain threats', () => {
  it('includes all attack vectors', () => {
    const threats = getKnownSupplyChainThreats();
    expect(threats.length).toBe(9);

    const vectors = threats.map((t) => t.vector);
    expect(vectors).toContain(AttackVector.DependencyConfusion);
    expect(vectors).toContain(AttackVector.Typosquatting);
    expect(vectors).toContain(AttackVector.MaliciousPackage);
    expect(vectors).toContain(AttackVector.CompromisedMaintainer);
    expect(vectors).toContain(AttackVector.BuildTampering);
    expect(vectors).toContain(AttackVector.Protestware);
  });

  it('each threat has mitigations', () => {
    for (const threat of getKnownSupplyChainThreats()) {
      expect(threat.mitigation.length).toBeGreaterThan(0);
      expect(threat.examples.length).toBeGreaterThan(0);
    }
  });
});

describe('SLSA levels', () => {
  it('SLSA 1 has basic requirements', () => {
    const reqs = getSlsaLevelRequirements(SlsaLevel.SLSA_1);
    expect(reqs).toHaveLength(3);
    expect(reqs[0]).toContain('scripted');
  });

  it('SLSA 4 has the most requirements', () => {
    const reqs = getSlsaLevelRequirements(SlsaLevel.SLSA_4);
    expect(reqs.length).toBeGreaterThan(3);
    expect(reqs.some((r) => r.includes('two-person'))).toBe(true);
  });
});

describe('CVSS utilities', () => {
  it('maps scores to severity', () => {
    expect(cvssToSeverity(9.5)).toBe(VulnerabilitySeverity.Critical);
    expect(cvssToSeverity(7.5)).toBe(VulnerabilitySeverity.High);
    expect(cvssToSeverity(5.5)).toBe(VulnerabilitySeverity.Medium);
    expect(cvssToSeverity(2.5)).toBe(VulnerabilitySeverity.Low);
    expect(cvssToSeverity(0)).toBe(VulnerabilitySeverity.None);
  });

  it('returns severity labels', () => {
    expect(severityLabel(VulnerabilitySeverity.Critical)).toBe('Critical');
  });
});

describe('SupplyChainCoordinator', () => {
  it('initializes with empty state', () => {
    const coord = new SupplyChainCoordinator();
    const stats = coord.getStats();
    expect(stats.packages).toBe(0);
    expect(stats.threats).toBe(9);
  });

  it('gets known threats', () => {
    const coord = new SupplyChainCoordinator();
    expect(coord.getKnownThreats()).toHaveLength(9);
  });

  it('finds threat by vector', () => {
    const coord = new SupplyChainCoordinator();
    const threat = coord.getThreatByVector(AttackVector.DependencyConfusion);
    expect(threat).toBeDefined();
    expect(threat!.vector).toBe(AttackVector.DependencyConfusion);
  });

  it('resets state', () => {
    const coord = new SupplyChainCoordinator();
    coord.compositionAnalyzer.addPackage(createPackage('test', '1.0.0', PackageEcosystem.npm));
    coord.reset();
    expect(coord.getStats().packages).toBe(0);
  });
});

describe('createDefaultSupplyChainEnvironment', () => {
  it('creates a populated environment', () => {
    const env = createDefaultSupplyChainEnvironment();
    const stats = env.getStats();

    expect(stats.packages).toBeGreaterThanOrEqual(3);
    expect(stats.dependencies).toBeGreaterThanOrEqual(4);
    expect(stats.sboms).toBeGreaterThanOrEqual(1);
    expect(stats.vulnerabilities).toBeGreaterThanOrEqual(3);
    expect(stats.criticalVulnerabilities).toBeGreaterThanOrEqual(3);
    expect(stats.builds).toBeGreaterThanOrEqual(1);
    expect(stats.scorecards).toBeGreaterThanOrEqual(1);
    expect(stats.policies).toBeGreaterThanOrEqual(1);
    expect(stats.attestations).toBeGreaterThanOrEqual(1);
    expect(stats.provenances).toBeGreaterThanOrEqual(1);
    expect(stats.sigstoreEntries).toBeGreaterThanOrEqual(1);
    expect(stats.threats).toBe(9);
  });
});

describe('Factory functions', () => {
  it('creates a package', () => {
    const p = createPackage('express', '4.18.2', PackageEcosystem.npm);
    expect(p.ecosystem).toBe(PackageEcosystem.npm);
    expect(p.status).toBe(PackageStatus.Known);
  });

  it('creates a dependency', () => {
    const d = createDependency('lodash', '4.17.21', PackageEcosystem.npm, DependencyType.Direct);
    expect(d.integrity).toMatch(/^sha256-/);
  });

  it('creates a vulnerability', () => {
    const v = createVulnerability('CVE-2024-001', VulnerabilitySeverity.High, 'test');
    expect(v.epssScore).toBeGreaterThan(0);
    expect(v.status).toBe(CveStatus.Published);
  });

  it('creates an SBOM', () => {
    const s = createSbom('test-sbom', SbomFormat.CycloneDX_1_5);
    expect(s.format).toBe(SbomFormat.CycloneDX_1_5);
  });

  it('creates a provenance', () => {
    const p = createProvenance('https://slsa.dev/provenance/v1', 'builder', SlsaLevel.SLSA_3);
    expect(p.level).toBe(SlsaLevel.SLSA_3);
    expect(p.invocation.configSource).toContain('github.com');
  });

  it('creates an attestation', () => {
    const a = createAttestation(AttestationType.Signing, 'app@1.0', 'sha256:def', 'https://slsa.dev/provenance/v1');
    expect(a.subject).toHaveLength(1);
  });

  it('creates a sigstore entry', () => {
    const s = createSigstoreEntry('hashedrekord', '{}');
    expect(s.logIndex).toBeGreaterThanOrEqual(0);
    expect(s.logId).toMatch(/^0x/);
  });

  it('creates a build record', () => {
    const b = createBuildRecord('https://github.com/owner/repo', 'abc123', BuildSystem.GitLabCI);
    expect(b.system).toBe(BuildSystem.GitLabCI);
    expect(b.status).toBe('passed');
  });

  it('creates a scorecard result', () => {
    const s = createScorecardResult('my-app', PackageEcosystem.npm, '1.0.0', 8.0);
    expect(s.overallScore).toBe(8.0);
  });

  it('creates a scorecard check', () => {
    const c = createScorecardCheck(ScorecardCheck.CodeReview, 8, 'Good review practices');
    expect(c.documentation).toContain('ossf/scorecard');
  });

  it('creates a policy', () => {
    const p = createSupplyChainPolicy('Test Policy', 'Test description', []);
    expect(p.enabled).toBe(true);
  });
});
