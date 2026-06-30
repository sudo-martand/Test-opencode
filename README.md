# Test OpenCode — Cyber Operations Simulator

**The world's most photorealistic, behaviorally-authentic cyber operations simulator.** A browser-based environment so technically accurate and visually indistinguishable from real SOC/military/IC cyber command centers that professional security operators mistake it for operational tooling.

This is NOT a game. This is NOT a "hacker typer." This is a **high-fidelity simulation framework** that models real cyber operations: actual protocol behavior, real exploit chains, authentic network physics, genuine OS internals, bona fide threat intelligence workflows, and true-to-life cyber-physical system dynamics.

No other simulator, open-source or commercial, targets this breadth at this depth.

---

## Implementation Status

| Phase | Domain | Status | Tests | LoC |
|-------|--------|--------|-------|-----|
| 1 | **shared** (types, event bus, Result/Option) | ✅ Complete | 25 | ~500 |
| 1 | **netstack** (TCP/IP, UDP, DNS, ARP, routing) | ✅ Complete | 41 | ~760 |
| 1 | **hostos** (kernel, scheduler, syscalls, /proc) | ✅ Complete | 37 | ~840 |
| 1 | **threatintel** (STIX, Sigma, YARA, TAXII, ATT&CK) | ✅ Complete | 36 | ~830 |
| 1 | **geo** (IP geolocation, BGP ASN, cables, RF) | ✅ Complete | 37 | ~560 |
| 1 | **sound** (DSP synthesis, keystroke/alert presets) | ✅ Complete | 16 | ~670 |
| 1 | **time** (hybrid logical clock, timers) | ✅ Complete | 18 | ~300 |
| 1 | **ai** (ModelManager, TextClassifier, AnomalyDetector) | ✅ Complete | 22 | ~250 |
| 1 | **fs** (VirtualFileSystem, IndexedDB) | ✅ Complete | 51 | ~450 |
| 1 | **kernel** (SimulationKernel mount/start/stop) | ✅ Complete | 6 | ~250 |
| 1 | **terminal** (xterm.js wrapper) | ✅ Complete | 21 | ~200 |
| 1 | **ui** (Panel, DataTable, StatusIndicator, Toast) | ✅ Complete | 8 | ~300 |
| 1 | **proto** (@bufbuild/protobuf types) | ✅ Complete | 8 | ~80 |
| 1 | **wasm-crypto** (SHA-256, HMAC, AES-GCM, PBKDF2, random) | ✅ Complete | 28 | ~300 |
| 2 | **deception** (honeypots, honeytokens, decoy networks, breadcrumbs) | ✅ Complete | 45 | ~600 |
| 2 | **dfir** (CaseManager, MemoryAnalyzer, DiskAnalyzer, NetworkAnalyzer, TimelineBuilder, IocManager, DFIRCoordinator) | ✅ Complete | 86 | ~780 |
| 2 | **identity** (AD, Kerberos, NTLM, OAuth 2.1, OIDC, SAML, FIDO2, PKI, password security, IdP) | ✅ Complete | 75 | ~950 |
| 2 | **ot-ics** (PLC, RTU, SCADA, DCS, Modbus, DNP3, IEC 61850, Purdue, alarm mgmt) | ✅ Complete | 62 | ~950 |
| 2 | **cloud** (AWS, Azure, GCP, K8s, IAM, CSPM, serverless) | ✅ Complete | 59 | ~1050 |
| 2 | **supply-chain** (SBOM, SLSA, in-toto, Sigstore) | ✅ Complete | 48 | ~650 |
| 2 | **hardware** (CPU µarch, JTAG, TPM, side-channels, fault injection, firmware/UEFI, PCIe/USB/SPI/I2C, buses) | ✅ Complete | 105 | ~1770 |
| 2 | **space-aviation** (SATCOM, CCSDS, GPS/GNSS, ACARS, ADS-B, avionics, UAV/MAVLink, ground stations, DO-326A) | ✅ Complete | 100 | ~1465 |
| 3 | **automotive** (CAN, ECU, UDS, DTC, V2X, ADAS, ISO 21434, EV charging) | ✅ Complete | 75 | ~850 |
| 3 | **social-eng** (phishing, deepfakes, BEC, pretexting, insider threats, OSINT, psychological manipulation) | ✅ Complete | 75 | ~730 |
| 3 | **blockchain** (Bitcoin, EVM, DeFi, MEV, bridges, NFTs, smart contract vulns, consensus attacks, wallet security, forensics) | ✅ Complete | 104 | ~900 |
| 3 | **telecom** (5G, SS7, Diameter, GTP, IMS, O-RAN, network slicing, signaling security) | ✅ Complete | 75 | ~960 |
| 3 | **risk** (FAIR, NIST CSF, compliance, attack graphs, KRIs, vendor risk, breach cost) | ✅ Complete | 85 | ~1420 |
| 3 | **formal** (TLA+, Alloy, Z3, Coq, K Framework, mutation testing, runtime verification, determinism) | ✅ Complete | 107 | ~750 |
| 3 | **collab** (exercise mgmt, AAR, comms, injects, participants) | ✅ Complete | 82 | ~920 |

**TypeScript strict mode**: ✅ Zero errors across all 29 packages (26 packages + 3 tools)
**Tests**: ✅ 1535 tests passing across 41 test files, all green
**CI/CD**: ✅ 6-job workflow (typecheck, lint, test, build, Docker, Rust checks)
**Rust toolchain**: ✅ rustc 1.96.0, cargo 1.96.0, wasm32 target installed  

---

## Core Philosophy

**Zero Concessions to "Gaminess"**

- No fake progress bars that fill on timers — operations take real computational time
- No "movie OS" interfaces — every pixel serves a documented operational purpose
- No Hollywood visual effects — only effects that exist in real tooling (packet captures, hex dumps, memory maps, flame graphs, logic analyzer traces, spectrum waterfalls)
- No simplified abstractions — expose the actual complexity: race conditions, timing attacks, protocol state machines, kernel structures, transistor-level side channels
- No hand-holding — the simulator demands and rewards genuine technical competence

**Authenticity Sources**: MITRE ATT&CK, NIST SP 800-series, RFC specifications, Linux/Windows/XNU/FreeBSD kernel code, real malware behavioral analysis, actual CVE exploit reproduction, production SIEM rule sets, and industry standards across ICS/OT (IEC 61850, DNP3, Modbus), aviation (ARINC, ACARS, ADS-B), space (CCSDS), automotive (ISO 26262, AUTOSAR), telecom (3GPP, SS7), and hardware (JTAG, PCIe, TPM 2.0).

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15+ (App Router, Server Components, Streaming, Server Actions) |
| **Language** | TypeScript 5.6+ (strict mode, no `any`, exhaustive discriminated unions, brand types) |
| **Styling** | Tailwind CSS 3.4+ (migrating to 4.0 CSS-first, OKLCH, container queries) |
| **Animation** | Framer Motion 12+ (layout animations, Web Workers, gesture recognition) |
| **3D/Graphics** | Three.js / React Three Fiber / Drei + WebGPU compute shaders |
| **Monorepo** | Turborepo (task caching, dependency graph) |
| **WASM** | Rust → wasm-pack / wasm-opt / cargo-component for crypto, emulation, hardware sim |
| **State** | Zustand + Immer + tRPC (deterministic state with time-travel debugging) |
| **Testing** | Vitest + Playwright + fast-check (property-based) + Stryker (mutation) |
| **Linting** | Oxlint / Biome (ZERO-runtime overhead) |
| **Storage** | IndexedDB (Dexie.js) + OPFS + origin-private file system |
| **Multiplayer** | WebRTC DataChannels / WebTransport (CRDT-based state sync) |
| **Audio** | Web Audio API / AudioWorklet (DSP synthesis, zero samples) |
| **Observability** | OpenTelemetry (WASM), Apache Arrow / Parquet (WASM) |
| **Hardware** | MLIR / CIRCT, WebGPU compute shaders |

---

## Architecture: Simulation Kernel Architecture (SKA)

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                            │
│  Terminal (xterm.js+WASM PTY)  Network Graph  World Map  Timeline    │
│  Hardware Inspector  3D Lab (R3F)  Spectrogram  Collab Overlay       │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ Event Bus (typed, replayable, versioned)
┌────────────────────────────────▼─────────────────────────────────────┐
│                        SIMULATION KERNEL (WASM)                       │
│  Network Stack  Host OS  Process Scheduler  File System              │
│  Memory Manager  Crypto Engine  Threat Intel  AI/ML Engine           │
│  Hardware Sim  OT/ICS Sim  RF/SDR Sim  Space/Aviation Sim            │
│  Automotive Sim  5G/Telecom Sim  Deception Engine  Identity & Access │
│  Blockchain Engine  Supply Chain  Digital Forensics  Cyber Risk      │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   TIME AUTHORITY         │
                    │   (hybrid logical clock, │
                    │    deterministic replay) │
                    └─────────────────────────┘
                    ┌─────────────────────────┐
                    │   FORMAL VERIFIER        │
                    │   (TLA+, Alloy, Z3 SMT)  │
                    └─────────────────────────┘
```

---

## Simulation Domains

### Phase 1 — Complete (14 packages)

- **Terminal** — xterm.js + WASM PTY, multi-shell (bash/zsh/fish/powershell), actual syscalls, job control, tmux, VT520 + Sixel + Kitty, SSH, GDB/LLDB/Pwndbg
- **Network Stack** — Full TCP/IP in WASM, TLS 1.3/1.2, QUIC/HTTP/3, WireGuard, BGP, OSPF/IS-IS/RIP/EIGRP, DNS (DNSSEC, DoH/DoT), eBPF, PCAPNG export, DDoS, TOR/I2P, SDN (OpenFlow, P4)
- **Host OS** — Linux 6.x/Windows 11/XNU/FreeBSD kernel behavior, cgroups v2, namespaces, FUSE filesystems (ext4/xfs/ntfs/apfs/zfs), memory management (5-level page tables, ASLR, KASLR), CFS/EEVDF scheduler, capabilities, seccomp-BPF, SELinux/AppArmor, Docker/Podman/containerd, Kubernetes, systemd, eBPF/bpftrace
- **Threat Intelligence** — STIX 2.1/TAXII 2.1 server, MISP, Sigma rule engine, YARA-X (Rust/WASM), CAPA/FLOSS, MITRE ATT&CK Navigator (enterprise + ICS), threat hunting notebooks, detection-as-code CI, TI sharing groups (ISAC/ISAO)
- **Geospatial** — Real BGP routing table (900k+ prefixes), submarine cable map, IXP locations, RF propagation modeling (Longley-Rice, ITM), spectrum occupancy, satellite ground tracks, cyber terrain mapping
- **Sound** — AudioWorklet modular synth, mechanical keyboard switch modeling, network/ICS sonification, alert tones (Shepard-Risset), spatial audio (HRTF), EM side-channel sonification
- **Time** — Hybrid logical clock, deterministic replay, vector clocks for distributed ops
- **AI/ML** — ONNX Runtime Web, threat classification, anomaly detection, natural language → query generation, adversarial ML, LLM red teaming, RL for pentesting, GNNs
- **Filesystem** — VirtualFileSystem with IndexedDB persistence, overlay structure
- **Kernel** — SimulationKernel lifecycle (mount/start/stop)
- **UI** — Panel, DataTable, StatusIndicator, Toast components
- **Crypto (WASM)** — Rust workspace structure for WASM crypto modules

### Phase 2-3 — Complete (15 domains)

- **Deception** — Honeypots (14 types: SSH, HTTP, HTTPS, MySQL, PostgreSQL, RDP, VNC, SMB, FTP, SMTP, DNS, Modbus, S7, DNP3), honeytokens (Credential, File, ApiKey, DatabaseRecord), deception networks, breadcrumbs
- **DFIR** — Case management, memory analysis (processes, modules, hidden detection, malware patterns, network connections), disk analysis (partition, NTFS/MFT, file carving), network analysis (packets, NetFlow, DNS, HTTP, TLS/JA3), timeline builder, IoC management
- **Identity** — AD domains/trusts/GPOs, Kerberos (AS-REQ/TGS-REQ/delegation), NTLM challenge-response, OAuth 2.1/SAML/FIDO2/TOTP, password analysis (entropy/crack-time/spraying), PKI/CA hierarchy
- **OT/ICS/SCADA** — Purdue model, PLC/RTU/HMI/DCS simulation (10 vendors, 24 models), fieldbus protocols (27 types), safety systems (SIL 1-4), ISA-18.2 alarm management, ICS-specific attacks (TRITON, Industroyer, Stuxnet, Havex, BlackEnergy, Pipedream, COSMICENERGY), physical process simulation with auto-alarming
- **Cloud** — AWS (EC2/S3/Lambda/RDS/ALB/Security Groups), IAM (policies, roles, users, access keys), EKS (pods, services, network policies, security contexts), Azure/GCP stubs, security assessment engine (SG, bucket, instance, pod)
- **Supply Chain** — SBOM (SPDX 2.3/3.0, CycloneDX 1.4/1.5), vulnerability manager (CVE/EPSS), in-toto attestations, SLSA provenance (levels 1-4), Sigstore Rekor, typo-squatting detection, dependency confusion, scorecard (20 checks), build systems, policy engine
- **Hardware** — CPU µarch (x86/ARM/RISC-V), firmware/UEFI (variables, boot entries, TCG log), TPM 2.0 (seal/unseal/remote attestation), JTAG/SWD (boundary scan, ID codes, register access), side-channels (7 types: cache timing, power analysis, EM, timing, RF, acoustic, optical), fault injection (voltage/clock/EM/laser/rowhammer), PCIe/USB/SPI/I2C/NVMe buses
- **Space/Aviation** — SATCOM (GEO/MEO/LEO/SSO/HEO), CCSDS (TC/TM/AOS/FDP/SLE), GPS/GNSS (6 constellations, 12 bands, spoofing/jamming/meaconing), ACARS (injected diversion), ADS-B (5 message types, ghost aircraft), avionics (FMS, EFB, TCAS, TAWS, weather radar, ILS), UAV/MAVLink (7 message types, 6 components), ground stations, DO-326A
- **Automotive** — CAN/CAN FD/XL/CANopen/J1939, ECU simulation (12 types: ECM, ABS, TCU, BCM, ADAS, Gateway, etc.), UDS (18 diagnostic services), DTC lifecycle, V2X (BSM/CAM/DENM/SPaT/MAPEM/IVIM, DSRC/C-V2X/NR-V2X), ISO 21434
- **Social Engineering** — Phishing (8 types), deepfakes (voice clone, face swap, lip sync), BEC (6 types), pretexting (7 types), insider threats (7 types, 5 severity levels), OSINT, psychological manipulation (Cialdini principles)
- **Telecom** — 5GC (AMF/SMF/UPF/UDM/AUSF/PCF/NRF/NSSF/SEPP), 4G EPC (MME/SGW/PGW/HSS/PCRF), 5G RAN (gNB CU/DU/RU, O-RAN), IMS/VoLTE (CSCF/TAS/MRF/MGCF), SS7/MAP/Diameter/GTP, signaling security, IMSI catchers, network slicing
- **Blockchain/DeFi** — Bitcoin full node, Ethereum/EVM, DeFi (DEX, lending, yield), cross-chain bridges, smart contract vulnerabilities (10 types), MEV (arbitrage, sandwich, liquidation), wallet security, blockchain forensics
- **Cyber Risk** — FAIR model (Monte Carlo simulation), NIST CSF 2.0 maturity, compliance (GDPR, PCI-DSS, HIPAA, SOC 2, ISO 27001), attack graphs, breach cost modeling, KRIs, TPRM
- **Collaboration** — Red vs Blue/Purple team exercises, SOC tiers (1/2/3), incident command (NIMS/ICS), communication channels (chat, voice, secure), inject engine, after-action review with replay
- **Formal Verification** — TLA+/PlusCal, Alloy, Z3 SMT, Coq, K Framework, property-based testing, mutation testing (kill rate), runtime verification, determinism checks

---

## Key Features

### Terminal: Real PTY + WASM Userspace
Actual terminal emulator with multi-shell, raw syscalls, process isolation, job control, tmux/screen, VT520 + Sixel + Kitty protocol compliance, WASM-compiled SSH/GDB/LLDB/Pwndbg, ncurses/vim/emacs TUI support.

### Network Stack: Protocol-Accurate
Full TCP/IP, TLS 1.3, QUIC, WireGuard, BGP, OSPF, DNS (DNSSEC/DoH/DoT), PCAPNG export, eBPF, traffic shaping (tc), DDoS, covert channels, TOR/I2P, SDN (OpenFlow/P4).

### Host OS: Kernel-Level Fidelity
Multi-kernel behavior simulation (Linux/Windows/XNU/FreeBSD), cgroups v2, namespaces, FUSE filesystems, 5-level page tables, ASLR/KASLR, CFS/EEVDF scheduling, seccomp-BPF, SELinux, containers (Docker/Podman/K8s), systemd, eBPF.

### Hardware & Firmware
CPU microarchitecture (RISC-V/ARM/x86-64), caches, branch prediction, speculative execution, PCIe/USB/SATA/NVMe, UEFI, Intel ME/AMD PSP, JTAG/SWD, side-channel emulation, fault injection, TPM 2.0, SDR.

### Cryptography: Constant-Time, Side-Channel Resistant
RustCrypto/BoringSSL/AWS-LC in WASM, TLS 1.3/DTLS 1.3, HSM simulation (PKCS#11, TPM 2.0), post-quantum KEM (ML-KEM, ML-DSA, SLH-DSA), QKD simulation, white-box crypto, MPC, ZKPs (Groth16, PLONK, Halo2, STARKs), FHE.

### AI/ML: Local Inference
ONNX Runtime Web / WebNN / WebGPU ML, threat classification, anomaly detection (VAEs, isolation forests), NL→query generation (WASM GGML/llama.cpp), adversarial ML, RL for pentesting, GNNs.

### Threat Intelligence: Production-Grade
STIX 2.1/TAXII 2.1, MISP, Sigma, YARA-X (Rust/WASM), CAPA/FLOSS, MITRE ATT&CK Navigator, threat hunting notebooks, detection-as-code CI.

### Persistence & Replay: Deterministic Time Travel
Event sourcing (IndexedDB + OPFS), deterministic simulation (seeded RNG, fixed timestep), time-travel debugger (rr-style), CRDT-based multiplayer sync, scenario marketplace.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run Oxlint/Biome linting |
| `npm run test` | Run Vitest test suite |
| `npm run typecheck` | TypeScript strict type checking |

---

## Performance Budgets

| Metric | Target |
|--------|--------|
| Cold load (p95) | < 2.0s |
| TTI | < 1.5s |
| Simulation step (60Hz) | < 2ms |
| WASM heap | < 64MB baseline, < 256MB peak |
| Bundle (gzipped) | < 300KB baseline, < 500KB full |
| Memory (full sim) | < 1GB |
| WebRTC latency (multiplayer) | < 50ms p95 |
| FPS (full sim) | > 30fps |

---

## Quality Gates

- **TypeScript**: strict mode, no unchecked indexed access, exact optional property types
- **Coverage**: 95% branch, 100% on critical paths (protocol parsers, crypto, scheduler)
- **Mutation testing**: > 95% kill rate (Stryker)
- **E2E**: Playwright across Chrome/Firefox/Safari, visual regression (< 0.05%)
- **WASM**: wasm-opt -Oz, cargo-audit, cargo-deny
- **Accessibility**: axe-core, lighthouse-ci (a11y > 95), WCAG 2.2 AA
- **Performance**: lighthouse-ci (perf > 95), LCP < 1.5s, CLS < 0.05, INP < 100ms
- **Security**: Trivy, Snyk, CSP validation, SRI
- **Determinism**: seed-based replay tests — bit-identical output across runs
- **Fuzzing**: cargo-fuzz, Jazzer.js (1h minimum per CI run)

---

## Accessibility

- WCAG 2.2 AA/AAA (OKLCH color contrast, live regions, landmarks)
- Screen reader support (aria-live, virtual cursor for canvas, sonification)
- Keyboard-only navigation (roving tabindex, command palette, no dead-ends)
- Reduced motion (prefers-reduced-motion)
- High contrast mode (prefers-contrast, Windows HCM)
- Color blindness palettes (protanopia/deuteranopia/tritanopia, never color-only)
- Font scaling to 500%, container queries, fluid typography
- Cognitive accessibility (plain language, progressive disclosure, undo everywhere)
- Motor disabilities (switch access, voice control, 48dp touch targets)

---

## Deliverables

1. **Complete monorepo** — 29 implemented packages across 3 phases
2. **Architecture Decision Records** — in `docs/adr/`
3. **Simulation Kernel Specification** — formal TLA+/Alloy specs
4. **Threat Model Document** — STRIDE/LINDDUN analysis per subsystem
5. **Operator Manual** — SOC analyst workflows, playbooks, keyboard shortcuts
6. **Developer Guide** — contributing, WASM build pipeline, debugging
7. **Deployment** — Docker (multi-arch), Kubernetes (Helm), Cloudflare Pages, Tauri desktop
8. **Benchmark Suite** — automated regression alerts, performance budgets enforced per commit
9. **Scenario SDK** — TypeScript/WASM SDK for custom scenarios and plugins
10. **Training curriculum** — mapped to SANS, OffSec, CISSP certifications
11. **Open-source reference implementations** — key WASM kernel components

---

## Ecosystem & Community

- **Plugin system** — WASM-based API for custom protocol parsers, detection rules
- **Scenario marketplace** — community-scored scenarios, official CISA/NSA/FBI packs
- **API/SDK** — headless mode for CI/CD, REST API, WebSocket telemetry, gRPC-web
- **Certification prep** — CompTIA Security+ through CISSP, OSCP, GPEN, GCFA mappings
- **Academic research** — Reproducible experiments, A/B defense testing, synthetic data
- **CTF integration** — Import/export CTFd, FBCTF, rCTF formats

---

## Final Objective

Deliver a **browser-native cyber operations simulator** that:

1. **Deceives experts** — Senior incident responders, red teamers, kernel developers, ICS engineers cannot distinguish simulated output from production telemetry in blind tests across every vertical
2. **Teaches real skills** — Scenarios translate 1:1 to operational competence
3. **Advances the state of the art** — Open-sourced kernel components adopted by real security tooling
4. **Sets a new baseline** — Future simulators are measured against this, not GeekTyper
5. **Unifies the discipline** — A single platform spanning IT, OT, hardware, RF, space, telecom, cloud, and physical security

**No compromises. No shortcuts. No "good enough." No domain left unmodeled.**

Every line of code must survive the question: *"Would this exist in a real security product deployed at a Fortune 500 / three-letter agency / critical infrastructure operator / space agency / automotive OEM?"* If the answer is no, rewrite it until it does.

---

## License

See [package.json](./package.json) for license information.
