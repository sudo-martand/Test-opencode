import type { EventBus } from '@cybersim/shared';
import { uid, createEvent } from '@cybersim/shared';

export type MacAddress = string & { readonly __brand: 'mac' };
export type IpV4Address = string & { readonly __brand: 'ipv4' };
export type IpV6Address = string & { readonly __brand: 'ipv6' };
export type IpAddress = IpV4Address | IpV6Address;
export type Port = number & { readonly __brand: 'port' };

export function macAddress(value: string): MacAddress {
  if (!/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(value)) {
    throw new Error(`Invalid MAC address: ${value}`);
  }
  return value as MacAddress;
}

export function ipV4Address(value: string): IpV4Address {
  const parts = value.split('.');
  if (parts.length !== 4) throw new Error(`Invalid IPv4: ${value}`);
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (n < 0 || n > 255) throw new Error(`Invalid IPv4: ${value}`);
  }
  return value as IpV4Address;
}

export function ipV6Address(value: string): IpV6Address {
  if (!value.includes(':')) throw new Error(`Invalid IPv6: ${value}`);
  return value as IpV6Address;
}

export function port(value: number): Port {
  if (value < 0 || value > 65535) throw new Error(`Invalid port: ${value}`);
  return value as Port;
}

export enum EtherType {
  IPv4 = 0x0800,
  IPv6 = 0x86DD,
  ARP = 0x0806,
  VLAN = 0x8100,
}

export enum IpProtocol {
  ICMP = 1,
  TCP = 6,
  UDP = 17,
  ICMPv6 = 58,
}

export enum TcpFlag {
  FIN = 0x01,
  SYN = 0x02,
  RST = 0x04,
  PSH = 0x08,
  ACK = 0x10,
  URG = 0x20,
  ECE = 0x40,
  CWR = 0x80,
  NS = 0x100,
}

export interface EthernetFrame {
  dstMac: MacAddress;
  srcMac: MacAddress;
  etherType: EtherType;
  payload: Uint8Array;
}

export interface IpV4Header {
  version: 4;
  ihl: number;
  dscp: number;
  ecn: number;
  totalLength: number;
  identification: number;
  flags: number;
  fragmentOffset: number;
  ttl: number;
  protocol: IpProtocol;
  headerChecksum: number;
  src: IpV4Address;
  dst: IpV4Address;
  options?: Uint8Array;
}

export interface IpV6Header {
  version: 6;
  trafficClass: number;
  flowLabel: number;
  payloadLength: number;
  nextHeader: IpProtocol;
  hopLimit: number;
  src: IpV6Address;
  dst: IpV6Address;
}

export interface TcpHeader {
  srcPort: Port;
  dstPort: Port;
  sequenceNumber: number;
  acknowledgmentNumber: number;
  dataOffset: number;
  flags: number;
  windowSize: number;
  checksum: number;
  urgentPointer: number;
  options?: Uint8Array;
}

export interface UdpHeader {
  srcPort: Port;
  dstPort: Port;
  length: number;
  checksum: number;
}

export interface Packet {
  id: string;
  timestamp: number;
  length: number;
  interfaceName: string;
  data: Uint8Array;
}

export enum TcpState {
  CLOSED = 'CLOSED',
  LISTEN = 'LISTEN',
  SYN_SENT = 'SYN_SENT',
  SYN_RECEIVED = 'SYN_RECEIVED',
  ESTABLISHED = 'ESTABLISHED',
  FIN_WAIT_1 = 'FIN_WAIT_1',
  FIN_WAIT_2 = 'FIN_WAIT_2',
  CLOSE_WAIT = 'CLOSE_WAIT',
  CLOSING = 'CLOSING',
  LAST_ACK = 'LAST_ACK',
  TIME_WAIT = 'TIME_WAIT',
}

export interface TcpConnection {
  readonly id: string;
  readonly state: TcpState;
  readonly localAddr: IpAddress;
  readonly localPort: Port;
  readonly remoteAddr: IpAddress;
  readonly remotePort: Port;
  readonly sendSequence: number;
  readonly recvSequence: number;
  readonly windowSize: number;
  readonly mtu: number;
  readonly rtt: number;
  readonly congestionWindow: number;
  readonly slowStartThreshold: number;
  readonly retransmissionTimeout: number;
}

export interface UdpSocket {
  readonly id: string;
  readonly localAddr: IpAddress;
  readonly localPort: Port;
  readonly remoteAddr: IpAddress | undefined;
  readonly remotePort: Port | undefined;
}

export interface DnsMessage {
  id: number;
  flags: number;
  questions: DnsQuestion[];
  answers: DnsRecord[];
  authorities: DnsRecord[];
  additionals: DnsRecord[];
}

export interface DnsQuestion {
  name: string;
  type: DnsRecordType;
  classCode: number;
}

export interface DnsRecord {
  name: string;
  type: DnsRecordType;
  classCode: number;
  ttl: number;
  data: Uint8Array | string;
}

export enum DnsRecordType {
  A = 1,
  NS = 2,
  CNAME = 5,
  SOA = 6,
  AAAA = 28,
  MX = 15,
  TXT = 16,
  DNSSEC = 41,
}

export interface NetworkInterfaceConfig {
  name: string;
  mac: MacAddress;
  ipv4?: IpV4Address;
  ipv4Mask?: string;
  ipv6?: IpV6Address;
  ipv6Prefix?: number;
  gateway?: IpV4Address;
  mtu: number;
  enabled: boolean;
  loopback: boolean;
}

export interface NetworkInterface {
  readonly config: NetworkInterfaceConfig;
  readonly stats: InterfaceStats;
  send(packet: Packet): void;
  receive(packet: Packet): void;
  onPacket(handler: (packet: Packet) => void): () => void;
  reset(): void;
  attach(bus: EventBus): void;
}

export interface InterfaceStats {
  bytesSent: number;
  bytesReceived: number;
  packetsSent: number;
  packetsReceived: number;
  errors: number;
  drops: number;
}

export interface NetworkStackConfig {
  hostname: string;
  interfaces: NetworkInterfaceConfig[];
  dnsServers: IpAddress[];
  arpCacheSize: number;
  tcpWindowScale: boolean;
  tcpSack: boolean;
  tcpTimestamps: boolean;
}

export interface NetworkStack {
  readonly config: NetworkStackConfig;
  readonly interfaces: Map<string, NetworkInterface>;
  readonly connections: Map<string, TcpConnection>;
  readonly sockets: Map<string, UdpSocket>;

  getInterface(name: string): NetworkInterface | undefined;
  getConnection(id: string): TcpConnection | undefined;

  start(): void;
  stop(): void;
  reset(): void;
}

export function createDefaultInterfaceConfig(name: string): NetworkInterfaceConfig {
  return {
    name,
    mac: macAddress('00:00:00:00:00:00'),
    mtu: 1500,
    enabled: true,
    loopback: name === 'lo',
  };
}

export function createDefaultStackConfig(hostname: string): NetworkStackConfig {
  return {
    hostname,
    interfaces: [
      {
        name: 'lo',
        mac: macAddress('00:00:00:00:00:01'),
        ipv4: ipV4Address('127.0.0.1'),
        ipv4Mask: '255.0.0.0',
        mtu: 65536,
        enabled: true,
        loopback: true,
      },
      {
        name: 'eth0',
        mac: macAddress('00:00:00:00:00:02'),
        mtu: 1500,
        enabled: true,
        loopback: false,
      },
    ],
    dnsServers: [ipV4Address('8.8.8.8')],
    arpCacheSize: 1024,
    tcpWindowScale: true,
    tcpSack: true,
    tcpTimestamps: true,
  };
}

class InterfaceStatsImpl implements InterfaceStats {
  bytesSent = 0;
  bytesReceived = 0;
  packetsSent = 0;
  packetsReceived = 0;
  errors = 0;
  drops = 0;
}

class ArpEntry {
  constructor(
    readonly ip: IpV4Address,
    readonly mac: MacAddress,
    public age: number = 0,
  ) {}
}

class ArpCache {
  private entries: Map<string, ArpEntry> = new Map();
  private _time = 0;

  constructor(private maxSize: number) {}

  tick(dt: number): void {
    this._time += dt;
    for (const [key, entry] of this.entries) {
      entry.age += dt;
      if (entry.age > 300_000) this.entries.delete(key);
    }
  }

  lookup(ip: IpV4Address): MacAddress | undefined {
    return this.entries.get(ip)?.mac;
  }

  learn(ip: IpV4Address, mac: MacAddress): void {
    if (this.entries.size >= this.maxSize && !this.entries.has(ip)) {
      const oldest = this.entries.entries().next().value;
      if (oldest) this.entries.delete(oldest[0]);
    }
    this.entries.set(ip, new ArpEntry(ip, mac, 0));
  }

  clear(): void {
    this.entries.clear();
  }

  get size(): number { return this.entries.size; }
}

class NetworkInterfaceImpl implements NetworkInterface {
  readonly config: NetworkInterfaceConfig;
  readonly stats: InterfaceStats = new InterfaceStatsImpl();
  private bus: EventBus | null = null;
  private onPacketHandlers: Set<(packet: Packet) => void> = new Set();

  constructor(config: NetworkInterfaceConfig) {
    this.config = { ...config };
  }

  attach(bus: EventBus): void {
    this.bus = bus;
  }

  send(packet: Packet): void {
    if (!this.config.enabled) {
      this.stats.drops++;
      return;
    }
    this.stats.bytesSent += packet.length;
    this.stats.packetsSent++;
    if (this.bus) {
      this.bus.publish(createEvent('netstack.net.interface.send', {
        interface: this.config.name,
        packet,
      }, { source: 'netstack' }));
    }
  }

  receive(packet: Packet): void {
    if (!this.config.enabled) {
      this.stats.drops++;
      return;
    }
    this.stats.bytesReceived += packet.length;
    this.stats.packetsReceived++;
    for (const handler of this.onPacketHandlers) handler(packet);
  }

  onPacket(handler: (packet: Packet) => void): () => void {
    this.onPacketHandlers.add(handler);
    return () => this.onPacketHandlers.delete(handler);
  }

  reset(): void {
    this.stats.bytesSent = 0;
    this.stats.bytesReceived = 0;
    this.stats.packetsSent = 0;
    this.stats.packetsReceived = 0;
    this.stats.errors = 0;
    this.stats.drops = 0;
  }
}

class TcpControlBlock {
  state: TcpState = TcpState.CLOSED;
  sendSequence: number;
  recvSequence: number;
  sendAcknowledged: number;
  windowSize: number;
  congestionWindow: number;
  slowStartThreshold: number;
  rtt: number;
  retransmissionTimeout: number;
  mtu: number;
  sendBuffer: Uint8Array[] = [];
  recvBuffer: Uint8Array[] = [];

  constructor(
    readonly localAddr: IpAddress,
    readonly localPort: Port,
    readonly remoteAddr: IpAddress,
    readonly remotePort: Port,
  ) {
    this.sendSequence = Math.floor(Math.random() * 1_000_000);
    this.recvSequence = Math.floor(Math.random() * 1_000_000);
    this.sendAcknowledged = this.sendSequence;
    this.windowSize = 65535;
    this.congestionWindow = 14600;
    this.slowStartThreshold = 65535;
    this.rtt = 30;
    this.retransmissionTimeout = 200;
    this.mtu = 1500;
  }
}

class TcpConnectionImpl implements TcpConnection {
  readonly id: string;
  readonly tcb: TcpControlBlock;
  private _closed = false;

  constructor(
    public localAddr: IpAddress,
    public localPort: Port,
    public remoteAddr: IpAddress,
    public remotePort: Port,
  ) {
    this.id = `tcp-${localAddr}:${localPort}-${remoteAddr}:${remotePort}-${uid()}`;
    this.tcb = new TcpControlBlock(localAddr, localPort, remoteAddr, remotePort);
  }

  get state(): TcpState { return this.tcb.state; }
  get sendSequence(): number { return this.tcb.sendSequence; }
  get recvSequence(): number { return this.tcb.recvSequence; }
  get windowSize(): number { return this.tcb.windowSize; }
  get mtu(): number { return this.tcb.mtu; }
  get rtt(): number { return this.tcb.rtt; }
  get congestionWindow(): number { return this.tcb.congestionWindow; }
  get slowStartThreshold(): number { return this.tcb.slowStartThreshold; }
  get retransmissionTimeout(): number { return this.tcb.retransmissionTimeout; }

  transition(newState: TcpState): void {
    this.tcb.state = newState;
    if (newState === TcpState.CLOSED || newState === TcpState.TIME_WAIT) {
      this._closed = true;
    }
  }

  closed(): boolean { return this._closed; }
}

class UdpSocketImpl implements UdpSocket {
  readonly id: string;

  constructor(
    readonly localAddr: IpAddress,
    readonly localPort: Port,
    readonly remoteAddr: IpAddress | undefined,
    readonly remotePort: Port | undefined,
  ) {
    this.id = `udp-${localAddr}:${localPort}-${uid()}`;
  }
}

class DnsResolver {
  private cache: Map<string, { data: DnsRecord[]; expires: number }> = new Map();
  private _time = 0;

  constructor(private servers: IpAddress[]) {}

  tick(dt: number): void {
    this._time += dt;
    for (const [key, entry] of this.cache) {
      if (this._time >= entry.expires) this.cache.delete(key);
    }
  }

  resolve(name: string): DnsRecord[] {
    const cached = this.cache.get(name.toUpperCase());
    if (cached && this._time < cached.expires) return cached.data;

    const records = this.simulateResolve(name);
    this.cache.set(name.toUpperCase(), {
      data: records,
      expires: this._time + 300_000,
    });
    return records;
  }

  private simulateResolve(name: string): DnsRecord[] {
    if (name === 'localhost') {
      return [{
        name, type: DnsRecordType.A, classCode: 1, ttl: 3600,
        data: ipV4Address('127.0.0.1'),
      }];
    }
    const hash = this.simpleHash(name);
    const ip = `${(hash & 0xFF)}.${(hash >> 8) & 0xFF}.${(hash >> 16) & 0xFF}.${(hash >> 24) & 0xFF}` as IpV4Address;
    return [{
      name, type: DnsRecordType.A, classCode: 1, ttl: 300,
      data: ip,
    }];
  }

  private simpleHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  clear(): void {
    this.cache.clear();
  }
}

function ipv4ToInt(ip: IpV4Address): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

function intToIpv4(n: number): IpV4Address {
  return `${(n >>> 24) & 0xFF}.${(n >>> 16) & 0xFF}.${(n >>> 8) & 0xFF}.${n & 0xFF}` as IpV4Address;
}

function ipv4InSubnet(ip: IpV4Address, subnet: IpV4Address, mask: string): boolean {
  const ipInt = ipv4ToInt(ip);
  const subnetInt = ipv4ToInt(subnet);
  const prefixLen = parseInt(mask.split('/')[1] ?? maskToPrefix(mask), 10);
  const maskInt = ~0 << (32 - prefixLen);
  return (ipInt & maskInt) === (subnetInt & maskInt);
}

function maskToPrefix(mask: string): string {
  if (mask.includes('.')) {
    const bits = mask.split('.').map(Number);
    const n = ((bits[0]! << 24) | (bits[1]! << 16) | (bits[2]! << 8) | bits[3]!) >>> 0;
    return String(32 - Math.clz32(n));
  }
  return mask;
}

export class NetworkStackImpl implements NetworkStack {
  readonly interfaces: Map<string, NetworkInterfaceImpl> = new Map();
  readonly connections: Map<string, TcpConnectionImpl> = new Map();
  readonly sockets: Map<string, UdpSocketImpl> = new Map();
  private _running = false;
  private _time = 0;
  private arpCache: ArpCache;
  private dns: DnsResolver;
  private bus?: EventBus;
  private listeners: (() => void)[] = [];
  private nextEphemeralPort = 49152;

  constructor(
    readonly config: NetworkStackConfig,
  ) {
    this.arpCache = new ArpCache(config.arpCacheSize);
    this.dns = new DnsResolver(config.dnsServers);
    for (const ifaceConfig of config.interfaces) {
      this.interfaces.set(ifaceConfig.name, new NetworkInterfaceImpl(ifaceConfig));
    }
  }

  getInterface(name: string): NetworkInterface | undefined {
    return this.interfaces.get(name);
  }

  getConnection(id: string): TcpConnection | undefined {
    return this.connections.get(id);
  }

  private route(ip: IpAddress): NetworkInterfaceImpl | undefined {
    const v4 = ip.includes(':') ? undefined : ip as IpV4Address;
    if (v4 === ipV4Address('127.0.0.1')) {
      return this.interfaces.get('lo');
    }
    for (const iface of this.interfaces.values()) {
      if (v4 && iface.config.ipv4 && iface.config.ipv4Mask) {
        if (ipv4InSubnet(v4, iface.config.ipv4, iface.config.ipv4Mask)) {
          return iface;
        }
      }
    }
    for (const iface of this.interfaces.values()) {
      if (iface.config.gateway && !iface.config.loopback) {
        return iface;
      }
    }
    return undefined;
  }

  private allocEphemeralPort(): Port {
    const p = this.nextEphemeralPort;
    this.nextEphemeralPort = (this.nextEphemeralPort + 1) % 65535;
    if (this.nextEphemeralPort < 49152) this.nextEphemeralPort = 49152;
    return p as Port;
  }

  private findConnectionByEndpoint(
    localAddr: IpAddress, localPort: Port,
    remoteAddr: IpAddress, remotePort: Port,
  ): TcpConnectionImpl | undefined {
    for (const conn of this.connections.values()) {
      if (conn.localAddr === localAddr && conn.localPort === localPort &&
          conn.remoteAddr === remoteAddr && conn.remotePort === remotePort) {
        return conn;
      }
    }
    return undefined;
  }

  tcpConnect(remoteAddr: IpAddress, remotePort: Port, localAddr?: IpAddress): TcpConnectionImpl {
    const srcIp = localAddr ?? this.config.interfaces.find(i => i.ipv4 && !i.loopback)?.ipv4 ?? ipV4Address('0.0.0.0');
    const srcPort = this.allocEphemeralPort();
    const conn = new TcpConnectionImpl(srcIp, srcPort, remoteAddr, remotePort);
    conn.transition(TcpState.SYN_SENT);
    this.connections.set(conn.id, conn);
    this.emitEvent('tcp.connect', {
      id: conn.id,
      localAddr: srcIp, localPort: srcPort,
      remoteAddr, remotePort,
    });
    return conn;
  }

  tcpListen(localAddr: IpAddress, localPort: Port): void {
    const conn = new TcpConnectionImpl(localAddr, localPort, ipV4Address('0.0.0.0'), port(0));
    conn.transition(TcpState.LISTEN);
    this.connections.set(conn.id, conn);
    this.emitEvent('tcp.listen', { id: conn.id, localAddr, localPort });
  }

  tcpClose(connId: string): void {
    const conn = this.connections.get(connId);
    if (!conn) return;
    switch (conn.state) {
      case TcpState.ESTABLISHED:
        conn.transition(TcpState.FIN_WAIT_1);
        break;
      case TcpState.CLOSE_WAIT:
        conn.transition(TcpState.LAST_ACK);
        break;
      default:
        conn.transition(TcpState.CLOSED);
    }
    if (conn.closed()) this.connections.delete(connId);
    this.emitEvent('tcp.close', { id: connId, state: conn.state });
  }

  udpBind(localAddr: IpAddress, localPort: Port): UdpSocketImpl {
    const socket = new UdpSocketImpl(localAddr, localPort, undefined, undefined);
    this.sockets.set(socket.id, socket);
    this.emitEvent('udp.bind', { id: socket.id, localAddr, localPort });
    return socket;
  }

  udpSend(socketId: string, data: Uint8Array, remoteAddr: IpAddress, remotePort: Port): void {
    const socket = this.sockets.get(socketId);
    if (!socket) return;
    const iface = this.route(remoteAddr);
    if (!iface) return;
    const pkt: Packet = {
      id: uid(),
      timestamp: Date.now(),
      length: data.length,
      interfaceName: iface.config.name,
      data,
    };
    iface.send(pkt);
    this.emitEvent('udp.send', { id: socketId, remoteAddr, remotePort, length: data.length });
  }

  dnsLookup(name: string): DnsRecord[] {
    const records = this.dns.resolve(name);
    this.emitEvent('dns.lookup', { name, records: records.length });
    return records;
  }

  receivePacket(ifaceName: string, data: Uint8Array): void {
    const iface = this.interfaces.get(ifaceName);
    if (!iface) return;
    const pkt: Packet = {
      id: uid(),
      timestamp: Date.now(),
      length: data.length,
      interfaceName: ifaceName,
      data,
    };
    iface.receive(pkt);
    this.emitEvent('net.packet.receive', { interface: ifaceName, length: data.length });
  }

  tick(dt: number): void {
    if (!this._running) return;
    this._time += dt;
    this.arpCache.tick(dt);
    this.dns.tick(dt);

    for (const [id, conn] of this.connections) {
      if (conn.closed()) {
        this.connections.delete(id);
      }
    }
  }

  private emitEvent(type: string, payload: Record<string, unknown>): void {
    if (this.bus) {
      this.bus.publish(createEvent(`netstack.${type}`, payload, { source: 'netstack' }));
    }
  }

  attach(bus: EventBus): void {
    this.bus = bus;
    for (const iface of this.interfaces.values()) {
      iface.attach(bus);
    }
  }

  start(): void {
    this._running = true;
    for (const iface of this.interfaces.values()) {
      if (!iface.config.loopback && iface.config.ipv4) {
        this.arpCache.learn(iface.config.ipv4, iface.config.mac);
      }
    }
  }

  stop(): void {
    this._running = false;
    for (const unsub of this.listeners) unsub();
    this.listeners = [];
  }

  reset(): void {
    this.stop();
    this._time = 0;
    this.connections.clear();
    this.sockets.clear();
    this.arpCache.clear();
    this.dns.clear();
    this.interfaces.clear();
    for (const ifaceConfig of this.config.interfaces) {
      const impl = new NetworkInterfaceImpl(ifaceConfig);
      this.interfaces.set(ifaceConfig.name, impl);
      if (this.bus) impl.attach(this.bus);
    }
  }
}
