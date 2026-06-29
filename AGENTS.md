# AGENTS.md

## Implementation Status

| Phase | Domain | Status | Tests | LoC |
|-------|--------|--------|-------|-----|
| 1 | **shared** (types, event bus, Result/Option) | ✅ Complete | 24 | ~500 |
| 1 | **netstack** (TCP/IP, UDP, DNS, ARP, routing) | ✅ Complete | 97 | ~760 |
| 1 | **hostos** (kernel, scheduler, syscalls, /proc) | ✅ Complete | 29 | ~840 |
| 1 | **threatintel** (STIX, Sigma, YARA, TAXII, ATT&CK) | ✅ Complete | 37 | ~830 |
| 1 | **geo** (IP geolocation, BGP ASN, cables, RF) | ✅ Complete | 29 | ~560 |
| 1 | **sound** (DSP synthesis, keystroke/alert presets) | ✅ Complete | 22 | ~670 |
| 1 | **time** (hybrid logical clock, timers) | ✅ Complete | 18 | ~300 |
| 1 | **ai** (ONNX Runtime Web manager) | ✅ Complete | (placeholder) | ~200 |
| 1 | **fs** (VirtualFileSystem, IndexedDB) | ✅ Complete | (placeholder) | ~350 |
| 1 | **kernel** (SimulationKernel mount/start/stop) | ✅ Complete | 5 | ~250 |
| 1 | **terminal** (xterm.js wrapper) | ✅ Complete | (placeholder) | ~120 |
| 1 | **ui** (Panel, DataTable, StatusIndicator, Toast) | ✅ Complete | (placeholder) | ~300 |
| 1 | **proto** (@bufbuild/protobuf types) | ✅ Complete | (placeholder) | ~80 |
| 1 | **wasm-crypto** (Rust workspace structure) | ✅ Scaffolded | (placeholder) | ~30 |
| 2 | **ot-ics, dfir, cloud, identity, deception** | ❌ Not started | — | — |
| 2 | **supply-chain, hardware, space-aviation** | ❌ Not started | — | — |
| 2 | **automotive, telecom, social-eng, risk** | ❌ Not started | — | — |
| 2 | **blockchain, collab, formal** | ❌ Not started | — | — |

**TypeScript strict mode**: ✅ Zero errors across all 17 packages (14 packages + 3 tools)
**Tests**: ✅ 221 tests passing across 20 test files, all green
**CI/CD**: ✅ 6-job workflow (typecheck, lint, test, build, Docker, Rust checks)
**Rust toolchain**: ✅ rustc 1.96.0, cargo 1.96.0, wasm32 target installed

## Project Goal

Create the world's most photorealistic, behaviorally-authentic cyber operations simulator — a browser-based environment so technically accurate and visually indistinguishable from real SOC/military/IC cyber command centers that professional security operators mistake it for operational tooling. Cover every domain of cybersecurity operations: enterprise IT, OT/ICS, space, aviation, automotive, telecom, cloud, hardware, and cyber-physical systems. No other simulator, open-source or commercial, targets this breadth at this depth.

This is NOT a game. This is NOT a "hacker typer." This is a **high-fidelity simulation framework** that models real cyber operations: actual protocol behavior, real exploit chains, authentic network physics, genuine OS internals, bona fide threat intelligence workflows, and true-to-life cyber-physical system dynamics.

## Core Philosophy

**Zero Concessions to "Gaminess"**

* No fake progress bars that fill on timers — operations take real computational time
* No "movie OS" interfaces — every pixel serves a documented operational purpose
* No Hollywood visual effects — only effects that exist in real tooling (packet captures, hex dumps, memory maps, flame graphs, logic analyzer traces, spectrum waterfalls)
* No simplified abstractions — expose the actual complexity: race conditions, timing attacks, protocol state machines, kernel structures, transistor-level side channels
* No hand-holding — the simulator demands and rewards genuine technical competence

**Authenticity Sources**

* MITRE ATT&CK framework — every technique mapped to real procedures (enterprise, mobile, ICS)
* NIST SP 800-61 / 800-53 / 800-150 / 800-82 — incident response, continuous monitoring, ICS security
* RFC specifications — TCP/IP, TLS, DNS, BGP, DHCP, ARP, HTTP/3, QUIC, WireGuard per spec
* Linux kernel source / Windows Internals / XNU / FreeBSD — syscalls, memory management, process scheduling
* Real malware samples (defanged) — behavioral analysis against actual IOCs
* Actual CVE exploit code (sandboxed) — reproduction of historical breaches (CVE-2021-44228, CVE-2023-34362, CVE-2024-3094, CVE-2025-0001+)
* Production SIEM rule sets (Sigma, Splunk, Elastic, Chronicle) — detection logic from enterprise deployments
* ICS/OT standards — IEC 61850, IEC 60870-5-104, DNP3, Modbus, OPC-UA, S7comm, Profinet, EtherCAT, CANopen
* Aviation standards — ARINC 429/664/825, ACARS, ADS-B, DO-178C, DO-326A
* Space standards — CCSDS, STIG for space, SATCOM protocols
* Automotive standards — ISO 26262, UDS (ISO 14229), SOME/IP, AUTOSAR, CAN/CAN FD/LIN/FlexRay
* Telecom standards — 3GPP (5G NR, 4G LTE), SS7/MAP, Diameter, GTP, IMS, SIP
* Cloud security frameworks — CSA CCM, CIS Benchmarks, AWS/Azure/GCP IAM, kubernetes security
* Hardware security — JTAG/IEEE 1149.1, SWD, SPI, I2C, PCIe, USB, SMBus, TPM 2.0, Intel ME/AMD PSP
* Formal standards — Common Criteria (ISO 15408), FIPS 140-3, PCI-DSS, SOC 2, HIPAA, GDPR, FedRAMP

## Technology Stack (Zero Compromise)

* **Next.js 15+ (App Router, Server Components, Streaming, Server Actions)**
* **TypeScript 5.6+ (strict, no `any`, exhaustive discriminated unions, brand types, nominal typing via `type-fest`)**
* **Tailwind CSS 3.4+ (migrating to 4.0 CSS-first, OKLCH color space, container queries, `@apply`-free)**
* **Framer Motion 12+ (layout animations, shared layout, Web Workers, gesture recognition)**
* **Three.js / React Three Fiber / Drei (instanced rendering, compute shaders, GPGPU, post-processing)**
* **Turborepo (monorepo orchestration, task caching, dependency graph)**
* **WebAssembly (Rust → WASM) for: protocol parsers, crypto, disassembly, emulation, hardware simulation**
* **Web Workers / OffscreenCanvas / WebGL 2 Compute / WebGPU** for simulation loops
* **IndexedDB (Dexie.js) + OPFS + origin-private file system** for persistent virtual filesystem
* **WebRTC DataChannels / WebTransport** for peer-to-peer "C2" and multi-user simulation
* **Web Audio API / AudioWorklet** for DSP-based sound synthesis (no samples)
* **WebAssembly System Interface (WASI)** for portable sandboxed subsystems
* **Rust (stable, nightly features gated)** for all WASM components, networking, crypto, hardware sim
* **eBPF / WASM-bpf hybrid** for in-kernel programmability and observability
* **Zustand + Immer + tRPC** for deterministic state with time-travel debugging
* **OpenTelemetry (WASM)** for distributed tracing and metrics export
* **Apache Arrow / Parquet (WASM)** for columnar telemetry and efficient transfer
* **Vitest + Playwright + fast-check + Stryker** for testing (unit, integration, e2e, property-based, mutation)
* **Oxlint / Biome** for linting and formatting (ZERO-runtime overhead)
* **wasm-pack + wasm-opt + cargo-component** for WASM build pipeline
* **WebGPU compute shaders** for physically-based network propagation, RF simulation, particle systems
* **MLIR / CIRCT** for hardware description language compilation and hardware simulation

## Architecture: Simulation Kernel Architecture (SKA)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Terminal   │ │   Network    │ │  World Map   │ │  Timeline  │  │
│  │  (xterm.js + │ │   Graph      │ │  (WebGL      │ │  (Virtual  │  │
│  │   WASM PTY)  │ │  (Canvas/    │ │   Globe +    │ │   List +   │  │
│  │              │ │   WebGPU)    │ │   Shaders)   │ │   Gantt)   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Hardware   │ │   3D Lab     │ │  Spectrogram │ │  Collab    │  │
│  │  Inspector   │ │  (R3F, phys) │ │  (Web Audio) │ │  Overlay   │  │
│  │  (PCB/board) │ │              │ │              │ │  (WebRTC)  │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ Event Bus (typed, replayable, versioned)
┌─────────────────────────────▼───────────────────────────────────────┐
│                         SIMULATION KERNEL (WASM)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Network    │ │    Host      │ │   Process    │ │    File    │  │
│  │   Stack      │ │    OS        │ │  Scheduler   │ │   System   │  │
│  │  (TCP/IP,    │ │  (Linux/Win  │ │  (Cgroups,   │ │  (VFS,     │  │
│  │   TLS, BGP,  │ │   /XNU/BSD   │ │   namespaces)│ │   FUSE,    │  │
│  │   QUIC)      │ │   kernels)   │ │              │ │   overlay) │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Memory     │ │   Crypto     │ │   Threat     │ │   AI/ML    │  │
│  │   Manager    │ │   Engine     │ │   Intel      │ │   Engine   │  │
│  │  (ASLR,      │ │  (Constant-  │ │  (STIX/TAXII,│ │  (ONNX     │  │
│  │   paging,    │ │   time,      │ │   MISP,      │ │   Runtime, │  │
│  │   heap)      │ │   post-     │ │   YARA-X)    │ │   WebNN)   │  │
│  │              │ │   quantum)   │ │              │ │            │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Hardware   │ │   OT/ICS     │ │    RF/SDR    │ │    Space   │  │
│  │   Simulator  │ │  Simulator   │ │  Simulator   │ │  /Aviation │  │
│  │  (uarch,     │ │  (PLC, RTU,  │ │  (IQ samples,│ │  Simulator │  │
│  │   JTAG, SPI, │ │   DNP3,      │ │   waterfall, │ │  (SATCOM,  │  │
│  │   PCIe, USB) │ │   Modbus)    │ │   SDR)       │ │   ACARS)   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │   Automotive │ │   5G/Telecom │ │   Deception  │ │  Identity  │  │
│  │  Simulator   │ │  Simulator   │ │   Engine     │ │  & Access  │  │
│  │  (CAN, LIN,  │ │  (5G core,   │ │  (honeypots, │ │  (Kerberos,│  │
│  │   FlexRay,   │ │   gNB, IMS,  │ │   honeytkns, │ │   OAuth,   │  │
│  │   SOME/IP)   │ │   SS7, GTP)  │ │   active def)│ │   SAML)    │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │  Blockchain  │ │   Supply     │ │   Digital    │ │  Cyber     │  │
│  │   Engine     │ │   Chain      │ │   Forensics  │ │  Risk      │  │
│  │  (Bitcoin,   │ │  (SBOM,      │ │  (memory,    │ │  Quant     │  │
│  │   EVM, DeFi, │ │   SLSA,      │ │   disk,      │ │  (FAIR,    │  │
│  │   MEV)       │ │   in-toto)   │ │   mobile)    │ │  MonteCarlo)│  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    TIME AUTHORITY  │
                    │  (hybrid logical   │
                    │   clock, HLC,      │
                    │   deterministic    │
                    │   replay, vector   │
                    │   clocks for       │
                    │   distributed ops) │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  FORMAL VERIFIER  │
                    │  (TLA+ model      │
                    │   checking at     │
                    │   runtime, Alloy  │
                    │   bounded check,  │
                    │   Z3 SMT solver)  │
                    └───────────────────┘
```

## Key Features (Redefined for Ultra-Realism)

### 1. Terminal: Real PTY + WASM Userspace

* **xterm.js + WebAssembly PTY** — actual terminal emulator, not a text renderer
* **Multi-shell** — `bash`/`zsh`/`fish`/`powershell` compiled to WASM (via `wasm-shell`, `emscripten`, or `lumen`)
* **Actual syscalls** — `read`, `write`, `open`, `mmap`, `clone`, `execve`, `io_uring` intercepted and simulated
* **Process isolation** — each tab = separate WASM memory instance with namespace simulation
* **Job control** — `SIGTSTP`, `SIGCONT`, `SIGINT`, `SIGKILL`, pipelines, process groups
* **Terminal multiplexing** — `tmux`-compatible session persistence across reloads, `screen` fallback
* **Raw mode / alternate screen / bracketed paste / OSC 52 clipboard** — full VT520 + Sixel + Kitty protocol compliance
* **SSH client in WASM** — real `ssh` binary, keys, agent forwarding, proxy jumps, `ssh_config`
* **GDB/LLDB/Pwndbg/GEF in WASM** — attach to simulated processes, inspect memory, set breakpoints, ROP gadget search
* **TUI framework support** — `ncurses`, `btop`, `htop`, `vim`, `emacs` - full terminal UI compatibility
* **TrueColor / ligatures / powerline** — terminal graphics protocol, image preview via `kitty`/`sixel`

### 2. Network Stack: Protocol-Accurate Simulation

* **Full TCP/IP stack in WASM** — lwIP or custom, with configurable MTU, window scaling, SACK, timestamps, ECN, BBR, CUBIC
* **TLS 1.3 / 1.2 implementation** — real handshake, 0-RTT, key updates, post-handshake auth, delegated credentials
* **QUIC / HTTP/3** — RFC 9000, 9001, 9002 compliant, full connection migration, 0-RTT
* **WireGuard** — full protocol implementation, key exchange, roaming
* **BGP speaker** — RFC 4271 compliant, route reflection, communities, RPKI/ROA validation, ASPA, BGPsec
* **OSPF / IS-IS / RIP / EIGRP** — full IGP suite for enterprise topology simulation
* **DNS authoritative + recursive + stealth** — DNSSEC, DANE, DoH, DoT, DoQ, zone transfers, response policy zones
* **Packet capture (PCAPNG + PCAP)** — every simulated packet exportable to Wireshark, Zeek, Suricata
* **BPF/eBPF virtual machine** — write filters in C/rust, compile to WASM, attach to interfaces, `bpftrace` compatible
* **Traffic shaping** — `tc` compatible: HTB, FQ_CODEL, CAKE, netem (loss, latency, jitter, reordering, corruption)
* **DDoS simulation** — volumetric, protocol, application layer with realistic botnet topologies (Mirai, Gafgyt, etc.)
* **Covert channels** — DNS tunneling, ICMP exfil, HTTP/2/3 framing, TLS SNI encoding, IP covert timing channels
* **Network segmentation** — VLAN, VXLAN, MPLS, EVPN, VRFs, firewall zones, microsegmentation
* **SDN controller** — OpenFlow, P4, ONOS, Ryu-compatible control plane
* **TOR network simulation** — onion routing, hidden services, guard/middle/exit nodes, directory authorities
* **I2P / Freenet** — garlic routing, darknet simulation

### 3. Host OS Simulation: Kernel-Level Fidelity

* **Linux 6.x / Windows 11 / XNU (macOS/iOS) / FreeBSD kernel behavior** — syscalls, signals, `/proc`, `/sys`, registry, WMI, ETW, kevents
* **Process tree with cgroups v2** — CPU/memory/IO limits, OOM killer, freezer, pressure stall info, cpuset, hugetlb
* **Namespace isolation** — PID, NET, MNT, UTS, IPC, USER, TIME, CGROUP, NS FS
* **Filesystem: FUSE in WASM** — ext4/xfs/ntfs/apfs/zfs semantics, inodes, xattrs, ACLs, capabilities, reflink, compression, encryption
* **Filesystem: overlayfs / tmpfs / devtmpfs / procfs / sysfs** — full pseudo-filesystem support
* **Memory management** — 5-level page tables, ASLR, KASLR, KPTI, huge pages, THP, transhuge, mmap semantics, mlock, madvise, userfaultfd
* **Scheduler** — CFS/EEVDF/BFS/MUQSS, real-time SCHED_FIFO/SCHED_RR/SCHED_DEADLINE, `sched_setattr`, `cgroup.procs`, energy-aware scheduling
* **Capabilities(7)** — fine-grained privilege: `CAP_NET_RAW`, `CAP_SYS_ADMIN`, `CAP_DAC_OVERRIDE`, `CAP_BPF`, `CAP_CHECKPOINT_RESTORE`
* **Seccomp-BPF / Seccomp-BPF with SECCOMP_RET_USER_NOTIF** — syscall filtering, trap, trace, user notification
* **LSM hooks** — SELinux/AppArmor/Smack/Tomoyo/Landlock simulation
* **Container runtime** — OCI spec, runc-compatible, crun, gVisor, Kata Containers, overlayfs, snapshotter
* **KVM/QEMU simulation** — nested virtualization, hypervisor escape scenarios
* **Docker / Podman / containerd** — full container lifecycle, images, registries, networking, volumes
* **Kubernetes** — multi-node cluster, pods, services, ingress, network policies, RBAC, OPA/Gatekeeper, service mesh (Istio, Linkerd, Cilium)
* **Systemd / init** — full unit lifecycle, journald, timers, socket activation, cgroup integration
* **eBPF / bpftrace** — full eBPF verifier and JIT, kprobes, uprobes, tracepoints, USDT, CO-RE, BTF, bpf_sk_lookup, XDP, TC BPF

### 4. Hardware & Firmware Simulation

* **CPU microarchitecture** — pipelining (RISC-V, ARM, x86-64), caches (L1/L2/L3), branch prediction (TAGE, perceptron), store buffers, out-of-order execution, speculative execution (Spectre/Meltdown/Retbleed/MDS/ZombieLoad)
* **Peripheral bus simulation** — PCIe (gen1-gen6, AER, ATS, PRI), USB (1.0-4.0), SATA, NVMe, SPI, I2C, SMBus, eMMC, UFS
* **Firmware/UEFI** — EDK2 simulation, UEFI variable store, secure boot, measured boot, TCG event log, SMM, DXE, BDS
* **Low-level management engines** — Intel ME / CSME, AMD PSP / ASP, Apple SEP, ARM TrustZone
* **SoC simulation** — RISC-V BOOM/CVA6, ARM Cortex-M/A, interconnects (NoC, AXI, AHB, APB)
* **JTAG/SWD** — boundary scan, flash reading/writing, register manipulation, JTAG debugging, IEEE 1149.1/1149.7
* **Logic analyzers** — sigrok/PulseView compatible, protocol decoding (SPI, I2C, UART, CAN, 1-Wire, MDIO)
* **Side-channel emulation** — power analysis (SPA/DPA/CPA), electromagnetic (EMA), timing, cache timing (Prime+Probe, Flush+Reload, Evict+Reload), port contention
* **Fault injection** — voltage glitching, clock glitching, EM pulse, laser, row hammer, rowhammer, ECC bit flips
* **Hardware security module** — TPM 2.0 full simulation (PCRs, NV indices, trusted boot, remote attestation), PKCS#11 HSM, YubiKey/SoloKey, Nitrokey
* **SDR simulation** — IQ sample generation, spectrum waterfalls, modulation (BPSK, QPSK, QAM, OFDM, LoRa), demodulation, RF fingerprinting
* **PCB/board viewer** — interactive board layout with component highlighting, datasheet cross-reference, test point navigation

### 5. OT/ICS/SCADA Simulation

* **Purdue model** — levels 0-4: process, control, operations, site, enterprise with network segmentation
* **PLC simulation** — Siemens S7-1200/1500, Allen-Bradley ControlLogix/CompactLogix, Schneider Modicon, Mitsubishi MELSEC, CODESYS runtime
* **RTU simulation** — SEL-3620/3622, Schweitzer, GE D20/D400, DNV GL
* **HMI/SCADA** — Wonderware, WinCC, iFix, Ignition, VTScada, AVEVA
* **DCS** — Emerson DeltaV, Honeywell Experion, Yokogawa Centum VP, ABB 800xA
* **Fieldbus protocols** — Modbus RTU/TCP/ASCII, DNP3, IEC 60870-5-101/103/104, IEC 61850 (GOOSE, MMS, SV), Profibus, Profinet, EtherCAT, CANopen, DeviceNet, ControlNet, HART, Foundation Fieldbus, OPC Classic, OPC UA
* **Safety systems** — SIS, SIL-rated logic solvers, emergency shutdown (ESD), fire & gas (F&G), burner management (BMS)
* **Remote access** — RA configurations (eWON, Moxa, Digi, generic VPN/RDP/VNC), jump boxes, DMZ architectures
* **ICS-specific attacks** — TRITON/Trisis, Industroyer/CrashOverride, Stuxnet (sabotage), Havex, BlackEnergy, EKANS, Pipedream/INCONTROLLER, COSMICENERGY
* **Safety-instrumented function bypass** — manipulation of SIL-rated logic, MOC bypass scenarios
* **Physical process simulation** — chemical reactor, power generation, water treatment, assembly line, pipeline, wind turbine with realistic physics (WebAssembly + GPU compute)
* **Alarm management** — ISA-18.2 / IEC 62682, alarm floods, rationalization, stale alarms, operator response metrics

### 6. Satellite / Space / Aviation Cybersecurity

* **SATCOM simulation** — fixed/mobile satellite service, VSAT, BGAN, Iridium, Starlink, OneWeb, Inmarsat, GPS/Galileo/GLONASS/BeiDou
* **Space protocols** — CCSDS (TC, TM, AOS, File Delivery Protocol, SLE), CFDP, CSP (CubeSat Space Protocol), KISS, AX.25
* **Spacecraft bus simulation** — command & data handling (C&DH), attitude determination & control (ADCS), electrical power (EPS), thermal control
* **GPS spoofing / jamming** — civil/military signal simulation (L1 C/A, L1C, L2C, L5), meaconing, time synchronization attacks
* **Aviation protocols** — ACARS (Aircraft Communications Addressing and Reporting System), ADS-B (OUT/IN), Mode S, FMS, EFB, SATVOICE, SELCAL
* **Aviation networks** — ARINC 429/629/664 (AFDX), ARINC 825 (CAN), ARINC 834, CDTI, CPDLC, FANS 1/A
* **Avionics simulation** — Flight Management System (FMS), Electronic Flight Bag (EFB), TAWS, TCAS, weather radar, ILS
* **UAV/UAS/drone simulation** — MAVLink, ArduPilot/PX4, mission planner, geofencing, sense-and-avoid
* **DO-326A / DO-356A** — airworthiness security, threat analysis, security controls
* **STIG for space** — space platform hardening, secure telemetry, anti-tamper
* **Ground station simulation** — antenna tracking, TTC, Doppler compensation, polarization, link budgets

### 7. Automotive / Transportation Cybersecurity

* **In-vehicle networks** — CAN (2.0, FD, XL), CANopen, J1939 (heavy-duty), LIN 2.x, FlexRay, MOST150, Automotive Ethernet (100BASE-T1, 1000BASE-T1)
* **ECU simulation** — engine control, transmission, ABS/ESC, airbag (ACU), telematics (TCU), IVI, instrument cluster, BCM, gateway
* **UDS / OBD-II** — ISO 14229 diagnostic services, ISO 15765 (DoCAN), ISO 13400 (DoIP), read/write DTC, flashing, security access, session control
* **AUTOSAR** — Classic and Adaptive platform, RTE, BSW, SW-C, communication stacks, secure onboard communication (SecOC)
* **V2X / C-V2X / DSRC** — IEEE 802.11p, ITS-G5, LTE-V2X, NR-V2X, CAM, DENM, BSM, SPaT, MAPEM misbehavior detection
* **ADAS / Autonomous systems** — sensor fusion (lidar, radar, camera, ultrasonic), perception, planning, control, ML model robustness
* **ISO 21434 / UN R155 / R156** — road vehicle cybersecurity engineering, CSMS, SUMS, type approval compliance
* **Charging infrastructure** — ISO 15118 (PLC, V2G), CCS, CHAdeMO, NACS, EVSE security, OCPP, OCPI
* **Rail/critical transport** — ETCS (ERTMS), PTC, CBTC, signaling (Relay, Solid State, Computer-Based Interlocking), ALSTOM, Thales, Siemens rail
* **Maritime** — AIS (Class A/B), ECDIS, GPS, GMDSS, LRIT, SSAS, port management systems, IEC 61162/NMEA 0183/2000

### 8. 5G / Telecommunications Cybersecurity

* **5G core (5GC)** — AMF, SMF, UPF, UDM, AUSF, PCF, NRF, NSSF, NEF, NRF, SEPP, SCP, NRF, UPF per 3GPP TS 23.501/502/503
* **5G RAN** — gNB (CU, DU, RU), O-RAN split, F1/E1/X2/Xn/N2/N3 interfaces, SDR-based PHY/MAC/RLC/PDCP/RRC/SDAP
* **4G/LTE fallback** — EPC (MME, SGW, PGW, HSS, PCRF), eNB, X2/S1 interfaces
* **IMS/VoLTE/VoNR** — CSCF, TAS, MRF, MGCF, IBCF, SIP registration, session establishment, encryption (SRTP/zRTP)
* **SS7/MAP/CAMEL** — SCCP, TCAP, MAP, ISUP, roaming, SMS interception, location tracking, redirect attacks
* **Diameter** — S6a/S6d, Gx, Gy, Rx, Sh/Dh interfaces, credit control, charging
* **GTP (GPRS Tunneling Protocol)** — GTP-C, GTP-U, GTP', encapsulation, TEID manipulation, GTP-U reflection
* **Signaling firewall** — roaming security, SS7/Diameter/5G signaling firewalls, RAN security, SEPP/N32 interconnect security
* **IMSI catchers / Stingrays** — fake base station simulation, IMSI acquisition, cipher downgrade, SS7-based tracking
* **O-RAN security** — open interfaces, RIC (near-real-time, non-real-time), xApps/rApps, E2 interface, O-RAN security specification
* **Network slicing** — NSSF, NSSAI, slice isolation, slice-specific security policies
* **Cable / fixed access** — DOCSIS 3.1/4.0, GPON/EPON, cable modem, CMTS, fiber OLT/ONT security

### 9. Threat Intelligence & Detection: Production-Grade

* **STIX 2.1 / TAXII 2.1 server** — real API, collections, manifests, pagination, STIX patterns, observables, indicators, campaigns, intrusion sets
* **MISP** — full MISP instance simulation, feed synchronization, correlation, galaxy, taxonomies, warning lists, sharing groups
* **Sigma rule engine** — full spec: modifiers, aggregations, field mappings, pipeline, custom correlation rules, sigma conversion to Splunk/ES|QL/KQL/Chronicle
* **YARA-X (Rust/WASM)** — pattern matching on memory, files, network streams, YARA 4.x modules (pe, elf, math, hash, magic)
* **CAPA / FLOSS** — rule-based capabilities analysis of binaries, string extraction, behavior matching
* **MITRE ATT&CK navigator** — technique → procedure → simulation mapping, coverage analysis, gap identification
* **ATT&CK for ICS** — ICS techniques, tactics, groups, software (includes TRITON, Industroyer, Stuxnet, PIPEDREAM)
* **RE&CT framework** — responder-oriented framework, response playbooks, countermeasure mapping
* **Threat hunting notebooks** — Jupyter-compatible, KQL/SPL/ES|QL translation, hunting loop automation
* **ATT&CK emulation plans** — atomic tests, Caldera/Infection Monkey/Stratus Red Team-style adversary profiles
* **False positive simulation** — tuning rules against benign noise distributions, baseline profiling
* **Detection-as-code CI** — unit tests for every rule, regression detection, TTD (time to detect) benchmarks
* **Threat feed simulation** — live-updated feeds (AlienVault OTX, VirusTotal, AbuseIPDB, Feodo, URLhaus)
* **TI sharing groups** — ISAC/ISAO simulation (FS-ISAC, IT-ISAC, E-ISAC, MS-ISAC), traffic light protocol (TLP)
* **Geopolitical threat context** — state-sponsored group profiles (APT1-45, UNC groups, TA groups), motivation modeling

### 10. Exploit Development & Vulnerability Research

* **Vulnerability replay** — CVE-2021-44228 (Log4Shell), CVE-2023-34362 (MOVEit), CVE-2024-3094 (xz), CVE-2025+, CVE-2026+, 0-day placeholders with realistic payloads
* **Exploit dev environment** — `pwntools` in WASM, ROP gadget finder (ROPgadget, Ropper, ROP chain assembler), heap visualizer (pwndbg, gef), shellcode generator (msfvenom style)
* **Fuzzing harness** — AFL++/libFuzzer/cargo-fuzz in WASM, corpus management (minimization, dedup), crash triage (exploitability scoring), coverage-guided
* **Binary analysis** — Ghidra headless API (WASM), radare2/rizin (WASM), Binary Ninja API (WASM), angr (symbolic execution concolic)
* **Kernel exploit mitigation bypass** — KPTI, SMAP/SMEP, KASLR, FG-KASLR, CET (IBT, Shadow Stack), PAC (AArch64), MTE, CFG, XFG
* **Hardware vuln simulation** — Spectre v1/v2/v4/v5, Meltdown, Retbleed, MMIO stale data, Zenbleed, Downfall, Inception, RFDS, Sinkclose
* **Heap exploitation** — tcache, fastbin, unsorted bin, overlapped chunks, heap feng shui, house of force/spirit/storm, safe-linking bypass
* **Web exploitation** — XSS, CSRF, SSRF, prototype pollution, deserialization, SSTI, SQLi, NoSQLi, race condition, DNS rebinding
* **Cloud exploitation** — AWS/Azure/GCP metadata service, S3/RBAC misconfig, container escape, K8s RBAC abuse, serverless injection
* **Wireless exploitation** — Wi-Fi deauth, WPA2 KRACK, WPA3 dragonblood, Bluetooth BIAS, BLE advertisement spoofing, RFID/NFC cloning
* **Mobile exploitation** — iOS jailbreak, Android root, Magisk, Xposed, Frida, objection, Corellium simulation, sideloading, NDSS exploitation

### 11. Cryptography: Constant-Time, Side-Channel Resistant

* **RustCrypto / BoringSSL / AWS-LC in WASM** — AES-GCM, ChaCha20-Poly1305, X25519, Ed25519, Kyber, Dilithium, SPHINCS+, Falcon
* **TLS 1.3 / 1.2 / DTLS 1.3** — full state machine, early data, key export, delegated credentials, Encrypted Client Hello (ECH)
* **Hardware security module (HSM) simulation** — PKCS#11 (SoftHSM), TPM 2.0 (TPM2-TSS), Nitrokey/YubiHSM, AWS CloudHSM, Azure HSM
* **Side-channel timing** — cache-timing (Flush+Reload, Prime+Probe), branch prediction (SCA), port contention, frequency scaling (Turbo Boost SC)
* **Post-quantum KEM/KEM+KEM hybrids** — NIST PQC finalists (ML-KEM, ML-DSA, SLH-DSA, FN-DSA), hybrid X25519+Kyber
* **Quantum key distribution (QKD) simulation** — BB84, E91, decoy state, entanglement distribution, photon number splitting
* **White-box cryptography** — table-based, masking, fault-resistant implementations, differential computation analysis (DCA) resistance
* **Multi-party computation** — SPDZ, Garbled Circuits, secret sharing, threshold ECDSA/EdDSA/BLS
* **Zero-knowledge proofs** — Groth16, PLONK, Halo2, STARKs, bulletproofs, recursive ZK, ZK-EVM circuits
* **Fully homomorphic encryption** — BFV, BGV, CKKS, TFHE, FHEW, bootstrapping, programmable bootstrapping
* **Verifiable delay functions** — VDF, time-lock puzzles, VDF-based randomness beacons
* **Cryptographic formal verification** — F* / HACL* verified implementations, coq proofs of protocol security

### 12. AI/ML: Local Inference, Real Models

* **ONNX Runtime Web / WebNN / WebGPU ML** — run distilled models in browser (CodeBERT, VulnBERT, MalConv, CyberGPT, SecBERT)
* **Threat classification** — static/dynamic malware family classification, CWE prediction, exploitability scoring, vulnerability assessment
* **Anomaly detection** — isolation forests, VAEs, deep SVDD on netflow/process trees/registry/ETW/auditd
* **Natural language → query** — Sigma/YARA/SPL/KQL/SQL generation from analyst intent (LLM-in-browser via WASM GGML/llama.cpp)
* **Adversarial ML** — evasion attacks (FGSM, PGD, CW, boundary), poisoning (model skew, backdoor), extraction (model stealing, membership inference)
* **LLM red teaming** — prompt injection, jailbreaking (GCG, PAIR, Cipher), indirect prompt injection, data poisoning, RAG injection
* **Computer vision for ICS** — gauge reading, pipe/cable detection, equipment tag identification from video feeds
* **Deepfake detection** — GAN/AE-generated image detection, voice cloning detection, face swap detection
* **Reinforcement learning for red teaming** — autonomous penetration testing, decision transformer for attack graphs
* **Graph neural networks** — GCN/GAT on BGP topology, network flow graphs, process trees, kill chains
* **Language model fine-tuning** — LoRA/QLoRA fine-tuning in WASM of distilled models for domain-specific SOC tasks
* **Neural code completion for exploits** — ROP chain generation, shellcode completion, fuzzing harness generation

### 13. World Map: Geospatial + BGP + Submarine Cables + RF Propagation

* **Real BGP routing table** — 900k+ prefixes, AS relationships (customer/provider/peer/sibling), valley-free routing, RPKI validation
* **Submarine cable map** — TeleGeography data, latency = physical distance / c (fiber refractive index), cable cuts
* **IXP locations** — peering DB, facility metadata, colocation, route server, IXP-specific security
* **Threat geo-attribution** — overlapping confidence intervals, not pinpoint markers, multi-factor attribution (language, TTP, timing, infrastructure overlaps)
* **Real-time (simulated) looking glass** — `traceroute`, `bgpstream`, `bgpkit`, `iris`, `RIPEstat` from any ASN
* **RF propagation modeling** — Longley-Rice, ITM, ITWOM, okumura-hata, ray-tracing, terrain-aware propagation, building penetration
* **Spectrum occupancy** — real-time spectrum waterfall, channel utilization, interference detection, SIGINT geolocation (TDOA, FDOA, AoA)
* **Satellite ground tracks** — real-time TLE propagation, coverage cones, inter-satellite links, ground station visibility windows
* **Cyber terrain mapping** — attack surface visualization, blast radius, choke points, crown jewel analysis, resilience scoring
* **CI/KR (Critical Infrastructure / Key Resources)** — mapping of power grid, water, telecom, transportation, financial infrastructure with interdependency modeling

### 14. Sound: DSP Synthesis, Zero Samples

* **AudioWorklet processors** — modular synth: VCO, VCF, VCA, LFO, envelope, noise, S&H, wavefolder, phaser, flanger, reverb (convolution, algorithmic)
* **Keyboard** — mechanical switch modeling (Cherry MX Blue/Brown/Red/Speed/Silver, Topre, Buckling Spring, Opto-mechanical, Hall effect)
* **Network sonification** — packet rate → granular density, port → pitch, flags → timbre, protocol → rhythmic pattern
* **ICS sonification** — motor RPM → frequency, valve position → amplitude, temperature → pitch, alarm cascade → polyrhythmic intensity
* **Alert tones** — Shepard-Risset glissando, tritone paradox, psychoacoustic urgency, IEC 60601 alarm priority levels
* **Ambient** — data center HVAC (120Hz + harmonics), disk seek harmonics, fan curves (linear/exponential), UPS hum, generator rumble
* **EM side-channel sonification** — power line hum, clock leakage, VGA/HDMI radiation demodulation
* **Spatial audio** — Web Audio PannerNode, HRTF (CIPIC, SADIE II), room impulse responses (shoebox, hall, chamber, anechoic)
* **Voice synthesis** — SpeechSynth with WASM voice cloning, deepfake voice simulation for vishing/Vishing simulation
* **Sonar/radar audio** — active/passive sonar, CW/Doppler/FMCW radar audio, whale/dolphin interference

### 15. Persistence & Replay: Deterministic Time Travel

* **Event sourcing** — every mutation = typed event, append-only log (IndexedDB + OPFS + remote sync), global order via hybrid logical clocks
* **Deterministic simulation** — fixed timestep (variable to 1ms), seeded RNG (PCG64, ChaCha8), reproducible runs across architectures
* **Time-travel debugger** — scrub timeline, fork history, `rr`-style reverse execution, branch/merge simulation timelines
* **Scenario export/import** — JSONL + WASM module bundle + hardware state, shareable, versioned, digitally signed (sigstore)
* **CI integration** — replay scenarios as regression tests, performance benchmarks, FPS/hitch tracking, determinism verification
* **Multiplayer simulation sync** — CRDT-based state sync for collaborative ops, OT for terminal, WebRTC DataChannels with SFrame encryption
* **Scenario marketplace** — community scenarios, scoring, leaderboards, official CISA/NSA/FBI scenario packs
* **Replay analysis** — TTD (time to detect), TTR (time to respond), coverage maps, MITRE ATT&CK heatmaps, kill chain timelines

### 16. Deception & Active Defense

* **Honeypots (high/low interaction)** — SSH, HTTP, HTTPS, databases (MySQL, PostgreSQL, MSSQL, MongoDB), RDP, VNC, SMB, FTP, SMTP, DNS, OT honeypots (Conpot, GasPot, SCADA honeynet)
* **Honeytokens** — fake database records (canarytables), API keys, credentials, files (canarydocs), SMB share honeyfiles, honeyaccounts
* **Honeynets** — distributed honeypot infrastructure, second-level honeypot interaction, network telescopes, darknets
* **Active defense / threat deception** — decoy infrastructure, breadcrumb trails, deception servers, lures, deceptions as a service
* **Attribution obfuscation** — C2 relay chaining, traffic obfuscation, user-agent spoofing, geolocation spoofing, TOR/Proxy chains
* **Threat deception platforms** — Illusive Networks, TrapX, Attivo, Fidelis deception simulation
* **Honeymonkeys / client honeypots** — simulated user browsing, form filling, credential submission, click patterns
* **ICMP/TCP stealth scans** — active response to reconnaissance, fake open ports, dynamic port assignment, port triggering

### 17. Digital Forensics & Incident Response (DFIR)

* **Memory forensics** — Volatility 3 (WASM), winpmem/linux memory acquisition, DFRWS memory challenge scenarios, pool tag scanning, KDBG/KPC, MFT scanning
* **Disk forensics** — Sleuth Kit/Autopsy (WASM), NTFS/ext4/FAT32/APFS data recovery, MFT parsing, journal analysis, timeline generation, file carving (photorec/scalpel)
* **Mobile forensics** — iOS/Android logical/file system/physical extraction, Cellebrite UFED simulation, SQLite recovery, plist parsing, Android backup analysis
* **Cloud forensics** — AWS CloudTrail/CloudWatch, Azure Monitor/Activity Log, GCP Audit Log, Kubernetes audit log, container snapshot analysis
* **Network forensics** — PCAP analysis (Wireshark, Zeek, Suricata), flow analysis (netflow, IPFIX, sFlow), TLS interception simulation
* **Malware analysis (static)** — PE/ELF/Mach-O format parsing, section analysis, import/export table, string extraction (FLOSS), packer detection, entropy analysis
* **Malware analysis (dynamic)** — syscall trace, API monitor, registry monitor, file system monitor, network callback capture
* **Timeline analysis** — super timeline, body file, Plaso/log2timeline, Mac/Droid/Windows timeline, event correlation
* **Live response** — Velociraptor, Osquery (WASM), GRR, CyLR collection, Kape, F-Response, remote registry
* **Indicators of compromise** — IOC extraction, OpenIOC, STIX, YARA rule generation from triage, threat intel enrichment
* **Forensic report generation** — templated report, timeline graph, hex dump, file system tree, registry hive viewer

### 18. Cloud & Container Security (Multi-Cloud)

* **AWS simulation** — EC2, S3, Lambda, IAM, VPC, Security Group, CloudTrail, GuardDuty, Inspector, WAF, Shield, KMS, Secrets Manager, EKS, ECS, Fargate
* **Azure simulation** — VMs, Blob Storage, Functions, Entra ID (Azure AD), NSG, Sentinel, Defender, Key Vault, AKS, Container Instances, Cosmos DB, SQL DB
* **GCP simulation** — Compute Engine, Cloud Storage, Cloud Functions, Cloud IAM, VPC, Security Command Center, Chronicle, KMS, GKE, Cloud SQL, BigQuery
* **Multi-cloud IAM** — role definitions, trust policies, permission boundaries, service control policies, permission escalation, cross-account access
* **CSPM / CWPP / CIEM** — cloud security posture management, workload protection, cloud infrastructure entitlement management
* **Kubernetes security** — RBAC escalation, pod escape, volume mount attacks, service account abuse, network policy bypass, OPA/Gatekeeper bypass, admission controller abuse, seccomp/apparmor escape
* **Service mesh security** — Istio/Consul/Linkerd/Cilium mTLS, authorization policies, ingress/egress gateway
* **Serverless security** — event injection, dependency poisoning, environment variable leakage, cold start exploitation, SQS trigger manipulation
* **Container supply chain** — image scanning (Trivy, Grype, Clair), Cosign verification, SBOM validation, SLSA provenance
* **eBPF-based security observability** — Falco, Cilium Tetragon, Tracee, Pixie, Kubeshark, Hubble

### 19. Identity & Access Management (IAM) Security

* **Active Directory** — forest/domain trusts, Kerberos (AS-REP, TGS, delegation, constrained/unconstrained delegation, RBCD, s4u2self, s4u2proxy, golden/silver/diamond/sapphire tickets), NTLM (pass-the-hash, pass-the-ticket, relaying), LDAP (enumeration, injection, queries), Group Policy abuse
* **Entra ID / Azure AD** — OAuth2 device code flow, consent phishing, token theft, PRT abuse, Seamless SSO, Kerberos cloud trust, hybrid identity, Password Hash Sync, Pass-Through Authentication, federation (ADFS, Ping, Okta)
* **OAuth 2.1 / OIDC** — authorization code PKCE, implicit flow, client credentials, device authorization, token exchange, refresh token rotation, back-channel logout, PAR, JWT/JWE/JWS/JWK
* **SAML / WS-Fed** — SAML assertion manipulation, XML signature wrapping, response tampering, replay attacks, relay state confusion, certificate impersonation
* **Passkeys / FIDO2 / WebAuthn** — credential management, platform vs cross-platform authenticators, user verification, attestation, discoverable credentials, hybrid, passkey syncing security
* **MFA/2FA** — TOTP, HOTP, SMS-based, push notification, authenticator app, hardware tokens, SIM swapping, MFA fatigue
* **PAM / privilegd access management** — CyberArk, BeyondTrust, Delinea, HashiCorp Vault, session recording, credential rotation, just-in-time access
* **LDAP injection / directory attacks** — attribute filtering, search filter manipulation, DN injection, blind LDAP
* **Password security** — rainbow tables, rule-based cracking (hashcat, John), pass-the-hash, pass-the-cookie, password spraying, credential stuffing
* **Certificate lifecycle / PKI** — CA/RA/subs, CRL/OCSP, certificate transparency, mis-issued certs, private key disclosure, CA compromise

### 20. Supply Chain Security

* **SBOM (SPDX 2.3/3.0, CycloneDX 1.5)** — generation, validation, diffing, vulnerability correlation, license compliance
* **SLSA framework** — SLSA 1-4 levels, provenance attestation (in-toto), build integrity, source integrity, dependency integrity
* **Dependency confusion / typo-squatting / repo confusion** — npm, PyPI, Maven, RubyGems, Cargo, NuGet, Go modules
* **Package manager security** — package signing (Sigstore, Cosign, Gitsign), reproducible builds, minimum version selection, peer dependency chain exploits
* **CI/CD pipeline security** — pipeline injection, DIND escape, secrets leakage, artifact tampering, staged deployments, approval gates
* **GitHub/GitLab security** — Actions/Runner/Workflow injection, branch protection bypass, PR hijacking, secrets in repos, Actions caching poisoning
* **Malware in dependencies** — typosquatting detection, dependency confusion, protestware, dependency deprivation, manifest confusion
* **Binary provenance** — Sigstore (Rekor, Fulcio, Cosign, Gitsign, Witness), TUF, in-toto attestations, PE/ELF/macho signing at scale
* **Vulnerability disclosure / CVE process** — CNA simulation, CVSS 4.0 scoring (environmental, temporal), EPSS probability, VEX documents
* **OpenSSF Scorecard / Criticality Score** — self-assessment, badge, compliance dashboards

### 21. Social Engineering & Human Factors

* **Phishing simulation** — spear-phishing, whaling, clone phishing, vishing (voice), smishing (SMS), quishing (QR), angler phishing (social media)
* **Deepfake audio/video** — voice cloning (11Labs style), face swapping, lip-syncing, real-time deepfake for vishing simulation
* **Business email compromise (BEC)** — CEO fraud, invoice fraud, gift card fraud, payroll diversion, W-2 phishing
* **Pretexting / impersonation** — IT support, vendor, colleague, authority figure, law enforcement, recruiter
* **Insider threat modeling** — malicious, negligent, compromised (credentials, coercion), collusive, disgruntled, departing employee
* **Social media reconnaissance** — OSINT enumeration, scraping, profile linkage, digital footprint analysis
* **Watering hole attacks** — compromised legitimate sites, drive-by downloads, malvertising
* **Physical social engineering** — tailgating, badge cloning, lock picking simulation, dumpster diving document recovery
* **Psychological manipulation** — urgency, authority, scarcity, social proof, reciprocity, liking, commitment/consistency (Cialdini)
* **User behavior analytics** — keystroke dynamics, mouse movement, activity timing, behavioral biometrics, anomaly detection

### 22. Cyber Risk Quantification & Compliance

* **FAIR model (Factor Analysis of Information Risk)** — loss event frequency (LEF), loss magnitude (LM), annualized loss expectancy (ALE), Monte Carlo simulation (WASM-compiled)
* **Cyber insurance modeling** — policy terms, exclusions, sub-limits, self-insured retention, premium estimation, incident response costs
* **NIST CSF 2.0** — govern, identify, protect, detect, respond, recover — maturity assessment, target profiles, tiers
* **Regulatory compliance** — GDPR (DPIA, breach notification, consent, DPO), PCI-DSS 4.0, HIPAA/HITECH, SOX, FedRAMP, SOC 2 Type II, ISO 27001, NIS2, DORA, CCPA/CPRA, LGPD, PIPEDA
* **Cyber wargaming** — tabletop exercise facilitation, red/blue/purple team automated exercises, decision trees, branch analysis
* **Attack graph generation** — MulVAL, Nested RPD, topological vulnerability analysis, exploit dependency analysis, shortest-path to crown jewels
* **Breach cost modeling** — Ponemon/IBM cost of data breach, detection, escalation, notification, post-breach, lost business, regulatory fines
* **Key risk indicators (KRIs)** — vulnerability density, patch latency, MTTD, MTTR, control effectiveness, security debt
* **Third-party / vendor risk** — TPRM lifecycle, vendor assessments (Sig, CAIQ, VSA), continuous monitoring, subcontractor cascading
* **Risk register** — threat taxonomy, asset inventory, control catalog, risk scoring, treatment plans, residual risk acceptance

### 23. Blockchain / DeFi / Digital Currency Security

* **Bitcoin full node** — full P2P network, mempool, UTXO set, block validation, mining simulation, peer discovery
* **Ethereum / EVM** — full Ethereum execution layer, Geth/Nethermind compatible, EVM bytecode execution, opcodes, precompiles, gas metering
* **DeFi protocol exploitation** — DEX (Uniswap v2/v3/v4, Curve), lending (Aave, Compound, Morpho), yield aggregator (Yearn), MEV (Flashbots, backrunning, sandwich attack, JIT liquidity)
* **Cross-chain bridges** — wormhole, multichain, nomad, layerZero, chainlink CCIP simulation, bridge security analysis, validator set attacks
* **NFT security** — ERC-721/1155, royalty manipulation, metadata poisoning, bidding exploits, floor price manipulation
* **Smart contract vulnerabilities** — reentrancy (single-function, cross-function, cross-contract, read-only), access control, oracle manipulation (price feed, randomness), flash loan attack
* **Consensus attacks** — 51% attack, long-range attack, selfish mining, eclipse attack, GRR, BGP hijacking of nodes
* **MEV (Miner/Maximal Extractable Value)** — DEX arbitrage, liquidation, sandwich, JIT liquidity, censorship, PBS/MEV-boost, MEV-share, ePBS
* **Wallet security** — mnemonic generation, HD wallets (BIP32/39/44/84/86), hardware wallet (Ledger, Trezor, GridPlus), multisig (Gnosis Safe), EIP-4337 account abstraction
* **Zero-knowledge blockchain** — ZK-rollup (zkSync, StarkNet, Polygon zkEVM), validity proof, zkBridge, privacy coins (Zcash, Monero)
* **DeFi insurance** — Nexus Mutual, Cover protocol, insurance claims assessment, risk assessment, staking
* **Blockchain forensics** — address clustering, taint analysis, chainalysis/elliptic simulation, mixers (Tornado Cash, Wasabi), privacy pools

### 24. Collaborative Operations & Multi-User Simulation

* **Red vs Blue team exercises** — automated opfor (AI adversary), blue team with live analysis tools, white cell controller, observer/reporter
* **Purple team exercises** — joint detection validation, rule tuning, gap identification, procedure improvement
* **SOC team simulation** — tier 1 (triage), tier 2 (investigation), tier 3 (hunting, forensics, malware) — role-based console views
* **Incident command system** — NIMS/ICS structure for cyber incidents, commander, operations, planning, logistics, finance/admin
* **Multi-echelon command** — tactical SOC, operational CISO, strategic board — different data views and KPIs at each level
* **Distributed simulation** — peer-to-peer state sync (CRDT, WebRTC), deterministic across clients, fork-resolution, time synchronization
* **Shared workspace** — shared terminals, collaborative packet analysis, shared forensic timeline, joint malware analysis
* **Communication systems** — SIPRNet/NIPRNet simulation, classified/unclassified channels, instant messaging (Jabber, Teams, Signal), IRC, telephone
* **Exercise management** — scenario inject engine, inject scheduling, player injects, branching scenarios, automated inject responses
* **After-action review (AAR)** — full scenario replay, decision-point analysis, alternative-path exploration, performance metrics, kill-chain reconstruction

### 25. Formal Verification & Simulation Correctness

* **TLA+ / PlusCal** — formal specs for network stack, scheduler, filesystem, consensus protocols: model checking with TLC, Apalache, TLAPS
* **Alloy** — bounded exhaustive analysis of access control policies, trust models, data flow, capability systems
* **Z3 SMT solver (WASM)** — symbolic execution, constraint solving, bounded model checking, invariant inference, test case generation
* **Coq / Rocq / Isabelle/HOL** — mechanically verified core simulation components: protocol implementations, cryptographic primitives, scheduler invariants
* **K framework** — semantics-based verification of VM bytecode, EVM, eBPF verifier, WASM execution semantics
* **Concolic testing (symcc, angr)** — guided input generation, path coverage, constraint discovery for WASM modules
* **Property-based testing (fast-check)** — stateful tests, model-based testing, invariant testing, falsification with shrinking
* **Mutation testing (Stryker)** — kill rate > 95%, surviving mutant analysis, equivalent mutant detection
* **Runtime verification** — invariants, assertions, pre/post conditions in production simulation, spectative monitors, enforcement monitors
* **Determinism checks** — every simulation run produces identical output given identical input and seed; CI-enforced regression

## Performance Budgets (Non-Negotiable)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold load (p95) | < 2.0s | Lighthouse CI, 3G throttling |
| TTI | < 1.5s | Real User Monitoring |
| Simulation step (60Hz) | < 2ms | `performance.measureUserTiming()` |
| WASM heap | < 64MB baseline, < 256MB peak | `memory.grow()` monitoring |
| WebGL/WebGPU draw calls | < 80/frame | Spector.js, GPU timers |
| Bundle (gzipped) | < 300KB baseline, < 500KB full | `webpack-bundle-analyzer`, `wbn` |
| Memory (idle) | < 100MB | Chrome DevTools heap snapshot |
| Memory (full sim) | < 1GB | Same |
| IndexedDB operations | < 5ms batch write | `performance.measure()` |
| WebRTC latency (multiplayer) | < 50ms p95 | round-trip measurement |
| WASM instantiation | < 100ms | `WebAssembly.instantiate()` tracing |
| FPS (idle) | 144fps | `requestAnimationFrame` cadence |
| FPS (full sim) | > 30fps | Same |

## Accessibility: Not an Afterthought

* **WCAG 2.2 AA / AAA** — color contrast (OKLCH), focus order, live regions, landmarks, AAA text contrast
* **Screen reader** — semantic HTML, `aria-live` for async events, virtual cursor for canvas, Sonification for visually impaired operators
* **Keyboard-only** — every action reachable, roving tabindex, command palette (⌘K), no dead-ends, escape hatch from every component
* **Reduced motion** — `prefers-reduced-motion`, disable all non-essential animation, timeline scrubbing remains
* **High contrast** — `prefers-contrast: more`, forced colors mode, Windows HCM, custom palette for protanopia/deuteranopia/tritanopia
* **Font scaling** — `rem` only, respect browser zoom to 500%, container queries, fluid typography via clamp()
* **Color blindness** — deuteranopia/protanopia/tritanopia palettes, pattern fills, texture overlays, icon + text indicator, never color-only
* **Cognitive** — plain language, progressive disclosure, undo everywhere, no time limits, consistent navigation, error prevention (constraint validation)
* **Motor disabilities** — switch access, voice control (Web Speech), dwell clicking, larger touch targets (48dp minimum), reduced simultaneous actions

## Quality Gates (Automated, Blocking)

```yaml
# .github/workflows/quality.yml
- TypeScript: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noPropertyAccessFromIndexSignature
- ESLint: @typescript-eslint/strict, react-hooks, jsx-a11y, import-x, unicorn, perfectionist, sonarjs
- Oxlint / Biome: as drop-in replacement for ESLint/Prettier once stable
- Prettier: single quote, trailing comma, printWidth 80, arrowParens always
- Vitest: unit + integration, 95% branch coverage, 100% on critical paths (protocol parsers, crypto, scheduler)
- Mutation testing (Stryker): kill rate > 95%
- Playwright: E2E across Chrome/Firefox/Safari, visual regression (pixelmatch < 0.05%), accessibility auto-check per page
- WASM: wasm-opt -Oz, wasm2wat validation, cargo-audit, cargo-deny, cargo-puffin (supply chain)
- Bundle: size-limit, @next/bundle-analyzer, no duplicate deps, tree-shaking verification
- Accessibility: axe-core, lighthouse-ci (a11y > 95), pa11y-ci, manual screen reader audit per release
- Performance: lighthouse-ci (perf > 95), web-vitals thresholds (LCP < 1.5s, CLS < 0.05, INP < 100ms)
- Security: Trivy, Snyk, npm audit, Bun audit, CSP header validation, subresource integrity (SRI)
- TLA+ model checking: all specs pass TLC model checker; any violation fails CI
- Determinism: seed-based replay tests on CI verify bit-identical output across runs
- WebGPU/WebGL conformance: automated visual diff on rendering output
- fuzzing (cargo-fuzz, Jazzer.js): continuous fuzzing of WASM modules, 1h minimum per CI run
- container image: Trivy scan, distroless base, SBOM generation, Cosign signature, SLSA level 3
```

## Deliverables (Expanded)

1. **Complete monorepo** — `apps/simulator`, `apps/docs`, `apps/benchmarks`, `packages/{kernel,ui,shared,proto,wasm-crypto,terminal,netstack,hostos,threatintel,ai,geo,sound,fs,time}` (✅ 14 packages implemented) + `{hardware,ot-ics,space-aviation,automotive,telecom,deception,dfir,cloud,identity,supply-chain,social-eng,risk,blockchain,collab,formal}` (❌ 15 not yet started)
2. **Architecture Decision Records (ADRs)** — one per major subsystem, in `docs/adr/`
3. **Simulation Kernel Specification** — formal spec (TLA+ / Alloy) for network stack, scheduler, FS, consensus, hardware interfaces
4. **Threat Model Document** — STRIDE/LINDDUN analysis per subsystem, trust boundaries, data flow diagrams, attack trees
5. **Operator Manual** — written for SOC analysts: workflows, playbooks, keyboard shortcuts, scenario authoring guide
6. **Developer Guide** — contributing, WASM build pipeline, debugging, profiling, testing, formal verification workflow
7. **Deployment** — Docker (multi-arch, distroless), Kubernetes (Helm, ArgoCD), Cloudflare Pages, Vercel, static export, Tauri desktop
8. **Benchmark Suite** — automated, historical tracking, regression alerts, performance budgets enforced per commit
9. **Scenario SDK** — TypeScript/WASM SDK for authoring custom scenarios, plugins, detection rules, adversary profiles
10. **Training curriculum** — mapped to SANS, OffSec, SANS FOR/CIS/ICS certifications, scenario progression from beginner to expert
11. **Open-source reference implementations** — key WASM kernel components (netstack, host OS, crypto) independently usable libraries

## Ecosystem & Community

* **Plugin system** — WASM-based plugin API for custom protocol parsers, detection rules, hardware targets, simulation extensions
* **Scenario marketplace** — community-scored scenarios, CTF challenge import, official CISA/NSA/FBI/NCSC scenario packs
* **API / SDK** — headless mode for CI/CD, REST API for scenario management, WebSocket for live telemetry, gRPC-web for programmatic control
* **Certification preparation** — CompTIA Security+, CySA+, CASP+, CISSP, OSCP, OSEP, GPEN, GCIH, GCFA, GRID, FORXX mappings
* **Academic research** — reproducible cybersecurity experiments, A/B testing of defenses, synthetic data generation for ML research
* **Capture the Flag (CTF) integration** — import/export CTFd, FBCTF, rCTF formats, automated scoring, dynamic flag generation

## Final Objective

Deliver a **browser-native cyber operations simulator** that:

1. **Deceives experts** — senior incident responders, red teamers, kernel developers, ICS engineers, avionics engineers cannot distinguish simulated output from production telemetry in blind tests across ANY vertical (IT, OT, space, aviation, automotive, telecom, cloud)
2. **Teaches real skills** — completing scenarios translates 1:1 to operational competence (validated by SANS/OffSec/ISC2 certification bodies)
3. **Advances the state of the art** — open-sourced kernel components adopted by real security tooling, formal verification methods influence industry standards
4. **Sets a new baseline** — future "hacking simulators" are measured against this, not GeekTyper; no simulator in any domain (IT, OT, ICS, space, aviation, automotive, RF, telecom, blockchain, hardware) surpasses this in fidelity
5. **Unifies the discipline** — a single platform that spans IT, OT, hardware, RF, space, telecom, cloud, and physical security eliminates silos and produces total-security operators

**No compromises. No shortcuts. No "good enough." No domain left unmodeled.**

Every line of code must survive the question: *"Would this exist in a real security product deployed at a Fortune 500 / three-letter agency / critical infrastructure operator / space agency / automotive OEM?"* If the answer is no, rewrite it until it does.
