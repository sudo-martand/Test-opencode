import type { NetworkNode, NetworkPacket, ThreatEvent } from '@/lib/types'

let nodeCounter = 0
let packetCounter = 0
let eventCounter = 0

export function generateNetworkNodes(count: number = 12): NetworkNode[] {
  const types: NetworkNode['type'][] = ['server', 'client', 'router', 'firewall', 'database']
  const statuses: NetworkNode['status'][] = ['active', 'idle', 'warning', 'critical']

  return Array.from({ length: count }, (_, i) => {
    nodeCounter++
    const angle = (2 * Math.PI * i) / count
    const radius = 150 + Math.random() * 100
    return {
      id: `node-${nodeCounter}`,
      label: `${types[i % types.length].charAt(0).toUpperCase() + types[i % types.length].slice(1)}-${String(i + 1).padStart(2, '0')}`,
      type: types[i % types.length],
      x: Math.cos(angle) * radius + 300,
      y: Math.sin(angle) * radius + 250,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      connections: [],
      ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
    }
  }).map((node, _, all) => ({
    ...node,
    connections: all
      .filter((_, j) => {
        const diff = Math.abs(parseInt(node.id.split('-')[1]) - parseInt(all[j].id.split('-')[1]))
        return diff > 0 && diff <= 3
      })
      .map((n) => n.id),
  }))
}

export function generatePacket(nodes: NetworkNode[]): NetworkPacket {
  packetCounter++
  const source = nodes[Math.floor(Math.random() * nodes.length)]
  let target = nodes[Math.floor(Math.random() * nodes.length)]
  while (target.id === source.id) {
    target = nodes[Math.floor(Math.random() * nodes.length)]
  }
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP']
  return {
    id: `pkt-${packetCounter}`,
    source: source.id,
    target: target.id,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    size: Math.floor(Math.random() * 1500) + 64,
    timestamp: Date.now(),
  }
}

export function generateThreatEvent(): ThreatEvent {
  eventCounter++
  const types: ThreatEvent['type'][] = ['scan', 'breach', 'malware', 'ddos', 'phishing', 'anomaly']
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical']
  const threatDescriptions: Record<ThreatEvent['type'], string[]> = {
    scan: [
      'Port scan detected from external IP',
      'Service enumeration attempt blocked',
      'Vulnerability scanner fingerprint detected',
      'Network mapping probe intercepted',
    ],
    breach: [
      'Unauthorized SSH login attempt detected',
      'SQL injection attempt on web application',
      'Authentication bypass exploit blocked',
      'Privilege escalation attempt detected',
    ],
    malware: [
      'Known malware signature detected in network traffic',
      'Suspicious binary download blocked',
      'Ransomware indicator detected on endpoint',
      'Trojan communication channel identified',
    ],
    ddos: [
      'Abnormal traffic spike detected',
      'SYN flood attack mitigated',
      'DNS amplification attack blocked',
      'HTTP flood attack in progress',
    ],
    phishing: [
      'Suspicious email campaign detected',
      'Credential harvesting page identified',
      'Brand impersonation attempt blocked',
      'Spear phishing email quarantined',
    ],
    anomaly: [
      'Unusual outbound data transfer detected',
      'Geographically improbable login attempt',
      'Non-standard protocol usage on internal port',
      'Beaconing activity detected from internal host',
    ],
  }
  const type = types[Math.floor(Math.random() * types.length)]
  const descs = threatDescriptions[type]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  return {
    id: `evt-${eventCounter}`,
    type,
    severity,
    source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
    target: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
    description: descs[Math.floor(Math.random() * descs.length)],
    timestamp: Date.now(),
    mitigated: Math.random() > 0.3,
  }
}
