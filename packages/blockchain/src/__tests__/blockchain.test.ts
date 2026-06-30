import { describe, it, expect } from 'vitest';
import {
  BlockchainCoordinator, createDefaultBlockchainEnvironment,
  BlockManager, TransactionManager, SmartContractManager,
  DeFiProtocolManager, NftManager, BridgeManager, BlockchainSecurityManager,
  blockId, transactionId, smartContractId, defiProtocolId,
  nftId, bridgeId, blockchainFindingId,
  BlockchainType, TransactionStatus, ConsensusMechanism,
  DeFiProtocolType, SmartContractVulnerability, MevType, WalletType, BridgeStatus,
  createBlock, createTransaction, createSmartContract,
  createDeFiProtocol, createNft, createBridge,
  createMevBundle, createBlockchainFinding,
  getKnownBlockchainAttacks,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      blockId(), transactionId(), smartContractId(), defiProtocolId(),
      nftId(), bridgeId(), blockchainFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => blockId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createBlock with defaults', () => {
    const b = createBlock();
    expect(b.chain).toBe(BlockchainType.ETHEREUM);
    expect(b.height).toBe(0);
    expect(b.miner).toBe('Satoshi');
  });
  it('createBlock with overrides', () => {
    const b = createBlock({ chain: BlockchainType.BITCOIN, height: 1, miner: 'F2Pool', difficulty: 5000000 });
    expect(b.chain).toBe(BlockchainType.BITCOIN);
    expect(b.height).toBe(1);
    expect(b.miner).toBe('F2Pool');
    expect(b.difficulty).toBe(5000000);
  });
  it('createTransaction with defaults', () => {
    const t = createTransaction();
    expect(t.chain).toBe(BlockchainType.ETHEREUM);
    expect(t.status).toBe(TransactionStatus.CONFIRMED);
    expect(t.value).toBe('1000000000000000000');
  });
  it('createTransaction with overrides', () => {
    const t = createTransaction({ chain: BlockchainType.SOLANA, status: TransactionStatus.PENDING, value: '1' });
    expect(t.chain).toBe(BlockchainType.SOLANA);
    expect(t.status).toBe(TransactionStatus.PENDING);
    expect(t.value).toBe('1');
  });
  it('createSmartContract with defaults', () => {
    const c = createSmartContract();
    expect(c.name).toBe('Uniswap V2 Router');
    expect(c.sourceVerified).toBe(true);
    expect(c.vulnerabilities).toEqual([]);
  });
  it('createSmartContract with overrides', () => {
    const c = createSmartContract({
      name: 'Test Contract', sourceVerified: false,
      vulnerabilities: [SmartContractVulnerability.REENTRANCY],
    });
    expect(c.name).toBe('Test Contract');
    expect(c.sourceVerified).toBe(false);
    expect(c.vulnerabilities).toContain(SmartContractVulnerability.REENTRANCY);
  });
  it('createDeFiProtocol with defaults', () => {
    const p = createDeFiProtocol();
    expect(p.name).toBe('Uniswap');
    expect(p.type).toBe(DeFiProtocolType.DEX);
    expect(p.tvl).toBe(5000000000);
  });
  it('createDeFiProtocol with overrides', () => {
    const p = createDeFiProtocol({ name: 'Aave', type: DeFiProtocolType.LENDING, tvl: 1000000000 });
    expect(p.name).toBe('Aave');
    expect(p.type).toBe(DeFiProtocolType.LENDING);
    expect(p.tvl).toBe(1000000000);
  });
  it('createNft with defaults', () => {
    const n = createNft();
    expect(n.collectionName).toBe('BoredApeYachtClub');
    expect(n.standard).toBe('ERC721');
    expect(n.metadataManipulated).toBe(false);
  });
  it('createNft with overrides', () => {
    const n = createNft({ collectionName: 'CryptoPunks', standard: 'ERC721', metadataManipulated: true });
    expect(n.collectionName).toBe('CryptoPunks');
    expect(n.metadataManipulated).toBe(true);
  });
  it('createBridge with defaults', () => {
    const b = createBridge();
    expect(b.name).toBe('Wormhole');
    expect(b.status).toBe(BridgeStatus.ACTIVE);
    expect(b.validators).toBe(19);
  });
  it('createBridge with overrides', () => {
    const b = createBridge({ name: 'PolyBridge', status: BridgeStatus.HACKED, validators: 5 });
    expect(b.name).toBe('PolyBridge');
    expect(b.status).toBe(BridgeStatus.HACKED);
    expect(b.validators).toBe(5);
  });
  it('createMevBundle with defaults', () => {
    const m = createMevBundle();
    expect(m.type).toBe(MevType.SANDWICH);
    expect(m.profit).toBe('5000');
    expect(m.executed).toBe(true);
  });
  it('createMevBundle with overrides', () => {
    const m = createMevBundle({ type: MevType.DEX_ARBITRAGE, profit: '10000', executed: false });
    expect(m.type).toBe(MevType.DEX_ARBITRAGE);
    expect(m.profit).toBe('10000');
    expect(m.executed).toBe(false);
  });
  it('createBlockchainFinding with defaults', () => {
    const f = createBlockchainFinding();
    expect(f.severity).toBe('high');
    expect(f.attackType).toBe('Flash Loan Attack');
    expect(f.mitigated).toBe(false);
  });
  it('createBlockchainFinding with overrides', () => {
    const f = createBlockchainFinding({ severity: 'critical', attackType: 'Reentrancy', mitigated: true });
    expect(f.severity).toBe('critical');
    expect(f.attackType).toBe('Reentrancy');
    expect(f.mitigated).toBe(true);
  });
  it('getKnownBlockchainAttacks returns 12 attacks', () => {
    const attacks = getKnownBlockchainAttacks();
    expect(attacks).toHaveLength(12);
  });
  it('known attacks include major blockchain events', () => {
    const attacks = getKnownBlockchainAttacks();
    expect(attacks.find(a => a.name === 'DAO Hack')).toBeDefined();
    expect(attacks.find(a => a.name === 'FTX Collapse')).toBeDefined();
    expect(attacks.find(a => a.name === 'Mt. Gox Hack')).toBeDefined();
  });
});

// ─── BlockManager ──────────────────────────────────────────────
describe('BlockManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new BlockManager();
    const b = createBlock();
    mgr.add(b);
    expect(mgr.get(b.id)).toEqual(b);
    mgr.remove(b.id);
    expect(mgr.get(b.id)).toBeUndefined();
    mgr.add(b);
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('filterByChain', () => {
    const mgr = new BlockManager();
    mgr.add(createBlock({ id: blockId(), chain: BlockchainType.ETHEREUM }));
    mgr.add(createBlock({ id: blockId(), chain: BlockchainType.BITCOIN }));
    expect(mgr.filterByChain(BlockchainType.ETHEREUM)).toHaveLength(1);
    expect(mgr.filterByChain(BlockchainType.SOLANA)).toHaveLength(0);
  });
  it('filterByHeightRange', () => {
    const mgr = new BlockManager();
    mgr.add(createBlock({ id: blockId(), height: 0 }));
    mgr.add(createBlock({ id: blockId(), height: 100 }));
    mgr.add(createBlock({ id: blockId(), height: 200 }));
    expect(mgr.filterByHeightRange(50, 150)).toHaveLength(1);
    expect(mgr.filterByHeightRange(0, 200)).toHaveLength(3);
  });
  it('filterByMiner', () => {
    const mgr = new BlockManager();
    mgr.add(createBlock({ id: blockId(), miner: 'Satoshi' }));
    mgr.add(createBlock({ id: blockId(), miner: 'Ethermine' }));
    expect(mgr.filterByMiner('satoshi')).toHaveLength(1);
    expect(mgr.filterByMiner('SATOSHI')).toHaveLength(1);
  });
  it('filterByTimeRange', () => {
    const mgr = new BlockManager();
    mgr.add(createBlock({ id: blockId(), timestamp: 1000 }));
    mgr.add(createBlock({ id: blockId(), timestamp: 2000 }));
    expect(mgr.filterByTimeRange(500, 1500)).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new BlockManager();
    expect(mgr.getTotalCount()).toBe(0);
    mgr.add(createBlock());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── TransactionManager ─────────────────────────────────────────
describe('TransactionManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new TransactionManager();
    const t = createTransaction();
    mgr.add(t);
    expect(mgr.get(t.id)).toEqual(t);
    mgr.remove(t.id);
    expect(mgr.get(t.id)).toBeUndefined();
  });
  it('filterByChain', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), chain: BlockchainType.ETHEREUM }));
    mgr.add(createTransaction({ id: transactionId(), chain: BlockchainType.BITCOIN }));
    expect(mgr.filterByChain(BlockchainType.ETHEREUM)).toHaveLength(1);
  });
  it('filterByStatus', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.CONFIRMED }));
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.PENDING }));
    expect(mgr.filterByStatus(TransactionStatus.CONFIRMED)).toHaveLength(1);
  });
  it('filterByFrom', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), from: '0xABC' }));
    mgr.add(createTransaction({ id: transactionId(), from: '0xDEF' }));
    expect(mgr.filterByFrom('0xabc')).toHaveLength(1);
  });
  it('filterByTo', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), to: '0xABC' }));
    mgr.add(createTransaction({ id: transactionId(), to: '0xDEF' }));
    expect(mgr.filterByTo('0xdef')).toHaveLength(1);
  });
  it('filterByValueThreshold', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), value: '100' }));
    mgr.add(createTransaction({ id: transactionId(), value: '1000' }));
    expect(mgr.filterByValueThreshold('500')).toHaveLength(1);
  });
  it('filterFailed', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.FAILED }));
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.REVERTED }));
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.CONFIRMED }));
    expect(mgr.filterFailed()).toHaveLength(2);
  });
  it('filterPending', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.PENDING }));
    mgr.add(createTransaction({ id: transactionId(), status: TransactionStatus.CONFIRMED }));
    expect(mgr.filterPending()).toHaveLength(1);
  });
  it('filterByBlock', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction({ id: transactionId(), blockHeight: 10 }));
    mgr.add(createTransaction({ id: transactionId(), blockHeight: 20 }));
    expect(mgr.filterByBlock(10)).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new TransactionManager();
    mgr.add(createTransaction());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── SmartContractManager ──────────────────────────────────────
describe('SmartContractManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new SmartContractManager();
    const c = createSmartContract();
    mgr.add(c);
    expect(mgr.get(c.id)).toEqual(c);
    mgr.remove(c.id);
    expect(mgr.get(c.id)).toBeUndefined();
  });
  it('filterByChain', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({ id: smartContractId(), chain: BlockchainType.ETHEREUM }));
    mgr.add(createSmartContract({ id: smartContractId(), chain: BlockchainType.POLYGON }));
    expect(mgr.filterByChain(BlockchainType.ETHEREUM)).toHaveLength(1);
  });
  it('filterByTokenStandard', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({ id: smartContractId(), tokenStandard: 'ERC721' }));
    mgr.add(createSmartContract({ id: smartContractId(), tokenStandard: 'ERC20' }));
    expect(mgr.filterByTokenStandard('ERC721')).toHaveLength(1);
  });
  it('filterByVulnerability', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({
      id: smartContractId(), vulnerabilities: [SmartContractVulnerability.REENTRANCY],
    }));
    mgr.add(createSmartContract({
      id: smartContractId(), vulnerabilities: [SmartContractVulnerability.ACCESS_CONTROL],
    }));
    expect(mgr.filterByVulnerability(SmartContractVulnerability.REENTRANCY)).toHaveLength(1);
  });
  it('filterSourceVerified / filterUnverified', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({ id: smartContractId(), sourceVerified: true }));
    mgr.add(createSmartContract({ id: smartContractId(), sourceVerified: false }));
    expect(mgr.filterSourceVerified()).toHaveLength(1);
    expect(mgr.filterUnverified()).toHaveLength(1);
  });
  it('filterByAuditor', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({ id: smartContractId(), audits: [{ auditor: 'Trail of Bits', date: 0, passed: true, findings: [] }] }));
    mgr.add(createSmartContract({ id: smartContractId(), audits: [] }));
    expect(mgr.filterByAuditor('trail of bits')).toHaveLength(1);
  });
  it('filterByTransactionCount', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract({ id: smartContractId(), totalTransactions: 100 }));
    mgr.add(createSmartContract({ id: smartContractId(), totalTransactions: 500 }));
    expect(mgr.filterByTransactionCount(200)).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new SmartContractManager();
    mgr.add(createSmartContract());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── DeFiProtocolManager ───────────────────────────────────────
describe('DeFiProtocolManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new DeFiProtocolManager();
    const p = createDeFiProtocol();
    mgr.add(p);
    expect(mgr.get(p.id)).toEqual(p);
    mgr.remove(p.id);
    expect(mgr.get(p.id)).toBeUndefined();
  });
  it('filterByType', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), type: DeFiProtocolType.DEX }));
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), type: DeFiProtocolType.LENDING }));
    expect(mgr.filterByType(DeFiProtocolType.DEX)).toHaveLength(1);
  });
  it('filterByChain', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), chain: BlockchainType.ETHEREUM }));
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), chain: BlockchainType.SOLANA }));
    expect(mgr.filterByChain(BlockchainType.ETHEREUM)).toHaveLength(1);
  });
  it('filterByMinTvl', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), tvl: 1000000000 }));
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), tvl: 500000000 }));
    expect(mgr.filterByMinTvl(600000000)).toHaveLength(1);
  });
  it('filterByMinSecurityScore', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), securityScore: 90 }));
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), securityScore: 70 }));
    expect(mgr.filterByMinSecurityScore(80)).toHaveLength(1);
  });
  it('filterExploited', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), exploitHistory: ['Hack 2023'] }));
    mgr.add(createDeFiProtocol({ id: defiProtocolId(), exploitHistory: [] }));
    expect(mgr.filterExploited()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new DeFiProtocolManager();
    mgr.add(createDeFiProtocol());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── NftManager ────────────────────────────────────────────────
describe('NftManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new NftManager();
    const n = createNft();
    mgr.add(n);
    expect(mgr.get(n.id)).toEqual(n);
    mgr.remove(n.id);
    expect(mgr.get(n.id)).toBeUndefined();
  });
  it('filterByCollection', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), collectionName: 'BoredApeYachtClub' }));
    mgr.add(createNft({ id: nftId(), collectionName: 'CryptoPunks' }));
    expect(mgr.filterByCollection('boredapeyachtclub')).toHaveLength(1);
  });
  it('filterByOwner', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), currentOwner: '0xABC' }));
    mgr.add(createNft({ id: nftId(), currentOwner: '0xDEF' }));
    expect(mgr.filterByOwner('0xabc')).toHaveLength(1);
  });
  it('filterByCreator', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), creator: '0xABC' }));
    mgr.add(createNft({ id: nftId(), creator: '0xDEF' }));
    expect(mgr.filterByCreator('0xdef')).toHaveLength(1);
  });
  it('filterByStandard', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), standard: 'ERC721' }));
    mgr.add(createNft({ id: nftId(), standard: 'ERC1155' }));
    expect(mgr.filterByStandard('ERC721')).toHaveLength(1);
  });
  it('filterManipulated', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), metadataManipulated: true }));
    mgr.add(createNft({ id: nftId(), metadataManipulated: false }));
    expect(mgr.filterManipulated()).toHaveLength(1);
  });
  it('filterByMinRoyalty', () => {
    const mgr = new NftManager();
    mgr.add(createNft({ id: nftId(), royaltyPercentage: 5 }));
    mgr.add(createNft({ id: nftId(), royaltyPercentage: 1 }));
    expect(mgr.filterByMinRoyalty(2)).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new NftManager();
    mgr.add(createNft());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── BridgeManager ─────────────────────────────────────────────
describe('BridgeManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new BridgeManager();
    const b = createBridge();
    mgr.add(b);
    expect(mgr.get(b.id)).toEqual(b);
    mgr.remove(b.id);
    expect(mgr.get(b.id)).toBeUndefined();
  });
  it('filterByStatus', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), status: BridgeStatus.ACTIVE }));
    mgr.add(createBridge({ id: bridgeId(), status: BridgeStatus.HACKED }));
    expect(mgr.filterByStatus(BridgeStatus.ACTIVE)).toHaveLength(1);
    expect(mgr.filterByStatus(BridgeStatus.HACKED)).toHaveLength(1);
  });
  it('filterByType', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), type: 'LOCK_MINT' }));
    mgr.add(createBridge({ id: bridgeId(), type: 'LIQUIDITY_NETWORK' }));
    expect(mgr.filterByType('LOCK_MINT')).toHaveLength(1);
  });
  it('filterByMinValidators', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), validators: 10 }));
    mgr.add(createBridge({ id: bridgeId(), validators: 5 }));
    expect(mgr.filterByMinValidators(7)).toHaveLength(1);
  });
  it('filterByMinTvl', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), totalValueLocked: 1000000000 }));
    mgr.add(createBridge({ id: bridgeId(), totalValueLocked: 100000000 }));
    expect(mgr.filterByMinTvl(500000000)).toHaveLength(1);
  });
  it('filterHacked', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), status: BridgeStatus.HACKED }));
    mgr.add(createBridge({ id: bridgeId(), status: BridgeStatus.ACTIVE }));
    expect(mgr.filterHacked()).toHaveLength(1);
  });
  it('filterHasIncidents', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge({ id: bridgeId(), securityIncidents: [{ date: 0, description: 'test', lossAmount: 100 }] }));
    mgr.add(createBridge({ id: bridgeId(), securityIncidents: [] }));
    expect(mgr.filterHasIncidents()).toHaveLength(1);
  });
  it('getTotalCount', () => {
    const mgr = new BridgeManager();
    mgr.add(createBridge());
    expect(mgr.getTotalCount()).toBe(1);
  });
});

// ─── BlockchainSecurityManager ──────────────────────────────────
describe('BlockchainSecurityManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new BlockchainSecurityManager();
    const f = createBlockchainFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new BlockchainSecurityManager();
    const f = createBlockchainFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new BlockchainSecurityManager();
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), severity: 'critical' }));
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), severity: 'high' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
  });
  it('filterFindingsByAttackType', () => {
    const mgr = new BlockchainSecurityManager();
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), attackType: 'Reentrancy' }));
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), attackType: 'Flash Loan Attack' }));
    expect(mgr.filterFindingsByAttackType('reentrancy')).toHaveLength(1);
  });
  it('filterFindingsUnmitigated', () => {
    const mgr = new BlockchainSecurityManager();
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), mitigated: true }));
    mgr.addFinding(createBlockchainFinding({ id: blockchainFindingId(), mitigated: false }));
    expect(mgr.filterFindingsUnmitigated()).toHaveLength(1);
  });
  it('loadKnownAttacks / getKnownAttacks', () => {
    const mgr = new BlockchainSecurityManager();
    expect(mgr.getKnownAttacks()).toHaveLength(0);
    mgr.loadKnownAttacks();
    expect(mgr.getKnownAttacks()).toHaveLength(12);
  });
  it('getTotalFindings', () => {
    const mgr = new BlockchainSecurityManager();
    mgr.addFinding(createBlockchainFinding());
    expect(mgr.getTotalFindings()).toBe(1);
  });
});

// ─── BlockchainCoordinator ─────────────────────────────────────
describe('BlockchainCoordinator', () => {
  it('composes all managers', () => {
    const coord = new BlockchainCoordinator();
    expect(coord.blocks).toBeInstanceOf(BlockManager);
    expect(coord.transactions).toBeInstanceOf(TransactionManager);
    expect(coord.smartContracts).toBeInstanceOf(SmartContractManager);
    expect(coord.protocols).toBeInstanceOf(DeFiProtocolManager);
    expect(coord.nfts).toBeInstanceOf(NftManager);
    expect(coord.bridges).toBeInstanceOf(BridgeManager);
    expect(coord.security).toBeInstanceOf(BlockchainSecurityManager);
  });
  it('getStats returns zeros for empty coordinator', () => {
    const coord = new BlockchainCoordinator();
    const stats = coord.getStats();
    expect(stats.blockCount).toBe(0);
    expect(stats.transactionCount).toBe(0);
    expect(stats.contractCount).toBe(0);
    expect(stats.protocolCount).toBe(0);
    expect(stats.nftCount).toBe(0);
    expect(stats.bridgeCount).toBe(0);
    expect(stats.findingCount).toBe(0);
  });
  it('getStats reflects added resources', () => {
    const coord = new BlockchainCoordinator();
    coord.addBlock(createBlock());
    coord.addTransaction(createTransaction());
    coord.deployContract(createSmartContract());
    const stats = coord.getStats();
    expect(stats.blockCount).toBe(1);
    expect(stats.transactionCount).toBe(1);
    expect(stats.contractCount).toBe(1);
  });
  it('addBlock / getBlock / listBlocks', () => {
    const coord = new BlockchainCoordinator();
    const b = createBlock();
    coord.addBlock(b);
    expect(coord.getBlock(b.id)).toEqual(b);
    expect(coord.listBlocks()).toHaveLength(1);
  });
  it('addTransaction / getTransaction', () => {
    const coord = new BlockchainCoordinator();
    const t = createTransaction();
    coord.addTransaction(t);
    expect(coord.getTransaction(t.id)).toEqual(t);
  });
  it('deployContract / getContract', () => {
    const coord = new BlockchainCoordinator();
    const c = createSmartContract();
    coord.deployContract(c);
    expect(coord.getContract(c.id)).toEqual(c);
  });
  it('registerProtocol / getProtocol', () => {
    const coord = new BlockchainCoordinator();
    const p = createDeFiProtocol();
    coord.registerProtocol(p);
    expect(coord.getProtocol(p.id)).toEqual(p);
  });
  it('mintNft / getNft', () => {
    const coord = new BlockchainCoordinator();
    const n = createNft();
    coord.mintNft(n);
    expect(coord.getNft(n.id)).toEqual(n);
  });
  it('registerBridge / getBridge', () => {
    const coord = new BlockchainCoordinator();
    const b = createBridge();
    coord.registerBridge(b);
    expect(coord.getBridge(b.id)).toEqual(b);
  });
  it('reset clears all managers', () => {
    const coord = new BlockchainCoordinator();
    coord.addBlock(createBlock());
    coord.addTransaction(createTransaction());
    coord.deployContract(createSmartContract());
    coord.registerProtocol(createDeFiProtocol());
    coord.mintNft(createNft());
    coord.registerBridge(createBridge());
    coord.reset();
    const stats = coord.getStats();
    expect(stats.blockCount).toBe(0);
    expect(stats.transactionCount).toBe(0);
    expect(stats.contractCount).toBe(0);
    expect(stats.protocolCount).toBe(0);
    expect(stats.nftCount).toBe(0);
    expect(stats.bridgeCount).toBe(0);
  });
  it('dealing with nonexistent IDs returns undefined', () => {
    const coord = new BlockchainCoordinator();
    expect(coord.getBlock('nonexistent' as any)).toBeUndefined();
    expect(coord.getTransaction('nonexistent' as any)).toBeUndefined();
    expect(coord.getContract('nonexistent' as any)).toBeUndefined();
    expect(coord.getProtocol('nonexistent' as any)).toBeUndefined();
    expect(coord.getNft('nonexistent' as any)).toBeUndefined();
    expect(coord.getBridge('nonexistent' as any)).toBeUndefined();
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultBlockchainEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultBlockchainEnvironment();
    const stats = coord.getStats();
    expect(stats.blockCount).toBe(3);
    expect(stats.transactionCount).toBe(8);
    expect(stats.contractCount).toBe(4);
    expect(stats.protocolCount).toBe(3);
    expect(stats.nftCount).toBe(3);
    expect(stats.bridgeCount).toBe(2);
    expect(stats.findingCount).toBe(6);
    expect(stats.unmitigatedFindingCount).toBe(6);
  });
  it('has blocks across multiple chains', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.blocks.filterByChain(BlockchainType.BITCOIN)).toHaveLength(1);
    expect(coord.blocks.filterByChain(BlockchainType.ETHEREUM)).toHaveLength(1);
    expect(coord.blocks.filterByChain(BlockchainType.SOLANA)).toHaveLength(1);
  });
  it('has Bitcoin genesis-like block at height 0', () => {
    const coord = createDefaultBlockchainEnvironment();
    const blocks = coord.blocks.filterByChain(BlockchainType.BITCOIN);
    expect(blocks[0]!.height).toBe(0);
    expect(blocks[0]!.miner).toBe('Satoshi Nakamoto');
  });
  it('has Ethereum block with gas stats', () => {
    const coord = createDefaultBlockchainEnvironment();
    const ethBlocks = coord.blocks.filterByChain(BlockchainType.ETHEREUM);
    expect(ethBlocks[0]!.gasUsed).toBeDefined();
    expect(ethBlocks[0]!.gasLimit).toBeDefined();
    expect(ethBlocks[0]!.uncleCount).toBe(2);
  });
  it('has mix of confirmed, pending, failed, and orphaned transactions', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.transactions.filterByStatus(TransactionStatus.CONFIRMED).length).toBeGreaterThan(0);
    expect(coord.transactions.filterByStatus(TransactionStatus.PENDING).length).toBeGreaterThan(0);
    expect(coord.transactions.filterByStatus(TransactionStatus.FAILED).length).toBeGreaterThan(0);
    expect(coord.transactions.filterByStatus(TransactionStatus.REVERTED).length).toBeGreaterThan(0);
    expect(coord.transactions.filterByStatus(TransactionStatus.ORPHANED).length).toBeGreaterThan(0);
  });
  it('has transactions across multiple chains', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.transactions.filterByChain(BlockchainType.BITCOIN).length).toBe(1);
    expect(coord.transactions.filterByChain(BlockchainType.ETHEREUM).length).toBeGreaterThan(0);
    expect(coord.transactions.filterByChain(BlockchainType.SOLANA).length).toBe(1);
    expect(coord.transactions.filterByChain(BlockchainType.POLYGON).length).toBe(1);
    expect(coord.transactions.filterByChain(BlockchainType.ARBITRUM).length).toBe(1);
    expect(coord.transactions.filterByChain(BlockchainType.BSC).length).toBe(1);
  });
  it('has smart contracts with diverse characteristics', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.smartContracts.filterSourceVerified()).toHaveLength(3);
    expect(coord.smartContracts.filterUnverified()).toHaveLength(1);
    expect(coord.smartContracts.filterByVulnerability(SmartContractVulnerability.REENTRANCY)).toHaveLength(1);
    expect(coord.smartContracts.filterByVulnerability(SmartContractVulnerability.ORACLE_MANIPULATION)).toHaveLength(1);
  });
  it('has a vulnerable contract with multiple vulnerabilities', () => {
    const coord = createDefaultBlockchainEnvironment();
    const vulnContracts = coord.smartContracts.filterByVulnerability(SmartContractVulnerability.REENTRANCY);
    expect(vulnContracts[0]!.vulnerabilities.length).toBeGreaterThanOrEqual(3);
    expect(vulnContracts[0]!.sourceVerified).toBe(false);
  });
  it('has DeFi protocols of different types', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.protocols.filterByType(DeFiProtocolType.DEX)).toHaveLength(1);
    expect(coord.protocols.filterByType(DeFiProtocolType.LENDING)).toHaveLength(1);
    expect(coord.protocols.filterByType(DeFiProtocolType.STABLECOIN)).toHaveLength(1);
  });
  it('has DeFi protocols with varying TVLs and security scores', () => {
    const coord = createDefaultBlockchainEnvironment();
    const protocols = coord.protocols.list();
    expect(protocols.filter(p => p.tvl > 0).length).toBe(3);
    expect(coord.protocols.filterByMinSecurityScore(80)).toHaveLength(2);
    expect(coord.protocols.filterByMinTvl(7000000000)).toHaveLength(2);
  });
  it('has some exploited protocols', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.protocols.filterExploited().length).toBeGreaterThan(0);
  });
  it('has NFTs across collections and standards', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.nfts.filterByCollection('cryptopunks')).toHaveLength(1);
    expect(coord.nfts.filterByCollection('boredapeyachtclub')).toHaveLength(1);
    expect(coord.nfts.filterByCollection('artblocks')).toHaveLength(1);
    expect(coord.nfts.filterByStandard('ERC721')).toHaveLength(2);
    expect(coord.nfts.filterByStandard('ERC1155')).toHaveLength(1);
  });
  it('has manipulated NFT metadata', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.nfts.filterManipulated()).toHaveLength(1);
  });
  it('has bridges with different statuses and types', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.bridges.filterByStatus(BridgeStatus.ACTIVE)).toHaveLength(2);
    expect(coord.bridges.filterByType('LOCK_MINT')).toHaveLength(1);
    expect(coord.bridges.filterByType('LIQUIDITY_NETWORK')).toHaveLength(1);
  });
  it('has a bridge with security incidents', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.bridges.filterHasIncidents()).toHaveLength(1);
    const bridges = coord.bridges.list();
    const wormholeBridge = bridges.find(b => b.name === 'Wormhole');
    expect(wormholeBridge).toBeDefined();
    expect(wormholeBridge!.securityIncidents.length).toBe(1);
  });
  it('has unmitigated security findings', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.security.filterFindingsUnmitigated().length).toBe(6);
    expect(coord.security.filterFindingsBySeverity('critical')).toHaveLength(2);
    expect(coord.security.filterFindingsBySeverity('high')).toHaveLength(3);
    expect(coord.security.filterFindingsBySeverity('medium')).toHaveLength(1);
  });
  it('loads known attacks', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.security.getKnownAttacks()).toHaveLength(12);
  });
  it('has pending transactions', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.transactions.filterPending()).toHaveLength(1);
  });
  it('has failed or reverted transactions', () => {
    const coord = createDefaultBlockchainEnvironment();
    expect(coord.transactions.filterFailed()).toHaveLength(2);
  });
});
