import { describe, it, expect, beforeEach } from 'vitest';
import {
  stixId, attackTechnique,
  StixParser, SigmaRule, YaraRule,
  TaxiiServer, AttackMapper, type StixObject,
  sigmaPresets, createDefaultSigmaRuleEngine,
  yaraPresets, createDefaultYaraEngine,
} from '../index.js';

describe('branded type constructors', () => {
  it('stixId creates valid STIX IDs', () => {
    const id = stixId('indicator--1234');
    expect(id).toBe('indicator--1234');
  });

  it('attackTechnique creates ATT&CK IDs', () => {
    const t = attackTechnique('T1059');
    expect(t).toBe('T1059');
  });
});

describe('StixParser', () => {
  const parser = new StixParser();

  it('parses valid STIX 2.1 bundle JSON', () => {
    const bundle = parser.parse('{"type": "bundle", "id": "bundle--1234", "objects": []}');
    expect(bundle.type).toBe('bundle');
    expect(bundle.objects).toEqual([]);
  });

  it('parses bundle from object', () => {
    const bundle = parser.parseBundle({ type: 'bundle', id: 'bundle--1234', objects: [] });
    expect(bundle.type).toBe('bundle');
    expect(bundle.objects).toEqual([]);
  });

  it('throws on invalid bundle JSON', () => {
    expect(() => parser.parse('not json')).toThrow();
  });

  it('throws on non-bundle JSON', () => {
    expect(() => parser.parse('{"type": "not-bundle"}')).toThrow();
  });

  it('generates an indicator', () => {
    const indicator = parser.generateIndicator(
      'test.com', 'domain-name:value = "test.com"', 'stix',
    );
    expect(indicator.type).toBe('indicator');
    expect(indicator.name).toBe('test.com');
    expect(indicator.pattern).toContain('test.com');
  });

  it('generates a relationship', () => {
    const rel = parser.generateRelationship(
      stixId('indicator--abc'), stixId('malware--def'), 'indicates',
    );
    expect(rel.type).toBe('relationship');
    expect(rel.relationship_type).toBe('indicates');
  });

  it('generates a bundle', () => {
    const indicator = parser.generateIndicator('evil.com', "file:name = 'evil.exe'", 'stix');
    const bundle = parser.generateBundle([indicator]);
    expect(bundle.objects.length).toBe(1);
    expect(bundle.objects[0]?.type).toBe('indicator');
  });

  it('serializes to JSON', () => {
    const json = parser.serializeToJson({ type: 'bundle', id: stixId('bundle--1'), objects: [] });
    expect(typeof json).toBe('string');
    expect(json).toContain('bundle');
  });

  it('serializes to bytes', () => {
    const bytes = parser.serializeToBytes({ type: 'bundle', id: stixId('bundle--1'), objects: [] });
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });
});

describe('SigmaRule', () => {
  it('matches when all conditions satisfied', () => {
    const rule = new SigmaRule({
      id: 'test-rule',
      title: 'Test Detection',
      description: 'Test rule',
      logsource: { category: 'process_creation', product: 'windows' },
      detection: {
        condition: 'all of them',
        items: {
          selection: [
            { field: 'Image', value: 'cmd.exe' },
            { field: 'CommandLine', value: '/c' },
          ],
        },
      },
      level: 'high',
    });
    const match = rule.match({ Image: 'cmd.exe', CommandLine: '/c' });
    expect(match).not.toBeNull();
    expect(match!.ruleId).toBe('test-rule');
  });

  it('does not match when conditions not satisfied', () => {
    const rule = new SigmaRule({
      id: 'test-rule-2',
      title: 'Test Detection 2',
      description: 'Test rule',
      logsource: { category: 'process_creation', product: 'windows' },
      detection: {
        condition: 'all of them',
        items: {
          selection: [
            { field: 'Image', value: 'cmd.exe' },
            { field: 'CommandLine', value: '/c' },
          ],
        },
      },
      level: 'high',
    });
    const match = rule.match({ Image: 'notepad.exe', CommandLine: '--help' });
    expect(match).toBeNull();
  });

  it('matches with regex patterns', () => {
    const rule = new SigmaRule({
      id: 'regex-rule',
      title: 'Regex Test',
      description: 'Regex test',
      logsource: { category: 'process_creation', product: 'windows' },
      detection: {
        condition: 'all of them',
        items: {
          selection: { field: 'CommandLine', value: /-enc/ },
        },
      },
      level: 'high',
    });
    const match = rule.match({ CommandLine: 'powershell -enc dGVzdA==' });
    expect(match).not.toBeNull();
    expect(match!.ruleId).toBe('regex-rule');
  });

  it('matches with 1 of detection', () => {
    const rule = new SigmaRule({
      id: 'or-rule',
      title: 'OR Test',
      description: 'OR test',
      logsource: { category: 'process_creation', product: 'windows' },
      detection: {
        condition: '1 of selection*',
        items: {
          selection_cmd: { field: 'Image', value: 'cmd.exe' },
          selection_ps: { field: 'Image', value: 'powershell.exe' },
        },
      },
      level: 'high',
    });
    const match = rule.match({ Image: 'powershell.exe' });
    expect(match).not.toBeNull();
    expect(match!.ruleId).toBe('or-rule');
  });
});

describe('YaraRule', () => {
  it('matches strings in data', () => {
    const rule = new YaraRule({
      ruleName: 'test_rule',
      meta: { description: 'Test YARA rule', author: 'test' },
      strings: [
        { identifier: '$a', value: 'MALWARE', modifiers: [] },
      ],
      condition: 'any of them',
    });
    const data = new Uint8Array([...Buffer.from('This is MALWARE binary')]);
    const matches = rule.match(data);
    expect(matches).not.toBeNull();
    expect(matches!.ruleName).toBe('test_rule');
  });

  it('does not match non-matching data', () => {
    const rule = new YaraRule({
      ruleName: 'test_rule',
      meta: { description: 'Test YARA rule' },
      strings: [
        { identifier: '$a', value: 'MALWARE', modifiers: [] },
      ],
      condition: 'any of them',
    });
    const data = new Uint8Array([...Buffer.from('benign content')]);
    const matches = rule.match(data);
    expect(matches).toBeNull();
  });

  it('matches string data', () => {
    const rule = new YaraRule({
      ruleName: 'test_rule',
      meta: {},
      strings: [
        { identifier: '$a', value: 'evil', modifiers: [] },
      ],
      condition: 'any of them',
    });
    const matches = rule.match('contains evil stuff');
    expect(matches).not.toBeNull();
  });

  it('all of them requires all strings to match', () => {
    const rule = new YaraRule({
      ruleName: 'multi_rule',
      meta: {},
      strings: [
        { identifier: '$a', value: 'MALWARE', modifiers: [] },
        { identifier: '$b', value: 'EVIL', modifiers: [] },
      ],
      condition: 'all of them',
    });
    const data = new Uint8Array([...Buffer.from('MALWARE and EVIL binary')]);
    const matches = rule.match(data);
    expect(matches).not.toBeNull();
    expect(matches!.ruleName).toBe('multi_rule');
  });
});

describe('TaxiiServer', () => {
  const server = new TaxiiServer({ title: 'Test TAXII', description: 'Test', contact: 'test@test.com', default: 'default', apiRoots: ['/api1'], versions: ['2.1'], maxContentLength: 1000000 });

  it('adds and lists collections', () => {
    server.addCollection({ id: 'col1', title: 'Collection 1', description: 'Test collection', canRead: true, canWrite: true, mediaTypes: ['application/stix+json'] });
    const collections = server.getCollections();
    expect(collections.length).toBe(1);
    expect(collections[0]!.id).toBe('col1');
  });

  it('gets collection by ID', () => {
    const col = server.getCollection('col1');
    expect(col?.title).toBe('Collection 1');
  });

  it('adds and retrieves objects', () => {
    const status = server.addObjects('col1', [{ type: 'indicator', id: stixId('indicator--1') }] as StixObject[]);
    expect(status.id).toBeDefined();
    expect(status.successCount).toBe(1);
    expect(status.failureCount).toBe(0);
    const objects = server.getObjects('col1');
    expect(objects.length).toBe(1);
    expect(objects[0]!.id).toBe('indicator--1');
  });

  it('getStatus returns status entry', () => {
    const status = server.addObjects('col1', []);
    const retrieved = server.getStatus(status.id);
    expect(retrieved?.id).toBe(status.id);
  });
});

describe('AttackMapper', () => {
  const mapper = new AttackMapper();

  beforeEach(() => {
    // Reset mapper state between tests by creating fresh instance
  });

  it('registers and retrieves techniques', () => {
    mapper.registerTechnique({
      techniqueId: attackTechnique('T1059'),
      name: 'Command and Scripting Interpreter',
      tactic: 'execution',
      platform: ['windows', 'linux'],
      permissionsRequired: ['user', 'administrator'],
      dataSources: ['process creation'],
    });
    const t = mapper.getTechnique(attackTechnique('T1059'));
    expect(t?.name).toBe('Command and Scripting Interpreter');
  });

  it('returns undefined for unknown technique', () => {
    expect(mapper.getTechnique(attackTechnique('T9999'))).toBeUndefined();
  });

  it('filters by tactic', () => {
    mapper.registerTechnique({
      techniqueId: attackTechnique('T1003'),
      name: 'OS Credential Dumping',
      tactic: 'credential-access',
      platform: ['windows'],
      permissionsRequired: ['administrator'],
      dataSources: [],
    });
    const results = mapper.getTechniquesByTactic('credential-access');
    expect(results.length).toBe(1);
    expect(results[0]!.techniqueId).toBe('T1003');
  });

  it('filters by platform', () => {
    mapper.registerTechnique({
      techniqueId: attackTechnique('T1059'),
      name: 'Command and Scripting Interpreter',
      tactic: 'execution',
      platform: ['windows', 'linux'],
      permissionsRequired: ['user'],
      dataSources: [],
    });
    const results = mapper.getTechniquesByPlatform('linux');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searches by keyword', () => {
    mapper.registerTechnique({
      techniqueId: attackTechnique('T1003'),
      name: 'OS Credential Dumping',
      tactic: 'credential-access',
      platform: ['windows'],
      permissionsRequired: ['administrator'],
      dataSources: [],
    });
    const results = mapper.searchTechniques('credential');
    expect(results.length).toBeGreaterThan(0);
  });

  it('registers and retrieves groups', () => {
    mapper.registerTechnique({
      techniqueId: attackTechnique('T1059'),
      name: 'Command and Scripting Interpreter',
      tactic: 'execution',
      platform: ['windows', 'linux'],
      permissionsRequired: ['user'],
      dataSources: [],
    });
    mapper.registerGroup({
      groupId: 'G0007',
      name: 'APT28',
      aliases: ['Fancy Bear', 'Sednit'],
      associatedTechniques: [attackTechnique('T1059')],
    });
    const group = mapper.getGroup('G0007');
    expect(group?.name).toBe('APT28');
    expect(group?.aliases).toContain('Fancy Bear');
    expect(mapper.getGroupsByTechnique(attackTechnique('T1059'))).toHaveLength(1);
  });

  it('loadEnterpriseTechniques adds real ATT&CK data', () => {
    mapper.loadEnterpriseTechniques();
    expect(mapper.searchTechniques('shell').length).toBeGreaterThan(0);
  });

  it('loadIcsTechniques adds real ICS ATT&CK data', () => {
    mapper.loadIcsTechniques();
    const icsResults = mapper.getTechniquesByPlatform('field-controller');
    expect(icsResults.length).toBeGreaterThan(0);
  });
});

describe('presets', () => {
  it('sigmaPresets has 3 rules', () => {
    expect(sigmaPresets.length).toBe(3);
  });

  it('createDefaultSigmaRuleEngine returns rules', () => {
    const rules = createDefaultSigmaRuleEngine();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0]).toBeInstanceOf(SigmaRule);
  });

  it('yaraPresets has 2 rules', () => {
    expect(yaraPresets.length).toBe(2);
  });

  it('createDefaultYaraEngine returns rules', () => {
    const rules = createDefaultYaraEngine();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0]).toBeInstanceOf(YaraRule);
  });
});
