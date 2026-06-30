import { uid } from '@cybersim/shared';

/* ── Branded IDs ── */

export type SbomId = string & { readonly __brand: unique symbol };
export type PackageId = string & { readonly __brand: unique symbol };
export type VulnerabilityId = string & { readonly __brand: unique symbol };
export type AttestationId = string & { readonly __brand: unique symbol };
export type ProvenanceId = string & { readonly __brand: unique symbol };
export type SigstoreEntryId = string & { readonly __brand: unique symbol };
export type DependencyId = string & { readonly __brand: unique symbol };
export type BuildId = string & { readonly __brand: unique symbol };
export type PolicyId = string & { readonly __brand: unique symbol };
export type ScorecardId = string & { readonly __brand: unique symbol };

export function sbomId(): SbomId { return `sbom-${uid()}` as SbomId; }
export function packageId(): PackageId { return `pkg-${uid()}` as PackageId; }
export function vulnerabilityId(): VulnerabilityId { return `vuln-${uid()}` as VulnerabilityId; }
export function attestationId(): AttestationId { return `att-${uid()}` as AttestationId; }
export function provenanceId(): ProvenanceId { return `prov-${uid()}` as ProvenanceId; }
export function sigstoreEntryId(): SigstoreEntryId { return `sig-${uid()}` as SigstoreEntryId; }
export function dependencyId(): DependencyId { return `dep-${uid()}` as DependencyId; }
export function buildId(): BuildId { return `bld-${uid()}` as BuildId; }
export function policyId(): PolicyId { return `spol-${uid()}` as PolicyId; }
export function scorecardId(): ScorecardId { return `scrd-${uid()}` as ScorecardId; }

/* ── Enums ── */

export enum SbomFormat {
  SPDX_2_3 = 'spdx_2_3',
  SPDX_3_0 = 'spdx_3_0',
  CycloneDX_1_4 = 'cyclonedx_1_4',
  CycloneDX_1_5 = 'cyclonedx_1_5',
  SWID = 'swid',
}

export enum PackageEcosystem {
  npm = 'npm',
  PyPI = 'pypi',
  Maven = 'maven',
  RubyGems = 'rubygems',
  Cargo = 'cargo',
  NuGet = 'nuget',
  Go = 'go',
  Docker = 'docker',
  APT = 'apt',
  RPM = 'rpm',
  Homebrew = 'homebrew',
  Composer = 'composer',
}

export enum VulnerabilitySeverity {
  None = 'none',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export enum SlsaLevel {
  SLSA_1 = 1,
  SLSA_2 = 2,
  SLSA_3 = 3,
  SLSA_4 = 4,
}

export enum AttestationType {
  Provenance = 'provenance',
  SBOM = 'sbom',
  VulnerabilityScan = 'vulnerability_scan',
  CodeReview = 'code_review',
  UnitTest = 'unit_test',
  IntegrationTest = 'integration_test',
  ContainerScan = 'container_scan',
  Signing = 'signing',
  PolicyEvaluation = 'policy_evaluation',
  Build = 'build',
  Source = 'source',
}

export enum DependencyType {
  Direct = 'direct',
  Transitive = 'transitive',
  Dev = 'dev',
  Optional = 'optional',
  Peer = 'peer',
  Bundled = 'bundled',
}

export enum AttackVector {
  DependencyConfusion = 'dependency_confusion',
  Typosquatting = 'typosquatting',
  RepoJacking = 'repo_jacking',
  MaliciousPackage = 'malicious_package',
  CompromisedMaintainer = 'compromised_maintainer',
  BuildTampering = 'build_tampering',
  CachePoisoning = 'cache_poisoning',
  ManifestConfusion = 'manifest_confusion',
  DependencyDeprivation = 'dependency_deprivation',
  Protestware = 'protestware',
}

export enum ScorecardCheck {
  BinaryArtifacts = 'binary_artifacts',
  BranchProtection = 'branch_protection',
  CI_Tests = 'ci_tests',
  CII_BestPractices = 'cii_best_practices',
  CodeReview = 'code_review',
  Contributors = 'contributors',
  DangerousWorkflow = 'dangerous_workflow',
  DependencyUpdateTool = 'dependency_update_tool',
  Fuzzing = 'fuzzing',
  License = 'license',
  Maintained = 'maintained',
  Packaging = 'packaging',
  PinnedDependencies = 'pinned_dependencies',
  SAST = 'sast',
  SecurityPolicy = 'security_policy',
  SignedReleases = 'signed_releases',
  SignedTags = 'signed_tags',
  TokenPermissions = 'token_permissions',
  TokenMinimal = 'token_minimal',
  Vulnerabilities = 'vulnerabilities',
}

export enum BuildSystem {
  GitHubActions = 'github_actions',
  GitLabCI = 'gitlab_ci',
  Jenkins = 'jenkins',
  CircleCI = 'circle_ci',
  TravisCI = 'travis_ci',
  Tekton = 'tekton',
  Buildkite = 'buildkite',
  DroneCI = 'drone_ci',
  AzurePipelines = 'azure_pipelines',
  Local = 'local',
}

export enum PackageStatus {
  Known = 'known',
  Suspicious = 'suspicious',
  Malicious = 'malicious',
  Quarantined = 'quarantined',
}

export enum CveStatus {
  Published = 'published',
  Reserved = 'reserved',
  Rejected = 'rejected',
  Disputed = 'disputed',
}

export enum ProvenanceLevel {
  BuildIdentity = 'build_identity',
  SourceIdentity = 'source_identity',
  DependencyIdentity = 'dependency_identity',
  None = 'none',
}

/* ── Interfaces ── */

export interface PackageInfo {
  id: PackageId;
  name: string;
  version: string;
  ecosystem: PackageEcosystem;
  description: string;
  author: string;
  homepage: string;
  repository: string;
  license: string;
  publishedAt: Date;
  downloads: number;
  status: PackageStatus;
  scorecard: ScorecardResult | null;
}

export interface Dependency {
  id: DependencyId;
  name: string;
  version: string;
  ecosystem: PackageEcosystem;
  type: DependencyType;
  optional: boolean;
  versionConstraint: string;
  resolvedVersion: string;
  integrity: string;
  vulnerabilities: VulnerabilityId[];
}

export interface SbomDocument {
  id: SbomId;
  format: SbomFormat;
  name: string;
  version: string;
  created: Date;
  creator: string;
  packages: PackageInfo[];
  dependencies: Dependency[];
  relationships: SbomRelationship[];
}

export interface SbomRelationship {
  source: string;
  target: string;
  type: string;
}

export interface Vulnerability {
  id: VulnerabilityId;
  cveId: string;
  severity: VulnerabilitySeverity;
  cvssScore: number;
  cvssVector: string;
  description: string;
  publishedAt: Date;
  affectedVersions: string[];
  fixedVersions: string[];
  references: string[];
  cweIds: string[];
  epssScore: number;
  epssPercentile: number;
  knownExploited: boolean;
  status: CveStatus;
}

export interface VulnerabilityScan {
  id: string;
  packageId: PackageId;
  vulnerabilities: Vulnerability[];
  scannedAt: Date;
  scanner: string;
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface SlsaProvenance {
  id: ProvenanceId;
  level: SlsaLevel;
  buildType: string;
  builderId: string;
  invocation: BuildInvocation;
  materials: BuildMaterial[];
  environment: Record<string, string>;
  metadata: Record<string, string>;
  generatedAt: Date;
}

export interface BuildInvocation {
  configSource: string;
  parameters: Record<string, string>;
  environment: Record<string, string>;
}

export interface BuildMaterial {
  uri: string;
  digest: string;
  algorithm: string;
}

export interface Attestation {
  id: AttestationId;
  type: AttestationType;
  predicateType: string;
  subject: AttestationSubject[];
  predicate: Record<string, unknown>;
  issuer: string;
  generatedAt: Date;
  expiresAt: Date | null;
  signature: string | null;
}

export interface AttestationSubject {
  name: string;
  digest: string;
  algorithm: string;
}

export interface SigstoreEntry {
  id: SigstoreEntryId;
  kind: string;
  signedEntryTimestamp: Date;
  body: string;
  integratedTime: Date;
  logIndex: number;
  logId: string;
  attestation: Attestation | null;
}

export interface BuildRecord {
  id: BuildId;
  system: BuildSystem;
  repository: string;
  commitSha: string;
  branch: string;
  tag: string | null;
  trigger: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt: Date | null;
  duration: number;
  pipeline: string;
  workflow: string;
  artifacts: BuildArtifact[];
  attestations: AttestationId[];
  provenance: ProvenanceId | null;
  logs: string;
}

export interface BuildArtifact {
  name: string;
  type: string;
  uri: string;
  digest: string;
  algorithm: string;
  size: number;
}

export interface ScorecardResult {
  id: ScorecardId;
  packageName: string;
  ecosystem: PackageEcosystem;
  version: string;
  overallScore: number;
  checks: ScorecardCheckResult[];
  date: Date;
  repo: string;
  commit: string;
}

export interface ScorecardCheckResult {
  check: ScorecardCheck;
  score: number;
  reason: string;
  details: string[];
  documentation: string;
}

export interface SupplyChainThreat {
  vector: AttackVector;
  name: string;
  description: string;
  likelihood: number;
  impact: number;
  severity: VulnerabilitySeverity;
  mitigation: string[];
  examples: string[];
}

export interface SupplyChainPolicy {
  id: PolicyId;
  name: string;
  description: string;
  rules: PolicyRule[];
  enabled: boolean;
  created: Date;
  updated: Date;
}

export interface PolicyRule {
  type: string;
  resource: string;
  condition: string;
  effect: 'allow' | 'deny' | 'warn';
  priority: number;
}

export interface SupplyChainStats {
  packages: number;
  dependencies: number;
  directDependencies: number;
  transitiveDependencies: number;
  sboms: number;
  attestations: number;
  provenances: number;
  sigstoreEntries: number;
  vulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  builds: number;
  passedBuilds: number;
  failedBuilds: number;
  scorecards: number;
  policies: number;
  threats: number;
}

/* ── Known Supply Chain Threats ── */

export function getKnownSupplyChainThreats(): SupplyChainThreat[] {
  return [
    {
      vector: AttackVector.DependencyConfusion,
      name: 'Dependency Confusion',
      description: 'Attacker publishes a package with the same name as an internal/private package to a public registry. Build tools resolve to the public (malicious) version when internal registry is not configured first.',
      likelihood: 8,
      impact: 9,
      severity: VulnerabilitySeverity.Critical,
      mitigation: [
        'Configure package manager to use private registry first',
        'Reserve package names in public registries',
        'Pin dependency versions with integrity hashes',
        'Use namespace scoping for internal packages (e.g., @company/pkg)',
      ],
      examples: ['2021 Dependency Confusion attacks (npm, PyPI, RubyGems)', 'Ubiquiti breach via dependency confusion'],
    },
    {
      vector: AttackVector.Typosquatting,
      name: 'Typosquatting',
      description: 'Attacker publishes packages with names that are slight misspellings of popular packages (e.g., crossenv instead of cross-env).',
      likelihood: 7,
      impact: 8,
      severity: VulnerabilitySeverity.High,
      mitigation: [
        'Use package allowlisting and denylisting',
        'Review package names before installation',
        'Use automated typo-squatting detection tools',
        'Enable package signatures and verification',
      ],
      examples: ['event-stream (npm) backdoor', 'ctx/electerm typosquatting'],
    },
    {
      vector: AttackVector.RepoJacking,
      name: 'Repository Hijacking / Repo Jacking',
      description: 'When a GitHub user or organization renames their account, an attacker registers the old name and creates malicious releases that existing dependents may pick up.',
      likelihood: 4,
      impact: 7,
      severity: VulnerabilitySeverity.High,
      mitigation: [
        'Use organization-specific package registries',
        'Monitor for account rename-based hijacking',
        'Reference packages by immutable IDs where possible',
      ],
      examples: ['GitHub username reuse attacks', 'NPM package hijack after org rename'],
    },
    {
      vector: AttackVector.MaliciousPackage,
      name: 'Malicious Package Injection',
      description: 'Attacker publishes a package containing malicious code (data exfiltration, backdoor, crypto miner) that executes during installation or runtime.',
      likelihood: 6,
      impact: 9,
      severity: VulnerabilitySeverity.Critical,
      mitigation: [
        'Scan all dependencies with security tools',
        'Use runtime package monitoring',
        'Enable code signing and verification',
        'Audit dependency licenses and maintainers',
      ],
      examples: ['colors.js/faker.js protestware', 'node-ipc protestware', 'ua-parser-js malware'],
    },
    {
      vector: AttackVector.CompromisedMaintainer,
      name: 'Compromised Maintainer / Account Takeover',
      description: 'Attacker compromises a package maintainer account (via phishing, credential theft, social engineering) and pushes malicious updates.',
      likelihood: 5,
      impact: 10,
      severity: VulnerabilitySeverity.Critical,
      mitigation: [
        'Enable MFA on all registry accounts',
        'Use package signing (Sigstore, PGP)',
        'Implement security contact and disclosure policy',
        'Require multi-party review for package releases',
      ],
      examples: ['eslint-scope compromise', 'PHP backdoor via compromised maintainer', 'Codecov breach'],
    },
    {
      vector: AttackVector.BuildTampering,
      name: 'Build Pipeline Tampering',
      description: 'Attacker gains access to CI/CD pipeline and modifies build scripts, injects malicious code, or alters artifacts before distribution.',
      likelihood: 4,
      impact: 10,
      severity: VulnerabilitySeverity.Critical,
      mitigation: [
        'Use SLSA provenance generation',
        'Implement build attestation (in-toto)',
        'Sign artifacts with Sigstore/Cosign',
        'Audit CI/CD pipeline configurations',
        'Use ephemeral build environments',
      ],
      examples: ['SolarWinds build pipeline compromise', 'Codecov Bash Uploader compromise', 'PHP PEAR hack'],
    },
    {
      vector: AttackVector.CachePoisoning,
      name: 'Cache Poisoning / Dependency Confusion in CI',
      description: 'Attacker poisons build cache artifacts or intermediate layers so that subsequent builds use tampered dependencies.',
      likelihood: 3,
      impact: 8,
      severity: VulnerabilitySeverity.High,
      mitigation: [
        'Use build cache isolation',
        'Pin and verify all cached artifacts',
        'Use content-addressed caching',
        'Implement cache invalidation on dependency change',
      ],
      examples: ['Docker image cache poisoning', 'npm cache injection'],
    },
    {
      vector: AttackVector.ManifestConfusion,
      name: 'Manifest Confusion',
      description: 'Attacker exploits differences between package manifest files and the actually published artifacts to execute unintended code.',
      likelihood: 4,
      impact: 6,
      severity: VulnerabilitySeverity.Medium,
      mitigation: [
        'Verify package integrity after publication',
        'Use lockfiles that pin exact versions and hashes',
        'Implement automatic manifest validation',
      ],
      examples: ['manifest confusion in npm packages', 'RubyGems manifest mismatch'],
    },
    {
      vector: AttackVector.Protestware,
      name: 'Protestware / Sabotage',
      description: 'Maintainer intentionally introduces malicious or destructive code to protest political/social issues, often through dependency updates.',
      likelihood: 3,
      impact: 7,
      severity: VulnerabilitySeverity.High,
      mitigation: [
        'Pin versions and review updates',
        'Mirror packages after security review',
        'Monitor package behavior changes',
        'Use software composition analysis (SCA)',
      ],
      examples: ['colors.js 1.4.1 → 1.4.44 loop-sleep', 'node-ipc data-wiper protestware', 'peacenotwar protest module'],
    },
  ];
}

/* ── SLSA Level Requirements ── */

export function getSlsaLevelRequirements(level: SlsaLevel): string[] {
  switch (level) {
    case SlsaLevel.SLSA_1:
      return ['Build process is scripted and automated', 'Provenance is generated', 'Provenance is available to consumers'];
    case SlsaLevel.SLSA_2:
      return ['All SLSA 1 requirements', 'Version control is used', 'Build is run on a hosted/build service', 'Provenance is generated by the build service with some authentication'];
    case SlsaLevel.SLSA_3:
      return ['All SLSA 2 requirements', 'Build service is hardened (non-falsifiable provenance)', 'Build runs in an isolated environment', 'Provenance includes all source and dependency references', 'Build parameters are immutable'];
    case SlsaLevel.SLSA_4:
      return ['All SLSA 3 requirements', 'Build is two-person reviewed', 'Provenance is generated with hermetic and reproducible builds', 'All dependencies are enumerated with provenance', 'Build runs with minimal permissions (least privilege)'];
  }
}

/* ── Scorecard Check Weights ── */

const SCORECARD_WEIGHTS: Record<ScorecardCheck, number> = {
  [ScorecardCheck.BinaryArtifacts]: 5,
  [ScorecardCheck.BranchProtection]: 6,
  [ScorecardCheck.CI_Tests]: 6,
  [ScorecardCheck.CII_BestPractices]: 3,
  [ScorecardCheck.CodeReview]: 8,
  [ScorecardCheck.Contributors]: 2,
  [ScorecardCheck.DangerousWorkflow]: 7,
  [ScorecardCheck.DependencyUpdateTool]: 6,
  [ScorecardCheck.Fuzzing]: 4,
  [ScorecardCheck.License]: 3,
  [ScorecardCheck.Maintained]: 7,
  [ScorecardCheck.Packaging]: 4,
  [ScorecardCheck.PinnedDependencies]: 8,
  [ScorecardCheck.SAST]: 5,
  [ScorecardCheck.SecurityPolicy]: 5,
  [ScorecardCheck.SignedReleases]: 7,
  [ScorecardCheck.SignedTags]: 4,
  [ScorecardCheck.TokenPermissions]: 6,
  [ScorecardCheck.TokenMinimal]: 5,
  [ScorecardCheck.Vulnerabilities]: 8,
};

/* ── CVSS Severity Mapping ── */

export function cvssToSeverity(score: number): VulnerabilitySeverity {
  if (score >= 9.0) return VulnerabilitySeverity.Critical;
  if (score >= 7.0) return VulnerabilitySeverity.High;
  if (score >= 4.0) return VulnerabilitySeverity.Medium;
  if (score >= 0.1) return VulnerabilitySeverity.Low;
  return VulnerabilitySeverity.None;
}

export function severityLabel(severity: VulnerabilitySeverity): string {
  const labels: Record<VulnerabilitySeverity, string> = {
    [VulnerabilitySeverity.None]: 'None',
    [VulnerabilitySeverity.Low]: 'Low',
    [VulnerabilitySeverity.Medium]: 'Medium',
    [VulnerabilitySeverity.High]: 'High',
    [VulnerabilitySeverity.Critical]: 'Critical',
  };
  return labels[severity];
}

/* ── Factory Functions ── */

export function createPackage(
  name: string,
  version: string,
  ecosystem: PackageEcosystem,
  overrides?: Partial<PackageInfo>,
): PackageInfo {
  return {
    id: packageId(),
    name,
    version,
    ecosystem,
    description: `${name} package`,
    author: 'unknown',
    homepage: '',
    repository: '',
    license: 'MIT',
    publishedAt: new Date(),
    downloads: 0,
    status: PackageStatus.Known,
    scorecard: null,
    ...overrides,
  };
}

export function createDependency(
  name: string,
  version: string,
  ecosystem: PackageEcosystem,
  type: DependencyType = DependencyType.Direct,
  overrides?: Partial<Dependency>,
): Dependency {
  return {
    id: dependencyId(),
    name,
    version,
    ecosystem,
    type,
    optional: type === DependencyType.Optional,
    versionConstraint: `^${version}`,
    resolvedVersion: version,
    integrity: `sha256-${Math.random().toString(36).slice(2, 42)}`,
    vulnerabilities: [],
    ...overrides,
  };
}

export function createVulnerability(
  cveId: string,
  severity: VulnerabilitySeverity,
  description: string,
  overrides?: Partial<Vulnerability>,
): Vulnerability {
  const cvssBase = severity === VulnerabilitySeverity.Critical ? 9.5 : severity === VulnerabilitySeverity.High ? 7.5 : severity === VulnerabilitySeverity.Medium ? 5.5 : severity === VulnerabilitySeverity.Low ? 2.5 : 0;
  return {
    id: vulnerabilityId(),
    cveId,
    severity,
    cvssScore: cvssBase,
    cvssVector: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`,
    description,
    publishedAt: new Date(),
    affectedVersions: ['< 1.0.0'],
    fixedVersions: ['1.0.0'],
    references: [],
    cweIds: [],
    epssScore: 0.5,
    epssPercentile: 0.8,
    knownExploited: false,
    status: CveStatus.Published,
    ...overrides,
  };
}

export function createSbom(
  name: string,
  format: SbomFormat = SbomFormat.SPDX_2_3,
  overrides?: Partial<SbomDocument>,
): SbomDocument {
  return {
    id: sbomId(),
    format,
    name,
    version: '1.0',
    created: new Date(),
    creator: 'Cybersim SBOM Generator 1.0',
    packages: [],
    dependencies: [],
    relationships: [],
    ...overrides,
  };
}

export function createProvenance(
  buildType: string,
  builderId: string,
  level: SlsaLevel = SlsaLevel.SLSA_2,
): SlsaProvenance {
  return {
    id: provenanceId(),
    level,
    buildType,
    builderId,
    invocation: {
      configSource: 'https://github.com/owner/repo/.github/workflows/build.yml',
      parameters: {},
      environment: { OS: 'ubuntu-latest' },
    },
    materials: [],
    environment: {},
    metadata: {},
    generatedAt: new Date(),
  };
}

export function createAttestation(
  type: AttestationType,
  subjectName: string,
  subjectDigest: string,
  predicateType: string,
  predicate: Record<string, unknown> = {},
): Attestation {
  return {
    id: attestationId(),
    type,
    predicateType,
    subject: [{ name: subjectName, digest: subjectDigest, algorithm: 'sha256' }],
    predicate,
    issuer: 'https://github.com/owner/repo/.github/workflows/build.yml',
    generatedAt: new Date(),
    expiresAt: null,
    signature: null,
  };
}

export function createSigstoreEntry(
  kind: string,
  body: string,
  overrides?: Partial<SigstoreEntry>,
): SigstoreEntry {
  return {
    id: sigstoreEntryId(),
    kind,
    signedEntryTimestamp: new Date(),
    body,
    integratedTime: new Date(),
    logIndex: Math.floor(Math.random() * 100000),
    logId: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    attestation: null,
    ...overrides,
  };
}

export function createBuildRecord(
  repository: string,
  commitSha: string,
  system: BuildSystem = BuildSystem.GitHubActions,
): BuildRecord {
  return {
    id: buildId(),
    system,
    repository,
    commitSha,
    branch: 'main',
    tag: null,
    trigger: 'push',
    status: 'passed',
    startedAt: new Date(),
    completedAt: new Date(),
    duration: 180,
    pipeline: 'ci.yml',
    workflow: 'CI',
    artifacts: [],
    attestations: [],
    provenance: null,
    logs: 'Build logs...',
  };
}

export function createScorecardResult(
  packageName: string,
  ecosystem: PackageEcosystem,
  version: string,
  overallScore: number,
  checks: ScorecardCheckResult[] = [],
): ScorecardResult {
  return {
    id: scorecardId(),
    packageName,
    ecosystem,
    version,
    overallScore,
    checks,
    date: new Date(),
    repo: `https://github.com/owner/${packageName}`,
    commit: 'abc123def456',
  };
}

export function createScorecardCheck(
  check: ScorecardCheck,
  score: number,
  reason: string,
  details: string[] = [],
): ScorecardCheckResult {
  return {
    check,
    score,
    reason,
    details,
    documentation: `https://github.com/ossf/scorecard/blob/main/docs/checks.md#${check}`,
  };
}

export function createSupplyChainPolicy(
  name: string,
  description: string,
  rules: PolicyRule[],
): SupplyChainPolicy {
  return {
    id: policyId(),
    name,
    description,
    rules,
    enabled: true,
    created: new Date(),
    updated: new Date(),
  };
}

/* ── SBOM Generator ── */

export class SbomManager {
  private sboms: Map<SbomId, SbomDocument> = new Map();

  generate(
    name: string,
    packages: PackageInfo[],
    dependencies: Dependency[],
    format: SbomFormat = SbomFormat.SPDX_2_3,
  ): SbomDocument {
    const pkgSet = new Set<string>();
    for (const dep of dependencies) {
      if (!packages.find((p) => p.name === dep.name)) {
        pkgSet.add(dep.name);
      }
    }
    const allPackages = [...packages];
    for (const pkgName of pkgSet) {
      allPackages.push(createPackage(pkgName, depVersion(pkgName, dependencies), PackageEcosystem.npm));
    }

    const relationships: SbomRelationship[] = dependencies
      .filter((d) => d.type === DependencyType.Direct)
      .map((d) => ({
        source: name,
        target: d.name,
        type: 'DEPENDS_ON',
      }));

    const sbom = createSbom(name, format, {
      packages: allPackages,
      dependencies,
      relationships,
    });
    this.sboms.set(sbom.id, sbom);
    return sbom;
  }

  get(id: SbomId): SbomDocument | undefined {
    return this.sboms.get(id);
  }

  list(): SbomDocument[] {
    return Array.from(this.sboms.values());
  }

  listByFormat(format: SbomFormat): SbomDocument[] {
    return this.list().filter((s) => s.format === format);
  }

  remove(id: SbomId): boolean {
    return this.sboms.delete(id);
  }

  validate(sbom: SbomDocument): string[] {
    const errors: string[] = [];
    if (!sbom.name) errors.push('SBOM name is required');
    if (sbom.packages.length === 0) errors.push('SBOM must contain at least one package');
    if (!sbom.creator) errors.push('SBOM creator is required');
    if (sbom.dependencies.length > 0 && sbom.packages.length === 0) errors.push('SBOM has dependencies but no packages');
    return errors;
  }

  getStats(): { total: number; byFormat: Record<string, number> } {
    const byFormat: Record<string, number> = {};
    for (const sbom of this.sboms.values()) {
      byFormat[sbom.format] = (byFormat[sbom.format] ?? 0) + 1;
    }
    return { total: this.sboms.size, byFormat };
  }

  clear(): void {
    this.sboms.clear();
  }
}

function depVersion(name: string, deps: Dependency[]): string {
  return deps.find((d) => d.name === name)?.version ?? '0.0.0';
}

/* ── Vulnerability Manager ── */

export class VulnerabilityManager {
  private vulnerabilities: Map<VulnerabilityId, Vulnerability> = new Map();
  private knownCves: Map<string, VulnerabilityId> = new Map();

  register(vuln: Vulnerability): VulnerabilityId {
    this.vulnerabilities.set(vuln.id, vuln);
    this.knownCves.set(vuln.cveId.toLowerCase(), vuln.id);
    return vuln.id;
  }

  get(id: VulnerabilityId): Vulnerability | undefined {
    return this.vulnerabilities.get(id);
  }

  list(): Vulnerability[] {
    return Array.from(this.vulnerabilities.values());
  }

  findByCve(cveId: string): Vulnerability | undefined {
    const id = this.knownCves.get(cveId.toLowerCase());
    return id ? this.vulnerabilities.get(id) : undefined;
  }

  listBySeverity(severity: VulnerabilitySeverity): Vulnerability[] {
    return this.list().filter((v) => v.severity === severity);
  }

  listExploited(): Vulnerability[] {
    return this.list().filter((v) => v.knownExploited);
  }

  remove(id: VulnerabilityId): boolean {
    const vuln = this.vulnerabilities.get(id);
    if (vuln) this.knownCves.delete(vuln.cveId.toLowerCase());
    return this.vulnerabilities.delete(id);
  }

  getStats(): { total: number; critical: number; high: number; medium: number; low: number; exploited: number } {
    const all = this.list();
    return {
      total: all.length,
      critical: all.filter((v) => v.severity === VulnerabilitySeverity.Critical).length,
      high: all.filter((v) => v.severity === VulnerabilitySeverity.High).length,
      medium: all.filter((v) => v.severity === VulnerabilitySeverity.Medium).length,
      low: all.filter((v) => v.severity === VulnerabilitySeverity.Low).length,
      exploited: all.filter((v) => v.knownExploited).length,
    };
  }

  clear(): void {
    this.vulnerabilities.clear();
    this.knownCves.clear();
  }
}

/* ── Attestation & Provenance Manager ── */

export class AttestationManager {
  private attestations: Map<AttestationId, Attestation> = new Map();
  private provenances: Map<ProvenanceId, SlsaProvenance> = new Map();
  private sigstoreEntries: Map<SigstoreEntryId, SigstoreEntry> = new Map();

  addAttestation(att: Attestation): AttestationId {
    this.attestations.set(att.id, att);
    return att.id;
  }

  getAttestation(id: AttestationId): Attestation | undefined {
    return this.attestations.get(id);
  }

  listAttestations(): Attestation[] {
    return Array.from(this.attestations.values());
  }

  listAttestationsByType(type: AttestationType): Attestation[] {
    return this.listAttestations().filter((a) => a.type === type);
  }

  addProvenance(prov: SlsaProvenance): ProvenanceId {
    this.provenances.set(prov.id, prov);
    return prov.id;
  }

  getProvenance(id: ProvenanceId): SlsaProvenance | undefined {
    return this.provenances.get(id);
  }

  listProvenances(): SlsaProvenance[] {
    return Array.from(this.provenances.values());
  }

  listProvenancesByLevel(level: SlsaLevel): SlsaProvenance[] {
    return this.listProvenances().filter((p) => p.level === level);
  }

  addSigstoreEntry(entry: SigstoreEntry): SigstoreEntryId {
    this.sigstoreEntries.set(entry.id, entry);
    return entry.id;
  }

  getSigstoreEntry(id: SigstoreEntryId): SigstoreEntry | undefined {
    return this.sigstoreEntries.get(id);
  }

  listSigstoreEntries(): SigstoreEntry[] {
    return Array.from(this.sigstoreEntries.values());
  }

  getStats(): { attestations: number; provenances: number; sigstoreEntries: number } {
    return {
      attestations: this.attestations.size,
      provenances: this.provenances.size,
      sigstoreEntries: this.sigstoreEntries.size,
    };
  }

  clear(): void {
    this.attestations.clear();
    this.provenances.clear();
    this.sigstoreEntries.clear();
  }
}

/* ── Software Composition Analysis ── */

export class SoftwareCompositionAnalyzer {
  private packages: Map<PackageId, PackageInfo> = new Map();
  private dependencies: Map<DependencyId, Dependency> = new Map();

  addPackage(pkg: PackageInfo): PackageId {
    this.packages.set(pkg.id, pkg);
    return pkg.id;
  }

  getPackage(id: PackageId): PackageInfo | undefined {
    return this.packages.get(id);
  }

  listPackages(): PackageInfo[] {
    return Array.from(this.packages.values());
  }

  addDependency(dep: Dependency): DependencyId {
    this.dependencies.set(dep.id, dep);
    return dep.id;
  }

  getDependency(id: DependencyId): Dependency | undefined {
    return this.dependencies.get(id);
  }

  listDependencies(): Dependency[] {
    return Array.from(this.dependencies.values());
  }

  listDependenciesByType(type: DependencyType): Dependency[] {
    return this.listDependencies().filter((d) => d.type === type);
  }

  detectTyposquatting(packageName: string, knownPackages: string[]): string[] {
    const suspects: string[] = [];
    for (const known of knownPackages) {
      const dist = levenshteinDistance(packageName, known);
      if (dist >= 1 && dist <= 3 && packageName !== known) {
        suspects.push(known);
      }
    }
    return suspects;
  }

  detectDependencyConfusion(
    packageName: string,
    internalNames: string[],
  ): boolean {
    return internalNames.includes(packageName);
  }

  removePackage(id: PackageId): boolean {
    return this.packages.delete(id);
  }

  removeDependency(id: DependencyId): boolean {
    return this.dependencies.delete(id);
  }

  getStats(): { packages: number; dependencies: number; direct: number; transitive: number } {
    const all = this.listDependencies();
    return {
      packages: this.packages.size,
      dependencies: all.length,
      direct: all.filter((d) => d.type === DependencyType.Direct).length,
      transitive: all.filter((d) => d.type === DependencyType.Transitive).length,
    };
  }

  clear(): void {
    this.packages.clear();
    this.dependencies.clear();
  }
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
    }
  }
  return dp[m][n];
}

/* ── Scorecard Manager ── */

export class ScorecardManager {
  private results: Map<ScorecardId, ScorecardResult> = new Map();

  add(result: ScorecardResult): ScorecardId {
    this.results.set(result.id, result);
    return result.id;
  }

  get(id: ScorecardId): ScorecardResult | undefined {
    return this.results.get(id);
  }

  list(): ScorecardResult[] {
    return Array.from(this.results.values());
  }

  listByScore(minScore: number): ScorecardResult[] {
    return this.list().filter((r) => r.overallScore >= minScore);
  }

  remove(id: ScorecardId): boolean {
    return this.results.delete(id);
  }

  getAverageScore(): number {
    const all = this.list();
    if (all.length === 0) return 0;
    return all.reduce((sum, r) => sum + r.overallScore, 0) / all.length;
  }

  clear(): void {
    this.results.clear();
  }
}

/* ── Build Manager ── */

export class BuildManager {
  private builds: Map<BuildId, BuildRecord> = new Map();

  create(repository: string, commitSha: string, system: BuildSystem = BuildSystem.GitHubActions): BuildRecord {
    const build = createBuildRecord(repository, commitSha, system);
    this.builds.set(build.id, build);
    return build;
  }

  get(id: BuildId): BuildRecord | undefined {
    return this.builds.get(id);
  }

  list(): BuildRecord[] {
    return Array.from(this.builds.values());
  }

  listByStatus(status: BuildRecord['status']): BuildRecord[] {
    return this.list().filter((b) => b.status === status);
  }

  listBySystem(system: BuildSystem): BuildRecord[] {
    return this.list().filter((b) => b.system === system);
  }

  setStatus(id: BuildId, status: BuildRecord['status']): boolean {
    const build = this.builds.get(id);
    if (!build) return false;
    build.status = status;
    if (status === 'passed' || status === 'failed' || status === 'cancelled') {
      build.completedAt = new Date();
    }
    return true;
  }

  remove(id: BuildId): boolean {
    return this.builds.delete(id);
  }

  getStats(): { total: number; passed: number; failed: number; running: number } {
    const all = this.list();
    return {
      total: all.length,
      passed: all.filter((b) => b.status === 'passed').length,
      failed: all.filter((b) => b.status === 'failed').length,
      running: all.filter((b) => b.status === 'running').length,
    };
  }

  clear(): void {
    this.builds.clear();
  }
}

/* ── Policy Manager ── */

export class SupplyChainPolicyManager {
  private policies: Map<PolicyId, SupplyChainPolicy> = new Map();

  add(policy: SupplyChainPolicy): PolicyId {
    this.policies.set(policy.id, policy);
    return policy.id;
  }

  get(id: PolicyId): SupplyChainPolicy | undefined {
    return this.policies.get(id);
  }

  list(): SupplyChainPolicy[] {
    return Array.from(this.policies.values());
  }

  listEnabled(): SupplyChainPolicy[] {
    return this.list().filter((p) => p.enabled);
  }

  setEnabled(id: PolicyId, enabled: boolean): boolean {
    const policy = this.policies.get(id);
    if (!policy) return false;
    policy.enabled = enabled;
    policy.updated = new Date();
    return true;
  }

  remove(id: PolicyId): boolean {
    return this.policies.delete(id);
  }

  evaluate(policyId: PolicyId, subject: string, type: string): { allowed: boolean; matchedRules: PolicyRule[] } {
    const policy = this.policies.get(policyId);
    if (!policy || !policy.enabled) return { allowed: true, matchedRules: [] };

    const matchedRules: PolicyRule[] = [];
    let allowed = true;

    for (const rule of policy.rules) {
      if (rule.type !== type && rule.type !== '*') continue;
      if (!subject.match(new RegExp(rule.resource))) continue;

      matchedRules.push(rule);
      if (rule.effect === 'deny') allowed = false;
    }

    return { allowed, matchedRules };
  }

  clear(): void {
    this.policies.clear();
  }
}

/* ── Supply Chain Coordinator ── */

export class SupplyChainCoordinator {
  sbomManager: SbomManager;
  vulnerabilityManager: VulnerabilityManager;
  attestationManager: AttestationManager;
  compositionAnalyzer: SoftwareCompositionAnalyzer;
  scorecardManager: ScorecardManager;
  buildManager: BuildManager;
  policyManager: SupplyChainPolicyManager;
  private threats: SupplyChainThreat[] = [];

  constructor() {
    this.sbomManager = new SbomManager();
    this.vulnerabilityManager = new VulnerabilityManager();
    this.attestationManager = new AttestationManager();
    this.compositionAnalyzer = new SoftwareCompositionAnalyzer();
    this.scorecardManager = new ScorecardManager();
    this.buildManager = new BuildManager();
    this.policyManager = new SupplyChainPolicyManager();
    this.threats = getKnownSupplyChainThreats();
  }

  getKnownThreats(): SupplyChainThreat[] {
    return this.threats;
  }

  getThreatByVector(vector: AttackVector): SupplyChainThreat | undefined {
    return this.threats.find((t) => t.vector === vector);
  }

  getStats(): SupplyChainStats {
    const vulnStats = this.vulnerabilityManager.getStats();
    const buildStats = this.buildManager.getStats();
    const compStats = this.compositionAnalyzer.getStats();
    const attStats = this.attestationManager.getStats();
    const sbomStats = this.sbomManager.getStats();

    return {
      packages: compStats.packages,
      dependencies: compStats.dependencies,
      directDependencies: compStats.direct,
      transitiveDependencies: compStats.transitive,
      sboms: sbomStats.total,
      attestations: attStats.attestations,
      provenances: attStats.provenances,
      sigstoreEntries: attStats.sigstoreEntries,
      vulnerabilities: vulnStats.total,
      criticalVulnerabilities: vulnStats.critical,
      highVulnerabilities: vulnStats.high,
      builds: buildStats.total,
      passedBuilds: buildStats.passed,
      failedBuilds: buildStats.failed,
      scorecards: this.scorecardManager.list().length,
      policies: this.policyManager.list().length,
      threats: this.threats.length,
    };
  }

  reset(): void {
    this.sbomManager.clear();
    this.vulnerabilityManager.clear();
    this.attestationManager.clear();
    this.compositionAnalyzer.clear();
    this.scorecardManager.clear();
    this.buildManager.clear();
    this.policyManager.clear();
  }
}

export function createDefaultSupplyChainEnvironment(): SupplyChainCoordinator {
  const coord = new SupplyChainCoordinator();

  const express = createPackage('express', '4.18.2', PackageEcosystem.npm, {
    description: 'Fast, unopinionated, minimalist web framework',
    author: 'TJ Holowaychuk',
    downloads: 15000000,
    license: 'MIT',
  });

  const lodash = createPackage('lodash', '4.17.21', PackageEcosystem.npm, {
    description: 'Lodash modular utilities',
    author: 'John-David Dalton',
    downloads: 40000000,
    license: 'MIT',
  });

  const axios = createPackage('axios', '1.6.0', PackageEcosystem.npm, {
    description: 'Promise based HTTP client',
    author: 'Matt Zabriskie',
    downloads: 25000000,
    license: 'MIT',
  });

  coord.compositionAnalyzer.addPackage(express);
  coord.compositionAnalyzer.addPackage(lodash);
  coord.compositionAnalyzer.addPackage(axios);

  const dep1 = createDependency('express', '4.18.2', PackageEcosystem.npm, DependencyType.Direct, {
    versionConstraint: '^4.18.0',
    integrity: 'sha256-abc123def456',
  });

  const dep2 = createDependency('body-parser', '1.20.2', PackageEcosystem.npm, DependencyType.Transitive, {
    versionConstraint: '^1.20.0',
    integrity: 'sha256-ghi789jkl012',
  });

  const dep3 = createDependency('lodash', '4.17.21', PackageEcosystem.npm, DependencyType.Direct, {
    versionConstraint: '^4.17.0',
    integrity: 'sha256-mno345pqr678',
  });

  const dep4 = createDependency('axios', '1.6.0', PackageEcosystem.npm, DependencyType.Direct, {
    versionConstraint: '^1.5.0',
    integrity: 'sha256-stu901vwx234',
  });

  coord.compositionAnalyzer.addDependency(dep1);
  coord.compositionAnalyzer.addDependency(dep2);
  coord.compositionAnalyzer.addDependency(dep3);
  coord.compositionAnalyzer.addDependency(dep4);

  const sbom = coord.sbomManager.generate(
    'my-app',
    [express, lodash, axios],
    [dep1, dep2, dep3, dep4],
    SbomFormat.SPDX_2_3,
  );

  const log4j = createVulnerability(
    'CVE-2021-44228',
    VulnerabilitySeverity.Critical,
    'Apache Log4j2 JNDI features do not protect against attacker-controlled LDAP servers',
    { knownExploited: true, epssScore: 0.97, epssPercentile: 0.999 },
  );
  coord.vulnerabilityManager.register(log4j);

  const moveit = createVulnerability(
    'CVE-2023-34362',
    VulnerabilitySeverity.Critical,
    'SQL injection in MOVEit Transfer',
    { knownExploited: true, epssScore: 0.95, epssPercentile: 0.99 },
  );
  coord.vulnerabilityManager.register(moveit);

  const xzBackdoor = createVulnerability(
    'CVE-2024-3094',
    VulnerabilitySeverity.Critical,
    'Malicious code in XZ Utils 5.6.0/5.6.1 build process',
    { knownExploited: false, epssScore: 0.85, epssPercentile: 0.95 },
  );
  coord.vulnerabilityManager.register(xzBackdoor);

  const prov = createProvenance('https://slsa.dev/provenance/v1', 'https://github.com/actions/runner', SlsaLevel.SLSA_3);
  coord.attestationManager.addProvenance(prov);

  const att = createAttestation(
    AttestationType.Provenance,
    'my-app@1.0.0',
    'sha256:abcdef1234567890',
    'https://slsa.dev/provenance/v1',
    { buildType: 'GitHubActions', builder: { id: 'https://github.com/actions/runner' } },
  );
  coord.attestationManager.addAttestation(att);

  const sigEntry = createSigstoreEntry('hashedrekord', JSON.stringify({ publicKey: '-----BEGIN PUBLIC KEY-----...' }));
  coord.attestationManager.addSigstoreEntry(sigEntry);

  const build = coord.buildManager.create('https://github.com/owner/my-app', 'a1b2c3d4');

  const scorecard = createScorecardResult('my-app', PackageEcosystem.npm, '1.0.0', 7.5, [
    createScorecardCheck(ScorecardCheck.CodeReview, 8, 'Code review performed on all PRs'),
    createScorecardCheck(ScorecardCheck.SAST, 6, 'SAST tools scan all commits'),
    createScorecardCheck(ScorecardCheck.PinnedDependencies, 5, 'Dependencies are pinned with hashes'),
    createScorecardCheck(ScorecardCheck.CI_Tests, 9, 'CI runs unit and integration tests'),
  ]);
  coord.scorecardManager.add(scorecard);

  const policy = createSupplyChainPolicy('DependencyPolicy', 'Policies for dependency management', [
    { type: 'dependency', resource: '.*', condition: 'version must be pinned', effect: 'deny', priority: 1 },
    { type: 'dependency', resource: '.*', condition: 'must have integrity hash', effect: 'deny', priority: 1 },
    { type: 'dependency', resource: '.*', condition: 'no critical vulns allowed', effect: 'deny', priority: 2 },
    { type: 'vulnerability', resource: 'CVE-.*', condition: 'critical vulns must be patched within 30 days', effect: 'warn', priority: 3 },
  ]);
  coord.policyManager.add(policy);

  return coord;
}
