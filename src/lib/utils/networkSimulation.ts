import type { NetworkNode, NetworkPacket, ThreatEvent, PacketCapture } from '@/lib/types'

let nodeCounter = 0
let packetCounter = 0
let eventCounter = 0
let captureCounter = 0

const NODE_CONFIGS = [
  { label: 'DC-01', type: 'server' as const, ip: '10.0.0.5', os: 'Windows Server 2025', hostname: 'dc-01', services: ['dns', 'kerberos', 'ldap', 'smb'] },
  { label: 'FW-01', type: 'firewall' as const, ip: '10.0.0.1', os: 'pfSense 2.7', hostname: 'fw-01', services: ['firewall', 'vpn', 'dhcp'] },
  { label: 'WEB-01', type: 'server' as const, ip: '10.0.1.10', os: 'Ubuntu 24.04', hostname: 'web-01', services: ['http', 'https', 'ssh'] },
  { label: 'DB-01', type: 'database' as const, ip: '10.0.1.20', os: 'RHEL 9', hostname: 'db-01', services: ['postgresql', 'ssh'] },
  { label: 'WS-01', type: 'workstation' as const, ip: '10.0.2.50', os: 'Windows 11 24H2', hostname: 'ws-01', services: ['rdp', 'smb'] },
  { label: 'WS-02', type: 'workstation' as const, ip: '10.0.2.51', os: 'macOS 15', hostname: 'ws-02', services: ['ssh', 'rdp'] },
  { label: 'IDS-01', type: 'ids' as const, ip: '10.0.0.10', os: 'Security Onion', hostname: 'ids-01', services: ['suricata', 'zeek', 'wazuh'] },
  { label: 'MAIL-01', type: 'server' as const, ip: '10.0.1.30', os: 'Debian 12', hostname: 'mail-01', services: ['smtp', 'imap', 'smtps'] },
  { label: 'HP-01', type: 'honeypot' as const, ip: '10.0.0.100', os: 'Ubuntu 24.04', hostname: 'hp-01', services: ['ssh', 'http', 'smb'] },
  { label: 'RT-01', type: 'router' as const, ip: '10.255.0.1', os: 'Cisco IOS XE', hostname: 'rt-01', services: ['bgp', 'ospf', 'snmp'] },
  { label: 'CL-01', type: 'client' as const, ip: '10.0.2.100', os: 'Windows 11 24H2', hostname: 'cl-01', services: ['rdp'] },
  { label: 'NMS-01', type: 'server' as const, ip: '10.0.0.15', os: 'Ubuntu 24.04', hostname: 'nms-01', services: ['snmp', 'netflow', 'syslog'] },
]

const VULN_POOL = ['CVE-2024-3094', 'CVE-2024-21626', 'CVE-2024-6387', 'CVE-2023-34362', 'CVE-2021-44228', 'CVE-2023-46604', 'CVE-2024-27198', 'CVE-2025-0001']

const PROTOCOLS = [
  { name: 'TCP', ports: [22, 80, 443, 3306, 5432, 8080, 8443, 3389], flags: ['SYN', 'SYN-ACK', 'ACK', 'PSH-ACK', 'FIN-ACK', 'RST'] },
  { name: 'UDP', ports: [53, 123, 161, 443, 514, 1900, 5353], flags: [''] },
  { name: 'ICMP', ports: [0, 8], flags: ['ECHO', 'ECHO-REPLY', 'DEST-UNREACH'] },
  { name: 'DNS', ports: [53, 5353], flags: ['QUERY', 'RESPONSE'] },
  { name: 'HTTP', ports: [80, 8080, 8000], flags: ['GET', 'POST', 'PUT'] },
  { name: 'HTTPS', ports: [443, 8443], flags: ['TLS1.3', 'TLS1.2'] },
  { name: 'SSH', ports: [22], flags: ['SSH2'] },
  { name: 'SMB', ports: [445, 139], flags: ['SMB3'] },
]

export function generateNetworkNodes(): NetworkNode[] {
  return NODE_CONFIGS.map((config, i) => {
    nodeCounter++
    const vulnCount = Math.floor(Math.random() * 3)
    const vulns: string[] = []
    for (let v = 0; v < vulnCount; v++) {
      vulns.push(VULN_POOL[Math.floor(Math.random() * VULN_POOL.length)])
    }
    const angle = (2 * Math.PI * (i + 1)) / NODE_CONFIGS.length
    const radius = 140 + Math.random() * 60
    return {
      id: `node-${nodeCounter}`,
      label: config.label,
      type: config.type,
      x: Math.cos(angle) * radius + 300,
      y: Math.sin(angle) * radius + 220,
      status: (Math.random() > 0.8 ? (Math.random() > 0.5 ? 'warning' : 'critical') : 'active') as 'active' | 'idle' | 'warning' | 'critical',
      connections: [],
      ip: config.ip,
      os: config.os,
      hostname: config.hostname,
      services: [...config.services],
      vulnerabilities: vulns,
    }
  }).map((node, _, all) => ({
    ...node,
    connections: all
      .filter((n) => {
        if (node.type === 'router' || n.type === 'router') return true
        if (node.type === 'firewall' || n.type === 'firewall') return true
        const nodeOctet = parseInt(node.ip.split('.')[2])
        const nOctet = parseInt(n.ip.split('.')[2])
        if (nodeOctet === nOctet) return true
        return false
      })
      .filter((n) => n.id !== node.id)
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
  const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)]
  const port = protocol.ports[Math.floor(Math.random() * protocol.ports.length)]
  const flag = protocol.flags[Math.floor(Math.random() * protocol.flags.length)]

  return {
    id: `pkt-${packetCounter}`,
    source: source.id,
    target: target.id,
    protocol: protocol.name,
    size: Math.floor(Math.random() * 1460) + 64,
    timestamp: Date.now(),
    srcPort: protocol.name === 'ICMP' ? 0 : Math.floor(Math.random() * 50000) + 1024,
    dstPort: port,
    flags: flag,
    ttl: Math.floor(Math.random() * 128) + 64,
    seq: packetCounter * 1024,
    ack: packetCounter > 0 ? (packetCounter - 1) * 1024 + 1 : 0,
  }
}

export function generatePacketCapture(packet: NetworkPacket): PacketCapture {
  captureCounter++
  const srcNode = packet.source
  const dstNode = packet.target
  return {
    id: `cap-${captureCounter}`,
    interface: 'eth0',
    protocol: packet.protocol,
    srcIp: srcNode,
    dstIp: dstNode,
    srcPort: packet.srcPort,
    dstPort: packet.dstPort,
    length: packet.size,
    flags: packet.flags,
    timestamp: packet.timestamp,
    raw: `0x${packetCounter.toString(16).padStart(8, '0')}${packet.size.toString(16).padStart(4, '0')}`,
  }
}

export function generateThreatEvent(): ThreatEvent {
  eventCounter++
  const types: ThreatEvent['type'][] = ['scan', 'breach', 'malware', 'ddos', 'phishing', 'anomaly', 'lateral_movement', 'exfiltration', 'ransomware', 'recon']
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical']
  const mitreIds: Record<string, string> = {
    scan: 'T1595',
    breach: 'T1190',
    malware: 'T1204',
    ddos: 'T1498',
    phishing: 'T1566',
    anomaly: 'T1078',
    lateral_movement: 'TA0008',
    exfiltration: 'TA0010',
    ransomware: 'T1486',
    recon: 'T1590',
  }
  const threatDescriptions: Record<ThreatEvent['type'], string[]> = {
    scan: [
      'Port scan detected from external IP 203.0.113.50 targeting DMZ subnet',
      'Service enumeration attempt against web server blocked by WAF',
      'Vulnerability scanner fingerprint detected on perimeter network',
      'Network mapping probe intercepted by IDS on segment 10.0.1.0/24',
    ],
    breach: [
      'Unauthorized SSH login attempt detected on bastion host',
      'SQL injection attempt on web application login endpoint',
      'Authentication bypass exploit blocked by application firewall',
      'Privilege escalation attempt via CVE-2024-6387 detected',
    ],
    malware: [
      'Known malware signature detected in email attachment (Heuristic: 0.94)',
      'Suspicious binary download from external C2 infrastructure blocked',
      'Ransomware indicator detected on endpoint: LockBit 4.0 artifacts found',
      'Trojan communication channel identified via anomalous DNS queries',
    ],
    ddos: [
      'Abnormal traffic spike detected: 12 Gbps inbound on link aggregate',
      'SYN flood attack mitigated by rate limiting on border router',
      'DNS amplification attack blocked by response rate limiting',
      'HTTP flood attack in progress against web application cluster',
    ],
    phishing: [
      'Spear phishing campaign targeting finance department detected',
      'Credential harvesting page imitating corporate SSO portal identified',
      'Brand impersonation domain registered: target-corp-verify.com',
      'Whaling email targeting C-suite with malicious attachment quarantined',
    ],
    anomaly: [
      'Unusual outbound data transfer (2.4 GB) from database server',
      'Geographically improbable login from IP in unauthorized region',
      'Non-standard protocol usage on internal port 4444 detected',
      'Beaconing activity detected from internal host every 60 seconds',
    ],
    lateral_movement: [
      'Pass-the-hash attack detected between workstations on subnet 10.0.2.0/24',
      'WMI remote execution event triggered on multiple endpoints',
      'SMB relay attack detected against domain controller',
      'PsExec execution detected on non-administrative workstation',
    ],
    exfiltration: [
      'DNS tunneling detected: anomalous TXT query volume to suspicious domain',
      'Data staged in archive files on file server ahead of scheduled transfer',
      'HTTPS connection to known exfiltration endpoint established from DMZ',
      'ICMP covert channel detected with irregular packet payload sizes',
    ],
    ransomware: [
      'Mass file encryption detected on file server share (K: drive)',
      'Ransom note dropped on network shares: README_LOCKBIT.txt',
      'Volume shadow copy deletion detected across multiple endpoints',
      'Encryption binary execution traced to user workstation via scheduled task',
    ],
    recon: [
      'Passive DNS enumeration detected via DNS zone transfer attempt',
      'Certificate transparency log monitoring for target domain discovered',
      'ASN mapping and BGP peering enumeration by external entity',
      'Subdomain brute-force attack against target organization domain',
    ],
  }
  const type = types[Math.floor(Math.random() * types.length)]
  const descs = threatDescriptions[type]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const srcIp = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`
  const dstIp = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`

  return {
    id: `evt-${eventCounter}`,
    type,
    severity,
    source: srcIp,
    target: dstIp,
    description: descs[Math.floor(Math.random() * descs.length)],
    timestamp: Date.now(),
    mitigated: Math.random() > 0.35,
    mitreId: mitreIds[type],
    confidence: Math.round((0.5 + Math.random() * 0.45) * 100) / 100,
    ioc: type === 'malware' || type === 'phishing'
      ? `${srcIp}:${Math.floor(Math.random() * 65535)}`
      : srcIp,
  }
}
