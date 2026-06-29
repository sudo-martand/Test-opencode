import type { UID, Timestamp } from '@cybersim/shared';
import { uid, timestamp } from '@cybersim/shared';
import { z } from 'zod';

// ── Branded types ────────────────────────────────────────────────────────

export type StixId = string & { readonly __brand: 'stixId' };
export type AttackTechnique = string & { readonly __brand: 'attackTechnique' };

export function stixId(value: string): StixId { return value as StixId; }
export function attackTechnique(value: string): AttackTechnique { return value as AttackTechnique; }

// ── STIX 2.1 Types ───────────────────────────────────────────────────────

export type StixType =
  | 'indicator' | 'observed-data' | 'threat-actor' | 'campaign'
  | 'intrusion-set' | 'malware' | 'attack-pattern' | 'course-of-action'
  | 'relationship' | 'bundle' | 'report' | 'identity'
  | 'infrastructure' | 'tool' | 'vulnerability' | 'note';

export interface StixIdentity {
  type: 'identity';
  id: StixId;
  name: string;
  identity_class: string;
  sectors?: string[];
  created: string;
  modified: string;
}

export interface StixIndicator {
  type: 'indicator';
  id: StixId;
  name: string;
  description?: string;
  pattern: string;
  pattern_type: 'stix' | 'sigma' | 'yara' | 'pcre';
  valid_from: string;
  valid_until?: string;
  indicator_types?: string[];
  created: string;
  modified: string;
  created_by_ref?: StixId;
  labels?: string[];
  confidence?: number;
  kill_chain_phases?: StixKillChainPhase[];
}

export interface StixKillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

export interface StixMalware {
  type: 'malware';
  id: StixId;
  name: string;
  description?: string;
  malware_types: string[];
  is_family: boolean;
  aliases?: string[];
  created: string;
  modified: string;
  created_by_ref?: StixId;
}

export interface StixAttackPattern {
  type: 'attack-pattern';
  id: StixId;
  name: string;
  description?: string;
  external_references?: StixExternalReference[];
  kill_chain_phases?: StixKillChainPhase[];
  created: string;
  modified: string;
}

export interface StixThreatActor {
  type: 'threat-actor';
  id: StixId;
  name: string;
  description?: string;
  threat_actor_types?: string[];
  aliases?: string[];
  roles?: string[];
  sophistication?: string;
  resource_level?: string;
  primary_motivation?: string;
  created: string;
  modified: string;
  external_references?: StixExternalReference[];
}

export interface StixRelationship {
  type: 'relationship';
  id: StixId;
  relationship_type: string;
  source_ref: StixId;
  target_ref: StixId;
  created: string;
  modified: string;
  description?: string;
}

export interface StixReport {
  type: 'report';
  id: StixId;
  name: string;
  description?: string;
  report_types: string[];
  published: string;
  object_refs: StixId[];
  created: string;
  modified: string;
}

export interface StixExternalReference {
  source_name: string;
  description?: string;
  url?: string;
  external_id?: string;
}

export interface StixBundle {
  type: 'bundle';
  id: StixId;
  objects: StixObject[];
}

export type StixObject =
  | StixIdentity
  | StixIndicator
  | StixMalware
  | StixAttackPattern
  | StixThreatActor
  | StixRelationship
  | StixReport;

// ── STIX Parser ──────────────────────────────────────────────────────────

export class StixParser {
  parse(json: string): StixBundle {
    const parsed = JSON.parse(json);
    return this.validateBundle(parsed);
  }

  parseBundle(data: unknown): StixBundle {
    return this.validateBundle(data);
  }

  generateBundle(objects: StixObject[]): StixBundle {
    return {
      type: 'bundle',
      id: stixId(`bundle--${this.uuidv4()}`),
      objects,
    };
  }

  generateIndicator(
    name: string,
    pattern: string,
    patternType: 'stix' | 'sigma' | 'yara',
    validFrom?: string,
  ): StixIndicator {
    return {
      type: 'indicator',
      id: stixId(`indicator--${this.uuidv4()}`),
      name,
      pattern,
      pattern_type: patternType,
      valid_from: validFrom ?? new Date().toISOString(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
  }

  generateRelationship(
    sourceRef: StixId,
    targetRef: StixId,
    relationshipType: string,
  ): StixRelationship {
    return {
      type: 'relationship',
      id: stixId(`relationship--${this.uuidv4()}`),
      relationship_type: relationshipType,
      source_ref: sourceRef,
      target_ref: targetRef,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
  }

  serializeToJson(bundle: StixBundle): string {
    return JSON.stringify(bundle, null, 2);
  }

  serializeToBytes(bundle: StixBundle): Uint8Array {
    return new TextEncoder().encode(this.serializeToJson(bundle));
  }

  private validateBundle(data: unknown): StixBundle {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid STIX bundle: expected object');
    }
    const obj = data as Record<string, unknown>;
    if (obj['type'] !== 'bundle') {
      throw new Error('Invalid STIX bundle: type must be "bundle"');
    }
    if (!Array.isArray(obj['objects'])) {
      throw new Error('Invalid STIX bundle: objects must be an array');
    }
    return obj as unknown as StixBundle;
  }

  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// ── Sigma Rules ──────────────────────────────────────────────────────────

export interface SigmaLogSource {
  category?: string;
  product?: string;
  service?: string;
  definition?: string;
}

export interface SigmaDetectionItem {
  field?: string;
  modifiers?: string[];
  value: string | number | boolean | RegExp | SigmaDetectionItem[] | Record<string, unknown>;
}

export interface SigmaDetection {
  name?: string;
  condition: string;
  items: Record<string, SigmaDetectionItem | SigmaDetectionItem[]>;
}

export interface SigmaRuleRaw {
  title: string;
  id?: string;
  description?: string;
  references?: string[];
  author?: string;
  date?: string;
  modified?: string;
  logsource: SigmaLogSource;
  detection: SigmaDetection;
  level?: string;
  status?: string;
  tags?: string[];
  falsepositives?: string[];
}

export interface SigmaMatch {
  ruleId: string;
  ruleTitle: string;
  level: string;
  timestamp: number;
  matchedFields: string[];
}

export class SigmaRule {
  readonly title: string;
  readonly id: string;
  readonly description: string;
  readonly logsource: SigmaLogSource;
  readonly detection: SigmaDetection;
  readonly level: string;
  readonly status: string;
  readonly tags: string[];
  readonly falsePositives: string[];

  constructor(raw: SigmaRuleRaw) {
    this.title = raw.title;
    this.id = raw.id ?? `sigma-${uid()}`;
    this.description = raw.description ?? '';
    this.logsource = raw.logsource;
    this.detection = raw.detection;
    this.level = raw.level ?? 'medium';
    this.status = raw.status ?? 'experimental';
    this.tags = raw.tags ?? [];
    this.falsePositives = raw.falsepositives ?? [];
  }

  match(event: Record<string, unknown>): SigmaMatch | null {
    try {
      const result = this.evaluateCondition(event);
      if (result) {
        return {
          ruleId: this.id,
          ruleTitle: this.title,
          level: this.level,
          timestamp: Date.now(),
          matchedFields: result,
        };
      }
    } catch {
      // evaluation error = no match
    }
    return null;
  }

  private evaluateCondition(event: Record<string, unknown>): string[] | null {
    const detection = this.detection;
    const condition = detection.condition;

    if (condition === 'all of them') {
      const matched: string[] = [];
      for (const [name, itemOrItems] of Object.entries(detection.items)) {
        const matches = this.matchDetectionItem(event, itemOrItems);
        if (!matches) return null;
        matched.push(name);
      }
      return matched.length > 0 ? matched : null;
    }

    if (condition.startsWith('all of')) {
      const prefix = condition.replace('all of ', '').replace(/\*$/, '');
      const matched: string[] = [];
      for (const [name] of Object.entries(detection.items)) {
        if (name.startsWith(prefix)) {
          const item = detection.items[name]!;
          const matches = this.matchDetectionItem(event, item);
          if (!matches) return null;
          matched.push(name);
        }
      }
      return matched.length > 0 ? matched : null;
    }

    if (condition.startsWith('1 of')) {
      const prefix = condition.replace(/1 of\s*/, '').replace(/\*$/, '');
      const matched: string[] = [];
      for (const [name] of Object.entries(detection.items)) {
        if (name.startsWith(prefix)) {
          const item = detection.items[name]!;
          const matches = this.matchDetectionItem(event, item);
          if (matches) matched.push(name);
        }
      }
      return matched.length >= 1 ? matched : null;
    }

    if (condition === 'any of them') {
      for (const [, itemOrItems] of Object.entries(detection.items)) {
        const matches = this.matchDetectionItem(event, itemOrItems);
        if (matches) return matches;
      }
      return null;
    }

    const fallback: SigmaDetectionItem = { field: '', value: '' };
    return this.matchDetectionItem(event, detection.items[condition] ?? fallback);
  }

  private matchDetectionItem(
    event: Record<string, unknown>,
    item: SigmaDetectionItem | SigmaDetectionItem[],
  ): string[] | null {
    const items = Array.isArray(item) ? item : [item];
    const matched: string[] = [];

    for (const single of items) {
      if (single.field) {
        const eventValue = event[single.field];
        if (this.matchValue(eventValue, single.value)) {
          matched.push(single.field);
        } else {
          return null;
        }
      } else {
        let anyMatched = false;
        for (const [field, fieldValue] of Object.entries(event)) {
          if (this.matchValue(fieldValue, single.value)) {
            matched.push(field);
            anyMatched = true;
            break;
          }
        }
        if (!anyMatched) return null;
      }
    }

    return matched.length > 0 ? matched : null;
  }

  private matchValue(eventValue: unknown, pattern: unknown): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(String(eventValue));
    }
    if (typeof pattern === 'object' && pattern !== null && !Array.isArray(pattern)) {
      const mods = pattern as Record<string, unknown>;
      if ('contains' in mods) {
        return String(eventValue).includes(String(mods['contains']));
      }
      if ('startswith' in mods) {
        return String(eventValue).startsWith(String(mods['startswith']));
      }
      if ('endswith' in mods) {
        return String(eventValue).endsWith(String(mods['endswith']));
      }
    }
    return String(eventValue) === String(pattern);
  }

  toZodSchema(): z.ZodObject<Record<string, z.ZodTypeAny>> {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const [name, item] of Object.entries(this.detection.items)) {
      if (Array.isArray(item)) {
        shape[name] = z.record(z.string(), z.unknown());
      } else if (item.field) {
        shape[item.field] = z.string();
      }
    }
    return z.object(shape);
  }
}

// ── YARA Rules ───────────────────────────────────────────────────────────

export interface YaraMeta {
  [key: string]: string | number | boolean;
}

export interface YaraString {
  identifier: string;
  value: string;
  modifiers: string[];
  offset?: number;
}

export interface YaraRuleRaw {
  ruleName: string;
  meta: YaraMeta;
  strings: YaraString[];
  condition: string;
}

export interface YaraMatch {
  ruleName: string;
  matches: Array<{ string: string; offset: number; data: string }>;
  tags: string[];
  metadata: YaraMeta;
}

export class YaraRule {
  readonly ruleName: string;
  readonly meta: YaraMeta;
  readonly strings: YaraString[];
  readonly condition: string;
  readonly tags: string[];

  constructor(raw: YaraRuleRaw, tags?: string[]) {
    this.ruleName = raw.ruleName;
    this.meta = raw.meta;
    this.strings = raw.strings;
    this.condition = raw.condition;
    this.tags = tags ?? [];
  }

  match(data: Uint8Array | string): YaraMatch | null {
    const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const matches: YaraMatch['matches'] = [];
    const decoder = new TextDecoder();

    for (const s of this.strings) {
      const needle = new TextEncoder().encode(s.value);
      let offset = 0;
      while (true) {
        const idx = this.indexOf(buf, needle, offset);
        if (idx === -1) break;
        matches.push({
          string: s.identifier,
          offset: idx,
          data: decoder.decode(needle),
        });
        offset = idx + 1;
      }
    }

    const conditionMet = this.evaluateCondition(matches, buf.length);

    if (matches.length > 0 && conditionMet) {
      return {
        ruleName: this.ruleName,
        matches,
        tags: this.tags,
        metadata: { ...this.meta },
      };
    }

    return null;
  }

  private indexOf(data: Uint8Array, needle: Uint8Array, offset: number): number {
    if (needle.length === 0 || needle.length > data.length - offset) return -1;
    for (let i = offset; i <= data.length - needle.length; i++) {
      let match = true;
      for (let j = 0; j < needle.length; j++) {
        if (data[i + j] !== needle[j]) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    return -1;
  }

  private evaluateCondition(matches: YaraMatch['matches'], dataLen: number): boolean {
    const cond = this.condition.trim();

    if (cond === 'any of them' || cond === 'any of ($*)') {
      return matches.length > 0;
    }

    if (cond.startsWith('all of them') || cond.startsWith('all of ($*)')) {
      return matches.length >= this.strings.length;
    }

    if (cond.startsWith('#') && cond.includes('>')) {
      const match = cond.match(/#(\w+)\s*>\s*(\d+)/);
      if (match) {
        const [, stringId, countStr] = match;
        const count = parseInt(countStr!, 10);
        const actual = matches.filter((m) => m.string === `$${stringId}`).length;
        return actual > count;
      }
    }

    if (cond.includes('filesize')) {
      const fsMatch = cond.match(/filesize\s*(<|>|<=|>=|==|!=)\s*(\d+)/);
      if (fsMatch) {
        const [, op, valStr] = fsMatch;
        const val = parseInt(valStr!, 10);
        switch (op) {
          case '<': return dataLen < val;
          case '>': return dataLen > val;
          case '<=': return dataLen <= val;
          case '>=': return dataLen >= val;
          case '==': return dataLen === val;
          case '!=': return dataLen !== val;
        }
      }
    }

    return matches.length > 0;
  }
}

// ── TAXII Interfaces ─────────────────────────────────────────────────────

export interface TaxiiCollection {
  id: string;
  title: string;
  description: string;
  canRead: boolean;
  canWrite: boolean;
  mediaTypes: string[];
}

export interface TaxiiStatus {
  id: string;
  status: 'pending' | 'complete' | 'failed';
  totalCount: number;
  successCount: number;
  failureCount: number;
  requestTimestamp: string;
}

export interface TaxiiServerConfig {
  title: string;
  description: string;
  contact: string;
  default: string;
  apiRoots: string[];
  versions: string[];
  maxContentLength: number;
}

export interface TaxiiClient {
  getCollections(apiRoot: string): Promise<TaxiiCollection[]>;
  getObjects(apiRoot: string, collectionId: string, filter?: Record<string, string>): Promise<StixBundle>;
  addObjects(apiRoot: string, collectionId: string, bundle: StixBundle): Promise<TaxiiStatus>;
  getStatus(apiRoot: string, statusId: string): Promise<TaxiiStatus>;
}

export class TaxiiServer {
  private collections: Map<string, TaxiiCollection> = new Map();
  private objects: Map<string, StixObject[]> = new Map();
  private statuses: Map<string, TaxiiStatus> = new Map();

  constructor(public readonly config: TaxiiServerConfig) {}

  addCollection(collection: TaxiiCollection): void {
    this.collections.set(collection.id, collection);
    this.objects.set(collection.id, []);
  }

  getCollections(): TaxiiCollection[] {
    return Array.from(this.collections.values());
  }

  getCollection(id: string): TaxiiCollection | undefined {
    return this.collections.get(id);
  }

  getObjects(collectionId: string): StixObject[] {
    return this.objects.get(collectionId) ?? [];
  }

  addObjects(collectionId: string, objects: StixObject[]): TaxiiStatus {
    const existing = this.objects.get(collectionId) ?? [];
    existing.push(...objects);
    this.objects.set(collectionId, existing);

    const status: TaxiiStatus = {
      id: `status--${uid()}`,
      status: 'complete',
      totalCount: objects.length,
      successCount: objects.length,
      failureCount: 0,
      requestTimestamp: new Date().toISOString(),
    };
    this.statuses.set(status.id, status);
    return status;
  }

  getStatus(id: string): TaxiiStatus | undefined {
    return this.statuses.get(id);
  }
}

// ── MITRE ATT&CK ─────────────────────────────────────────────────────────

export interface AttackTechniqueMapping {
  techniqueId: AttackTechnique;
  name: string;
  tactic: string;
  platform: string[];
  permissionsRequired?: string[];
  dataSources?: string[];
  detectionRules?: string[];
}

export interface AttackGroupMapping {
  groupId: string;
  name: string;
  aliases: string[];
  associatedTechniques: AttackTechnique[];
}

export interface AttackMitigation {
  mitigationId: string;
  name: string;
  description: string;
  techniquesMitigated: AttackTechnique[];
}

export class AttackMapper {
  private techniques: Map<AttackTechnique, AttackTechniqueMapping> = new Map();
  private groups: Map<string, AttackGroupMapping> = new Map();
  private mitigations: Map<string, AttackMitigation> = new Map();

  registerTechnique(mapping: AttackTechniqueMapping): void {
    this.techniques.set(mapping.techniqueId, mapping);
  }

  registerGroup(group: AttackGroupMapping): void {
    this.groups.set(group.groupId, group);
  }

  registerMitigation(mitigation: AttackMitigation): void {
    this.mitigations.set(mitigation.mitigationId, mitigation);
  }

  getTechnique(id: AttackTechnique): AttackTechniqueMapping | undefined {
    return this.techniques.get(id);
  }

  getGroup(id: string): AttackGroupMapping | undefined {
    return this.groups.get(id);
  }

  getTechniquesByTactic(tactic: string): AttackTechniqueMapping[] {
    return Array.from(this.techniques.values()).filter((t) => t.tactic === tactic);
  }

  getTechniquesByPlatform(platform: string): AttackTechniqueMapping[] {
    return Array.from(this.techniques.values()).filter((t) => t.platform.includes(platform));
  }

  getGroupsByTechnique(techniqueId: AttackTechnique): AttackGroupMapping[] {
    return Array.from(this.groups.values()).filter(
      (g) => g.associatedTechniques.includes(techniqueId),
    );
  }

  searchTechniques(query: string): AttackTechniqueMapping[] {
    const lower = query.toLowerCase();
    return Array.from(this.techniques.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.techniqueId.toLowerCase().includes(lower) ||
        t.tactic.toLowerCase().includes(lower),
    );
  }

  // ── Pre-loaded enterprise techniques ──────────────────────────────

  loadEnterpriseTechniques(): void {
    const techniques: AttackTechniqueMapping[] = [
      { techniqueId: attackTechnique('T1059'), name: 'Command and Scripting Interpreter', tactic: 'execution', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1059.001'), name: 'PowerShell', tactic: 'execution', platform: ['windows'] },
      { techniqueId: attackTechnique('T1566'), name: 'Phishing', tactic: 'initial-access', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1566.001'), name: 'Spearphishing Attachment', tactic: 'initial-access', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1047'), name: 'Windows Management Instrumentation', tactic: 'execution', platform: ['windows'] },
      { techniqueId: attackTechnique('T1136'), name: 'Create Account', tactic: 'persistence', platform: ['windows', 'linux', 'macos', 'azure-ad'] },
      { techniqueId: attackTechnique('T1078'), name: 'Valid Accounts', tactic: 'defense-evasion', platform: ['windows', 'linux', 'macos', 'azure-ad'] },
      { techniqueId: attackTechnique('T1548'), name: 'Abuse Elevation Control Mechanism', tactic: 'privilege-escalation', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1003'), name: 'OS Credential Dumping', tactic: 'credential-access', platform: ['windows', 'linux'] },
      { techniqueId: attackTechnique('T1018'), name: 'Remote System Discovery', tactic: 'discovery', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1021'), name: 'Remote Services', tactic: 'lateral-movement', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1048'), name: 'Exfiltration Over Alternative Protocol', tactic: 'exfiltration', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1071'), name: 'Application Layer Protocol', tactic: 'command-and-control', platform: ['windows', 'linux', 'macos'] },
      { techniqueId: attackTechnique('T1490'), name: 'Inhibit System Recovery', tactic: 'impact', platform: ['windows'] },
      { techniqueId: attackTechnique('T1486'), name: 'Data Encrypted for Impact', tactic: 'impact', platform: ['windows', 'linux', 'macos'] },
    ];

    for (const t of techniques) {
      this.registerTechnique(t);
    }
  }

  loadIcsTechniques(): void {
    const icsTechniques: AttackTechniqueMapping[] = [
      { techniqueId: attackTechnique('T0836'), name: 'Modbus Function Code Injection', tactic: 'impact-ics', platform: ['field-controller', 'rtu'] },
      { techniqueId: attackTechnique('T0839'), name: 'DNP3 Spoofing', tactic: 'impact-ics', platform: ['rtu', 'plc'] },
      { techniqueId: attackTechnique('T0842'), name: 'IEC 61850 GOOSE Injection', tactic: 'impact-ics', platform: ['ied', 'bay-controller'] },
      { techniqueId: attackTechnique('T0801'), name: 'Alarm Suppression', tactic: 'impair-process-control', platform: ['hmi', 'plc'] },
    ];

    for (const t of icsTechniques) {
      this.registerTechnique(t);
    }
  }
}

// ── Sigma rule presets ───────────────────────────────────────────────────

export const sigmaPresets: SigmaRuleRaw[] = [
  {
    title: 'Suspicious PowerShell Invocation',
    id: 'sigma-ps-001',
    description: 'Detects suspicious PowerShell execution patterns',
    logsource: { category: 'process_creation', product: 'windows' },
    detection: {
      condition: 'selection',
      items: {
        selection: { field: 'Image', value: 'powershell.exe' },
      },
    },
    level: 'medium',
    tags: ['attack.t1059.001', 'car.2016-03-001'],
  },
  {
    title: 'Network Scan Detection',
    id: 'sigma-net-001',
    description: 'Detects port scanning activity from a single source',
    logsource: { category: 'network_connection', product: 'windows' },
    detection: {
      condition: 'selection',
      items: {
        selection: { field: 'Initiated', value: 'true' },
      },
    },
    level: 'low',
    tags: ['attack.t1046', 'car.2013-04-001'],
  },
  {
    title: 'Suspicious LSASS Access',
    id: 'sigma-cred-001',
    description: 'Detects processes accessing LSASS for credential dumping',
    logsource: { category: 'process_access', product: 'windows' },
    detection: {
      condition: 'selection',
      items: {
        selection: { field: 'TargetImage', value: 'lsass.exe' },
      },
    },
    level: 'high',
    tags: ['attack.t1003.001', 'car.2019-04-001'],
  },
];

export function createDefaultSigmaRuleEngine(): SigmaRule[] {
  return sigmaPresets.map((raw) => new SigmaRule(raw));
}

// ── YARA presets ─────────────────────────────────────────────────────────

export const yaraPresets: YaraRuleRaw[] = [
  {
    ruleName: 'Suspicious_JavaScript_Strings',
    meta: { author: 'cybersim', description: 'Detects suspicious JavaScript patterns', severity: 'medium' },
    strings: [
      { identifier: '$s1', value: 'eval(', modifiers: [] },
      { identifier: '$s2', value: 'atob(', modifiers: [] },
      { identifier: '$s3', value: 'document.write', modifiers: [] },
    ],
    condition: 'any of them',
  },
  {
    ruleName: 'Windows_Executable_Download',
    meta: { author: 'cybersim', description: 'Detects EXE download patterns', severity: 'low' },
    strings: [
      { identifier: '$mz', value: 'MZ', modifiers: [] },
    ],
    condition: '$mz at 0',
  },
];

export function createDefaultYaraEngine(): YaraRule[] {
  return yaraPresets.map((raw) => new YaraRule(raw));
}
