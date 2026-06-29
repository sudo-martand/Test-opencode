import { describe, it, expect } from 'vitest';
import {
  HoneypotType,
  HoneypotStatus,
  HoneytokenType,
  IntrusionSeverity,
  HoneypotManager,
  HoneytokenManager,
  DeceptionEngine,
  createDefaultDeceptionEngine,
  createHoneypot,
  createSshHoneypot,
  createHttpHoneypot,
  createCredentialHoneytoken,
  createFileHoneytoken,
  createApiKeyHoneytoken,
  createBreadcrumb,
  createHoneypotConfig,
  honeypotId,
  honeytokenId,
  decoyId,
  breadcrumbId,
  deceptionNetworkId,
} from '../index';

describe('ID generators', () => {
  it('generates honeypot IDs', () => {
    const id = honeypotId();
    expect(id).toMatch(/^hp-/);
  });

  it('generates honeytoken IDs', () => {
    const id = honeytokenId();
    expect(id).toMatch(/^ht-/);
  });

  it('generates unique IDs', () => {
    const a = honeypotId();
    const b = honeypotId();
    expect(a).not.toBe(b);
  });
});

describe('HoneypotConfig', () => {
  it('creates SSH config with defaults', () => {
    const config = createHoneypotConfig(HoneypotType.SSH);
    expect(config.port).toBe(22);
    expect(config.banner).toContain('OpenSSH');
    expect(config.interactive).toBe(true);
  });

  it('creates HTTP config with defaults', () => {
    const config = createHoneypotConfig(HoneypotType.HTTP);
    expect(config.port).toBe(80);
    expect(config.banner).toContain('Apache');
  });

  it('applies overrides', () => {
    const config = createHoneypotConfig(HoneypotType.SSH, { port: 2222, maxConnections: 10 });
    expect(config.port).toBe(2222);
    expect(config.maxConnections).toBe(10);
  });

  it('creates config for all honeypot types', () => {
    for (const type of Object.values(HoneypotType)) {
      const config = createHoneypotConfig(type);
      expect(config.port).toBeGreaterThan(0);
      expect(config.type).toBe(type);
    }
  });
});

describe('Honeypot creation', () => {
  it('creates SSH honeypot', () => {
    const hp = createSshHoneypot();
    expect(hp.type).toBe(HoneypotType.SSH);
    expect(hp.status).toBe(HoneypotStatus.Running);
    expect(hp.id).toMatch(/^hp-/);
    expect(hp.intrusions).toEqual([]);
  });

  it('creates HTTP honeypot', () => {
    const hp = createHttpHoneypot();
    expect(hp.type).toBe(HoneypotType.HTTP);
    expect(hp.config.port).toBe(80);
  });

  it('creates generic honeypot', () => {
    const hp = createHoneypot(HoneypotType.Modbus);
    expect(hp.type).toBe(HoneypotType.Modbus);
    expect(hp.config.port).toBe(502);
  });
});

describe('HoneypotManager', () => {
  it('deploys and retrieves honeypots', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    expect(mgr.get(hp.id)).toBeDefined();
    expect(mgr.list().length).toBe(1);
  });

  it('lists honeypots by type', () => {
    const mgr = new HoneypotManager();
    mgr.deploy(HoneypotType.SSH);
    mgr.deploy(HoneypotType.SSH);
    mgr.deploy(HoneypotType.HTTP);
    expect(mgr.listByType(HoneypotType.SSH).length).toBe(2);
    expect(mgr.listByType(HoneypotType.HTTP).length).toBe(1);
  });

  it('starts and stops honeypots', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    mgr.stop(hp.id);
    expect(mgr.get(hp.id)?.status).toBe(HoneypotStatus.Stopped);
    mgr.start(hp.id);
    expect(mgr.get(hp.id)?.status).toBe(HoneypotStatus.Running);
  });

  it('pauses running honeypots', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    mgr.pause(hp.id);
    expect(mgr.get(hp.id)?.status).toBe(HoneypotStatus.Paused);
  });

  it('does not pause stopped honeypots', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    mgr.stop(hp.id);
    expect(mgr.pause(hp.id)).toBe(false);
  });

  it('removes honeypots', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    expect(mgr.remove(hp.id)).toBe(true);
    expect(mgr.get(hp.id)).toBeUndefined();
  });

  it('returns false removing non-existent honeypot', () => {
    const mgr = new HoneypotManager();
    expect(mgr.remove('nonexistent' as HoneypotType)).toBe(false);
  });

  it('records intrusions', () => {
    const mgr = new HoneypotManager();
    const hp = mgr.deploy(HoneypotType.SSH);
    const record = mgr.recordIntrusion(hp.id, '10.0.0.1', 54321, ['ls', 'whoami']);
    expect(record).toBeDefined();
    expect(record!.sourceIp).toBe('10.0.0.1');
    expect(record!.commands).toEqual(['ls', 'whoami']);
    expect(record!.severity).toBe(IntrusionSeverity.Medium);

    const updated = mgr.get(hp.id);
    expect(updated?.status).toBe(HoneypotStatus.Compromised);
    expect(updated?.intrusions.length).toBe(1);
  });

  it('records null for non-existent honeypot', () => {
    const mgr = new HoneypotManager();
    expect(mgr.recordIntrusion('fake' as HoneypotType, '1.2.3.4', 80)).toBeNull();
  });

  it('gets stats', () => {
    const mgr = new HoneypotManager();
    mgr.deploy(HoneypotType.SSH);
    mgr.deploy(HoneypotType.HTTP);
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.running).toBe(2);
  });

  it('clears all honeypots', () => {
    const mgr = new HoneypotManager();
    mgr.deploy(HoneypotType.SSH);
    mgr.deploy(HoneypotType.HTTP);
    mgr.clear();
    expect(mgr.list().length).toBe(0);
  });
});

describe('Honeytoken creation', () => {
  it('creates credential honeytoken', () => {
    const token = createCredentialHoneytoken('admin', 'secret', 'SSH', '10.0.0.1', '/root/.ssh/config');
    expect(token.type).toBe(HoneytokenType.Credential);
    expect(token.username).toBe('admin');
    expect(token.password).toBe('secret');
    expect(token.service).toBe('SSH');
    expect(token.triggeredAt).toBeNull();
  });

  it('creates file honeytoken', () => {
    const token = createFileHoneytoken('/path/to/file.txt', 'fake content', '/path/to/');
    expect(token.type).toBe(HoneytokenType.File);
    expect(token.path).toBe('/path/to/file.txt');
    expect(token.content).toBe('fake content');
  });

  it('creates API key honeytoken', () => {
    const token = createApiKeyHoneytoken('aws', ['s3:*'], '/home/user/.aws/creds');
    expect(token.type).toBe(HoneytokenType.ApiKey);
    expect(token.service).toBe('aws');
    expect(token.permissions).toEqual(['s3:*']);
    expect(token.value.length).toBeGreaterThan(10);
  });
});

describe('HoneytokenManager', () => {
  it('deploys and retrieves honeytokens', () => {
    const mgr = new HoneytokenManager();
    const token = createCredentialHoneytoken('user', 'pass', 'SSH', 'host', '/path');
    mgr.deploy(token);
    expect(mgr.get(token.id)).toBeDefined();
    expect(mgr.list().length).toBe(1);
  });

  it('lists by type', () => {
    const mgr = new HoneytokenManager();
    mgr.deploy(createCredentialHoneytoken('u1', 'p1', 'SSH', 'h1', '/a'));
    mgr.deploy(createCredentialHoneytoken('u2', 'p2', 'SSH', 'h2', '/b'));
    mgr.deploy(createApiKeyHoneytoken('aws', [], '/c'));
    expect(mgr.listByType(HoneytokenType.Credential).length).toBe(2);
    expect(mgr.listByType(HoneytokenType.ApiKey).length).toBe(1);
  });

  it('lists by location', () => {
    const mgr = new HoneytokenManager();
    mgr.deploy(createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/home/user/'));
    mgr.deploy(createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/root/'));
    expect(mgr.listByLocation('/home').length).toBe(1);
  });

  it('triggers honeytokens', () => {
    const mgr = new HoneytokenManager();
    const token = createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/path');
    mgr.deploy(token);
    expect(mgr.trigger(token.id, '10.0.0.1')).toBe(true);
    expect(mgr.get(token.id)?.triggeredAt).toBeInstanceOf(Date);
    expect(mgr.get(token.id)?.triggeredBy).toBe('10.0.0.1');
  });

  it('does not double-trigger', () => {
    const mgr = new HoneytokenManager();
    const token = createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/path');
    mgr.deploy(token);
    mgr.trigger(token.id, '10.0.0.1');
    expect(mgr.trigger(token.id, '10.0.0.2')).toBe(false);
  });

  it('lists triggered/untriggered', () => {
    const mgr = new HoneytokenManager();
    const t1 = createCredentialHoneytoken('u1', 'p1', 'SSH', 'h1', '/a');
    const t2 = createCredentialHoneytoken('u2', 'p2', 'SSH', 'h2', '/b');
    mgr.deploy(t1);
    mgr.deploy(t2);
    mgr.trigger(t1.id, '10.0.0.1');
    expect(mgr.listTriggered().length).toBe(1);
    expect(mgr.listUntriggered().length).toBe(1);
  });

  it('removes honeytokens', () => {
    const mgr = new HoneytokenManager();
    const token = createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/path');
    mgr.deploy(token);
    expect(mgr.remove(token.id)).toBe(true);
    expect(mgr.list().length).toBe(0);
  });

  it('gets stats', () => {
    const mgr = new HoneytokenManager();
    const t1 = createCredentialHoneytoken('u1', 'p1', 'SSH', 'h1', '/a');
    const t2 = createCredentialHoneytoken('u2', 'p2', 'SSH', 'h2', '/b');
    mgr.deploy(t1);
    mgr.deploy(t2);
    mgr.trigger(t1.id, '10.0.0.1');
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.triggered).toBe(1);
    expect(stats.byType['credential']).toBe(2);
  });

  it('clears all honeytokens', () => {
    const mgr = new HoneytokenManager();
    mgr.deploy(createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/a'));
    mgr.deploy(createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/b'));
    mgr.clear();
    expect(mgr.list().length).toBe(0);
  });
});

describe('Breadcrumbs', () => {
  it('creates breadcrumb', () => {
    const bc = createBreadcrumb('config_backup', '/var/backups/', 'Contains credentials', true);
    expect(bc.id).toMatch(/^bc-/);
    expect(bc.type).toBe('config_backup');
    expect(bc.triggeredAt).toBeNull();
  });
});

describe('DeceptionEngine', () => {
  it('creates networks', () => {
    const engine = new DeceptionEngine();
    const net = engine.createNetwork('test-net', ['10.0.0.0/24']);
    expect(net.id).toMatch(/^dn-/);
    expect(engine.listNetworks().length).toBe(1);
    expect(engine.getNetwork(net.id)).toBeDefined();
  });

  it('adds hosts to networks', () => {
    const engine = new DeceptionEngine();
    const net = engine.createNetwork('test', ['10.0.0.0/24']);
    const host = {
      id: decoyId(),
      hostname: 'test-host',
      ipAddress: '10.0.0.1',
      os: 'Linux',
      services: [],
      tags: [],
    };
    expect(engine.addHostToNetwork(net.id, host)).toBe(true);
    expect(engine.getNetwork(net.id)?.hosts.length).toBe(1);
  });

  it('manages breadcrumbs', () => {
    const engine = new DeceptionEngine();
    const bc = createBreadcrumb('test', '/tmp', 'content');
    engine.addBreadcrumb(bc);
    expect(engine.listBreadcrumbs().length).toBe(1);
    expect(engine.getBreadcrumb(bc.id)).toBeDefined();
    expect(engine.triggerBreadcrumb(bc.id, '10.0.0.1')).toBe(true);
    expect(engine.removeBreadcrumb(bc.id)).toBe(true);
    expect(engine.listBreadcrumbs().length).toBe(0);
  });

  it('provides stats', () => {
    const engine = new DeceptionEngine();
    const stats = engine.getStats();
    expect(stats.totalHoneypots).toBe(0);
    expect(stats.totalHoneytokens).toBe(0);
    expect(typeof stats.uptime).toBe('number');
  });

  it('resets state', () => {
    const engine = new DeceptionEngine();
    engine.honeypots.deploy(HoneypotType.SSH);
    engine.honeytokens.deploy(createCredentialHoneytoken('u', 'p', 'SSH', 'h', '/p'));
    engine.createNetwork('test', ['10.0.0.0/24']);
    engine.reset();
    expect(engine.listNetworks().length).toBe(0);
    expect(engine.honeypots.list().length).toBe(0);
    expect(engine.honeytokens.list().length).toBe(0);
  });
});

describe('createDefaultDeceptionEngine', () => {
  it('creates a fully populated deception environment', () => {
    const engine = createDefaultDeceptionEngine();
    expect(engine.listNetworks().length).toBe(1);
    expect(engine.honeypots.list().length).toBe(3);
    expect(engine.honeytokens.list().length).toBe(4);
    expect(engine.listBreadcrumbs().length).toBe(2);
  });

  it('creates default network with hosts', () => {
    const engine = createDefaultDeceptionEngine();
    const net = engine.listNetworks()[0];
    expect(net?.hosts.length).toBe(3);
    expect(net?.subnets).toContain('10.0.100.0/24');
  });

  it('deploys varied honeypots', () => {
    const engine = createDefaultDeceptionEngine();
    const types = engine.honeypots.list().map((hp) => hp.type);
    expect(types).toContain(HoneypotType.SSH);
    expect(types).toContain(HoneypotType.HTTP);
    expect(types).toContain(HoneypotType.MySQL);
  });

  it('deploys varied honeytokens', () => {
    const engine = createDefaultDeceptionEngine();
    const types = engine.honeytokens.list().map((t) => t.type);
    expect(types).toContain(HoneytokenType.Credential);
    expect(types).toContain(HoneytokenType.ApiKey);
    expect(types).toContain(HoneytokenType.File);
  });

  it('provides meaningful stats', () => {
    const engine = createDefaultDeceptionEngine();
    const stats = engine.getStats();
    expect(typeof stats.totalHoneypots).toBe('number');
    expect(typeof stats.uptime).toBe('number');
  });
});
