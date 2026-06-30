import { describe, it, expect } from 'vitest';
import {
  CloudAccountManager, createDefaultCloudEnvironment,
  CloudProvider, InstanceState, StorageAccess, IamEffect,
  FindingSeverity, FindingCategory, AuditEventSource,
  cloudAccountId, cloudRegionId, cloudVpcId, cloudSubnetId,
  cloudSecurityGroupId, cloudInstanceId, cloudStorageId,
  cloudFunctionId, cloudRoleId, cloudPolicyId, cloudUserId,
  cloudClusterId, cloudAuditEventId, cloudFindingId,
  cloudLoadBalancerId, cloudDatabaseId, cloudQueueId, cloudEndpointId,
  createAwsAccount, createAwsRegion, createVpc, createSubnet,
  createSecurityGroup, createSecurityGroupRule,
  createInstance, createStorageBucket, createLambdaFunction,
  createRdsInstance, createLoadBalancer,
  createIamPolicy, createIamRole, createIamUser,
  createK8sCluster, createK8sNamespace, createK8sPod, createK8sService,
  createSecurityFinding, createAuditEvent,
  assessSecurityGroup, assessStorageBucket, assessInstance, assessK8sPod,
  calculateSecurityScore,
  COMMON_PUBLIC_PORTS, WELL_KNOWN_ADMIN_ACTIONS,
} from '../index';

describe('Branded IDs', () => {
  it('generates unique IDs with correct prefixes', () => {
    expect(cloudAccountId()).toMatch(/^acct-/);
    expect(cloudRegionId()).toMatch(/^rgn-/);
    expect(cloudVpcId()).toMatch(/^vpc-/);
    expect(cloudSubnetId()).toMatch(/^sub-/);
    expect(cloudSecurityGroupId()).toMatch(/^sg-/);
    expect(cloudInstanceId()).toMatch(/^i-/);
    expect(cloudStorageId()).toMatch(/^s3-/);
    expect(cloudFunctionId()).toMatch(/^fn-/);
    expect(cloudRoleId()).toMatch(/^role-/);
    expect(cloudPolicyId()).toMatch(/^pol-/);
    expect(cloudUserId()).toMatch(/^cusr-/);
    expect(cloudClusterId()).toMatch(/^cls-/);
    expect(cloudAuditEventId()).toMatch(/^evt-/);
    expect(cloudFindingId()).toMatch(/^fnd-/);
    expect(cloudLoadBalancerId()).toMatch(/^lb-/);
    expect(cloudDatabaseId()).toMatch(/^db-/);
    expect(cloudQueueId()).toMatch(/^q-/);
    expect(cloudEndpointId()).toMatch(/^ep-/);
  });

  it('generates unique values', () => {
    const ids = Array.from({ length: 10 }, () => cloudAccountId());
    expect(new Set(ids).size).toBe(10);
  });
});

describe('CloudAccountManager - Account & Regions', () => {
  let manager: CloudAccountManager;

  beforeEach(() => {
    manager = new CloudAccountManager();
  });

  it('creates and lists accounts', () => {
    manager.createAccount('123456789012', 'prod');
    manager.createAccount('210987654321', 'staging');
    expect(manager.listAccounts()).toHaveLength(2);
  });

  it('creates regions', () => {
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    expect(rgn.name).toBe('us-east-1');
    expect(manager.listRegions()).toHaveLength(1);
    expect(acct.regions).toContain(rgn.id);
  });

  it('removes accounts', () => {
    const acct = manager.createAccount('123', 'prod');
    expect(manager.removeAccount(acct.id)).toBe(true);
    expect(manager.listAccounts()).toHaveLength(0);
  });
});

describe('CloudAccountManager - VPC & Subnets', () => {
  let manager: CloudAccountManager;
  let rgnId: ReturnType<typeof cloudRegionId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    rgnId = rgn.id;
  });

  it('creates VPCs', () => {
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgnId);
    expect(vpc.name).toBe('prod-vpc');
    expect(manager.listVpcs()).toHaveLength(1);
  });

  it('creates subnets', () => {
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgnId);
    const sub = manager.createSubnet('public-a', '10.0.1.0/24', vpc.id, 'us-east-1a', true);
    expect(sub.public).toBe(true);
    expect(manager.listSubnetsByVpc(vpc.id)).toHaveLength(1);
  });

  it('lists VPCs by region', () => {
    const vpc1 = manager.createVpc('vpc1', '10.0.0.0/16', rgnId);
    const vpc2 = manager.createVpc('vpc2', '10.1.0.0/16', rgnId);
    expect(manager.listVpcsByRegion(rgnId)).toHaveLength(2);
  });
});

describe('CloudAccountManager - Security Groups', () => {
  let manager: CloudAccountManager;
  let vpcId: ReturnType<typeof cloudVpcId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgn.id);
    vpcId = vpc.id;
  });

  it('creates and adds rules', () => {
    const sg = manager.createSecurityGroup('web-sg', 'Web SG', vpcId);
    expect(manager.listSecurityGroups()).toHaveLength(1);

    manager.addInboundRule(sg.id, createSecurityGroupRule('tcp', 443, ['0.0.0.0/0']));
    expect(manager.getSecurityGroup(sg.id)!.inboundRules).toHaveLength(1);
    expect(manager.getSecurityGroup(sg.id)!.outboundRules).toHaveLength(1);
  });
});

describe('CloudAccountManager - Compute', () => {
  let manager: CloudAccountManager;
  let vpcId: ReturnType<typeof cloudVpcId>;
  let subId: ReturnType<typeof cloudSubnetId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgn.id);
    vpcId = vpc.id;
    subId = manager.createSubnet('sub', '10.0.1.0/24', vpc.id, 'us-east-1a').id;
  });

  it('creates and lists instances', () => {
    const inst = manager.createInstance('web-1', 't3.micro', vpcId, subId);
    expect(inst.name).toBe('web-1');
    expect(manager.listInstances()).toHaveLength(1);
  });

  it('sets instance state', () => {
    const inst = manager.createInstance('web-1', 't3.micro', vpcId, subId);
    expect(manager.setInstanceState(inst.id, InstanceState.Stopped)).toBe(true);
    expect(manager.getInstance(inst.id)!.state).toBe(InstanceState.Stopped);
  });

  it('lists instances by VPC', () => {
    manager.createInstance('web-1', 't3.micro', vpcId, subId);
    expect(manager.listInstancesByVpc(vpcId)).toHaveLength(1);
  });

  it('removes an instance', () => {
    const inst = manager.createInstance('web-1', 't3.micro', vpcId, subId);
    expect(manager.removeInstance(inst.id)).toBe(true);
    expect(manager.listInstances()).toHaveLength(0);
  });
});

describe('CloudAccountManager - Storage', () => {
  let manager: CloudAccountManager;
  let rgnId: ReturnType<typeof cloudRegionId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    rgnId = rgn.id;
  });

  it('creates and lists buckets', () => {
    manager.createBucket('prod-data', rgnId);
    manager.createBucket('prod-logs', rgnId);
    expect(manager.listBuckets()).toHaveLength(2);
  });

  it('detects public buckets', () => {
    const bucket = manager.createBucket('public-data', rgnId);
    expect(manager.listPublicBuckets()).toHaveLength(0);

    const b = manager.getBucket(bucket.id)!;
    b.access = StorageAccess.PublicRead;
    expect(manager.listPublicBuckets()).toHaveLength(1);
  });
});

describe('CloudAccountManager - Lambda', () => {
  let manager: CloudAccountManager;

  beforeEach(() => {
    manager = new CloudAccountManager();
  });

  it('creates and lists functions', () => {
    manager.createFunction('process-orders', 'nodejs18.x', 'index.handler');
    expect(manager.listFunctions()).toHaveLength(1);
  });
});

describe('CloudAccountManager - RDS', () => {
  let manager: CloudAccountManager;
  let vpcId: ReturnType<typeof cloudVpcId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgn.id);
    vpcId = vpc.id;
  });

  it('creates and lists databases', () => {
    manager.createDatabase('prod-primary', 'postgres', vpcId);
    manager.createDatabase('prod-replica', 'mysql', vpcId);
    expect(manager.listDatabases()).toHaveLength(2);
  });
});

describe('CloudAccountManager - Load Balancers', () => {
  let manager: CloudAccountManager;
  let vpcId: ReturnType<typeof cloudVpcId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgn.id);
    vpcId = vpc.id;
  });

  it('creates and lists load balancers', () => {
    manager.createLoadBalancer('prod-alb', 'application', vpcId, 'internet_facing');
    expect(manager.listLoadBalancers()).toHaveLength(1);
  });
});

describe('CloudAccountManager - IAM', () => {
  let manager: CloudAccountManager;

  beforeEach(() => {
    manager = new CloudAccountManager();
  });

  it('creates roles and policies', () => {
    const role = manager.createRole('AdminRole', '{"Version":"2012-10-17","Statement":[]}');
    const policy = manager.createPolicy('AdminAccess', IamEffect.Allow, ['*']);
    expect(manager.listRoles()).toHaveLength(1);
    expect(manager.listPolicies()).toHaveLength(1);

    manager.attachPolicyToRole(role.id, policy.id);
    expect(manager.getRole(role.id)!.managedPolicies).toContain(policy.id);
  });

  it('creates users', () => {
    manager.createUser('john.doe', 'arn:aws:iam::123:user/john.doe');
    expect(manager.listUsers()).toHaveLength(1);
  });
});

describe('CloudAccountManager - Kubernetes', () => {
  let manager: CloudAccountManager;
  let rgnId: ReturnType<typeof cloudRegionId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    rgnId = rgn.id;
  });

  it('creates and manages clusters', () => {
    const cls = manager.createCluster('prod-eks', CloudProvider.AWS, rgnId);
    expect(manager.listClusters()).toHaveLength(1);

    const ns = createK8sNamespace('production');
    manager.addNamespaceToCluster(cls.id, ns);
    expect(manager.getCluster(cls.id)!.namespaces).toHaveLength(1);

    const pod = createK8sPod('web', 'production', ['nginx']);
    manager.addPodToCluster(cls.id, pod);
    expect(manager.getCluster(cls.id)!.pods).toHaveLength(1);

    const svc = createK8sService('web-svc', 'production', 'ClusterIP', [{ port: 80, targetPort: 80, protocol: 'TCP' }]);
    manager.addServiceToCluster(cls.id, svc);
    expect(manager.getCluster(cls.id)!.services).toHaveLength(1);

    manager.removeCluster(cls.id);
    expect(manager.listClusters()).toHaveLength(0);
  });

  it('creates K8s service with correct defaults', () => {
    const svc = createK8sService('lb', 'default', 'LoadBalancer', [{ port: 443, targetPort: 443, protocol: 'TCP' }]);
    expect(svc.externalIp).toBe('203.0.113.1');
  });
});

describe('CloudAccountManager - Audit & Findings', () => {
  let manager: CloudAccountManager;

  beforeEach(() => {
    manager = new CloudAccountManager();
  });

  it('adds and retrieves audit events', () => {
    const acct = manager.createAccount('123', 'prod');
    const event = createAuditEvent('ConsoleLogin', 'signin.amazonaws.com', 'john', '1.2.3.4', CloudProvider.AWS, acct.id);
    manager.addAuditEvent(event);
    expect(manager.getAuditEvents()).toHaveLength(1);
    expect(manager.getAuditEventsByUser('john')).toHaveLength(1);
  });

  it('adds and filters findings', () => {
    const acct = manager.createAccount('123', 'prod');
    const f1 = createSecurityFinding('Critical finding', 'desc', FindingSeverity.Critical, FindingCategory.NetworkExposure, CloudProvider.AWS, acct.id);
    const f2 = createSecurityFinding('Low finding', 'desc', FindingSeverity.Low, FindingCategory.LoggingDisabled, CloudProvider.AWS, acct.id);
    manager.addFinding(f1);
    manager.addFinding(f2);

    expect(manager.getFindings()).toHaveLength(2);
    expect(manager.getFindingsBySeverity(FindingSeverity.Critical)).toHaveLength(1);
    expect(manager.getFindingsByCategory(FindingCategory.LoggingDisabled)).toHaveLength(1);
  });

  it('mitigates findings', () => {
    const acct = manager.createAccount('123', 'prod');
    const f = createSecurityFinding('Test', 'desc', FindingSeverity.Medium, FindingCategory.IamMisconfiguration, CloudProvider.AWS, acct.id);
    manager.addFinding(f);
    expect(manager.mitigateFinding(f.id)).toBe(true);
    expect(manager.getUnmitigatedFindings()).toHaveLength(0);
  });
});

describe('CloudAccountManager - Security Assessment', () => {
  let manager: CloudAccountManager;
  let rgnId: ReturnType<typeof cloudRegionId>;
  let vpcId: ReturnType<typeof cloudVpcId>;
  let subId: ReturnType<typeof cloudSubnetId>;

  beforeEach(() => {
    manager = new CloudAccountManager();
    const acct = manager.createAccount('123', 'prod');
    const rgn = manager.createRegion('us-east-1', 'US East', acct.id);
    rgnId = rgn.id;
    const vpc = manager.createVpc('prod-vpc', '10.0.0.0/16', rgn.id);
    vpcId = vpc.id;
    subId = manager.createSubnet('sub', '10.0.1.0/24', vpc.id, 'us-east-1a').id;
  });

  it('finds public SSH exposure', () => {
    const sg = manager.createSecurityGroup('ssh-sg', 'SSH SG', vpcId);
    manager.addInboundRule(sg.id, createSecurityGroupRule('tcp', 22, ['0.0.0.0/0']));
    const findings = manager.runSecurityAssessment();
    expect(findings.some((f) => f.title.includes('SSH'))).toBe(true);
  });

  it('finds open database ports', () => {
    const sg = manager.createSecurityGroup('db-sg', 'DB SG', vpcId);
    manager.addInboundRule(sg.id, createSecurityGroupRule('tcp', 3306, ['0.0.0.0/0']));
    const findings = manager.runSecurityAssessment();
    expect(findings.some((f) => f.title.includes('3306'))).toBe(true);
  });

  it('assesses storage buckets for exposure', () => {
    const bucket = manager.createBucket('public-data', rgnId);
    const b = manager.getBucket(bucket.id)!;
    b.access = StorageAccess.PublicRead;
    const findings = manager.runSecurityAssessment();
    expect(findings.some((f) => f.category === FindingCategory.StorageExposure)).toBe(true);
  });

  it('assesses instances for missing encryption', () => {
    manager.createInstance('web-1', 't3.micro', vpcId, subId);
    const findings = manager.runSecurityAssessment();
    expect(findings.some((f) => f.category === FindingCategory.EncryptionDisabled)).toBe(true);
  });

  it('returns stats after assessment', () => {
    const sg = manager.createSecurityGroup('ssh-sg', 'SSH SG', vpcId);
    manager.addInboundRule(sg.id, createSecurityGroupRule('tcp', 22, ['0.0.0.0/0']));
    manager.runSecurityAssessment();
    const stats = manager.getStats();
    expect(stats.findings).toBeGreaterThan(0);
    expect(stats.highFindings).toBeGreaterThanOrEqual(0);
  });
});

describe('Security assessment functions', () => {
  it('assessSecurityGroup returns null for non-public rule', () => {
    const rule = createSecurityGroupRule('tcp', 22, ['10.0.0.0/8']);
    expect(assessSecurityGroup(rule)).toBeNull();
  });

  it('assessSecurityGroup returns Critical for all-traffic', () => {
    const rule = createSecurityGroupRule('-1', 0, ['0.0.0.0/0']);
    const finding = assessSecurityGroup(rule);
    expect(finding).not.toBeNull();
    expect(finding!.severity).toBe(FindingSeverity.Critical);
  });

  it('assessStorageBucket returns findings for public bucket', () => {
    const acctId = cloudAccountId();
    const rgnId = cloudRegionId();
    const bucket = createStorageBucket('test-bucket', rgnId);
    bucket.access = StorageAccess.PublicRead;
    const findings = assessStorageBucket(bucket);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.some((f) => f.category === FindingCategory.StorageExposure)).toBe(true);
  });

  it('assessInstance finds missing encryption', () => {
    const vpcId = cloudVpcId();
    const subId = cloudSubnetId();
    const inst = createInstance('test', 't3.micro', vpcId, subId, { encryptionAtRest: false });
    const findings = assessInstance(inst);
    expect(findings.some((f) => f.category === FindingCategory.EncryptionDisabled)).toBe(true);
  });

  it('assessK8sPod finds privileged issues', () => {
    const pod = createK8sPod('bad-pod', 'default', ['evil'], { privileged: true });
    const findings = assessK8sPod(pod);
    expect(findings.some((f) => f.severity === FindingSeverity.Critical)).toBe(true);
  });

  it('assessK8sPod finds host network issues', () => {
    const pod = createK8sPod('host-net-pod', 'default', ['agent'], { hostNetwork: true });
    const findings = assessK8sPod(pod);
    expect(findings.some((f) => f.category === FindingCategory.K8sMisconfiguration)).toBe(true);
  });
});

describe('Security score', () => {
  it('calculates perfect score with no findings', () => {
    const score = calculateSecurityScore([]);
    expect(score.overall).toBe(100);
    expect(score.findingCount).toBe(0);
  });

  it('penalizes for critical findings', () => {
    const acctId = cloudAccountId();
    const findings = [
      createSecurityFinding('Critical', 'desc', FindingSeverity.Critical, FindingCategory.NetworkExposure, CloudProvider.AWS, acctId),
    ];
    const score = calculateSecurityScore(findings);
    expect(score.overall).toBe(85);
  });

  it('penalizes for mixed findings', () => {
    const acctId = cloudAccountId();
    const findings = [
      createSecurityFinding('C', 'desc', FindingSeverity.Critical, FindingCategory.NetworkExposure, CloudProvider.AWS, acctId),
      createSecurityFinding('H', 'desc', FindingSeverity.High, FindingCategory.EncryptionDisabled, CloudProvider.AWS, acctId),
      createSecurityFinding('M', 'desc', FindingSeverity.Medium, FindingCategory.LoggingDisabled, CloudProvider.AWS, acctId),
      createSecurityFinding('L', 'desc', FindingSeverity.Low, FindingCategory.LoggingDisabled, CloudProvider.AWS, acctId),
    ];
    const score = calculateSecurityScore(findings);
    expect(score.overall).toBe(74);
    expect(score.criticalCount).toBe(1);
    expect(score.highCount).toBe(1);
    expect(score.mediumCount).toBe(1);
    expect(score.lowCount).toBe(1);
  });
});

describe('Factory functions', () => {
  it('creates AwsAccount', () => {
    const acct = createAwsAccount('123456789012', 'prod');
    expect(acct.accountId).toBe('123456789012');
  });

  it('creates AwsRegion', () => {
    const rgn = createAwsRegion('us-east-1', 'US East');
    expect(rgn.enabled).toBe(true);
  });

  it('creates VPC', () => {
    const rgnId = cloudRegionId();
    const vpc = createVpc('test-vpc', '10.0.0.0/16', rgnId);
    expect(vpc.cidrBlock).toBe('10.0.0.0/16');
  });

  it('creates Subnet', () => {
    const vpcId = cloudVpcId();
    const sub = createSubnet('test-sub', '10.0.1.0/24', vpcId, 'us-east-1a', true);
    expect(sub.mapPublicIp).toBe(true);
  });

  it('creates SecurityGroup with default outbound rule', () => {
    const vpcId = cloudVpcId();
    const sg = createSecurityGroup('test-sg', 'Test SG', vpcId);
    expect(sg.outboundRules).toHaveLength(1);
  });

  it('creates Instance with defaults', () => {
    const vpcId = cloudVpcId();
    const subId = cloudSubnetId();
    const inst = createInstance('web', 't3.micro', vpcId, subId);
    expect(inst.state).toBe(InstanceState.Running);
    expect(inst.publicIp).toBeNull();
  });

  it('creates StorageBucket', () => {
    const rgnId = cloudRegionId();
    const bucket = createStorageBucket('test-bucket', rgnId);
    expect(bucket.access).toBe(StorageAccess.Private);
  });

  it('creates Lambda function', () => {
    const fn = createLambdaFunction('process', 'nodejs18.x', 'index.handler');
    expect(fn.memory).toBe(128);
  });

  it('creates RDS instance', () => {
    const vpcId = cloudVpcId();
    const db = createRdsInstance('primary', 'mysql', vpcId);
    expect(db.port).toBe(3306);
  });

  it('creates LoadBalancer', () => {
    const vpcId = cloudVpcId();
    const lb = createLoadBalancer('alb', 'application', vpcId, 'internet_facing');
    expect(lb.scheme).toBe('internet_facing');
  });

  it('creates IAM policy', () => {
    const policy = createIamPolicy('ReadOnly', IamEffect.Allow, ['ec2:Describe*']);
    expect(policy.effect).toBe(IamEffect.Allow);
    expect(policy.actions).toContain('ec2:Describe*');
  });

  it('creates IAM role', () => {
    const role = createIamRole('AdminRole', '{}');
    expect(role.managedPolicies).toEqual([]);
  });

  it('creates IAM user', () => {
    const user = createIamUser('jdoe', 'arn:aws:iam::123:user/jdoe');
    expect(user.mfaEnabled).toBe(false);
  });

  it('creates K8s cluster', () => {
    const rgnId = cloudRegionId();
    const cls = createK8sCluster('prod-cluster', CloudProvider.AWS, rgnId);
    expect(cls.version).toBe('1.28');
    expect(cls.nodeCount).toBe(3);
  });

  it('creates K8s pod with defaults', () => {
    const pod = createK8sPod('test-pod', 'default', ['nginx']);
    expect(pod.runAsRoot).toBe(true);
    expect(pod.privileged).toBe(false);
  });

  it('creates audit event', () => {
    const acctId = cloudAccountId();
    const evt = createAuditEvent('ConsoleLogin', 'signin', 'user', '1.2.3.4', CloudProvider.AWS, acctId);
    expect(evt.eventName).toBe('ConsoleLogin');
  });

  it('creates security finding', () => {
    const acctId = cloudAccountId();
    const f = createSecurityFinding('Test', 'desc', FindingSeverity.High, FindingCategory.NetworkExposure, CloudProvider.AWS, acctId);
    expect(f.severity).toBe(FindingSeverity.High);
    expect(f.mitigated).toBe(false);
  });
});

describe('createDefaultCloudEnvironment', () => {
  it('creates a fully populated environment', () => {
    const env = createDefaultCloudEnvironment();
    const stats = env.getStats();

    expect(stats.accounts).toBe(1);
    expect(stats.regions).toBeGreaterThanOrEqual(3);
    expect(stats.vpcs).toBeGreaterThanOrEqual(2);
    expect(stats.subnets).toBeGreaterThanOrEqual(3);
    expect(stats.securityGroups).toBeGreaterThanOrEqual(2);
    expect(stats.computeInstances).toBeGreaterThanOrEqual(3);
    expect(stats.storageBuckets).toBeGreaterThanOrEqual(2);
    expect(stats.functions).toBeGreaterThanOrEqual(2);
    expect(stats.databases).toBeGreaterThanOrEqual(2);
    expect(stats.loadBalancers).toBeGreaterThanOrEqual(1);
    expect(stats.iamRoles).toBeGreaterThanOrEqual(2);
    expect(stats.iamUsers).toBeGreaterThanOrEqual(2);
    expect(stats.iamPolicies).toBeGreaterThanOrEqual(2);
    expect(stats.clusters).toBeGreaterThanOrEqual(1);
    expect(stats.pods).toBeGreaterThanOrEqual(2);
    expect(stats.auditEvents).toBeGreaterThanOrEqual(2);
  });
});

describe('Constants', () => {
  it('COMMON_PUBLIC_PORTS includes well-known ports', () => {
    expect(COMMON_PUBLIC_PORTS.SSH).toBe(22);
    expect(COMMON_PUBLIC_PORTS.HTTP).toBe(80);
    expect(COMMON_PUBLIC_PORTS.KubernetesAPI).toBe(6443);
  });

  it('WELL_KNOWN_ADMIN_ACTIONS includes privileged operations', () => {
    expect(WELL_KNOWN_ADMIN_ACTIONS).toContain('iam:CreateUser');
    expect(WELL_KNOWN_ADMIN_ACTIONS).toContain('iam:PassRole');
    expect(WELL_KNOWN_ADMIN_ACTIONS).toContain('s3:PutBucketPolicy');
  });
});
