import { describe, it, expect } from 'vitest';
import {
  serializeEnvelope,
  deserializeEnvelope,
  serializeSimulationEvent,
  deserializeSimulationEvent,
  serializeNetworkPacket,
  deserializeNetworkPacket,
  serializeThreatIntelReport,
  deserializeThreatIntelReport,
} from '../index';

describe('serialize/deserialize round-trips', () => {
  it('simulation event', () => {
    const event = {
      id: 'evt-1',
      type: 'test.event',
      timestamp: 1234567890,
      payload_json: '{"key":"value"}',
      metadata: {
        source: 'test',
        correlation_id: 'corr-1',
        tags: ['a', 'b'],
      },
    };
    const bytes = serializeSimulationEvent(event);
    const decoded = deserializeSimulationEvent(bytes);
    expect(decoded.id).toBe('evt-1');
    expect(decoded.type).toBe('test.event');
    expect(Number(decoded.timestamp)).toBe(1234567890);
  });

  it('network packet', () => {
    const packet = {
      id: 'pkt-1',
      ethernet_frame: {
        dst_mac: 'ff:ff:ff:ff:ff:ff',
        src_mac: '00:11:22:33:44:55',
        ether_type: 0x0800,
        payload: new Uint8Array([1, 2, 3]),
      },
      ipv4_header: {
        version: 4,
        ihl: 5,
        dscp: 0,
        ecn: 0,
        total_length: 44,
        identification: 1,
        flags: 2,
        fragment_offset: 0,
        ttl: 64,
        protocol: 6,
        header_checksum: 0,
        src: '10.0.0.1',
        dst: '10.0.0.2',
      },
      packet_metadata: {
        interface_name: 'eth0',
        direction: 0,
        timestamp: 1234567890,
        captured_length: 44,
      },
    };
    const bytes = serializeNetworkPacket(packet);
    const decoded = deserializeNetworkPacket(bytes);
    expect(decoded.id).toBe('pkt-1');
  });

  it('threat intel report', () => {
    const report = {
      id: 'report-1',
      title: 'Test Report',
      description: 'A test threat report',
      source: 'test-sim',
      indicators: [
        {
          id: 'ind-1',
          pattern: '1.2.3.4',
          type: 0,
          confidence: 0.95,
          severity: 3,
          first_seen: 1000,
          last_seen: 2000,
          tags: ['c2'],
          description: 'C2 server',
        },
      ],
      ttps: ['T1071'],
      threat_actors: ['APT-42'],
      campaigns: ['Campaign Alpha'],
      published: 1000,
      tlp: 1,
    };
    const bytes = serializeThreatIntelReport(report);
    const decoded = deserializeThreatIntelReport(bytes);
    expect(decoded.id).toBe('report-1');
    expect(decoded.title).toBe('Test Report');
  });

  it('envelope', () => {
    const envelope = {
      version: '1.0',
      message_type: 'cybersim.v1.SimulationEvent',
      simulation_event: {
        id: 'env-evt',
        type: 'envelope.test',
        timestamp: 12345,
        payload_json: '{}',
        metadata: { source: 'test' },
      },
    };
    const bytes = serializeEnvelope(envelope);
    const decoded = deserializeEnvelope(bytes);
    expect(decoded.version).toBe('1.0');
  });
});

describe('fields handling', () => {
  it('handles optional fields', () => {
    const event = {
      id: 'test',
      type: 'test',
      timestamp: 0,
      payload_json: '{}',
      metadata: { source: 'test' },
    };
    const bytes = serializeSimulationEvent(event);
    const decoded = deserializeSimulationEvent(bytes);
    expect(decoded.metadata?.source).toBe('test');
  });

  it('handles repeated fields', () => {
    const report = {
      id: 'r1',
      title: 'test',
      description: 'desc',
      source: 'src',
      indicators: [],
      ttps: ['T1001', 'T1002'],
      threat_actors: [],
      campaigns: [],
      published: 0,
      tlp: 0,
    };
    const bytes = serializeThreatIntelReport(report);
    const decoded = deserializeThreatIntelReport(bytes);
    expect(decoded.ttps).toHaveLength(2);
  });

  it('handles packets with ethernet_frame', () => {
    const packet = {
      id: 'pkt-eth',
      ethernet_frame: {
        dst_mac: 'ff:ff:ff:ff:ff:ff',
        src_mac: '00:11:22:33:44:55',
        ether_type: 2048,
        payload: new Uint8Array([]),
      },
    };
    const bytes = serializeNetworkPacket(packet);
    const decoded = deserializeNetworkPacket(bytes);
    expect(typeof decoded.id).toBe('string');
  });
});
