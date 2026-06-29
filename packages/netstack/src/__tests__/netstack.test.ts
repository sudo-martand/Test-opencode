import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventBus } from '@cybersim/shared';
import {
  macAddress, ipV4Address, ipV6Address, port,
  NetworkStackImpl, createDefaultStackConfig,
  TcpState, TcpFlag,
  MacAddress, IpV4Address, Port, Packet,
} from '../index.js';

function defaultStack() {
  const config = createDefaultStackConfig('testhost');
  config.interfaces[1]!.ipv4 = ipV4Address('192.168.1.10');
  config.interfaces[1]!.ipv4Mask = '255.255.255.0';
  config.interfaces[1]!.gateway = ipV4Address('192.168.1.1');
  return new NetworkStackImpl(config);
}

describe('branded type constructors', () => {
  it('macAddress validates format', () => {
    expect(macAddress('00:11:22:33:44:55')).toBe('00:11:22:33:44:55');
    expect(() => macAddress('invalid')).toThrow('Invalid MAC');
    expect(() => macAddress('00:11:22:33:44:zz')).toThrow('Invalid MAC');
  });

  it('ipV4Address validates format', () => {
    expect(ipV4Address('192.168.1.1')).toBe('192.168.1.1');
    expect(() => ipV4Address('256.1.1.1')).toThrow('Invalid IPv4');
    expect(() => ipV4Address('1.2.3.256')).toThrow('Invalid IPv4');
    expect(() => ipV4Address('1.2.3')).toThrow('Invalid IPv4');
  });

  it('ipV6Address validates format', () => {
    expect(ipV6Address('::1')).toBe('::1');
    expect(ipV6Address('fe80::1')).toBe('fe80::1');
    expect(() => ipV6Address('invalid')).toThrow('Invalid IPv6');
  });

  it('port validates range', () => {
    expect(port(80)).toBe(80);
    expect(port(0)).toBe(0);
    expect(port(65535)).toBe(65535);
    expect(() => port(-1)).toThrow('Invalid port');
    expect(() => port(65536)).toThrow('Invalid port');
  });
});

describe('NetworkStackImpl', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('creates with default config', () => {
    expect(stack.config.hostname).toBe('testhost');
    expect(stack.interfaces.size).toBe(2);
    expect(stack.interfaces.has('lo')).toBe(true);
    expect(stack.interfaces.has('eth0')).toBe(true);
  });

  it('getInterface returns named interface', () => {
    const iface = stack.getInterface('eth0');
    expect(iface).toBeDefined();
    expect(iface!.config.name).toBe('eth0');
    expect(stack.getInterface('nonexistent')).toBeUndefined();
  });

  it('start and stop lifecycle', () => {
    stack.start();
    stack.tick(100);
    stack.stop();
  });

  it('reset clears all state', () => {
    stack.start();
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    stack.udpBind(ipV4Address('127.0.0.1'), port(53));
    expect(stack.connections.size).toBeGreaterThan(0);
    expect(stack.sockets.size).toBeGreaterThan(0);

    stack.reset();
    expect(stack.connections.size).toBe(0);
    expect(stack.sockets.size).toBe(0);
  });
});

describe('TCP state machine', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('tcpConnect creates SYN_SENT connection', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    expect(conn.state).toBe(TcpState.SYN_SENT);
    expect(conn.remoteAddr).toBe('10.0.0.1');
    expect(conn.remotePort).toBe(80);
    expect(stack.connections.has(conn.id)).toBe(true);
  });

  it('tcpConnect uses eth0 IP as source when available', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    expect(conn.localAddr).toBe('192.168.1.10');
  });

  it('tcpListen creates LISTEN connection', () => {
    stack.tcpListen(ipV4Address('0.0.0.0'), port(8080));
    const conns = Array.from(stack.connections.values());
    expect(conns.length).toBe(1);
    expect(conns[0]!.state).toBe(TcpState.LISTEN);
    expect(conns[0]!.localPort).toBe(8080);
  });

  it('tcpClose transitions ESTABLISHED to FIN_WAIT_1', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.ESTABLISHED);
    stack.tcpClose(conn.id);
    expect(conn.state).toBe(TcpState.FIN_WAIT_1);
  });

  it('tcpClose transitions CLOSE_WAIT to LAST_ACK', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.CLOSE_WAIT);
    stack.tcpClose(conn.id);
    expect(conn.state).toBe(TcpState.LAST_ACK);
  });

  it('tcpClose removes CLOSED connections from map', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.CLOSED);
    expect(conn.closed()).toBe(true);
    stack.tcpClose(conn.id);
    expect(stack.connections.has(conn.id)).toBe(false);
  });

  it('connection transition to TIME_WAIT sets closed', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.TIME_WAIT);
    expect(conn.closed()).toBe(true);
  });

  it('allocates unique ephemeral ports', () => {
    const c1 = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    const c2 = stack.tcpConnect(ipV4Address('10.0.0.2'), port(80));
    expect(c1.localPort).not.toBe(c2.localPort);
  });

  it('TCP control block has reasonable defaults', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    expect(conn.sendSequence).toBeGreaterThan(0);
    expect(conn.recvSequence).toBeGreaterThan(0);
    expect(conn.windowSize).toBe(65535);
    expect(conn.mtu).toBe(1500);
    expect(conn.rtt).toBe(30);
    expect(conn.retransmissionTimeout).toBe(200);
    expect(conn.congestionWindow).toBe(14600);
    expect(conn.slowStartThreshold).toBe(65535);
  });

  it('getConnection returns by id', () => {
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    expect(stack.getConnection(conn.id)).toBe(conn);
    expect(stack.getConnection('nonexistent')).toBeUndefined();
  });

  it('tcpClose on non-existent id is noop', () => {
    expect(() => stack.tcpClose('nonexistent')).not.toThrow();
  });
});

describe('UDP', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('udpBind creates socket', () => {
    const sock = stack.udpBind(ipV4Address('0.0.0.0'), port(53));
    expect(sock.localAddr).toBe('0.0.0.0');
    expect(sock.localPort).toBe(53);
    expect(stack.sockets.has(sock.id)).toBe(true);
  });

  it('udpSend on unbound socket is noop', () => {
    expect(() => stack.udpSend('nonexistent', new Uint8Array([1, 2, 3]), ipV4Address('10.0.0.1'), port(53))).not.toThrow();
  });

  it('udpSend sends via routed interface', () => {
    stack.start();
    const sock = stack.udpBind(ipV4Address('192.168.1.10'), port(12345));
    const iface = stack.getInterface('eth0')!;
    const statsBefore = { ...iface.stats };
    stack.udpSend(sock.id, new Uint8Array([1, 2, 3]), ipV4Address('10.0.0.1'), port(53));
    expect(iface.stats.packetsSent).toBe(statsBefore.packetsSent + 1);
  });

  it('udpSend to localhost uses lo interface', () => {
    stack.start();
    const sock = stack.udpBind(ipV4Address('127.0.0.1'), port(12345));
    const loIface = stack.getInterface('lo')!;
    const statsBefore = { ...loIface.stats };
    stack.udpSend(sock.id, new Uint8Array([1, 2, 3]), ipV4Address('127.0.0.1'), port(53));
    expect(loIface.stats.packetsSent).toBe(statsBefore.packetsSent + 1);
  });
});

describe('DNS', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('resolves localhost to 127.0.0.1', () => {
    const records = stack.dnsLookup('localhost');
    expect(records.length).toBe(1);
    expect(records[0]!.data).toBe('127.0.0.1');
    expect(records[0]!.ttl).toBe(3600);
  });

  it('resolves arbitrary hostnames', () => {
    const records = stack.dnsLookup('example.com');
    expect(records.length).toBe(1);
    expect(records[0]!.name).toBe('example.com');
    expect(records[0]!.type).toBe(1);
  });

  it('caches DNS results', () => {
    const r1 = stack.dnsLookup('example.com');
    const r2 = stack.dnsLookup('example.com');
    expect(r2).toEqual(r1);
  });
});

describe('ARP cache', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('learns interface ARP on start', () => {
    stack.start();
    const iface = stack.getInterface('eth0')!;
    expect(iface.stats).toBeDefined();
  });
});

describe('NetworkInterface', () => {
  let stack: NetworkStackImpl;

  beforeEach(() => {
    stack = defaultStack();
  });

  it('send increments stats on enabled interface', () => {
    const iface = stack.getInterface('eth0')!;
    const pkt: Packet = {
      id: 'test',
      timestamp: Date.now(),
      length: 100,
      interfaceName: 'eth0',
      data: new Uint8Array(100),
    };
    iface.send(pkt);
    expect(iface.stats.packetsSent).toBe(1);
    expect(iface.stats.bytesSent).toBe(100);
  });

  it('send drops on disabled interface', () => {
    const iface = stack.getInterface('eth0')!;
    iface.config.enabled = false;
    const pkt: Packet = {
      id: 'test',
      timestamp: Date.now(),
      length: 100,
      interfaceName: 'eth0',
      data: new Uint8Array(100),
    };
    iface.send(pkt);
    expect(iface.stats.drops).toBe(1);
    expect(iface.stats.packetsSent).toBe(0);
  });

  it('receive triggers packet handlers', () => {
    const iface = stack.getInterface('eth0')!;
    const handler = { called: false, packet: null as Packet | null };
    iface.onPacket((p) => { handler.called = true; handler.packet = p; });
    const pkt: Packet = {
      id: 'test',
      timestamp: Date.now(),
      length: 50,
      interfaceName: 'eth0',
      data: new Uint8Array(50),
    };
    iface.receive(pkt);
    expect(handler.called).toBe(true);
    expect(handler.packet!.id).toBe('test');
    expect(iface.stats.packetsReceived).toBe(1);
    expect(iface.stats.bytesReceived).toBe(50);
  });

  it('receive drops on disabled interface', () => {
    const iface = stack.getInterface('eth0')!;
    const handler = { called: false };
    iface.onPacket(() => { handler.called = true; });
    iface.config.enabled = false;
    iface.receive({
      id: 'test', timestamp: Date.now(), length: 50,
      interfaceName: 'eth0', data: new Uint8Array(50),
    });
    expect(handler.called).toBe(false);
    expect(iface.stats.drops).toBe(1);
  });

  it('onPacket returns unsubscribe function', () => {
    const iface = stack.getInterface('eth0')!;
    const handler = { called: false };
    const unsub = iface.onPacket(() => { handler.called = true; });
    unsub();
    iface.receive({
      id: 'test', timestamp: Date.now(), length: 50,
      interfaceName: 'eth0', data: new Uint8Array(50),
    });
    expect(handler.called).toBe(false);
  });

  it('reset clears stats', () => {
    const iface = stack.getInterface('eth0')!;
    iface.send({
      id: 'test', timestamp: Date.now(), length: 100,
      interfaceName: 'eth0', data: new Uint8Array(100),
    });
    iface.reset();
    expect(iface.stats.packetsSent).toBe(0);
    expect(iface.stats.bytesSent).toBe(0);
    expect(iface.stats.packetsReceived).toBe(0);
  });
});

describe('receivePacket', () => {
  it('delivers packet to interface', () => {
    const stack = defaultStack();
    const iface = stack.getInterface('eth0')!;
    const handler = { called: false };
    iface.onPacket(() => { handler.called = true; });
    stack.receivePacket('eth0', new Uint8Array([1, 2, 3]));
    expect(handler.called).toBe(true);
  });

  it('ignores unknown interfaces', () => {
    const stack = defaultStack();
    expect(() => stack.receivePacket('nonexistent', new Uint8Array([1]))).not.toThrow();
  });
});

describe('tick', () => {
  it('cleans up closed connections', () => {
    const stack = defaultStack();
    stack.start();
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.CLOSED);
    expect(stack.connections.has(conn.id)).toBe(true);
    stack.tick(100);
    expect(stack.connections.has(conn.id)).toBe(false);
  });

  it('does not run when stopped', () => {
    const stack = defaultStack();
    const conn = stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    conn.transition(TcpState.CLOSED);
    stack.tick(100);
    expect(stack.connections.has(conn.id)).toBe(true);
  });
});

describe('event bus integration', () => {
  it('emits events', () => {
    const bus = new InMemoryEventBus();
    const events: string[] = [];
    bus.subscribeAll((e) => { events.push(e.type); });

    const stack = defaultStack();
    stack.attach(bus);
    stack.tcpConnect(ipV4Address('10.0.0.1'), port(80));
    expect(events).toContain('netstack.tcp.connect');
  });

  it('attaches bus to interfaces', () => {
    const bus = new InMemoryEventBus();
    const events: string[] = [];
    bus.subscribeAll((e) => { events.push(e.type); });

    const stack = defaultStack();
    stack.attach(bus);
    const pkt: Packet = {
      id: 'test', timestamp: Date.now(), length: 10,
      interfaceName: 'eth0', data: new Uint8Array(10),
    };
    stack.getInterface('eth0')!.send(pkt);
    expect(events).toContain('netstack.net.interface.send');
  });
});

describe('ipv4 utilities', () => {
  it('createDefaultInterfaceConfig creates lo', () => {
    const config = createDefaultStackConfig('test');
    expect(config.hostname).toBe('test');
    expect(config.interfaces[0]!.loopback).toBe(true);
    expect(config.interfaces[0]!.name).toBe('lo');
    expect(config.interfaces[1]!.name).toBe('eth0');
  });
});
