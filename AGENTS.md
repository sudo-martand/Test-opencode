# AGENTS.md

## Project Goal

Create the world's most photorealistic, behaviorally-authentic cyber operations simulator — a browser-based environment so technically accurate and visually indistinguishable from real SOC/military cyber command centers that professional security operators mistake it for operational tooling.

This is NOT a game. This is NOT a "hacker typer." This is a **high-fidelity simulation framework** that models real cyber operations: actual protocol behavior, real exploit chains, authentic network physics, genuine OS internals, and bona fide threat intelligence workflows.

## Core Philosophy

**Zero Concessions to "Gaminess"**

* No fake progress bars that fill on timers — operations take real computational time
* No "movie OS" interfaces — every pixel serves a documented operational purpose
* No Hollywood visual effects — only effects that exist in real tooling (packet captures, hex dumps, memory maps, flame graphs)
* No simplified abstractions — expose the actual complexity: race conditions, timing attacks, protocol state machines, kernel structures
* No hand-holding — the simulator demands and rewards genuine technical competence

**Authenticity Sources**

* MITRE ATT&CK framework — every technique mapped to real procedures
* NIST SP 800-61 / 800-53 / 800-150 — incident response and continuous monitoring standards
* RFC specifications — TCP/IP, TLS, DNS, BGP, DHCP, ARP implemented per spec
* Linux kernel source / Windows Internals — syscalls, memory management, process scheduling
* Real malware samples (defanged) — behavioral analysis against actual IOCs
* Actual CVE exploit code (sandboxed) — reproduction of historical breaches
* Production SIEM rule sets (Sigma, Splunk, Elastic) — detection logic from enterprise deployments

## Technology Stack (Zero Compromise)

* **Next.js 15+ (App Router, Server Components, Streaming)**
* **TypeScript 5.6+ (strict, no `any`, exhaustive discriminated unions)**
* **Tailwind CSS 4.0 (CSS-first, OKLCH color space, container queries)**
* **Framer Motion 12+ (layout animations, shared layout, Web Workers)**
* **Three.js / React Three Fiber / Drei (instanced rendering, compute shaders, GPGPU)**
* **WebAssembly (Rust → WASM) for: protocol parsers, crypto, disassembly, emulation**
* **Web Workers / OffscreenCanvas / WebGL 2 Compute** for simulation loops
* **IndexedDB (Dexie.js) + OPFS** for persistent virtual filesystem
* **WebRTC DataChannels** for peer-to-peer "C2" simulation
* **Web Audio API / AudioWorklet** for DSP-based sound synthesis (no samples)
* **Zustand + Immer** for deterministic state with time-travel debugging
* **Vitest + Playwright + Property-based testing (fast-check)**

## Architecture: Simulation Kernel Architecture (SKA)

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐  │
│  │  Terminal   │ │  Network    │ │  World Map  │ │  Timeline │  │
│  │  (xterm.js  │ │  Graph      │ │  (WebGL     │ │  (Virtual │  │
│  │  + WASM PTY)│ │  (Canvas/   │ │   Globe +   │ │   List)   │  │
│  └─────────────┘ │   WebGPU)   │ │   Shaders)  │ └───────────┘  │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Event Bus (typed, replayable)
┌──────────────────────────▼──────────────────────────────────────┐
│                      SIMULATION KERNEL (WASM)                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐  │
│  │  Network     │ │  Host        │ │  Process     │ │  File  │  │
│  │  Stack       │ │  OS          │ │  Scheduler   │ │  System│  │
│  │  (TCP/IP,    │ │  (Linux/Win  │ │  (Cgroups,   │ │  (VFS, │  │
│  │   TLS, BGP)  │ │   kernels)   │ │   namespaces)│ │   FUSE)│  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────┘  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐  │
│  │  Memory      │ │  Crypto      │ │  Threat      │ │  AI/ML │  │
│  │  Manager     │ │  Engine      │ │  Intel       │ │  Engine│  │
│  │  (ASLR,      │ │  (Constant-  │ │  (STIX/TAXII,│ │  (ONNX │  │
│  │   paging,    │ │   time,      │ │   MISP,      │ │   Runtime)│ │
│  │   heap)      │ │   side-chan) │ │   YARA)      │ │         │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  TIME       │
                    │  AUTHORITY  │
                    │  (logical   │
                    │   clock,    │
                    │   determin- │
                    │   istic     │
                    │   replay)   │
                    └─────────────┘
```

## Key Features (Redefined for Ultra-Realism)

### 1. Terminal: Real PTY + WASM Userspace

* **xterm.js + WebAssembly PTY** — actual terminal emulator, not a text renderer
* **Real shell** — `bash`/`zsh` compiled to WASM (via `wasm-shell` or `emscripten`)
* **Actual syscalls** — `read`, `write`, `open`, `mmap`, `clone`, `execve` intercepted and simulated
* **Process isolation** — each tab = separate WASM memory instance with namespace simulation
* **Job control** — `SIGTSTP`, `SIGCONT`, `SIGINT`, `SIGKILL`, pipelines, process groups
* **Terminal multiplexing** — `tmux`-compatible session persistence across reloads
* **Raw mode / alternate screen / bracketed paste / OSC 52 clipboard** — full VT520 compliance
* **SSH client in WASM** — real `ssh` binary, keys, agent forwarding, proxy jumps
* **GDB/LLDB in WASM** — attach to simulated processes, inspect memory, set breakpoints

### 2. Network Stack: Protocol-Accurate Simulation

* **Full TCP/IP stack in WASM** — lwIP or custom, with configurable MTU, window scaling, SACK, timestamps
* **TLS 1.3 implementation** — real handshake, 0-RTT, key updates, post-handshake auth
* **BGP speaker** — RFC 4271 compliant, route reflection, communities, RPKI validation
* **DNS authoritative + recursive** — DNSSEC, DANE, DoH, DoT, zone transfers
* **Packet capture (PCAPNG)** — every simulated packet exportable to Wireshark
* **BPF/eBPF virtual machine** — write filters in C, compile to WASM, attach to interfaces
* **Traffic shaping** — `tc` compatible: HTB, FQ_CODEL, CAKE, netem (loss, latency, jitter, reordering)
* **DDoS simulation** — volumetric, protocol, application layer with realistic botnet topologies
* **Covert channels** — DNS tunneling, ICMP exfil, HTTP/2 framing, TLS SNI encoding

### 3. Host OS Simulation: Kernel-Level Fidelity

* **Linux 6.x / Windows 11 kernel behavior** — syscalls, signals, `/proc`, `/sys`, registry, WMI, ETW
* **Process tree with cgroups v2** — CPU/memory/IO limits, OOM killer, freezer, pressure stall info
* **Namespace isolation** — PID, NET, MNT, UTS, IPC, USER, TIME, CGROUP
* **Filesystem: FUSE in WASM** — ext4/xfs/ntfs semantics, inodes, xattrs, ACLs, capabilities
* **Memory management** — 4-level page tables, ASLR, KASLR, KPTI, huge pages, THP, mmap semantics
* **Scheduler** — CFS/EEVDF, real-time classes, `sched_setattr`, `cgroup.procs`
* **Capabilities(7)** — fine-grained privilege: `CAP_NET_RAW`, `CAP_SYS_ADMIN`, `CAP_DAC_OVERRIDE`
* **Seccomp-BPF** — syscall filtering, `SECCOMP_RET_TRAP`, `SECCOMP_RET_TRACE`
* **LSM hooks** — SELinux/AppArmor policy simulation, landlock
* **Container runtime** — OCI spec, runc-compatible, overlayfs, snapshotter

### 4. Threat Intelligence & Detection: Production-Grade

* **STIX 2.1 / TAXII 2.1 server** — real API, collections, manifests, pagination
* **Sigma rule engine** — full spec: modifiers, aggregations, field mappings, pipeline
* **YARA-X (Rust/WASM)** — pattern matching on memory, files, network streams
* **MITRE ATT&CK navigator** — technique → procedure → simulation mapping
* **Threat hunting notebooks** — Jupyter-compatible, KQL/SPL translation
* **ATT&CK emulation plans** — atomic tests, Caldera-style adversary profiles
* **False positive simulation** — tuning rules against benign noise distributions
* **Detection-as-code CI** — unit tests for every rule, regression detection

### 5. Exploit Development & Vulnerability Research

* **Vulnerability replay** — CVE-2021-44228 (Log4Shell), CVE-2023-34362 (MOVEit), CVE-2024-3094 (xz), etc.
* **Exploit dev environment** — `pwntools` in WASM, ROP gadget finder, heap visualizer
* **Fuzzing harness** — AFL++/libFuzzer in WASM, corpus management, crash triage
* **Binary analysis** — Ghidra headless API, radare2, Binary Ninja API (WASM)
* **Kernel exploit mitigation bypass** — KPTI, SMAP/SMEP, KASLR, FG-KASLR, CET, PAC
* **Hardware vuln simulation** — Spectre/Meltdown/Retbleed/MDS, transient execution

### 6. Cryptography: Constant-Time, Side-Channel Resistant

* **RustCrypto / BoringSSL in WASM** — AES-GCM, ChaCha20-Poly1305, X25519, Ed25519, Kyber, Dilithium
* **TLS 1.3 stack** — full state machine, early data, key export, delegated credentials
* **Hardware security module (HSM) simulation** — PKCS#11, TPM 2.0, Secure Enclave
* **Side-channel timing** — cache-timing, branch prediction, port contention models
* **Post-quantum KEM/KEM+KEM hybrids** — NIST PQC finalists, hybrid key exchange

### 7. AI/ML: Local Inference, Real Models

* **ONNX Runtime Web** — run distilled models in browser (CodeBERT, VulnBERT, MalConv)
* **Threat classification** — static/dynamic malware family, CWE prediction, exploitability scoring
* **Anomaly detection** — isolation forests, VAEs on netflow/process trees/registry
* **Natural language → query** — Sigma/YARA/SQL generation from analyst intent
* **Adversarial ML** — evasion attacks, poisoning, model extraction (defanged)

### 8. World Map: Geospatial + BGP + Submarine Cables

* **Real BGP routing table** — 900k+ prefixes, AS relationships, valley-free routing
* **Submarine cable map** — TeleGeography data, latency = physical distance / c
* **IXP locations** — peering DB, facility metadata, colocation
* **Threat geo-attribution** — overlapping confidence intervals, not pinpoint markers
* **Real-time (simulated) looking glass** — `traceroute`, `bgpstream`, `iris` from any ASN

### 9. Sound: DSP Synthesis, Zero Samples

* **AudioWorklet processors** — modular synth: VCO, VCF, VCA, LFO, envelope, noise
* **Keyboard** — mechanical switch modeling (Cherry MX Blue/Brown/Red, Topre, Buckling Spring)
* **Network sonification** — packet rate → granular density, port → pitch, flags → timbre
* **Alert tones** — Shepard-Risset glissando, tritone paradox, psychoacoustic urgency
* **Ambient** — data center HVAC (120Hz + harmonics), disk seek harmonics, fan curves
* **Spatial audio** — Web Audio PannerNode, HRTF, room impulse responses

### 10. Persistence & Replay: Deterministic Time Travel

* **Event sourcing** — every mutation = typed event, append-only log (IndexedDB)
* **Deterministic simulation** — fixed timestep, seeded RNG (PCG64), reproducible runs
* **Time-travel debugger** — scrub timeline, fork history, `rr`-style reverse execution
* **Scenario export/import** — JSONL + WASM module bundle, shareable, versioned
* **CI integration** — replay scenarios as regression tests, performance benchmarks

## Performance Budgets (Non-Negotiable)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold load (p95) | < 2.5s | Lighthouse CI, 3G throttling |
| TTI | < 1.8s | Real User Monitoring |
| Simulation step (60Hz) | < 4ms | `performance.measureUserTiming()` |
| WASM heap | < 128MB | `memory.grow()` monitoring |
| WebGL draw calls | < 120/frame | Spector.js, GPU timers |
| Bundle (gzipped) | < 400KB | `webpack-bundle-analyzer` |
| Memory (idle) | < 200MB | Chrome DevTools heap snapshot |
| Memory (full sim) | < 1.5GB | Same |

## Accessibility: Not an Afterthought

* **WCAG 2.2 AA** — color contrast (OKLCH), focus order, live regions, landmarks
* **Screen reader** — semantic HTML, `aria-live` for async events, virtual cursor for canvas
* **Keyboard-only** — every action reachable, roving tabindex, command palette (⌘K)
* **Reduced motion** — `prefers-reduced-motion`, disable all non-essential animation
* **High contrast** — `prefers-contrast: more`, forced colors mode, Windows HCM
* **Font scaling** — `rem` only, respect browser zoom to 500%, container queries
* **Color blindness** — deuteranopia/protanopia/tritanopia palettes, pattern fills
* **Cognitive** — plain language, progressive disclosure, undo everywhere, no time limits

## Quality Gates (Automated, Blocking)

```yaml
# .github/workflows/quality.yml
- TypeScript: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes
- ESLint: @typescript-eslint, react-hooks, jsx-a11y, import-x, unicorn
- Prettier: single quote, trailing comma, printWidth 100
- Vitest: unit + integration, 95% branch coverage, mutation testing (Stryker)
- Playwright: E2E across Chrome/Firefox/Safari, visual regression (pixelmatch < 0.1%)
- WASM: wasm-opt -Oz, wasm2wat validation, cargo-audit, cargo-deny
- Bundle: size-limit, @next/bundle-analyzer, no duplicate deps
- Accessibility: axe-core, lighthouse-ci (a11y > 95)
- Performance: lighthouse-ci (perf > 90), web-vitals thresholds
- Security: Trivy, Snyk, npm audit, CSP header validation
```

## Deliverables (Expanded)

1. **Complete monorepo** — `apps/simulator`, `packages/{kernel,ui,shared,proto,wasm-crypto,terminal,netstack,hostos,threatintel,ai,geo,sound,fs,time}`
2. **Architecture Decision Records (ADRs)** — one per major subsystem, in `docs/adr/`
3. **Simulation Kernel Specification** — formal spec (TLA+ / Alloy) for network stack, scheduler, FS
4. **Threat Model Document** — STRIDE analysis, trust boundaries, data flow diagrams
5. **Operator Manual** — written for SOC analysts: workflows, playbooks, keyboard shortcuts
6. **Developer Guide** — contributing, WASM build pipeline, debugging, profiling, testing
7. **Deployment** — Docker (multi-arch), Kubernetes (Helm), Cloudflare Pages, Vercel, static export
8. **Benchmark Suite** — automated, historical tracking, regression alerts

## Final Objective

Deliver a **browser-native cyber operations simulator** that:

1. **Deceives experts** — senior incident responders, red teamers, kernel developers cannot distinguish simulated output from production telemetry in blind tests
2. **Teaches real skills** — completing scenarios translates 1:1 to operational competence (validated by certification bodies)
3. **Advances the state of the art** — open-sourced kernel components adopted by real security tooling
4. **Sets a new baseline** — future "hacking simulators" are measured against this, not GeekTyper

**No compromises. No shortcuts. No "good enough."**

Every line of code must survive the question: *"Would this exist in a real security product deployed at a Fortune 500 / three-letter agency?"* If the answer is no, rewrite it until it does.