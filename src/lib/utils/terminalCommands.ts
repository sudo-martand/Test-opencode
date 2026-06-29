import type { TerminalLine } from '@/lib/types'

export function executeCommand(command: string, cwd: string): TerminalLine[] {
  const trimmed = command.trim().toLowerCase()
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0]
  const args = parts.slice(1)

  const commands: Record<string, (args: string[], cwd: string) => string[]> = {
    help: () => [
      'Available commands:',
      '  help       - Show this help message',
      '  clear      - Clear terminal',
      '  whoami     - Display current user',
      '  ls         - List directory contents',
      '  cd         - Change directory',
      '  pwd        - Print working directory',
      '  cat        - Display file contents',
      '  neofetch   - Display system info',
      '  ping       - Ping target host',
      '  ifconfig   - Display network interfaces',
      '  ps         - List processes',
      '  ss         - List network sockets',
      '  date       - Display current date/time',
      '  echo       - Echo text',
      '  ai         - Query AI assistant',
      '  scan       - Perform network scan',
      '  trace      - Trace route to target',
      '  analyze    - Analyze target/file',
      '  monitor    - Start monitoring',
      '  enumerate  - Enumerate target',
      '  recon      - Run reconnaissance',
      '  nmap       - Nmap wrapper',
      '  nslookup   - DNS lookup',
      '  tcpdump    - Packet capture',
      '  grep       - Search text',
      '  tail       - View last lines of file',
      '  head       - View first lines of file',
    ],

    clear: () => [],

    whoami: () => ['analyst'],

    ls: () => {
      const files = [
        { name: 'Documents', type: 'd' },
        { name: 'Downloads', type: 'd' },
        { name: 'Tools', type: 'd' },
        { name: 'targets.txt', type: 'f', size: '2.4K' },
        { name: 'notes.md', type: 'f', size: '1.1K' },
        { name: 'config.json', type: 'f', size: '456B' },
        { name: 'scan_results.log', type: 'f', size: '12K' },
        { name: '.ssh', type: 'd' },
      ]
      return files.map((f) => `  ${f.type === 'd' ? 'drwxr-xr-x' : '-rw-r--r--'}  analyst  soc  ${f.size?.padEnd(6) || '4.0K    '}  ${f.name}${f.type === 'd' ? '/' : ''}`)
    },

    cd: (args) => {
      if (!args[0] || args[0] === '~' || args[0] === '/home/analyst') return []
      return ['']
    },

    pwd: () => [cwd],

    cat: (args) => {
      if (!args[0]) return ['Usage: cat <filename>']
      const fakeContents: Record<string, string[]> = {
        'targets.txt': [
          '# Target List - Classified',
          '# Priority: High',
          '',
          '10.0.0.5 - Domain Controller',
          '10.0.1.10 - Web Server',
          '10.0.1.20 - Database Server',
          '10.0.2.50 - Workstation (Potential compromise)',
          '203.0.113.50 - External C2 (TRACKED)',
        ],
        'notes.md': [
          '# Operation Notes',
          '',
          'TODO:',
          '- Complete reconnaissance phase',
          '- Deploy packet capture on subnet 10.0.1.0/24',
          '- Extract forensic artifacts from memory',
          '- Analyze anomalous beaconing traffic',
          '',
          'Status: In progress',
        ],
        'config.json': [
          '{',
          '  "version": "3.1.0",',
          '  "proxy_chain": ["tor", "vpn", "socks5"],',
          '  "encryption": "aes-256-gcm",',
          '  "scan_threads": 50,',
          '  "timeout": 30,',
          '  "log_level": "INFO"',
          '}',
        ],
        'scan_results.log': [
          '[2025-06-29 08:32:01] Scan initiated: 10.0.0.0/24 (SYN stealth)',
          '[2025-06-29 08:32:05] Host found: 10.0.0.1 (Gateway)',
          '[2025-06-29 08:32:08] Host found: 10.0.0.5 (DC-01)',
          '[2025-06-29 08:32:12] Host found: 10.0.1.10 (WEB-01)',
          '[2025-06-29 08:32:15] Ports open: 22, 80, 443, 8080',
          '[2025-06-29 08:32:20] Service fingerprinting initiated',
          '[2025-06-29 08:32:25] OS detected: Ubuntu 24.04',
          '[2025-06-29 08:32:30] Vulnerability scan initiated',
        ],
      }
      const content = fakeContents[args[0]]
      return content || [`File not found: ${args[0]}`]
    },

    neofetch: () => [
      `       .---.        analyst@soc-terminal`,
      `      /     \\       --------------------`,
      `     /       \\      OS: Security Onion 2.4`,
      `    /  O   O  \\     Host: SOC-WS-01`,
      `   |    ...    |    Kernel: 6.8.0-48-generic`,
      `    \\  '~'~'  /     Uptime: ${Math.floor(Math.random() * 720) + 1}h ${Math.floor(Math.random() * 60)}m`,
      `     \\_______/      Packages: ${Math.floor(Math.random() * 3000) + 500}`,
      `                     Shell: zsh 6.1.0`,
      `                     Terminal: SOC-Term v3.1`,
      `                     CPU: AMD EPYC 7713 64-Core`,
      `                     GPU: NVIDIA RTX A6000`,
      `                     Memory: ${Math.floor(Math.random() * 64) + 32}GB / 256GB`,
      `                     Storage: ${Math.floor(Math.random() * 2000) + 500}GB / 4TB NVMe`,
    ],

    ping: (args) => {
      const target = args[0] || '10.0.0.1'
      const lines = [`PING ${target} (${target}) 56(84) bytes of data.`]
      for (let i = 0; i < 4; i++) {
        const ms = Math.floor(Math.random() * 50) + 1
        lines.push(`  64 bytes from ${target}: icmp_seq=${i + 1} ttl=64 time=${ms}.${Math.floor(Math.random() * 999)} ms`)
      }
      lines.push('', `--- ${target} ping statistics ---`, '4 packets transmitted, 4 received, 0% packet loss, time 3004ms')
      return lines
    },

    ifconfig: () => [
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      `        inet 10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}  netmask 255.255.255.0  broadcast 10.0.${Math.floor(Math.random() * 255)}.255`,
      '        inet6 fe80::dead:beef:cafe:1234  prefixlen 64  scopeid 0x20<link>',
      `        ether 00:1a:2b:3c:4d:5e  txqueuelen 1000  (Ethernet)`,
      '        RX packets: 45231  bytes: 48291031 (46.0 MB)',
      '        TX packets: 38921  bytes: 12948321 (12.3 MB)',
      '',
      'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
      '        inet 127.0.0.1  netmask 255.0.0.0',
      '        inet6 ::1  prefixlen 128  scopeid 0x10<host>',
      '        loop  txqueuelen 1000  (Local Loopback)',
    ],

    ps: () => {
      const processes = [
        { pid: 1, name: 'systemd', cpu: '0.0', mem: '0.2' },
        { pid: 342, name: 'sshd', cpu: '0.1', mem: '0.4' },
        { pid: 456, name: 'nginx', cpu: '0.3', mem: '1.1' },
        { pid: 612, name: 'suricata', cpu: '4.2', mem: '8.3' },
        { pid: 789, name: 'zeek', cpu: '3.8', mem: '6.7' },
        { pid: 834, name: 'wazuh-agent', cpu: '0.8', mem: '2.1' },
        { pid: 1024, name: 'elasticsearch', cpu: '12.5', mem: '24.3' },
        { pid: 1128, name: 'kibana', cpu: '1.2', mem: '3.4' },
        { pid: 1256, name: 'packetbeat', cpu: '2.1', mem: '4.8' },
        { pid: 1516, name: 'osqueryd', cpu: '0.6', mem: '1.9' },
        { pid: 1718, name: 'tcpdump', cpu: '1.5', mem: '2.2' },
        { pid: 1920, name: 'terminal_server', cpu: '0.3', mem: '1.5' },
      ]
      return [
        '  PID  NAME              CPU%    MEM%',
        '  ─────────────────────────────────────',
        ...processes.map((p) => `  ${String(p.pid).padEnd(5)} ${p.name.padEnd(18)} ${p.cpu.padEnd(6)} ${p.mem}`),
      ]
    },

    ss: () => {
      const sockets = [
        { proto: 'tcp', recvq: 0, sendq: 0, local: '10.0.0.15:22', peer: '10.0.2.50:45123', state: 'ESTAB' },
        { proto: 'tcp', recvq: 0, sendq: 0, local: '10.0.0.15:443', peer: '10.0.1.10:38912', state: 'ESTAB' },
        { proto: 'tcp', recvq: 0, sendq: 0, local: '10.0.0.15:5601', peer: '10.0.2.100:52341', state: 'ESTAB' },
        { proto: 'tcp', recvq: 0, sendq: 0, local: '10.0.0.15:9200', peer: '127.0.0.1:38721', state: 'ESTAB' },
        { proto: 'udp', recvq: 0, sendq: 0, local: '10.0.0.15:514', peer: '0.0.0.0:*', state: '' },
        { proto: 'tcp', recvq: 0, sendq: 0, local: '0.0.0.0:22', peer: '0.0.0.0:*', state: 'LISTEN' },
        { proto: 'tcp', recvq: 0, sendq: 0, local: '0.0.0.0:443', peer: '0.0.0.0:*', state: 'LISTEN' },
      ]
      return [
        '  Proto Recv-Q Send-Q Local Address:Port   Peer Address:Port   State',
        '  ─────────────────────────────────────────────────────────────────',
        ...sockets.map((s) => `  ${s.proto}   ${s.recvq}      ${s.sendq}     ${s.local.padEnd(21)} ${s.peer.padEnd(21)} ${s.state}`),
      ]
    },

    date: () => [new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })],

    echo: (args) => [args.join(' ') || ''],

    ai: (args) => {
      const query = args.join(' ') || 'help'
      const responses = [
        `[SOC AI] Processing query: "${query}"`,
        `[SOC AI] Analyzing available intelligence...`,
        `[SOC AI] Confidence: ${(85 + Math.random() * 14).toFixed(1)}%`,
        `[SOC AI] Assessment: ${query} - recommend correlation with SIEM alerts and review of endpoint telemetry. Suspicious indicators should be escalated per SOC playbook IR-4.`,
        `[SOC AI] MITRE ATT&CK mapping available. Use \`ai --detailed\` for full analysis.`,
      ]
      return responses
    },

    scan: (args) => {
      const target = args[0] || '10.0.0.0/24'
      const hosts = Math.floor(Math.random() * 20) + 5
      const lines = [
        `[*] Initiating network scan on ${target}`,
        `[*] Scan type: SYN stealth scan`,
        `[*] Port range: 1-65535`,
        `[*] Discovered ${hosts} live hosts`,
        '',
      ]
      for (let i = 0; i < Math.min(hosts, 8); i++) {
        const ip = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`
        const ports = [22, 80, 443, 3306, 8080, 8443, 3389, 21, 25, 53, 445, 1433, 5432]
        const openPorts = ports.slice(0, Math.floor(Math.random() * 6) + 1).join(', ')
        const os = ['Linux 6.x', 'Windows Server 2025', 'FreeBSD 14', 'Ubuntu 24.04', 'RHEL 9'][Math.floor(Math.random() * 5)]
        lines.push(`  [+] ${ip} (${os}) - Open ports: ${openPorts}`)
      }
      lines.push('', `[*] Scan complete. ${hosts} hosts discovered.`)
      return lines
    },

    trace: (args) => {
      const target = args[0] || '203.0.113.1'
      const hops = Math.floor(Math.random() * 10) + 5
      const lines = [
        `[*] Traceroute to ${target} (max 30 hops)`,
        '',
      ]
      for (let i = 1; i <= hops; i++) {
        const hopIp = i === 1 ? '10.0.0.1' : i === hops ? target : `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`
        const ms = Math.floor(Math.random() * 200) + 1
        const location = ['AS15169 Google', 'AS8075 Microsoft', 'AS16509 Amazon', 'AS13335 Cloudflare', 'AS7922 Comcast'][Math.floor(Math.random() * 5)]
        lines.push(`  ${i}.  ${ms}ms  ${hopIp} [${location}]`)
      }
      lines.push('', `[*] Trace complete. ${target} reached in ${hops} hops.`)
      return lines
    },

    nmap: (args) => {
      const target = args[args.length - 1] || '10.0.0.0/24'
      const lines = [
        'Starting Nmap 7.95 ( https://nmap.org )',
        `Nmap scan report for ${target}`,
        'Host is up (0.012s latency).',
        'Not shown: 995 filtered ports',
        'PORT     STATE  SERVICE',
        '22/tcp   open   ssh',
        '80/tcp   open   http',
        '443/tcp  open   https',
        '3306/tcp open   mysql',
        '8080/tcp open   http-proxy',
        '',
        'OS detection performed. Reported: Linux 6.x (96%)',
        'Nmap done: 256 IP addresses (12 hosts up)',
      ]
      return lines
    },

    nslookup: (args) => {
      const domain = args[0] || 'target-org.com'
      return [
        `Server:    10.0.0.5`,
        `Address:  10.0.0.5#53`,
        '',
        `Non-authoritative answer:`,
        `Name:    ${domain}`,
        `Address: 203.0.113.50`,
        `Aliases: www.${domain}, mail.${domain}`,
      ]
    },

    tcpdump: (args) => {
      const iface = args.includes('-i') ? args[args.indexOf('-i') + 1] || 'eth0' : 'eth0'
      const count = args.includes('-c') ? args[args.indexOf('-c') + 1] || '5' : '5'
      return [
        `tcpdump: listening on ${iface}, link-type EN10MB (Ethernet), capture size 262144 bytes`,
        '',
        `${String.fromCharCode(48 + Math.floor(Math.random() * 9))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${String(Math.floor(Math.random() * 999999)).padStart(6, '0')} IP 10.0.1.10.443 > 10.0.2.50.45123: Flags [P.], seq 1:1461, ack 1, win 501, length 1460`,
        `${String.fromCharCode(48 + Math.floor(Math.random() * 9))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${String(Math.floor(Math.random() * 999999)).padStart(6, '0')} IP 10.0.2.50.45123 > 10.0.1.10.443: Flags [.], ack 1461, win 509, length 0`,
        `${String.fromCharCode(48 + Math.floor(Math.random() * 9))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${String(Math.floor(Math.random() * 999999)).padStart(6, '0')} IP 10.0.0.5.53 > 10.0.2.50.53421: ${Math.floor(Math.random() * 100) + 1}+ A? target-org.com. (32)`,
        `${String.fromCharCode(48 + Math.floor(Math.random() * 9))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${String(Math.floor(Math.random() * 999999)).padStart(6, '0')} IP 203.0.113.50.4444 > 10.0.2.50.51234: Flags [S], seq 12345, win 65535, length 0`,
        '',
        `${count} packets captured`,
      ]
    },

    grep: (args) => {
      if (args.length < 1) return ['Usage: grep <pattern> [file]']
      const pattern = args[0]
      const matches = [
        `${args[1] || 'output'}:12:  [+] 10.0.0.5 (Windows Server 2025) - Open ports: 22, 80, 443, 389, 445`,
        `${args[1] || 'output'}:15:  [+] 10.0.0.1 (pfSense 2.7) - Open ports: 22, 443, 8080`,
        `${args[1] || 'output'}:18:  [+] 10.0.1.10 (Ubuntu 24.04) - Open ports: 22, 80, 443, 3306`,
      ].filter(() => Math.random() > 0.3)
      return matches.length > 0
        ? [`Found ${matches.length} match(es) for pattern "${pattern}":`, '', ...matches]
        : [`No matches found for "${pattern}"`]
    },

    tail: (args) => {
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
      const file = args[args.length - 1] || 'syslog'
      const lines = [
        `[2025-06-29 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00] sshd[234]: Accepted publickey for analyst from 10.0.2.50 port 45123`,
        `[2025-06-29 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:05] suricata[612]: ALERT: ET SCAN NMAP -sS scan detected from 10.0.2.100`,
        `[2025-06-29 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:10] zeek[789]: Notice: connection_established 10.0.1.10:443 -> 203.0.113.50:4444`,
        `[2025-06-29 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:15] wazuh-agent[834]: File integrity monitoring: /etc/passwd modified`,
      ]
      return lines.slice(0, n)
    },

    head: (args) => {
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
      const file = args[args.length - 1] || 'scan_results.log'
      const lines = [
        `[2025-06-29 08:32:01] Scan initiated: 10.0.0.0/24 (SYN stealth)`,
        `[2025-06-29 08:32:05] Host found: 10.0.0.1 (Gateway)`,
        `[2025-06-29 08:32:08] Host found: 10.0.0.5 (DC-01)`,
      ]
      return lines.slice(0, n)
    },

    analyze: (args) => {
      const target = args[0] || 'sample.bin'
      return [
        `[*] Analyzing ${target}...`,
        `[*] SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        `[*] File type: ELF 64-bit LSB executable, x86-64, version 1 (SYSV)`,
        `[*] Entropy: 7.84 (likely encrypted/packed)`,
        `[*] Suspicious sections: .text (packed), .upx1 (UPX packed)`,
        `[*] Malware indicators: YES (Heuristic score: 0.94)`,
        `[*] YARA rule match: MAL_Generic_Packed_v1`,
        `[*] Recommended action: Quarantine and submit for deep analysis`,
      ]
    },

    monitor: (args) => {
      const target = args[0] || 'eth0'
      return [
        `[*] Starting packet capture on ${target}...`,
        '[*] Interface: eth0 (10.0.0.15/24)',
        '  IN: 1.2 Gbps  |  OUT: 340 Mbps  |  PPS: 12,450',
        '  Connections: 1,234 established | 12 SYN_RECV | 3 TIME_WAIT',
        '  Protocols: TCP(67%) UDP(28%) ICMP(4%) Other(1%)',
        '  Alerts: 2 (1 medium, 1 low severity)',
        '[*] Capture active. Press Ctrl+C to stop.',
      ]
    },

    enumerate: (args) => {
      const target = args[0] || '10.0.0.5'
      return [
        `[*] Enumerating ${target}...`,
        '[+] Hostname: DC-01',
        '[+] OS: Windows Server 2025 Standard (Build 26100)',
        '[+] Domain: TARGET.CORP',
        '[+] Users: Administrator, svc_adm, krbtgt, sql_svc, backup_svc',
        '[+] Groups: Domain Admins, Domain Users, Enterprise Admins, SQL Admins',
        '[+] Listening services:',
        '    22/tcp   OpenSSH for Windows',
        '    80/tcp   IIS 10.0',
        '    389/tcp  LDAP (AD DS)',
        '    443/tcp  IIS 10.0 (SSL)',
        '    445/tcp  SMB (Active Directory)',
        '    636/tcp  LDAP SSL',
        '    3389/tcp RDP',
        '    5985/tcp WinRM',
        '[+] SMB shares: NETLOGON, SYSVOL, Data (R/W), Backup$ (Admin)',
        '[+] Kerberos: Enabled (AES256-CTS-HMAC-SHA1)',
      ]
    },

    recon: (args) => {
      const target = args[0] || 'target-org.com'
      return [
        `[*] Starting passive reconnaissance on ${target}...`,
        '[*] DNS enumeration...',
        '[*] Subdomain discovery (dictionary + brute force)...',
        '[*] Certificate Transparency log analysis...',
        '[*] Technology stack fingerprinting...',
        '',
        '[+] Results:',
        '  Subdomains: 24 discovered (www, mail, vpn, dev, admin, api, ...)',
        '  Tech stack: React, Node.js, PostgreSQL, Redis, Cloudflare',
        '  Mail servers: mail.target-org.com (Exchange 2025, M365 hybrid)',
        '  DNS: 12 A, 6 CNAME, 3 MX, 2 TXT, 2 NS records',
        '  SSL certs: Let\'s Encrypt, DigiCert, Sectigo',
        '  ASN: AS32934 (Facebook), AS15169 (Google) for hosted services',
        '',
        '[*] Recon complete. ${target} attack surface mapped.',
      ]
    },
  }

  const handler = commands[cmd]
  if (handler) {
    const output = handler(args, cwd)
    if (output.length === 0 && cmd === 'clear') return []
    return output.map((text) => ({
      id: `response-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: text.startsWith('[+]') ? 'success' as const : text.startsWith('[!]') || text.startsWith('Error') ? 'error' as const : 'output' as const,
      content: text,
      timestamp: Date.now(),
    }))
  }

  return [{
    id: `response-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'error' as const,
    content: `Command not found: ${cmd}. Type \`help\` for available commands.`,
    timestamp: Date.now(),
  }]
}
