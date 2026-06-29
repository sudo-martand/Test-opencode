import { proto3 } from '@bufbuild/protobuf';

const PacketDirectionEnum = proto3.makeEnumType('cybersim.v1.PacketDirection', [
  { name: 'INBOUND', no: 0, localName: 'inbound' },
  { name: 'OUTBOUND', no: 1, localName: 'outbound' },
]);

const IndicatorTypeEnum = proto3.makeEnumType('cybersim.v1.IndicatorType', [
  { name: 'IPV4', no: 0, localName: 'ipv4' },
  { name: 'IPV6', no: 1, localName: 'ipv6' },
  { name: 'DOMAIN', no: 2, localName: 'domain' },
  { name: 'URL', no: 3, localName: 'url' },
  { name: 'HASH_MD5', no: 4, localName: 'hashMd5' },
  { name: 'HASH_SHA1', no: 5, localName: 'hashSha1' },
  { name: 'HASH_SHA256', no: 6, localName: 'hashSha256' },
  { name: 'YARA', no: 7, localName: 'yara' },
  { name: 'SIGMA', no: 8, localName: 'sigma' },
  { name: 'STIX_PATTERN', no: 9, localName: 'stixPattern' },
]);

const SeverityEnum = proto3.makeEnumType('cybersim.v1.Severity', [
  { name: 'INFO', no: 0, localName: 'info' },
  { name: 'LOW', no: 1, localName: 'low' },
  { name: 'MEDIUM', no: 2, localName: 'medium' },
  { name: 'HIGH', no: 3, localName: 'high' },
  { name: 'CRITICAL', no: 4, localName: 'critical' },
]);

const TlpEnum = proto3.makeEnumType('cybersim.v1.TLP', [
  { name: 'CLEAR', no: 0, localName: 'clear' },
  { name: 'GREEN', no: 1, localName: 'green' },
  { name: 'AMBER', no: 2, localName: 'amber' },
  { name: 'RED', no: 3, localName: 'red' },
]);

export const SimulationEventMetadataSchema = proto3.makeMessageType(
  'cybersim.v1.SimulationEventMetadata',
  () => [
    { no: 1, name: 'source', kind: 'scalar', T: 9 },
    { no: 2, name: 'correlation_id', kind: 'scalar', T: 9, opt: true },
    { no: 3, name: 'causation_id', kind: 'scalar', T: 9, opt: true },
    { no: 4, name: 'tags', kind: 'scalar', T: 9, repeated: true },
  ],
);

export const SimulationEventSchema = proto3.makeMessageType(
  'cybersim.v1.SimulationEvent',
  () => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 },
    { no: 2, name: 'type', kind: 'scalar', T: 9 },
    { no: 3, name: 'timestamp', kind: 'scalar', T: 3 },
    { no: 4, name: 'payload_json', kind: 'scalar', T: 9 },
    { no: 5, name: 'metadata', kind: 'message', T: SimulationEventMetadataSchema },
  ],
);

export const EthernetFrameSchema = proto3.makeMessageType(
  'cybersim.v1.EthernetFrame',
  () => [
    { no: 1, name: 'dst_mac', kind: 'scalar', T: 9 },
    { no: 2, name: 'src_mac', kind: 'scalar', T: 9 },
    { no: 3, name: 'ether_type', kind: 'scalar', T: 13 },
    { no: 4, name: 'payload', kind: 'scalar', T: 12 },
  ],
);

export const IpV4HeaderSchema = proto3.makeMessageType(
  'cybersim.v1.IpV4Header',
  () => [
    { no: 1, name: 'version', kind: 'scalar', T: 13 },
    { no: 2, name: 'ihl', kind: 'scalar', T: 13 },
    { no: 3, name: 'dscp', kind: 'scalar', T: 13 },
    { no: 4, name: 'ecn', kind: 'scalar', T: 13 },
    { no: 5, name: 'total_length', kind: 'scalar', T: 13 },
    { no: 6, name: 'identification', kind: 'scalar', T: 13 },
    { no: 7, name: 'flags', kind: 'scalar', T: 13 },
    { no: 8, name: 'fragment_offset', kind: 'scalar', T: 13 },
    { no: 9, name: 'ttl', kind: 'scalar', T: 13 },
    { no: 10, name: 'protocol', kind: 'scalar', T: 13 },
    { no: 11, name: 'header_checksum', kind: 'scalar', T: 13 },
    { no: 12, name: 'src', kind: 'scalar', T: 9 },
    { no: 13, name: 'dst', kind: 'scalar', T: 9 },
  ],
);

export const TcpHeaderSchema = proto3.makeMessageType(
  'cybersim.v1.TcpHeader',
  () => [
    { no: 1, name: 'src_port', kind: 'scalar', T: 13 },
    { no: 2, name: 'dst_port', kind: 'scalar', T: 13 },
    { no: 3, name: 'sequence_number', kind: 'scalar', T: 13 },
    { no: 4, name: 'acknowledgment_number', kind: 'scalar', T: 13 },
    { no: 5, name: 'data_offset', kind: 'scalar', T: 13 },
    { no: 6, name: 'flags', kind: 'scalar', T: 13 },
    { no: 7, name: 'window_size', kind: 'scalar', T: 13 },
    { no: 8, name: 'checksum', kind: 'scalar', T: 13 },
    { no: 9, name: 'urgent_pointer', kind: 'scalar', T: 13 },
  ],
);

export const UdpHeaderSchema = proto3.makeMessageType(
  'cybersim.v1.UdpHeader',
  () => [
    { no: 1, name: 'src_port', kind: 'scalar', T: 13 },
    { no: 2, name: 'dst_port', kind: 'scalar', T: 13 },
    { no: 3, name: 'length', kind: 'scalar', T: 13 },
    { no: 4, name: 'checksum', kind: 'scalar', T: 13 },
  ],
);

export const NetworkPacketMetadataSchema = proto3.makeMessageType(
  'cybersim.v1.NetworkPacketMetadata',
  () => [
    { no: 1, name: 'interface_name', kind: 'scalar', T: 9 },
    { no: 2, name: 'direction', kind: 'enum', T: PacketDirectionEnum },
    { no: 3, name: 'timestamp', kind: 'scalar', T: 3 },
    { no: 4, name: 'captured_length', kind: 'scalar', T: 13 },
  ],
);

export const NetworkPacketSchema = proto3.makeMessageType(
  'cybersim.v1.NetworkPacket',
  () => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 },
    { no: 2, name: 'ethernet_frame', kind: 'message', T: EthernetFrameSchema, opt: true },
    { no: 3, name: 'ipv4_header', kind: 'message', T: IpV4HeaderSchema, opt: true },
    { no: 4, name: 'tcp_header', kind: 'message', T: TcpHeaderSchema, opt: true },
    { no: 5, name: 'udp_header', kind: 'message', T: UdpHeaderSchema, opt: true },
    { no: 6, name: 'payload', kind: 'scalar', T: 12, opt: true },
    { no: 7, name: 'packet_metadata', kind: 'message', T: NetworkPacketMetadataSchema, opt: true },
  ],
);

export const ThreatIndicatorSchema = proto3.makeMessageType(
  'cybersim.v1.ThreatIndicator',
  () => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 },
    { no: 2, name: 'pattern', kind: 'scalar', T: 9 },
    { no: 3, name: 'type', kind: 'enum', T: IndicatorTypeEnum },
    { no: 4, name: 'confidence', kind: 'scalar', T: 2 },
    { no: 5, name: 'severity', kind: 'enum', T: SeverityEnum },
    { no: 6, name: 'first_seen', kind: 'scalar', T: 3 },
    { no: 7, name: 'last_seen', kind: 'scalar', T: 3 },
    { no: 8, name: 'tags', kind: 'scalar', T: 9, repeated: true },
    { no: 9, name: 'description', kind: 'scalar', T: 9 },
  ],
);

export const ThreatIntelReportSchema = proto3.makeMessageType(
  'cybersim.v1.ThreatIntelReport',
  () => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 },
    { no: 2, name: 'title', kind: 'scalar', T: 9 },
    { no: 3, name: 'description', kind: 'scalar', T: 9 },
    { no: 4, name: 'source', kind: 'scalar', T: 9 },
    { no: 5, name: 'indicators', kind: 'message', T: ThreatIndicatorSchema, repeated: true },
    { no: 6, name: 'ttps', kind: 'scalar', T: 9, repeated: true },
    { no: 7, name: 'threat_actors', kind: 'scalar', T: 9, repeated: true },
    { no: 8, name: 'campaigns', kind: 'scalar', T: 9, repeated: true },
    { no: 9, name: 'published', kind: 'scalar', T: 3 },
    { no: 10, name: 'tlp', kind: 'enum', T: TlpEnum },
  ],
);

export const SigmaRuleSchema = proto3.makeMessageType(
  'cybersim.v1.SigmaRule',
  () => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 },
    { no: 2, name: 'title', kind: 'scalar', T: 9 },
    { no: 3, name: 'description', kind: 'scalar', T: 9 },
    { no: 4, name: 'log_source', kind: 'scalar', T: 9 },
    { no: 5, name: 'detection_yaml', kind: 'scalar', T: 9 },
    { no: 6, name: 'level', kind: 'scalar', T: 9 },
    { no: 7, name: 'tags', kind: 'scalar', T: 9, repeated: true },
    { no: 8, name: 'false_positives', kind: 'scalar', T: 9, repeated: true },
  ],
);

export const YaraRuleSchema = proto3.makeMessageType(
  'cybersim.v1.YaraRule',
  () => [
    { no: 1, name: 'rule_name', kind: 'scalar', T: 9 },
    { no: 2, name: 'author', kind: 'scalar', T: 9 },
    { no: 3, name: 'date', kind: 'scalar', T: 9 },
    { no: 4, name: 'reference', kind: 'scalar', T: 9 },
    { no: 5, name: 'strings_yaml', kind: 'scalar', T: 9 },
    { no: 6, name: 'condition', kind: 'scalar', T: 9 },
    { no: 7, name: 'metadata_json', kind: 'scalar', T: 9 },
  ],
);

export const ProcessMessageSchema = proto3.makeMessageType(
  'cybersim.v1.ProcessMessage',
  () => [
    { no: 1, name: 'pid', kind: 'scalar', T: 13 },
    { no: 2, name: 'ppid', kind: 'scalar', T: 13 },
    { no: 3, name: 'name', kind: 'scalar', T: 9 },
    { no: 4, name: 'state', kind: 'scalar', T: 9 },
    { no: 5, name: 'uid', kind: 'scalar', T: 13 },
    { no: 6, name: 'gid', kind: 'scalar', T: 13 },
    { no: 7, name: 'command_line', kind: 'scalar', T: 9, repeated: true },
    { no: 8, name: 'cwd', kind: 'scalar', T: 9 },
    { no: 9, name: 'start_time', kind: 'scalar', T: 3 },
    { no: 10, name: 'cpu_time', kind: 'scalar', T: 1 },
    { no: 11, name: 'memory_bytes', kind: 'scalar', T: 3 },
    { no: 12, name: 'thread_count', kind: 'scalar', T: 13 },
    { no: 13, name: 'fd_count', kind: 'scalar', T: 13 },
  ],
);

export const HostInfoSchema = proto3.makeMessageType(
  'cybersim.v1.HostInfo',
  () => [
    { no: 1, name: 'hostname', kind: 'scalar', T: 9 },
    { no: 2, name: 'os_version', kind: 'scalar', T: 9 },
    { no: 3, name: 'kernel_version', kind: 'scalar', T: 9 },
    { no: 4, name: 'cpu_cores', kind: 'scalar', T: 13 },
    { no: 5, name: 'memory_total', kind: 'scalar', T: 3 },
    { no: 6, name: 'memory_used', kind: 'scalar', T: 3 },
    { no: 7, name: 'uptime', kind: 'scalar', T: 1 },
    { no: 8, name: 'ipv4_addresses', kind: 'scalar', T: 9, repeated: true },
    { no: 9, name: 'ipv6_addresses', kind: 'scalar', T: 9, repeated: true },
    { no: 10, name: 'processes', kind: 'message', T: ProcessMessageSchema, repeated: true },
  ],
);

export const EnvelopeSchema = proto3.makeMessageType(
  'cybersim.v1.Envelope',
  () => [
    { no: 1, name: 'version', kind: 'scalar', T: 9 },
    { no: 2, name: 'message_type', kind: 'scalar', T: 9 },
    { no: 3, name: 'simulation_event', kind: 'message', T: SimulationEventSchema, opt: true },
    { no: 4, name: 'network_packet', kind: 'message', T: NetworkPacketSchema, opt: true },
    { no: 5, name: 'threat_intel_report', kind: 'message', T: ThreatIntelReportSchema, opt: true },
    { no: 6, name: 'host_info', kind: 'message', T: HostInfoSchema, opt: true },
  ],
);

type ProtoSchema = ReturnType<typeof proto3.makeMessageType>;

function serializeMessage(schema: ProtoSchema, data: Record<string, unknown>): Uint8Array {
  return new schema(data).toBinary();
}

function deserializeMessage(schema: ProtoSchema, bytes: Uint8Array): Record<string, unknown> {
  const msg = schema.fromBinary(bytes);
  return JSON.parse(JSON.stringify(msg));
}

export { serializeMessage as serialize, deserializeMessage as deserialize };

export function serializeEnvelope(data: Record<string, unknown>): Uint8Array {
  return serializeMessage(EnvelopeSchema, data);
}

export function deserializeEnvelope(bytes: Uint8Array): Record<string, unknown> {
  return deserializeMessage(EnvelopeSchema, bytes);
}

export function serializeSimulationEvent(data: Record<string, unknown>): Uint8Array {
  return serializeMessage(SimulationEventSchema, data);
}

export function deserializeSimulationEvent(bytes: Uint8Array): Record<string, unknown> {
  return deserializeMessage(SimulationEventSchema, bytes);
}

export function serializeNetworkPacket(data: Record<string, unknown>): Uint8Array {
  return serializeMessage(NetworkPacketSchema, data);
}

export function deserializeNetworkPacket(bytes: Uint8Array): Record<string, unknown> {
  return deserializeMessage(NetworkPacketSchema, bytes);
}

export function serializeThreatIntelReport(data: Record<string, unknown>): Uint8Array {
  return serializeMessage(ThreatIntelReportSchema, data);
}

export function deserializeThreatIntelReport(bytes: Uint8Array): Record<string, unknown> {
  return deserializeMessage(ThreatIntelReportSchema, bytes);
}
