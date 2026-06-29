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
      '  scan       - Perform network scan',
      '  trace      - Trace route to target',
      '  whoami     - Display current user',
      '  ls         - List directory contents',
      '  cd         - Change directory',
      '  pwd        - Print working directory',
      '  cat        - Display file contents',
      '  neofetch   - Display system info',
      '  ping       - Ping target host',
      '  ifconfig   - Display network interfaces',
      '  ps         - List processes',
      '  date       - Display current date/time',
      '  echo       - Echo text',
      '  ai         - Query AI assistant',
      '  breach     - Attempt system breach',
      '  decrypt    - Decrypt data',
      '  analyze    - Analyze target',
      '  exploit    - Run exploit',
      '  monitor    - Start monitoring',
      '  enumerate  - Enumerate target',
      '  recon      - Run reconnaissance',
    ],

    clear: () => [],

    scan: (args) => {
      const target = args[0] || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0/24`
      const hosts = Math.floor(Math.random() * 20) + 5
      const lines = [
        `[*] Initiating network scan on ${target}...`,
        `[*] Scan type: SYN stealth scan`,
        `[*] Port range: 1-65535`,
        `[*] Scanning ${hosts} live hosts...`,
        '',
      ]
      for (let i = 0; i < Math.min(hosts, 8); i++) {
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`
        const ports = [22, 80, 443, 3306, 8080, 8443, 3389, 21, 25, 53]
        const openPorts = ports.slice(0, Math.floor(Math.random() * 6) + 1).join(', ')
        const os = ['Linux 6.x', 'Windows Server 2025', 'FreeBSD 14', 'macOS 15', 'Ubuntu 24.04'][Math.floor(Math.random() * 5)]
        lines.push(`  [+] ${ip} (${os}) - Open ports: ${openPorts}`)
      }
      lines.push('', `[+] Scan complete. Found ${hosts} live hosts.`)
      return lines
    },

    trace: (args) => {
      const target = args[0] || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`
      const hops = Math.floor(Math.random() * 10) + 5
      const lines = [
        `[*] Tracing route to ${target}...`,
        `[*] Maximum hops: 30`,
        '',
      ]
      for (let i = 1; i <= hops; i++) {
        const hopIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`
        const ms = Math.floor(Math.random() * 200) + 1
        const location = ['AS15169 Google', 'AS8075 Microsoft', 'AS16509 Amazon', 'AS13335 Cloudflare', 'AS7922 Comcast'][Math.floor(Math.random() * 5)]
        lines.push(`  ${i}.  ${ms}ms  ${hopIp} [${location}]`)
      }
      lines.push('', `[*] Trace complete. ${target} reached in ${hops} hops.`)
      return lines
    },

    whoami: () => ['operator'],

    ls: () => {
      const files = [
        { name: 'Documents', type: 'd' },
        { name: 'Downloads', type: 'd' },
        { name: 'Tools', type: 'd' },
        { name: 'targets.txt', type: 'f', size: '2.4K' },
        { name: 'notes.md', type: 'f', size: '1.1K' },
        { name: 'config.json', type: 'f', size: '456B' },
        { name: 'exploit.py', type: 'f', size: '3.7K' },
        { name: 'scan_results.log', type: 'f', size: '12K' },
        { name: '.ssh', type: 'd' },
      ]
      return files.map((f) => `  ${f.type === 'd' ? 'drwxr-xr-x' : '-rw-r--r--'}  operator  staff  ${f.size?.padEnd(6) || '4.0K    '}  ${f.name}${f.type === 'd' ? '/' : ''}`)
    },

    cd: (args) => {
      if (!args[0] || args[0] === '~' || args[0] === '/home/user') return []
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
          '10.0.0.45 - Primary target - ACTIVE',
          '10.0.0.78 - Secondary target - MONITORING',
          '192.168.1.100 - Internal node - COMPROMISED',
          '203.0.113.50 - External C2 - TRACKED',
        ],
        'notes.md': [
          '# Operation Notes',
          '',
          'TODO:',
          '- Complete reconnaissance phase',
          '- Deploy packet sniffers on subnet',
          '- Extract encryption keys from memory',
          '- Establish persistent access',
          '',
          'Status: In progress',
        ],
        'config.json': [
          '{',
          '  "version": "2.4.1",',
          '  "mode": "stealth",',
          '  "proxy_chain": ["tor", "vpn", "socks5"],',
          '  "encryption": "aes-256-gcm",',
          '  "scan_threads": 50,',
          '  "timeout": 30,',
          '  "payload_dir": "/opt/tools/payloads"',
          '}',
        ],
        'exploit.py': [
          '#!/usr/bin/env python3',
          '# Exploit: CVE-2025-2847',
          '# Target: Apache HTTP Server 2.4.55',
          '',
          'import socket',
          'import struct',
          '',
          'def exploit(target):',
          '    s = socket.socket()',
          '    s.connect((target, 80))',
          '    payload = b"\\x90" * 256',
          '    s.send(payload)',
          '    return s.recv(1024)',
        ],
        'scan_results.log': [
          '[2025-06-28 14:32:01] Scan initiated: 10.0.0.0/24',
          '[2025-06-28 14:32:05] Host found: 10.0.0.1 (Gateway)',
          '[2025-06-28 14:32:08] Host found: 10.0.0.45 (Target)',
          '[2025-06-28 14:32:12] Ports open: 22, 80, 443, 8080',
          '[2025-06-28 14:32:15] Service fingerprinting...',
          '[2025-06-28 14:32:20] OS detected: Linux 6.8.0',
          '[2025-06-28 14:32:25] Vulnerability scan initiated',
        ],
      }
      const content = fakeContents[args[0]]
      return content || [`File not found: ${args[0]}`]
    },

    neofetch: () => [
      `       .---.        operator@cyberos`,
      `      /     \\       ------------------`,
      `     /       \\      OS: CyberOS ${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 99)}`,
      `    /  O   O  \\     Host: Quantum-X9`,
      `   |    ...    |    Kernel: 6.8.0-cyber`,
      `    \\  '~'~'  /     Uptime: ${Math.floor(Math.random() * 72) + 1}h ${Math.floor(Math.random() * 60)}m`,
      `     \\_______/      Packages: ${Math.floor(Math.random() * 5000) + 1000}`,
      `                     Shell: zsh 6.1.0`,
      `                     Terminal: CyberTerm`,
      `                     CPU: AMD Ryzen Threadripper 7980X`,
      `                     GPU: NVIDIA RTX 6090`,
      `                     Memory: ${Math.floor(Math.random() * 32) + 16}GB / 128GB`,
    ],

    ping: (args) => {
      const target = args[0] || 'localhost'
      const lines = [`PING ${target} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1})`]
      for (let i = 0; i < 4; i++) {
        const ms = Math.floor(Math.random() * 50) + 1
        lines.push(`  64 bytes from ${target}: icmp_seq=${i + 1} ttl=64 time=${ms}.${Math.floor(Math.random() * 999)} ms`)
      }
      lines.push('', `--- ${target} ping statistics ---`, '4 packets transmitted, 4 received, 0% packet loss')
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
        { pid: 1, name: 'init', cpu: '0.0', mem: '0.1' },
        { pid: 234, name: 'sshd', cpu: '0.1', mem: '0.5' },
        { pid: 456, name: 'nginx', cpu: '0.3', mem: '1.2' },
        { pid: 789, name: 'snifferd', cpu: '2.1', mem: '4.8' },
        { pid: 1012, name: 'payload_server', cpu: '0.5', mem: '2.3' },
        { pid: 1314, name: 'crypto_miner', cpu: '45.2', mem: '12.1' },
        { pid: 1516, name: 'intrusion_detect', cpu: '1.8', mem: '3.4' },
        { pid: 1718, name: 'packet_capture', cpu: '3.2', mem: '8.7' },
        { pid: 1920, name: 'terminal_server', cpu: '0.4', mem: '1.9' },
        { pid: 2122, name: 'ai_assistant', cpu: '12.5', mem: '24.6' },
      ]
      return [
        '  PID  NAME              CPU%    MEM%',
        '  ─────────────────────────────────────',
        ...processes.map((p) => `  ${String(p.pid).padEnd(5)} ${p.name.padEnd(18)} ${p.cpu.padEnd(6)} ${p.mem}`),
      ]
    },

    date: () => [new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })],

    echo: (args) => [args.join(' ') || ''],

    ai: (args) => {
      const query = args.join(' ') || 'help'
      const responses = [
        `[AI Assistant] Analyzing request: "${query}"`,
        '[AI Assistant] Processing through neural network...',
        '[AI Assistant] Confidence: 94.7%',
        `[AI Assistant] Response: Based on available intelligence, ${query} requires elevated privileges. Recommend escalating permissions via known vector CVE-2025-${Math.floor(Math.random() * 9999)}.`,
        '[AI Assistant] Additional context available. Use `ai --detailed` for full report.',
      ]
      return responses
    },

    breach: (args) => {
      const target = args[0] || 'unknown'
      const steps = [
        `[*] Initializing breach sequence against ${target}...`,
        '[*] Bypassing firewall rules...',
        '[*] Exploiting service vulnerability...',
        '[*] Establishing encrypted channel...',
        '[*] Extracting access credentials...',
        '[+] BREACH SUCCESSFUL - Root access obtained',
        `[+] Target ${target} fully compromised`,
        '',
        '  Access level: ROOT',
        '  Persistence: ESTABLISHED',
        '  Data exfil: READY',
      ]
      return steps
    },

    decrypt: (args) => {
      const target = args[0] || 'captured_data.enc'
      const algorithms = ['AES-256-GCM', 'ChaCha20-Poly1305', 'Twofish-256', 'Serpent-256']
      const algo = algorithms[Math.floor(Math.random() * algorithms.length)]
      return [
        `[*] Attempting to decrypt: ${target}`,
        `[*] Detected encryption: ${algo}`,
        '[*] Brute-forcing key...',
        `[*] ${Math.floor(Math.random() * 40) + 60}% complete...`,
        '[*] Key found!',
        '[+] Decryption successful',
        `[+] Output written to ${target.replace('.enc', '')}`,
      ]
    },

    analyze: (args) => {
      const target = args[0] || 'target'
      return [
        `[*] Analyzing ${target}...`,
        '[+] Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        '[+] File type: ELF 64-bit LSB executable',
        '[+] Entropy: 7.84 (likely encrypted/packed)',
        '[+] Suspicious sections detected: 3',
        '[+] Potential malware indicators: YES',
        '[+] Recommended action: Quarantine and deep scan',
      ]
    },

    exploit: (args) => {
      const target = args[0] || 'target'
      const exploits = ['CVE-2025-2847', 'CVE-2025-9123', 'CVE-2025-4456', 'CVE-2025-7891']
      const exploit = exploits[Math.floor(Math.random() * exploits.length)]
      return [
        `[*] Loading exploit module: ${exploit}`,
        `[*] Targeting: ${target}`,
        '[*] Preparing payload...',
        '[*] Sending exploit...',
        '[*] Waiting for response...',
        `[+] Exploit successful! ${target} is now accessible.`,
      ]
    },

    monitor: (args) => {
      const target = args[0] || 'network'
      return [
        `[*] Starting ${target} monitoring...`,
        '[*] Capturing packets...',
        '  IN: 1.2 Gbps  |  OUT: 340 Mbps  |  PPS: 12,450',
        '  Connections: 1,234 established',
        '  Protocols: TCP(67%) UDP(28%) ICMP(5%)',
        '  Anomalies detected: 2 (low severity)',
        '[*] Monitoring active. Press Ctrl+C to stop.',
      ]
    },

    enumerate: (args) => {
      const target = args[0] || '10.0.0.1'
      return [
        `[*] Enumerating ${target}...`,
        '[+] Hostname: TARGET-SRV-01',
        '[+] OS: Linux 6.8.0-48-generic',
        '[+] Users: root, admin, svc_backup, www-data',
        '[+] Groups: sudo, docker, admin, www-data',
        '[+] Listening services:',
        '    22/tcp   OpenSSH 9.2',
        '    80/tcp   Apache 2.4.55',
        '    443/tcp  Apache 2.4.55 (SSL)',
        '    3306/tcp MySQL 8.0',
        '    8080/tcp Tomcat 10.1',
        '[+] SMB shares: public (RW), backup (R), admin$ (hidden)',
        '[+] Cron jobs: backup.sh (daily 0200), cleanup.sh (hourly)',
      ]
    },

    recon: (args) => {
      const target = args[0] || 'target-network'
      return [
        `[*] Starting reconnaissance on ${target}...`,
        '[*] Passive intelligence gathering...',
        '[*] DNS enumeration...',
        '[*] Subdomain discovery...',
        '[*] Technology fingerprinting...',
        '',
        '[+] Results:',
        '  Subdomains: 24 discovered',
        '  Tech stack: React, Node.js, PostgreSQL, Redis',
        '  Email servers: mail.target-org.com (Exchange 2025)',
        '  DNS records: 12 A, 6 CNAME, 3 MX, 2 TXT',
        '  SSL certs: Let\'s Encrypt, DigiCert',
        '  Social media: 14 employee profiles',
        '',
        '[*] Recon complete. Report saved.',
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
