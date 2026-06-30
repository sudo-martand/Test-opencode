import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type BlockchainAddressId = string & { readonly __brand: unique symbol };
export const blockchainAddressId = (): BlockchainAddressId => uid() as unknown as BlockchainAddressId;

export type TransactionId = string & { readonly __brand: unique symbol };
export const transactionId = (): TransactionId => uid() as unknown as TransactionId;

export type BlockId = string & { readonly __brand: unique symbol };
export const blockId = (): BlockId => uid() as unknown as BlockId;

export type SmartContractId = string & { readonly __brand: unique symbol };
export const smartContractId = (): SmartContractId => uid() as unknown as SmartContractId;

export type DeFiProtocolId = string & { readonly __brand: unique symbol };
export const defiProtocolId = (): DeFiProtocolId => uid() as unknown as DeFiProtocolId;

export type NftId = string & { readonly __brand: unique symbol };
export const nftId = (): NftId => uid() as unknown as NftId;

export type BridgeId = string & { readonly __brand: unique symbol };
export const bridgeId = (): BridgeId => uid() as unknown as BridgeId;

export type BlockchainFindingId = string & { readonly __brand: unique symbol };
export const blockchainFindingId = (): BlockchainFindingId => uid() as unknown as BlockchainFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum BlockchainType {
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  SOLANA = 'SOLANA',
  POLYGON = 'POLYGON',
  ARBITRUM = 'ARBITRUM',
  OPTIMISM = 'OPTIMISM',
  AVALANCHE = 'AVALANCHE',
  BSC = 'BSC',
  COSMOS = 'COSMOS',
  NEAR = 'NEAR',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REVERTED = 'REVERTED',
  ORPHANED = 'ORPHANED',
}

export enum ConsensusMechanism {
  POW = 'POW',
  POS = 'POS',
  DPOS = 'DPOS',
  POA = 'POA',
  PBFT = 'PBFT',
  HOTSTUFF = 'HOTSTUFF',
  TENDERMINT = 'TENDERMINT',
}

export enum DeFiProtocolType {
  DEX = 'DEX',
  LENDING = 'LENDING',
  YIELD_AGGREGATOR = 'YIELD_AGGREGATOR',
  BRIDGE = 'BRIDGE',
  INSURANCE = 'INSURANCE',
  DERIVATIVES = 'DERIVATIVES',
  STABLECOIN = 'STABLECOIN',
  OPTIONS = 'OPTIONS',
  SYNTHETIC_ASSETS = 'SYNTHETIC_ASSETS',
}

export enum SmartContractVulnerability {
  REENTRANCY = 'REENTRANCY',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  ORACLE_MANIPULATION = 'ORACLE_MANIPULATION',
  FLASH_LOAN_ATTACK = 'FLASH_LOAN_ATTACK',
  LOGIC_ERROR = 'LOGIC_ERROR',
  INTEGER_OVERFLOW = 'INTEGER_OVERFLOW',
  FRONT_RUNNING = 'FRONT_RUNNING',
  PRICE_MANIPULATION = 'PRICE_MANIPULATION',
  GAS_DOS = 'GAS_DOS',
  DELEGATE_CALL_INJECTION = 'DELEGATE_CALL_INJECTION',
}

export enum MevType {
  DEX_ARBITRAGE = 'DEX_ARBITRAGE',
  LIQUIDATION = 'LIQUIDATION',
  SANDWICH = 'SANDWICH',
  JIT_LIQUIDITY = 'JIT_LIQUIDITY',
  BACKRUN = 'BACKRUN',
  CENSORSHIP = 'CENSORSHIP',
}

export enum WalletType {
  EOA = 'EOA',
  MULTISIG = 'MULTISIG',
  HARDWARE = 'HARDWARE',
  SMART_CONTRACT_WALLET = 'SMART_CONTRACT_WALLET',
  CUSTODIAL = 'CUSTODIAL',
}

export enum BridgeStatus {
  ACTIVE = 'ACTIVE',
  HACKED = 'HACKED',
  PAUSED = 'PAUSED',
  DEPRECATED = 'DEPRECATED',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface BlockInstance {
  id: BlockId;
  chain: BlockchainType;
  height: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: TransactionId[];
  size: number;
  miner: string;
  difficulty: number;
  gasUsed?: number;
  gasLimit?: number;
  uncleCount?: number;
}

export interface TransactionInstance {
  id: TransactionId;
  chain: BlockchainType;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice?: string;
  gasLimit?: string;
  nonce: number;
  data: string;
  status: TransactionStatus;
  blockHeight?: number;
  timestamp?: number;
  logEntries: { address: string; topics: string[]; data: string }[];
  internalCalls: { from: string; to: string; value: string; input: string }[];
}

export interface SmartContractInstance {
  id: SmartContractId;
  chain: BlockchainType;
  address: string;
  name: string;
  compiler: string;
  sourceVerified: boolean;
  vulnerabilities: SmartContractVulnerability[];
  totalSupply?: string;
  tokenStandard: string | undefined;
  audits: { auditor: string; date: number; passed: boolean; findings: string[] }[];
  totalTransactions: number;
}

export interface DeFiProtocolInstance {
  id: DeFiProtocolId;
  type: DeFiProtocolType;
  name: string;
  chain: BlockchainType;
  tvl: number;
  contracts: SmartContractId[];
  totalUsers: number;
  exploitHistory: string[];
  securityScore: number;
  forksFrom: string | undefined;
}

export interface NftInstance {
  id: NftId;
  contract: string;
  tokenId: string;
  standard: string;
  creator: string;
  currentOwner: string;
  mintPrice?: string;
  metadataUri: string;
  metadataManipulated: boolean;
  royaltyPercentage: number;
  collectionName: string;
}

export interface BridgeInstance {
  id: BridgeId;
  name: string;
  sourceChains: BlockchainType[];
  destinationChains: BlockchainType[];
  type: 'LOCK_MINT' | 'BURN_MINT' | 'LIQUIDITY_NETWORK' | 'THIRD_PARTY_CUSTODIAN';
  totalValueLocked: number;
  validators: number;
  securityIncidents: { date: number; description: string; lossAmount: number }[];
  status: BridgeStatus;
}

export interface MevBundle {
  type: MevType;
  transactions: TransactionId[];
  profit: string;
  strategy: string;
  executed: boolean;
  gasCost?: string;
  blockNumber?: number;
}

export interface BlockchainFinding {
  id: BlockchainFindingId;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  attackType: string;
  cveId: string;
  mitigated: boolean;
  timestamp: number;
}

export interface BlockchainAttackScenario {
  name: string;
  description: string;
  target: string;
  impact: string;
  year: number;
  lossAmount: string;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createBlock(overrides?: Partial<BlockInstance>): BlockInstance {
  return {
    id: blockId(),
    chain: BlockchainType.ETHEREUM,
    height: 0,
    hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: 1231006505,
    transactions: [],
    size: 215,
    miner: 'Satoshi',
    difficulty: 1,
    ...overrides,
  };
}

export function createTransaction(overrides?: Partial<TransactionInstance>): TransactionInstance {
  return {
    id: transactionId(),
    chain: BlockchainType.ETHEREUM,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD19',
    value: '1000000000000000000',
    gasPrice: '20000000000',
    gasLimit: '21000',
    nonce: 0,
    data: '0x',
    status: TransactionStatus.CONFIRMED,
    blockHeight: 1,
    timestamp: Date.now(),
    logEntries: [],
    internalCalls: [],
    ...overrides,
  };
}

export function createSmartContract(overrides?: Partial<SmartContractInstance>): SmartContractInstance {
  return {
    id: smartContractId(),
    chain: BlockchainType.ETHEREUM,
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    name: 'Uniswap V2 Router',
    compiler: 'solc 0.8.19',
    sourceVerified: true,
    vulnerabilities: [],
    tokenStandard: undefined,
    audits: [{ auditor: 'Trail of Bits', date: Date.now() - 86400000, passed: true, findings: [] }],
    totalTransactions: 1500000,
    ...overrides,
  };
}

export function createDeFiProtocol(overrides?: Partial<DeFiProtocolInstance>): DeFiProtocolInstance {
  return {
    id: defiProtocolId(),
    type: DeFiProtocolType.DEX,
    name: 'Uniswap',
    chain: BlockchainType.ETHEREUM,
    tvl: 5000000000,
    contracts: [],
    totalUsers: 300000,
    exploitHistory: [],
    securityScore: 85,
    forksFrom: undefined,
    ...overrides,
  };
}

export function createNft(overrides?: Partial<NftInstance>): NftInstance {
  return {
    id: nftId(),
    contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    tokenId: '1',
    standard: 'ERC721',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    currentOwner: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    mintPrice: '0.08',
    metadataUri: 'ipfs://QmZcH4YvBVVRJtdn4DbngHADMEXsNbjyyz7NASrrQEJxzv',
    metadataManipulated: false,
    royaltyPercentage: 2.5,
    collectionName: 'BoredApeYachtClub',
    ...overrides,
  };
}

export function createBridge(overrides?: Partial<BridgeInstance>): BridgeInstance {
  return {
    id: bridgeId(),
    name: 'Wormhole',
    sourceChains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA],
    destinationChains: [BlockchainType.POLYGON, BlockchainType.BSC],
    type: 'LOCK_MINT',
    totalValueLocked: 3500000000,
    validators: 19,
    securityIncidents: [],
    status: BridgeStatus.ACTIVE,
    ...overrides,
  };
}

export function createMevBundle(overrides?: Partial<MevBundle>): MevBundle {
  return {
    type: MevType.SANDWICH,
    transactions: [],
    profit: '5000',
    strategy: 'Sandwich attack on large Uniswap V3 swap',
    executed: true,
    gasCost: '150',
    blockNumber: 18500000,
    ...overrides,
  };
}

export function createBlockchainFinding(overrides?: Partial<BlockchainFinding>): BlockchainFinding {
  return {
    id: blockchainFindingId(),
    description: 'Suspicious transaction pattern detected',
    severity: 'high',
    attackType: 'Flash Loan Attack',
    cveId: 'CVE-2023-12345',
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function getKnownBlockchainAttacks(): BlockchainAttackScenario[] {
  return [
    { name: 'DAO Hack', description: 'Reentrancy exploit against The DAO smart contract draining $60M in ETH', target: 'The DAO smart contract', impact: '$60M ETH stolen, Ethereum hard fork to recover funds', year: 2016, lossAmount: '$60,000,000' },
    { name: 'Poly Network Hack', description: 'Cross-chain bridge vulnerability exploited across Ethereum, Binance Chain, and Polygon', target: 'Poly Network bridge contracts', impact: '$611M in crypto assets stolen, later partially returned', year: 2021, lossAmount: '$611,000,000' },
    { name: 'Wormhole Bridge Hack', description: 'Validator signature spoofing attack on Wormhole bridge contract', target: 'Wormhole Solana-Ethereum bridge', impact: '$326M in wETH stolen from bridge contract', year: 2022, lossAmount: '$326,000,000' },
    { name: 'Ronin Bridge Hack', description: 'Compromised validator keys used to forge withdrawals from Axie Infinity Ronin bridge', target: 'Ronin bridge validators (9-of-11 threshold)', impact: '$625M in ETH and USDC stolen', year: 2022, lossAmount: '$625,000,000' },
    { name: 'Nomad Bridge Hack', description: 'Incorrect initialization parameter allowed mass withdrawal spoofing', target: 'Nomad bridge contract', impact: '$190M drained in mass exploit by copycat attackers', year: 2022, lossAmount: '$190,000,000' },
    { name: 'FTX Collapse', description: 'Commingling of customer funds, unauthorized Alameda trading, and alleged fraud', target: 'FTX exchange hot wallets and internal accounting', impact: '$8B+ in customer funds lost, exchange bankruptcy', year: 2022, lossAmount: '$8,000,000,000' },
    { name: 'Curve Pool Exploit', description: 'Vyper compiler bug in reentrancy lock causing Curve pools to be drained', target: 'Curve Finance pools using Vyper 0.2.15', impact: '$73M in crypto stolen from multiple liquidity pools', year: 2023, lossAmount: '$73,000,000' },
    { name: 'Mt. Gox Hack', description: 'Custodial wallet compromise of largest Bitcoin exchange at the time', target: 'Mt. Gox Bitcoin exchange hot wallet', impact: '~850,000 BTC stolen ($460M at time), exchange bankruptcy', year: 2014, lossAmount: '$460,000,000' },
    { name: 'Euler Finance Flash Loan', description: 'Flash loan attack exploiting donation and liquidation logic in Euler lending protocol', target: 'Euler Finance lending pools', impact: '$197M stolen via complex flash loan attack', year: 2023, lossAmount: '$197,000,000' },
    { name: 'BNB Bridge Hack', description: 'Proof-of-stake bridge vulnerability allowed minting of 2M BNB tokens', target: 'BNB Chain cross-chain bridge', impact: '$570M in BNB tokens minted and withdrawn', year: 2022, lossAmount: '$570,000,000' },
    { name: 'Mango Markets Exploit', description: 'Oracle price manipulation via Mango Markets MNGO token pump and dump', target: 'Mango Markets DEX on Solana', impact: '$114M drained via price manipulation and under-collateralized loans', year: 2022, lossAmount: '$114,000,000' },
    { name: 'BadgerDAO Frontier Exploit', description: 'Compromised Cloudflare API key used to inject malicious withdraw contracts', target: 'BadgerDAO vault user interface', impact: '$120M stolen via phishing tx approvals', year: 2021, lossAmount: '$120,000,000' },
  ];
}

// ─── BlockManager ──────────────────────────────────────────────
export class BlockManager {
  private blocks: Map<string, BlockInstance> = new Map();
  add(b: BlockInstance): void { this.blocks.set(b.id, b); }
  get(id: BlockId): BlockInstance | undefined { return this.blocks.get(id); }
  remove(id: BlockId): void { this.blocks.delete(id); }
  list(): BlockInstance[] { return Array.from(this.blocks.values()); }
  clear(): void { this.blocks.clear(); }
  filterByChain(chain: BlockchainType): BlockInstance[] { return this.list().filter(b => b.chain === chain); }
  filterByHeightRange(min: number, max: number): BlockInstance[] { return this.list().filter(b => b.height >= min && b.height <= max); }
  filterByMiner(miner: string): BlockInstance[] { return this.list().filter(b => b.miner.toLowerCase() === miner.toLowerCase()); }
  filterByTimeRange(start: number, end: number): BlockInstance[] { return this.list().filter(b => b.timestamp >= start && b.timestamp <= end); }
  getTotalCount(): number { return this.blocks.size; }
}

// ─── TransactionManager ─────────────────────────────────────────
export class TransactionManager {
  private transactions: Map<string, TransactionInstance> = new Map();
  add(t: TransactionInstance): void { this.transactions.set(t.id, t); }
  get(id: TransactionId): TransactionInstance | undefined { return this.transactions.get(id); }
  remove(id: TransactionId): void { this.transactions.delete(id); }
  list(): TransactionInstance[] { return Array.from(this.transactions.values()); }
  clear(): void { this.transactions.clear(); }
  filterByChain(chain: BlockchainType): TransactionInstance[] { return this.list().filter(t => t.chain === chain); }
  filterByStatus(status: TransactionStatus): TransactionInstance[] { return this.list().filter(t => t.status === status); }
  filterByFrom(from: string): TransactionInstance[] { return this.list().filter(t => t.from.toLowerCase() === from.toLowerCase()); }
  filterByTo(to: string): TransactionInstance[] { return this.list().filter(t => t.to.toLowerCase() === to.toLowerCase()); }
  filterByValueThreshold(minValue: string): TransactionInstance[] {
    return this.list().filter(t => BigInt(t.value) >= BigInt(minValue));
  }
  filterFailed(): TransactionInstance[] { return this.list().filter(t => t.status === TransactionStatus.FAILED || t.status === TransactionStatus.REVERTED); }
  filterPending(): TransactionInstance[] { return this.list().filter(t => t.status === TransactionStatus.PENDING); }
  filterByBlock(blockHeight: number): TransactionInstance[] { return this.list().filter(t => t.blockHeight === blockHeight); }
  getTotalCount(): number { return this.transactions.size; }
}

// ─── SmartContractManager ──────────────────────────────────────
export class SmartContractManager {
  private contracts: Map<string, SmartContractInstance> = new Map();
  add(c: SmartContractInstance): void { this.contracts.set(c.id, c); }
  get(id: SmartContractId): SmartContractInstance | undefined { return this.contracts.get(id); }
  remove(id: SmartContractId): void { this.contracts.delete(id); }
  list(): SmartContractInstance[] { return Array.from(this.contracts.values()); }
  clear(): void { this.contracts.clear(); }
  filterByChain(chain: BlockchainType): SmartContractInstance[] { return this.list().filter(c => c.chain === chain); }
  filterByTokenStandard(standard: string): SmartContractInstance[] { return this.list().filter(c => c.tokenStandard === standard); }
  filterByVulnerability(vuln: SmartContractVulnerability): SmartContractInstance[] {
    return this.list().filter(c => c.vulnerabilities.includes(vuln));
  }
  filterSourceVerified(): SmartContractInstance[] { return this.list().filter(c => c.sourceVerified); }
  filterUnverified(): SmartContractInstance[] { return this.list().filter(c => !c.sourceVerified); }
  filterByAuditor(auditor: string): SmartContractInstance[] {
    return this.list().filter(c => c.audits.some(a => a.auditor.toLowerCase() === auditor.toLowerCase()));
  }
  filterByTransactionCount(min: number): SmartContractInstance[] { return this.list().filter(c => c.totalTransactions >= min); }
  getTotalCount(): number { return this.contracts.size; }
}

// ─── DeFiProtocolManager ───────────────────────────────────────
export class DeFiProtocolManager {
  private protocols: Map<string, DeFiProtocolInstance> = new Map();
  add(p: DeFiProtocolInstance): void { this.protocols.set(p.id, p); }
  get(id: DeFiProtocolId): DeFiProtocolInstance | undefined { return this.protocols.get(id); }
  remove(id: DeFiProtocolId): void { this.protocols.delete(id); }
  list(): DeFiProtocolInstance[] { return Array.from(this.protocols.values()); }
  clear(): void { this.protocols.clear(); }
  filterByType(type: DeFiProtocolType): DeFiProtocolInstance[] { return this.list().filter(p => p.type === type); }
  filterByChain(chain: BlockchainType): DeFiProtocolInstance[] { return this.list().filter(p => p.chain === chain); }
  filterByMinTvl(minTvl: number): DeFiProtocolInstance[] { return this.list().filter(p => p.tvl >= minTvl); }
  filterByMinSecurityScore(minScore: number): DeFiProtocolInstance[] { return this.list().filter(p => p.securityScore >= minScore); }
  filterExploited(): DeFiProtocolInstance[] { return this.list().filter(p => p.exploitHistory.length > 0); }
  getTotalCount(): number { return this.protocols.size; }
}

// ─── NftManager ────────────────────────────────────────────────
export class NftManager {
  private nfts: Map<string, NftInstance> = new Map();
  add(n: NftInstance): void { this.nfts.set(n.id, n); }
  get(id: NftId): NftInstance | undefined { return this.nfts.get(id); }
  remove(id: NftId): void { this.nfts.delete(id); }
  list(): NftInstance[] { return Array.from(this.nfts.values()); }
  clear(): void { this.nfts.clear(); }
  filterByCollection(collection: string): NftInstance[] { return this.list().filter(n => n.collectionName.toLowerCase() === collection.toLowerCase()); }
  filterByOwner(owner: string): NftInstance[] { return this.list().filter(n => n.currentOwner.toLowerCase() === owner.toLowerCase()); }
  filterByCreator(creator: string): NftInstance[] { return this.list().filter(n => n.creator.toLowerCase() === creator.toLowerCase()); }
  filterByStandard(standard: string): NftInstance[] { return this.list().filter(n => n.standard === standard); }
  filterManipulated(): NftInstance[] { return this.list().filter(n => n.metadataManipulated); }
  filterByMinRoyalty(minRoyalty: number): NftInstance[] { return this.list().filter(n => n.royaltyPercentage >= minRoyalty); }
  getTotalCount(): number { return this.nfts.size; }
}

// ─── BridgeManager ─────────────────────────────────────────────
export class BridgeManager {
  private bridges: Map<string, BridgeInstance> = new Map();
  add(b: BridgeInstance): void { this.bridges.set(b.id, b); }
  get(id: BridgeId): BridgeInstance | undefined { return this.bridges.get(id); }
  remove(id: BridgeId): void { this.bridges.delete(id); }
  list(): BridgeInstance[] { return Array.from(this.bridges.values()); }
  clear(): void { this.bridges.clear(); }
  filterByStatus(status: BridgeStatus): BridgeInstance[] { return this.list().filter(b => b.status === status); }
  filterByType(type: BridgeInstance['type']): BridgeInstance[] { return this.list().filter(b => b.type === type); }
  filterByMinValidators(minVals: number): BridgeInstance[] { return this.list().filter(b => b.validators >= minVals); }
  filterByMinTvl(minTvl: number): BridgeInstance[] { return this.list().filter(b => b.totalValueLocked >= minTvl); }
  filterHacked(): BridgeInstance[] { return this.list().filter(b => b.status === BridgeStatus.HACKED); }
  filterHasIncidents(): BridgeInstance[] { return this.list().filter(b => b.securityIncidents.length > 0); }
  getTotalCount(): number { return this.bridges.size; }
}

// ─── BlockchainSecurityManager ─────────────────────────────────
export class BlockchainSecurityManager {
  private findings: Map<string, BlockchainFinding> = new Map();
  private attacks: BlockchainAttackScenario[] = [];

  addFinding(f: BlockchainFinding): void { this.findings.set(f.id, f); }
  getFinding(id: BlockchainFindingId): BlockchainFinding | undefined { return this.findings.get(id); }
  listFindings(): BlockchainFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }
  mitigateFinding(id: BlockchainFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.mitigated = true;
    return true;
  }
  filterFindingsBySeverity(severity: BlockchainFinding['severity']): BlockchainFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }
  filterFindingsByAttackType(attackType: string): BlockchainFinding[] {
    return this.listFindings().filter(f => f.attackType.toLowerCase() === attackType.toLowerCase());
  }
  filterFindingsUnmitigated(): BlockchainFinding[] { return this.listFindings().filter(f => !f.mitigated); }
  getTotalFindings(): number { return this.findings.size; }

  loadKnownAttacks(): void { this.attacks = getKnownBlockchainAttacks(); }
  getKnownAttacks(): BlockchainAttackScenario[] { return this.attacks; }
}

// ─── BlockchainCoordinator ─────────────────────────────────────
export class BlockchainCoordinator {
  readonly blocks: BlockManager;
  readonly transactions: TransactionManager;
  readonly smartContracts: SmartContractManager;
  readonly protocols: DeFiProtocolManager;
  readonly nfts: NftManager;
  readonly bridges: BridgeManager;
  readonly security: BlockchainSecurityManager;

  constructor() {
    this.blocks = new BlockManager();
    this.transactions = new TransactionManager();
    this.smartContracts = new SmartContractManager();
    this.protocols = new DeFiProtocolManager();
    this.nfts = new NftManager();
    this.bridges = new BridgeManager();
    this.security = new BlockchainSecurityManager();
  }

  addBlock(b: BlockInstance): void { this.blocks.add(b); }
  getBlock(id: BlockId): BlockInstance | undefined { return this.blocks.get(id); }
  listBlocks(): BlockInstance[] { return this.blocks.list(); }

  addTransaction(t: TransactionInstance): void { this.transactions.add(t); }
  getTransaction(id: TransactionId): TransactionInstance | undefined { return this.transactions.get(id); }

  deployContract(c: SmartContractInstance): void { this.smartContracts.add(c); }
  getContract(id: SmartContractId): SmartContractInstance | undefined { return this.smartContracts.get(id); }

  registerProtocol(p: DeFiProtocolInstance): void { this.protocols.add(p); }
  getProtocol(id: DeFiProtocolId): DeFiProtocolInstance | undefined { return this.protocols.get(id); }

  mintNft(n: NftInstance): void { this.nfts.add(n); }
  getNft(id: NftId): NftInstance | undefined { return this.nfts.get(id); }

  registerBridge(b: BridgeInstance): void { this.bridges.add(b); }
  getBridge(id: BridgeId): BridgeInstance | undefined { return this.bridges.get(id); }

  getStats(): {
    blockCount: number; transactionCount: number; contractCount: number;
    protocolCount: number; nftCount: number; bridgeCount: number;
    findingCount: number; unmitigatedFindingCount: number;
    pendingTxCount: number; failedTxCount: number;
  } {
    return {
      blockCount: this.blocks.getTotalCount(),
      transactionCount: this.transactions.getTotalCount(),
      contractCount: this.smartContracts.getTotalCount(),
      protocolCount: this.protocols.getTotalCount(),
      nftCount: this.nfts.getTotalCount(),
      bridgeCount: this.bridges.getTotalCount(),
      findingCount: this.security.getTotalFindings(),
      unmitigatedFindingCount: this.security.filterFindingsUnmitigated().length,
      pendingTxCount: this.transactions.filterPending().length,
      failedTxCount: this.transactions.filterFailed().length,
    };
  }

  reset(): void {
    this.blocks.clear();
    this.transactions.clear();
    this.smartContracts.clear();
    this.protocols.clear();
    this.nfts.clear();
    this.bridges.clear();
    this.security.clearFindings();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultBlockchainEnvironment(): BlockchainCoordinator {
  const coord = new BlockchainCoordinator();

  // Blocks
  const genesisBlock = createBlock({
    chain: BlockchainType.BITCOIN, height: 0,
    hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: 1231006505, miner: 'Satoshi Nakamoto', difficulty: 1, size: 285,
  });
  const ethereumBlock = createBlock({
    chain: BlockchainType.ETHEREUM, height: 12965000,
    hash: '0xb3b2c0b7e5b5c1f9c5b7c3b5e9f0a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    previousHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    timestamp: 1630810000, miner: 'Ethermine', difficulty: 7500000, size: 52000,
    gasUsed: 14950000, gasLimit: 15000000, uncleCount: 2,
  });
  const solanaBlock = createBlock({
    chain: BlockchainType.SOLANA, height: 245000000,
    hash: '5VeriFyM3sag3HashF0rSo1anaB1ockDeMonstrat10nPurp0s3s0nly',
    previousHash: '4Val1dAt10n0fPr3v10usHa5hF0rSo1anaChainC0nt1nu1ty',
    timestamp: 1700000000, miner: 'Solana Labs', difficulty: 1, size: 98000,
  });

  coord.addBlock(genesisBlock);
  coord.addBlock(ethereumBlock);
  coord.addBlock(solanaBlock);

  // Transactions
  const tx1 = createTransaction({
    chain: BlockchainType.BITCOIN,
    hash: 'f4184fc596403b9ef638e1e4c8f3b0c9c5b0b5c5f4b0b5c5f4b0b5c5f4b0b5c5',
    from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb',
    value: '5000000000', nonce: 0, status: TransactionStatus.CONFIRMED,
    blockHeight: 0, data: '0x0100000001000000000000000000000000000000000000000000000000000000',
    logEntries: [], internalCalls: [],
  });
  const tx2 = createTransaction({
    chain: BlockchainType.ETHEREUM,
    hash: '0xe1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9fafbfcfdfefff0f1f2f3f4f5f6',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    value: '1000000000000000000', gasPrice: '50000000000', gasLimit: '300000',
    nonce: 42, status: TransactionStatus.CONFIRMED, blockHeight: 12965000,
    data: '0x7ff36ab500000000000000000000000000000000000000000000000000000000',
    logEntries: [
      { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'], data: '0x0000000000000000000000000000000000000000000000000000000000000000' },
    ],
    internalCalls: [
      { from: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', value: '500000000000000000', input: '0x' },
    ],
  });
  const tx3 = createTransaction({
    chain: BlockchainType.ETHEREUM,
    hash: '0xf1f2f3f4f5f6f7f8f9fafbfcfdfefff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
    from: '0xmalic10usWa11etAddre55NotRea1ButFake',
    to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    value: '0', gasPrice: '30000000000', gasLimit: '1000000',
    nonce: 7, status: TransactionStatus.FAILED, blockHeight: 12965001,
    data: '0x23b872dd00000000000000000000000000000000000000000000000000000000',
    logEntries: [], internalCalls: [],
  });
  const tx4 = createTransaction({
    chain: BlockchainType.SOLANA,
    hash: '5TxHashForSolanaDemonstrationPurposes123456789abcdef',
    from: 'GjJ3WZq8vH3hVxQyRzLkMnOpQrStUvWxYz1234567890',
    to: 'AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIj',
    value: '1000000000', gasPrice: '0.000001', gasLimit: '200000',
    nonce: 15, status: TransactionStatus.CONFIRMED, blockHeight: 245000000,
    data: '0x0102030405060708090a0b0c0d0e0f10',
    logEntries: [
      { address: 'So11111111111111111111111111111111111111112', topics: ['0xtransfer'], data: '0x' },
    ],
    internalCalls: [],
  });
  const tx5 = createTransaction({
    chain: BlockchainType.ETHEREUM,
    hash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    from: '0xmalic10usWa11etAddre55NotRea1ButFake',
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    value: '0', gasPrice: '25000000000', gasLimit: '500000',
    nonce: 13, status: TransactionStatus.REVERTED, blockHeight: 18500001,
    data: '0x0902f1ac00000000000000000000000000000000000000000000000000000000',
    logEntries: [], internalCalls: [],
  });
  const tx6 = createTransaction({
    chain: BlockchainType.POLYGON,
    hash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
    from: '0xpolygonAddress1SomeRandomWalletHere',
    to: '0xpolygonAddress2AnotherRandomWalletForTest',
    value: '50000000000000000000', gasPrice: '150000000000', gasLimit: '250000',
    nonce: 3, status: TransactionStatus.PENDING, data: '0x',
    logEntries: [], internalCalls: [],
  });
  const tx7 = createTransaction({
    chain: BlockchainType.ARBITRUM,
    hash: '0x222233334444555566667777888899990000aaaabbbbccccddddeeeeffff0000',
    from: '0xarbitrumAddressOneRandomExampleForTesting',
    to: '0xarbitrumAddressTwoAnotherExampleForTestingPurposes',
    value: '100000000000000000', gasPrice: '100000000', gasLimit: '350000',
    nonce: 8, status: TransactionStatus.CONFIRMED, blockHeight: 125000000,
    data: '0x',
    logEntries: [], internalCalls: [],
  });
  const tx8 = createTransaction({
    chain: BlockchainType.BSC,
    hash: '0x33334444555566667777888899990000aaaabbbbccccddddeeeeffff00001111',
    from: '0xbscAddressAliceTestWalletForDemonstration',
    to: '0xbscAddressBobTestWalletForDemonstrationPurposes',
    value: '50000000000000000000', gasPrice: '5000000000', gasLimit: '21000',
    nonce: 0, status: TransactionStatus.ORPHANED, data: '0x',
    logEntries: [], internalCalls: [],
  });

  coord.addTransaction(tx1); coord.addTransaction(tx2); coord.addTransaction(tx3); coord.addTransaction(tx4);
  coord.addTransaction(tx5); coord.addTransaction(tx6); coord.addTransaction(tx7); coord.addTransaction(tx8);

  // Smart contracts
  const uniswapV2Contract = createSmartContract({
    chain: BlockchainType.ETHEREUM, address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    name: 'Uniswap V2 Router', compiler: 'solc 0.6.6', sourceVerified: true,
    vulnerabilities: [],
    audits: [{ auditor: 'ConsenSys Diligence', date: Date.now() - 604800000, passed: true, findings: [] }],
    totalTransactions: 85000000,
  });
  const aaveContract = createSmartContract({
    chain: BlockchainType.ETHEREUM, address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    name: 'Aave Lending Pool', compiler: 'solc 0.8.10', sourceVerified: true,
    vulnerabilities: [],
    audits: [{ auditor: 'Trail of Bits', date: Date.now() - 1209600000, passed: true, findings: ['Centralization risk'] },
      { auditor: 'OpenZeppelin', date: Date.now() - 1814400000, passed: true, findings: [] }],
    totalTransactions: 42000000,
  });
  const vulnerableNftContract = createSmartContract({
    chain: BlockchainType.ETHEREUM, address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    name: 'Vulnerable NFT Collection', compiler: 'solc 0.8.7', sourceVerified: false,
    vulnerabilities: [SmartContractVulnerability.REENTRANCY, SmartContractVulnerability.ACCESS_CONTROL,
      SmartContractVulnerability.INTEGER_OVERFLOW],
    tokenStandard: 'ERC721', totalSupply: '10000',
    audits: [],
    totalTransactions: 500000,
  });
  const bridgeContract = createSmartContract({
    chain: BlockchainType.ETHEREUM, address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Cross-Chain Bridge Contract', compiler: 'solc 0.8.19', sourceVerified: true,
    vulnerabilities: [SmartContractVulnerability.ORACLE_MANIPULATION],
    audits: [{ auditor: 'SlowMist', date: Date.now() - 86400000, passed: true, findings: ['Oracle dependency risk'] }],
    totalTransactions: 1200000,
  });

  coord.deployContract(uniswapV2Contract);
  coord.deployContract(aaveContract);
  coord.deployContract(vulnerableNftContract);
  coord.deployContract(bridgeContract);

  // DeFi protocols
  const uniswapProtocol = createDeFiProtocol({
    type: DeFiProtocolType.DEX, name: 'Uniswap', chain: BlockchainType.ETHEREUM,
    tvl: 7800000000, contracts: [uniswapV2Contract.id], totalUsers: 5200000,
    exploitHistory: [], securityScore: 88,
  });
  const aaveProtocol = createDeFiProtocol({
    type: DeFiProtocolType.LENDING, name: 'Aave', chain: BlockchainType.ETHEREUM,
    tvl: 6500000000, contracts: [aaveContract.id], totalUsers: 1800000,
    exploitHistory: ['Aave V2 rate manipulation incident (2022)'], securityScore: 82,
  });
  const makerProtocol = createDeFiProtocol({
    type: DeFiProtocolType.STABLECOIN, name: 'MakerDAO', chain: BlockchainType.ETHEREUM,
    tvl: 7200000000, contracts: [aaveContract.id], totalUsers: 950000,
    exploitHistory: ['Black Thursday March 2020 - oracle lag caused $8M in liquidations'],
    securityScore: 75,
  });

  coord.registerProtocol(uniswapProtocol);
  coord.registerProtocol(aaveProtocol);
  coord.registerProtocol(makerProtocol);

  // NFTs
  const punk = createNft({
    contract: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', tokenId: '5822',
    standard: 'ERC721', creator: '0x942bc2d3e7a5899e98ffb11b0f1c3a1c9a5a5c5a',
    currentOwner: '0x1234567890abcdef1234567890abcdef12345678',
    mintPrice: '0', metadataUri: 'ipfs://QmPm6QMHoxdNbNYmDXMYj1VGwzBxfzyxGQjYXGjWhYNw3M',
    metadataManipulated: false, royaltyPercentage: 0,
    collectionName: 'CryptoPunks',
  });
  const bayc = createNft({
    contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', tokenId: '8817',
    standard: 'ERC721', creator: '0xba5e35ef26ac1a84f0a9a4b0f8a2a0b0f0a0b0a0',
    currentOwner: '0xdead000000000000000000000000000000000000',
    mintPrice: '0.08', metadataUri: 'ipfs://QmZcH4YvBVVRJtdn4DbngHADMEXsNbjyyz7NASrrQEJxzv',
    metadataManipulated: false, royaltyPercentage: 2.5,
    collectionName: 'BoredApeYachtClub',
  });
  const artBlock = createNft({
    contract: '0xa7d8d9ef8d8ce6ba2e36d8b2cf3a6b9c8d7e6f5a', tokenId: '7800',
    standard: 'ERC1155', creator: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    currentOwner: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    mintPrice: '0.35', metadataUri: 'ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    metadataManipulated: true, royaltyPercentage: 5.0,
    collectionName: 'ArtBlocks',
  });

  coord.mintNft(punk);
  coord.mintNft(bayc);
  coord.mintNft(artBlock);

  // Bridges
  const wormhole = createBridge({
    name: 'Wormhole', sourceChains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA],
    destinationChains: [BlockchainType.POLYGON, BlockchainType.BSC, BlockchainType.ARBITRUM],
    type: 'LOCK_MINT', totalValueLocked: 3500000000, validators: 19,
    securityIncidents: [{ date: 1645891200000, description: 'Validator signature bypass led to 120k wETH theft', lossAmount: 326000000 }],
    status: BridgeStatus.ACTIVE,
  });
  const layerZero = createBridge({
    name: 'LayerZero', sourceChains: [BlockchainType.ETHEREUM, BlockchainType.ARBITRUM, BlockchainType.OPTIMISM],
    destinationChains: [BlockchainType.POLYGON, BlockchainType.BSC, BlockchainType.AVALANCHE],
    type: 'LIQUIDITY_NETWORK', totalValueLocked: 8500000000, validators: 30,
    securityIncidents: [],
    status: BridgeStatus.ACTIVE,
  });

  coord.registerBridge(wormhole);
  coord.registerBridge(layerZero);

  // Security findings
  coord.security.addFinding(createBlockchainFinding({
    description: 'Reentrancy vulnerability detected in NFT contract - potential DAO-style attack vector',
    severity: 'critical', attackType: 'Reentrancy', cveId: 'CVE-2016-1000001',
  }));
  coord.security.addFinding(createBlockchainFinding({
    description: 'Suspicious flash loan activity detected on Aave lending pool - 15x leverage in single block',
    severity: 'high', attackType: 'Flash Loan Attack', cveId: 'CVE-2023-45678',
  }));
  coord.security.addFinding(createBlockchainFinding({
    description: 'Oracle price deviation detected on bridge contract - potential price manipulation',
    severity: 'critical', attackType: 'Oracle Manipulation', cveId: 'CVE-2022-33456',
  }));
  coord.security.addFinding(createBlockchainFinding({
    description: 'Access control gap in vulnerable NFT contract allows unauthorized minting',
    severity: 'high', attackType: 'Access Control Bypass', cveId: 'CVE-2023-78901',
  }));
  coord.security.addFinding(createBlockchainFinding({
    description: 'MEV sandwich attack detected on Uniswap V2 - 5000 USD profit extracted',
    severity: 'medium', attackType: 'MEV Sandwich', cveId: 'CVE-2024-11223',
  }));
  coord.security.addFinding(createBlockchainFinding({
    description: 'Integer overflow in NFT totalSupply could lead to token inflation',
    severity: 'high', attackType: 'Integer Overflow', cveId: 'CVE-2023-45679',
  }));

  // Known attacks
  coord.security.loadKnownAttacks();

  return coord;
}
