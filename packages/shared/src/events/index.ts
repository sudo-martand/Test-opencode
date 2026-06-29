export interface EventMetadata {
  source: string;
  correlationId?: string;
  causationId?: string;
  tags?: string[];
}

export interface SimulationEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: number;
  payload: T;
  metadata: EventMetadata;
}

export type EventHandler<T = unknown> = (event: SimulationEvent<T>) => void | Promise<void>;

export interface EventBus {
  publish<T>(event: SimulationEvent<T>): void;
  subscribe<T>(type: string, handler: EventHandler<T>): () => void;
  subscribeAll(handler: EventHandler): () => void;
  replay(events: SimulationEvent[]): Promise<void>;
  getEventLog(): SimulationEvent[];
  clearLog(): void;
  setMaxLogSize(size: number): void;
}

export const EventTypes = {
  TERMINAL: {
    INPUT: 'terminal.input',
    OUTPUT: 'terminal.output',
    COMMAND: 'terminal.command',
    RESIZE: 'terminal.resize',
    SESSION_START: 'terminal.session.start',
    SESSION_END: 'terminal.session.end',
  },
  NETWORK: {
    PACKET_SENT: 'network.packet.sent',
    PACKET_RECEIVED: 'network.packet.received',
    CONNECTION_OPEN: 'network.connection.open',
    CONNECTION_CLOSE: 'network.connection.close',
    DNS_QUERY: 'network.dns.query',
    DNS_RESPONSE: 'network.dns.response',
    TLS_HANDSHAKE: 'network.tls.handshake',
    BGP_UPDATE: 'network.bgp.update',
  },
  HOST: {
    PROCESS_SPAWN: 'host.process.spawn',
    PROCESS_EXIT: 'host.process.exit',
    PROCESS_SIGNAL: 'host.process.signal',
    FILE_OPEN: 'host.file.open',
    FILE_READ: 'host.file.read',
    FILE_WRITE: 'host.file.write',
    FILE_CLOSE: 'host.file.close',
    MEMORY_ALLOC: 'host.memory.alloc',
    MEMORY_FREE: 'host.memory.free',
    SYSCALL: 'host.syscall',
  },
  THREAT: {
    DETECTION: 'threat.detection',
    ALERT: 'threat.alert',
    INTEL_UPDATE: 'threat.intel.update',
    SIGNATURE_MATCH: 'threat.signature.match',
    ANOMALY: 'threat.anomaly',
  },
  TIME: {
    TICK: 'time.tick',
    STEP: 'time.step',
    PAUSE: 'time.pause',
    RESUME: 'time.resume',
    REWIND: 'time.rewind',
    CHECKPOINT: 'time.checkpoint',
  },
  UI: {
    PANEL_OPEN: 'ui.panel.open',
    PANEL_CLOSE: 'ui.panel.close',
    PANEL_RESIZE: 'ui.panel.resize',
    NOTIFICATION: 'ui.notification',
    COMMAND_PALETTE: 'ui.command.palette',
  },
} as const;