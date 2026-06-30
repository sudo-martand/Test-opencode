import { uid } from '@cybersim/shared';

/* ── Branded IDs ── */

export type CloudAccountId = string & { readonly __brand: unique symbol };
export type CloudRegionId = string & { readonly __brand: unique symbol };
export type CloudVpcId = string & { readonly __brand: unique symbol };
export type CloudSubnetId = string & { readonly __brand: unique symbol };
export type CloudSecurityGroupId = string & { readonly __brand: unique symbol };
export type CloudInstanceId = string & { readonly __brand: unique symbol };
export type CloudStorageId = string & { readonly __brand: unique symbol };
export type CloudFunctionId = string & { readonly __brand: unique symbol };
export type CloudRoleId = string & { readonly __brand: unique symbol };
export type CloudPolicyId = string & { readonly __brand: unique symbol };
export type CloudUserId = string & { readonly __brand: unique symbol };
export type CloudClusterId = string & { readonly __brand: unique symbol };
export type CloudSecretId = string & { readonly __brand: unique symbol };
export type CloudAuditEventId = string & { readonly __brand: unique symbol };
export type CloudFindingId = string & { readonly __brand: unique symbol };
export type CloudLoadBalancerId = string & { readonly __brand: unique symbol };
export type CloudDatabaseId = string & { readonly __brand: unique symbol };
export type CloudQueueId = string & { readonly __brand: unique symbol };
export type CloudEndpointId = string & { readonly __brand: unique symbol };

export function cloudAccountId(): CloudAccountId { return `acct-${uid()}` as CloudAccountId; }
export function cloudRegionId(): CloudRegionId { return `rgn-${uid()}` as CloudRegionId; }
export function cloudVpcId(): CloudVpcId { return `vpc-${uid()}` as CloudVpcId; }
export function cloudSubnetId(): CloudSubnetId { return `sub-${uid()}` as CloudSubnetId; }
export function cloudSecurityGroupId(): CloudSecurityGroupId { return `sg-${uid()}` as CloudSecurityGroupId; }
export function cloudInstanceId(): CloudInstanceId { return `i-${uid()}` as CloudInstanceId; }
export function cloudStorageId(): CloudStorageId { return `s3-${uid()}` as CloudStorageId; }
export function cloudFunctionId(): CloudFunctionId { return `fn-${uid()}` as CloudFunctionId; }
export function cloudRoleId(): CloudRoleId { return `role-${uid()}` as CloudRoleId; }
export function cloudPolicyId(): CloudPolicyId { return `pol-${uid()}` as CloudPolicyId; }
export function cloudUserId(): CloudUserId { return `cusr-${uid()}` as CloudUserId; }
export function cloudClusterId(): CloudClusterId { return `cls-${uid()}` as CloudClusterId; }
export function cloudSecretId(): CloudSecretId { return `sec-${uid()}` as CloudSecretId; }
export function cloudAuditEventId(): CloudAuditEventId { return `evt-${uid()}` as CloudAuditEventId; }
export function cloudFindingId(): CloudFindingId { return `fnd-${uid()}` as CloudFindingId; }
export function cloudLoadBalancerId(): CloudLoadBalancerId { return `lb-${uid()}` as CloudLoadBalancerId; }
export function cloudDatabaseId(): CloudDatabaseId { return `db-${uid()}` as CloudDatabaseId; }
export function cloudQueueId(): CloudQueueId { return `q-${uid()}` as CloudQueueId; }
export function cloudEndpointId(): CloudEndpointId { return `ep-${uid()}` as CloudEndpointId; }

/* ── Enums ── */

export enum CloudProvider {
  AWS = 'aws',
  Azure = 'azure',
  GCP = 'gcp',
  MultiCloud = 'multi_cloud',
}

export enum InstanceState {
  Running = 'running',
  Stopped = 'stopped',
  Terminated = 'terminated',
  Pending = 'pending',
  Stopping = 'stopping',
  Rebooting = 'rebooting',
  Unknown = 'unknown',
}

export enum StorageClass {
  Standard = 'standard',
  InfrequentAccess = 'infrequent_access',
  Glacier = 'glacier',
  DeepArchive = 'deep_archive',
  Coldline = 'coldline',
  Archive = 'archive',
  Nearline = 'nearline',
}

export enum StorageAccess {
  Private = 'private',
  PublicRead = 'public_read',
  PublicReadWrite = 'public_read_write',
  BucketOnly = 'bucket_only',
  AuthenticatedRead = 'authenticated_read',
}

export enum IamEffect {
  Allow = 'allow',
  Deny = 'deny',
}

export enum AuditEventSource {
  CloudTrail = 'cloud_trail',
  GuardDuty = 'guard_duty',
  SecurityHub = 'security_hub',
  Config = 'config',
  Inspector = 'inspector',
  AzureActivityLog = 'azure_activity_log',
  AzureDefender = 'azure_defender',
  AzureSentinel = 'azure_sentinel',
  GcpAuditLog = 'gcp_audit_log',
  GcpSecurityCommandCenter = 'gcp_security_command_center',
  K8sAudit = 'k8s_audit',
  Falco = 'falco',
  KubeBench = 'kube_bench',
  KubeHunter = 'kube_hunter',
  Trivy = 'trivy',
}

export enum FindingSeverity {
  Informational = 'informational',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export enum FindingCategory {
  IamMisconfiguration = 'iam_misconfiguration',
  StorageExposure = 'storage_exposure',
  NetworkExposure = 'network_exposure',
  ComputeVulnerability = 'compute_vulnerability',
  K8sMisconfiguration = 'k8s_misconfiguration',
  DataExposure = 'data_exposure',
  CredentialLeak = 'credential_leak',
  CryptoMisuse = 'crypto_misuse',
  LoggingDisabled = 'logging_disabled',
  EncryptionDisabled = 'encryption_disabled',
  PublicAccess = 'public_access',
  CrossAccountAccess = 'cross_account_access',
  PrivilegeEscalation = 'privilege_escalation',
  Backdoor = 'backdoor',
  SuspiciousActivity = 'suspicious_activity',
  ContainerEscape = 'container_escape',
  Malware = 'malware',
  Exfiltration = 'exfiltration',
  BruteForce = 'brute_force',
}

export enum KubernetesResourceType {
  Pod = 'pod',
  Deployment = 'deployment',
  Service = 'service',
  Ingress = 'ingress',
  ConfigMap = 'config_map',
  Secret = 'secret',
  Namespace = 'namespace',
  Node = 'node',
  ClusterRole = 'cluster_role',
  ClusterRoleBinding = 'cluster_role_binding',
  ServiceAccount = 'service_account',
  NetworkPolicy = 'network_policy',
  PodSecurityPolicy = 'pod_security_policy',
  Role = 'role',
  RoleBinding = 'role_binding',
  DaemonSet = 'daemon_set',
  StatefulSet = 'stateful_set',
  Job = 'job',
  CronJob = 'cron_job',
  PersistentVolume = 'persistent_volume',
  PersistentVolumeClaim = 'persistent_volume_claim',
  HorizontalPodAutoscaler = 'horizontal_pod_autoscaler',
  PodDisruptionBudget = 'pod_disruption_budget',
}

export enum CloudServiceCategory {
  Compute = 'compute',
  Storage = 'storage',
  Database = 'database',
  Networking = 'networking',
  Security = 'security',
  Identity = 'identity',
  Monitoring = 'monitoring',
  Serverless = 'serverless',
  Container = 'container',
  Analytics = 'analytics',
  AI = 'ai',
  IoT = 'iot',
  Messaging = 'messaging',
  CDN = 'cdn',
  DNS = 'dns',
  Secrets = 'secrets',
}

export enum ComplianceFramework {
  SOC2 = 'soc2',
  ISO27001 = 'iso27001',
  PCI_DSS = 'pci_dss',
  HIPAA = 'hipaa',
  GDPR = 'gdpr',
  FedRAMP = 'fedramp',
  CIS = 'cis',
  NIST_CSF = 'nist_csf',
  NIST_800_53 = 'nist_800_53',
  CSA_CCM = 'csa_ccm',
}

/* ── Interfaces: AWS ── */

export interface AwsAccount {
  id: CloudAccountId;
  accountId: string;
  alias: string;
  organizationId: string;
  isMaster: boolean;
  regions: CloudRegionId[];
  users: CloudUserId[];
  roles: CloudRoleId[];
  policies: CloudPolicyId[];
}

export interface AwsRegion {
  id: CloudRegionId;
  name: string;
  fullName: string;
  enabled: boolean;
  vpcs: CloudVpcId[];
}

export interface AwsVpc {
  id: CloudVpcId;
  name: string;
  cidrBlock: string;
  region: CloudRegionId;
  internetGateway: boolean;
  vpcFlowLogs: boolean;
  subnets: CloudSubnetId[];
  securityGroups: CloudSecurityGroupId[];
  instances: CloudInstanceId[];
  loadBalancers: CloudLoadBalancerId[];
  databases: CloudDatabaseId[];
  tags: Record<string, string>;
}

export interface AwsSubnet {
  id: CloudSubnetId;
  name: string;
  cidrBlock: string;
  vpcId: CloudVpcId;
  availabilityZone: string;
  public: boolean;
  mapPublicIp: boolean;
}

export interface AwsSecurityGroup {
  id: CloudSecurityGroupId;
  name: string;
  description: string;
  vpcId: CloudVpcId;
  inboundRules: SecurityGroupRule[];
  outboundRules: SecurityGroupRule[];
  tags: Record<string, string>;
}

export interface SecurityGroupRule {
  protocol: string;
  portRange: [number, number];
  cidrBlocks: string[];
  securityGroupId: string | null;
  description: string;
}

export interface AwsInstance {
  id: CloudInstanceId;
  name: string;
  instanceType: string;
  vpcId: CloudVpcId;
  subnetId: CloudSubnetId;
  privateIp: string;
  publicIp: string | null;
  state: InstanceState;
  ami: string;
  securityGroups: CloudSecurityGroupId[];
  iamRole: CloudRoleId | null;
  keyPair: string;
  launchTime: Date;
  publicIpAutoAssign: boolean;
  encryptionAtRest: boolean;
  detailedMonitoring: boolean;
  tags: Record<string, string>;
}

export interface AwsStorageBucket {
  id: CloudStorageId;
  name: string;
  region: CloudRegionId;
  access: StorageAccess;
  versioning: boolean;
  encryption: boolean;
  logging: boolean;
  publicBlocks: boolean;
  objectCount: number;
  sizeBytes: number;
  lifecycleRules: number;
  tags: Record<string, string>;
}

export interface AwsLambdaFunction {
  id: CloudFunctionId;
  name: string;
  runtime: string;
  handler: string;
  memory: number;
  timeout: number;
  iamRole: CloudRoleId | null;
  vpcConfig: boolean;
  vpcId: CloudVpcId | null;
  environmentVariables: Record<string, string>;
  reservedConcurrency: number;
  tracing: boolean;
  lastInvocation: Date | null;
  tags: Record<string, string>;
}

export interface AwsRdsInstance {
  id: CloudDatabaseId;
  name: string;
  engine: string;
  engineVersion: string;
  instanceClass: string;
  vpcId: CloudVpcId;
  subnetIds: CloudSubnetId[];
  storageEncrypted: boolean;
  backupRetentionDays: number;
  multiAz: boolean;
  publiclyAccessible: boolean;
  deletionProtection: boolean;
  autoMinorVersionUpgrade: boolean;
  port: number;
  masterUsername: string;
  tags: Record<string, string>;
}

export interface AwsLoadBalancer {
  id: CloudLoadBalancerId;
  name: string;
  type: 'application' | 'network' | 'gateway';
  vpcId: CloudVpcId;
  subnetIds: CloudSubnetId[];
  securityGroups: CloudSecurityGroupId[];
  deletionProtection: boolean;
  accessLogs: boolean;
  idleTimeout: number;
  scheme: 'internet_facing' | 'internal';
  tags: Record<string, string>;
}

/* ── Interfaces: Identity & Access ── */

export interface IamPolicy {
  id: CloudPolicyId;
  name: string;
  description: string;
  effect: IamEffect;
  actions: string[];
  resources: string[];
  conditions: IamCondition[];
  managed: boolean;
  version: string;
  attachedTo: string[];
}

export interface IamCondition {
  key: string;
  operator: string;
  value: string;
}

export interface IamRole {
  id: CloudRoleId;
  name: string;
  assumeRolePolicy: string;
  managedPolicies: CloudPolicyId[];
  inlinePolicies: IamPolicy[];
  maxSessionDuration: number;
  tags: Record<string, string>;
}

export interface IamUser {
  id: CloudUserId;
  userName: string;
  arn: string;
  groups: string[];
  managedPolicies: CloudPolicyId[];
  inlinePolicies: IamPolicy[];
  accessKeys: IamAccessKey[];
  mfaEnabled: boolean;
  passwordLastUsed: Date | null;
  tags: Record<string, string>;
}

export interface IamAccessKey {
  keyId: string;
  status: 'active' | 'inactive';
  created: Date;
  lastUsed: Date | null;
  rotated: boolean;
}

/* ── Interfaces: Kubernetes ── */

export interface K8sCluster {
  id: CloudClusterId;
  name: string;
  provider: CloudProvider;
  region: CloudRegionId;
  version: string;
  nodeCount: number;
  nodeInstanceType: string;
  networkPlugin: string;
  podCidr: string;
  serviceCidr: string;
  privateCluster: boolean;
  rbacEnabled: boolean;
  podSecurityPolicyEnabled: boolean;
  networkPolicyEnabled: boolean;
  auditLogging: boolean;
  secretsEncryption: boolean;
  oidcEnabled: boolean;
  namespaces: K8sNamespace[];
  nodes: K8sNode[];
  pods: K8sPod[];
  services: K8sService[];
  deployments: K8sDeployment[];
  roles: K8sRole[];
  serviceAccounts: K8sServiceAccount[];
  networkPolicies: K8sNetworkPolicy[];
}

export interface K8sNamespace {
  name: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  status: 'active' | 'terminating';
}

export interface K8sNode {
  name: string;
  instanceType: string;
  internalIp: string;
  externalIp: string | null;
  kubeletVersion: string;
  capacity: { cpu: number; memory: string; pods: number };
  allocatable: { cpu: number; memory: string; pods: number };
  conditions: { type: string; status: string }[];
  labels: Record<string, string>;
  taints: { key: string; value: string; effect: string }[];
}

export interface K8sPod {
  name: string;
  namespace: string;
  nodeName: string;
  serviceAccount: string;
  containers: string[];
  initContainers: string[];
  hostNetwork: boolean;
  hostPid: boolean;
  hostIpc: boolean;
  privileged: boolean;
  runAsRoot: boolean;
  securityContext: Partial<K8sSecurityContext>;
  imagePullPolicy: string;
  restartPolicy: string;
  phase: string;
  labels: Record<string, string>;
}

export interface K8sSecurityContext {
  runAsNonRoot: boolean;
  readOnlyRootFilesystem: boolean;
  allowPrivilegeEscalation: boolean;
  capabilities: { add: string[]; drop: string[] };
  seccompProfile: string;
  appArmorProfile: string;
}

export interface K8sService {
  name: string;
  namespace: string;
  type: string;
  clusterIp: string;
  externalIp: string | null;
  ports: { port: number; targetPort: number; protocol: string }[];
  selector: Record<string, string>;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  replicas: number;
  availableReplicas: number;
  strategy: string;
  containers: string[];
  serviceAccount: string;
  labels: Record<string, string>;
}

export interface K8sRole {
  name: string;
  namespace: string;
  clusterScope: boolean;
  rules: { verbs: string[]; resources: string[]; apiGroups: string[] }[];
}

export interface K8sServiceAccount {
  name: string;
  namespace: string;
  automountToken: boolean;
  secrets: string[];
}

export interface K8sNetworkPolicy {
  name: string;
  namespace: string;
  podSelector: Record<string, string>;
  policyTypes: string[];
  ingress: K8sNetworkPolicyRule[];
  egress: K8sNetworkPolicyRule[];
}

export interface K8sNetworkPolicyRule {
  from: { podSelector?: Record<string, string>; namespaceSelector?: Record<string, string>; ipBlock?: string }[];
  ports: { port: number; protocol: string }[];
}

/* ── Interfaces: Azure ── */

export interface AzureSubscription {
  id: CloudAccountId;
  subscriptionId: string;
  displayName: string;
  tenantId: string;
  resourceGroups: AzureResourceGroup[];
}

export interface AzureResourceGroup {
  name: string;
  region: CloudRegionId;
  resources: string[];
  tags: Record<string, string>;
}

/* ── Interfaces: GCP ── */

export interface GcpProject {
  id: CloudAccountId;
  projectId: string;
  projectNumber: string;
  displayName: string;
  organizationId: string;
  vpcs: CloudVpcId[];
}

/* ── Interfaces: Security & Compliance ── */

export interface AuditEvent {
  id: CloudAuditEventId;
  timestamp: Date;
  source: AuditEventSource;
  provider: CloudProvider;
  accountId: CloudAccountId;
  region: CloudRegionId | null;
  eventName: string;
  eventSource: string;
  userName: string;
  sourceIp: string;
  userAgent: string;
  requestParameters: Record<string, unknown>;
  responseElements: Record<string, unknown>;
  errorCode: string | null;
  errorMessage: string | null;
  resources: { arn: string; type: string }[];
  severity: FindingSeverity;
}

export interface ComplianceControl {
  framework: ComplianceFramework;
  controlId: string;
  controlName: string;
  description: string;
  passed: boolean;
  accountId: CloudAccountId;
}

export interface SecurityFinding {
  id: CloudFindingId;
  timestamp: Date;
  source: AuditEventSource;
  provider: CloudProvider;
  accountId: CloudAccountId;
  region: CloudRegionId | null;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  description: string;
  resourceArn: string;
  resourceType: string;
  remediation: string;
  complianceFrameworks: ComplianceFramework[];
  score: number;
  mitigated: boolean;
}

export interface CloudAuditTrail {
  events: AuditEvent[];
  findings: SecurityFinding[];
  startDate: Date;
  endDate: Date;
  totalEvents: number;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
}

export interface CloudSecurityScore {
  overall: number;
  compute: number;
  storage: number;
  networking: number;
  identity: number;
  logging: number;
  encryption: number;
  k8s: number;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export interface CloudStats {
  accounts: number;
  regions: number;
  vpcs: number;
  subnets: number;
  securityGroups: number;
  computeInstances: number;
  runningInstances: number;
  storageBuckets: number;
  publicBuckets: number;
  functions: number;
  databases: number;
  loadBalancers: number;
  clusters: number;
  pods: number;
  iamRoles: number;
  iamUsers: number;
  iamPolicies: number;
  auditEvents: number;
  findings: number;
  criticalFindings: number;
  highFindings: number;
}

/* ── Security rules ── */

export const COMMON_PUBLIC_PORTS: Record<string, number> = {
  SSH: 22,
  HTTP: 80,
  HTTPS: 443,
  RDP: 3389,
  MySQL: 3306,
  PostgreSQL: 5432,
  MSSQL: 1433,
  MongoDB: 27017,
  Redis: 6379,
  Elasticsearch: 9200,
  Cassandra: 9042,
  Memcached: 11211,
  Docker: 2375,
  KubernetesAPI: 6443,
};

export const WELL_KNOWN_ADMIN_ACTIONS: string[] = [
  'iam:CreateUser',
  'iam:CreateAccessKey',
  'iam:PutUserPolicy',
  'iam:AttachRolePolicy',
  'iam:PassRole',
  'ec2:AuthorizeSecurityGroupIngress',
  'ec2:ModifyInstanceAttribute',
  's3:PutBucketAcl',
  's3:PutBucketPolicy',
  'lambda:UpdateFunctionCode',
  'lambda:InvokeFunction',
  'kms:Decrypt',
  'kms:GenerateDataKey',
  'secretsmanager:GetSecretValue',
  'ssm:SendCommand',
  'eks:UpdateClusterConfig',
  'eks:CreateCluster',
];

/* ── Factory Functions ── */

export function createAwsAccount(accountId: string, alias: string): AwsAccount {
  return {
    id: cloudAccountId(),
    accountId,
    alias,
    organizationId: 'o-abc123',
    isMaster: false,
    regions: [],
    users: [],
    roles: [],
    policies: [],
  };
}

export function createAwsRegion(name: string, fullName: string): AwsRegion {
  return {
    id: cloudRegionId(),
    name,
    fullName,
    enabled: true,
    vpcs: [],
  };
}

export function createVpc(name: string, cidrBlock: string, region: CloudRegionId): AwsVpc {
  return {
    id: cloudVpcId(),
    name,
    cidrBlock,
    region,
    internetGateway: false,
    vpcFlowLogs: false,
    subnets: [],
    securityGroups: [],
    instances: [],
    loadBalancers: [],
    databases: [],
    tags: {},
  };
}

export function createSubnet(name: string, cidrBlock: string, vpcId: CloudVpcId, az: string, isPublic = false): AwsSubnet {
  return {
    id: cloudSubnetId(),
    name,
    cidrBlock,
    vpcId,
    availabilityZone: az,
    public: isPublic,
    mapPublicIp: isPublic,
  };
}

export function createSecurityGroup(name: string, description: string, vpcId: CloudVpcId): AwsSecurityGroup {
  return {
    id: cloudSecurityGroupId(),
    name,
    description,
    vpcId,
    inboundRules: [],
    outboundRules: [{ protocol: '-1', portRange: [0, 65535], cidrBlocks: ['0.0.0.0/0'], securityGroupId: null, description: 'Default outbound' }],
    tags: {},
  };
}

export function createSecurityGroupRule(
  protocol: string,
  port: number,
  cidrBlocks: string[] = ['0.0.0.0/0'],
  description = '',
): SecurityGroupRule {
  return { protocol, portRange: [port, port], cidrBlocks, securityGroupId: null, description };
}

export function createInstance(
  name: string,
  instanceType: string,
  vpcId: CloudVpcId,
  subnetId: CloudSubnetId,
  options?: Partial<AwsInstance>,
): AwsInstance {
  return {
    id: cloudInstanceId(),
    name,
    instanceType,
    vpcId,
    subnetId,
    privateIp: '10.0.0.1',
    publicIp: null,
    state: InstanceState.Running,
    ami: 'ami-0abcdef1234567890',
    securityGroups: [],
    iamRole: null,
    keyPair: 'default-key',
    launchTime: new Date(),
    publicIpAutoAssign: false,
    encryptionAtRest: false,
    detailedMonitoring: false,
    tags: {},
    ...options,
  };
}

export function createStorageBucket(name: string, region: CloudRegionId): AwsStorageBucket {
  return {
    id: cloudStorageId(),
    name,
    region,
    access: StorageAccess.Private,
    versioning: false,
    encryption: false,
    logging: false,
    publicBlocks: true,
    objectCount: 0,
    sizeBytes: 0,
    lifecycleRules: 0,
    tags: {},
  };
}

export function createLambdaFunction(name: string, runtime: string, handler: string): AwsLambdaFunction {
  return {
    id: cloudFunctionId(),
    name,
    runtime,
    handler,
    memory: 128,
    timeout: 3,
    iamRole: null,
    vpcConfig: false,
    vpcId: null,
    environmentVariables: {},
    reservedConcurrency: 100,
    tracing: false,
    lastInvocation: null,
    tags: {},
  };
}

export function createRdsInstance(name: string, engine: string, vpcId: CloudVpcId): AwsRdsInstance {
  return {
    id: cloudDatabaseId(),
    name,
    engine,
    engineVersion: '15.3',
    instanceClass: 'db.r6g.large',
    vpcId,
    subnetIds: [],
    storageEncrypted: false,
    backupRetentionDays: 7,
    multiAz: false,
    publiclyAccessible: false,
    deletionProtection: false,
    autoMinorVersionUpgrade: true,
    port: engine === 'mysql' ? 3306 : engine === 'postgres' ? 5432 : 1433,
    masterUsername: 'admin',
    tags: {},
  };
}

export function createLoadBalancer(name: string, type: AwsLoadBalancer['type'], vpcId: CloudVpcId, scheme: AwsLoadBalancer['scheme'] = 'internal'): AwsLoadBalancer {
  return {
    id: cloudLoadBalancerId(),
    name,
    type,
    vpcId,
    subnetIds: [],
    securityGroups: [],
    deletionProtection: false,
    accessLogs: false,
    idleTimeout: 60,
    scheme,
    tags: {},
  };
}

export function createIamPolicy(
  name: string,
  effect: IamEffect,
  actions: string[],
  resources: string[] = ['*'],
): IamPolicy {
  return {
    id: cloudPolicyId(),
    name,
    description: `Policy ${name}`,
    effect,
    actions,
    resources,
    conditions: [],
    managed: true,
    version: '2012-10-17',
    attachedTo: [],
  };
}

export function createIamRole(name: string, assumeRolePolicy: string): IamRole {
  return {
    id: cloudRoleId(),
    name,
    assumeRolePolicy,
    managedPolicies: [],
    inlinePolicies: [],
    maxSessionDuration: 3600,
    tags: {},
  };
}

export function createIamUser(userName: string, arn: string): IamUser {
  return {
    id: cloudUserId(),
    userName,
    arn,
    groups: [],
    managedPolicies: [],
    inlinePolicies: [],
    accessKeys: [],
    mfaEnabled: false,
    passwordLastUsed: null,
    tags: {},
  };
}

export function createK8sCluster(name: string, provider: CloudProvider, region: CloudRegionId): K8sCluster {
  return {
    id: cloudClusterId(),
    name,
    provider,
    region,
    version: '1.28',
    nodeCount: 3,
    nodeInstanceType: 'm5.large',
    networkPlugin: 'calico',
    podCidr: '10.100.0.0/16',
    serviceCidr: '10.200.0.0/16',
    privateCluster: false,
    rbacEnabled: true,
    podSecurityPolicyEnabled: false,
    networkPolicyEnabled: false,
    auditLogging: false,
    secretsEncryption: false,
    oidcEnabled: false,
    namespaces: [],
    nodes: [],
    pods: [],
    services: [],
    deployments: [],
    roles: [],
    serviceAccounts: [],
    networkPolicies: [],
  };
}

export function createK8sNamespace(name: string): K8sNamespace {
  return { name, labels: {}, annotations: {}, status: 'active' };
}

export function createK8sPod(
  name: string,
  namespace: string,
  containers: string[],
  overrides?: Partial<K8sPod>,
): K8sPod {
  return {
    name,
    namespace,
    nodeName: 'node-1',
    serviceAccount: 'default',
    containers,
    initContainers: [],
    hostNetwork: false,
    hostPid: false,
    hostIpc: false,
    privileged: false,
    runAsRoot: true,
    securityContext: {
      runAsNonRoot: false,
      readOnlyRootFilesystem: false,
      allowPrivilegeEscalation: false,
      capabilities: { add: [], drop: [] },
      seccompProfile: 'unconfined',
      appArmorProfile: 'unconfined',
    },
    imagePullPolicy: 'Always',
    restartPolicy: 'Always',
    phase: 'Running',
    labels: {},
    ...overrides,
  };
}

export function createK8sService(name: string, namespace: string, type: string, ports: { port: number; targetPort: number; protocol: string }[]): K8sService {
  return {
    name,
    namespace,
    type,
    clusterIp: '10.200.0.1',
    externalIp: type === 'LoadBalancer' ? '203.0.113.1' : null,
    ports,
    selector: { app: name },
  };
}

export function createSecurityFinding(
  title: string,
  description: string,
  severity: FindingSeverity,
  category: FindingCategory,
  provider: CloudProvider,
  accountId: CloudAccountId,
  options?: Partial<SecurityFinding>,
): SecurityFinding {
  return {
    id: cloudFindingId(),
    timestamp: new Date(),
    source: AuditEventSource.SecurityHub,
    provider,
    accountId,
    region: null,
    severity,
    category,
    title,
    description,
    resourceArn: `arn:aws:ec2:us-east-1:${accountId}:instance/i-123`,
    resourceType: 'AWS::EC2::Instance',
    remediation: 'Apply the recommended remediation',
    complianceFrameworks: [],
    score: severity === FindingSeverity.Critical ? 10 : severity === FindingSeverity.High ? 7 : severity === FindingSeverity.Medium ? 4 : 1,
    mitigated: false,
    ...options,
  };
}

export function createAuditEvent(
  eventName: string,
  eventSource: string,
  userName: string,
  sourceIp: string,
  provider: CloudProvider,
  accountId: CloudAccountId,
  options?: Partial<AuditEvent>,
): AuditEvent {
  return {
    id: cloudAuditEventId(),
    timestamp: new Date(),
    source: AuditEventSource.CloudTrail,
    provider,
    accountId,
    region: null,
    eventName,
    eventSource,
    userName,
    sourceIp,
    userAgent: 'console.amazonaws.com',
    requestParameters: {},
    responseElements: {},
    errorCode: null,
    errorMessage: null,
    resources: [],
    severity: FindingSeverity.Informational,
    ...options,
  };
}

/* ── Security Assessment ── */

export function assessSecurityGroup(rule: SecurityGroupRule): SecurityFinding | null {
  const publicCidrs = rule.cidrBlocks.filter((c) => c === '0.0.0.0/0' || c === '::/0');
  if (publicCidrs.length === 0) return null;

  const port = rule.portRange[0];
  if (rule.protocol === '-1') {
    return createSecurityFinding(
      'Security group allows all traffic from internet',
      `Security group rule allows all protocols (0-65535) from 0.0.0.0/0`,
      FindingSeverity.Critical,
      FindingCategory.NetworkExposure,
      CloudProvider.AWS,
      cloudAccountId(),
      { region: null },
    );
  }

  if (port === 22 || port === 3389) {
    return createSecurityFinding(
      `Security group allows SSH/RDP from internet (port ${port})`,
      `Port ${port === 22 ? 'SSH' : 'RDP'} is exposed to 0.0.0.0/0`,
      FindingSeverity.High,
      FindingCategory.NetworkExposure,
      CloudProvider.AWS,
      cloudAccountId(),
      { region: null },
    );
  }

  if ([3306, 5432, 1433, 27017, 6379, 9200, 9042, 11211].includes(port)) {
    return createSecurityFinding(
      `Database port ${port} exposed to internet`,
      `Port ${port} is accessible from 0.0.0.0/0`,
      FindingSeverity.Critical,
      FindingCategory.NetworkExposure,
      CloudProvider.AWS,
      cloudAccountId(),
      { region: null },
    );
  }

  if ([80, 443].includes(port)) {
    return createSecurityFinding(
      `HTTP/S port ${port} exposed to internet`,
      `Port ${port} is accessible from 0.0.0.0/0`,
      FindingSeverity.Medium,
      FindingCategory.NetworkExposure,
      CloudProvider.AWS,
      cloudAccountId(),
      { region: null },
    );
  }

  return null;
}

export function assessStorageBucket(bucket: AwsStorageBucket): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const acctId = cloudAccountId();

  if (bucket.access === StorageAccess.PublicRead || bucket.access === StorageAccess.PublicReadWrite) {
    findings.push(createSecurityFinding(
      `S3 bucket ${bucket.name} is publicly accessible`,
      `Bucket access is set to ${bucket.access}`,
      FindingSeverity.Critical,
      FindingCategory.StorageExposure,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `arn:aws:s3:::${bucket.name}` },
    ));
  }

  if (!bucket.encryption) {
    findings.push(createSecurityFinding(
      `S3 bucket ${bucket.name} does not have encryption enabled`,
      'Server-side encryption should be enabled for all S3 buckets',
      FindingSeverity.High,
      FindingCategory.EncryptionDisabled,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `arn:aws:s3:::${bucket.name}` },
    ));
  }

  if (!bucket.versioning) {
    findings.push(createSecurityFinding(
      `S3 bucket ${bucket.name} does not have versioning enabled`,
      'Versioning helps protect against accidental deletion',
      FindingSeverity.Medium,
      FindingCategory.DataExposure,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `arn:aws:s3:::${bucket.name}` },
    ));
  }

  if (!bucket.logging) {
    findings.push(createSecurityFinding(
      `S3 bucket ${bucket.name} does not have access logging enabled`,
      'Access logs help with auditing and forensic investigations',
      FindingSeverity.Low,
      FindingCategory.LoggingDisabled,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `arn:aws:s3:::${bucket.name}` },
    ));
  }

  return findings;
}

export function assessInstance(instance: AwsInstance): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const acctId = cloudAccountId();

  if (!instance.encryptionAtRest) {
    findings.push(createSecurityFinding(
      `EC2 instance ${instance.name} does not have EBS encryption enabled`,
      'Encryption at rest should be enabled for all EBS volumes',
      FindingSeverity.High,
      FindingCategory.EncryptionDisabled,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `arn:aws:ec2:us-east-1:${acctId}:instance/${instance.id}` },
    ));
  }

  if (!instance.detailedMonitoring) {
    findings.push(createSecurityFinding(
      `EC2 instance ${instance.name} does not have detailed monitoring enabled`,
      'Detailed monitoring provides metrics at 1-minute frequency',
      FindingSeverity.Low,
      FindingCategory.LoggingDisabled,
      CloudProvider.AWS,
      acctId,
      { region: null },
    ));
  }

  if (instance.publicIp && instance.publicIpAutoAssign) {
    findings.push(createSecurityFinding(
      `EC2 instance ${instance.name} has auto-assign public IP enabled`,
      'Auto-assigning public IPs increases attack surface',
      FindingSeverity.Medium,
      FindingCategory.NetworkExposure,
      CloudProvider.AWS,
      acctId,
      { region: null },
    ));
  }

  return findings;
}

export function assessK8sPod(pod: K8sPod): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const acctId = cloudAccountId();

  if (pod.privileged) {
    findings.push(createSecurityFinding(
      `Pod ${pod.name} runs in privileged mode`,
      'Privileged containers have all capabilities and can access all devices',
      FindingSeverity.Critical,
      FindingCategory.ContainerEscape,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
    ));
  }

  if (pod.runAsRoot) {
    findings.push(createSecurityFinding(
      `Pod ${pod.name} runs as root`,
      'Containers should run as non-root user',
      FindingSeverity.High,
      FindingCategory.K8sMisconfiguration,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
    ));
  }

  if (pod.hostNetwork) {
    findings.push(createSecurityFinding(
      `Pod ${pod.name} uses host network`,
      'Host network access can bypass network policies',
      FindingSeverity.High,
      FindingCategory.K8sMisconfiguration,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
    ));
  }

  if (pod.hostPid) {
    findings.push(createSecurityFinding(
      `Pod ${pod.name} uses host PID namespace`,
      'Host PID access can leak process information across containers',
      FindingSeverity.High,
      FindingCategory.K8sMisconfiguration,
      CloudProvider.AWS,
      acctId,
      { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
    ));
  }

  if (pod.securityContext?.runAsNonRoot === false && !pod.privileged) {
    const sc = pod.securityContext;
    if (sc.allowPrivilegeEscalation) {
      findings.push(createSecurityFinding(
        `Pod ${pod.name} allows privilege escalation`,
        'Containers should set allowPrivilegeEscalation to false',
        FindingSeverity.Medium,
        FindingCategory.K8sMisconfiguration,
        CloudProvider.AWS,
        acctId,
        { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
      ));
    }
    if (sc.seccompProfile === 'unconfined') {
      findings.push(createSecurityFinding(
        `Pod ${pod.name} has seccomp unconfined`,
        'Seccomp profile should be set to RuntimeDefault or local profile',
        FindingSeverity.Medium,
        FindingCategory.K8sMisconfiguration,
        CloudProvider.AWS,
        acctId,
        { region: null, resourceArn: `pod://${pod.namespace}/${pod.name}` },
      ));
    }
  }

  return findings;
}

/* ── Cloud Auditor ── */

export function calculateSecurityScore(findings: SecurityFinding[]): CloudSecurityScore {
  const critical = findings.filter((f) => f.severity === FindingSeverity.Critical).length;
  const high = findings.filter((f) => f.severity === FindingSeverity.High).length;
  const medium = findings.filter((f) => f.severity === FindingSeverity.Medium).length;
  const low = findings.filter((f) => f.severity === FindingSeverity.Low).length;

  const totalIssues = findings.length;
  const rawScore = 100 - (critical * 15 + high * 7 + medium * 3 + low * 1);
  const overall = Math.max(0, Math.min(100, rawScore));

  return {
    overall,
    compute: overall,
    storage: overall,
    networking: overall,
    identity: overall,
    logging: overall,
    encryption: overall,
    k8s: overall,
    findingCount: totalIssues,
    criticalCount: critical,
    highCount: high,
    mediumCount: medium,
    lowCount: low,
  };
}

/* ── Cloud Account Manager ── */

export class CloudAccountManager {
  private accounts: Map<CloudAccountId, AwsAccount> = new Map();
  private regions: Map<CloudRegionId, AwsRegion> = new Map();
  private vpcs: Map<CloudVpcId, AwsVpc> = new Map();
  private subnets: Map<CloudSubnetId, AwsSubnet> = new Map();
  private securityGroups: Map<CloudSecurityGroupId, AwsSecurityGroup> = new Map();
  private instances: Map<CloudInstanceId, AwsInstance> = new Map();
  private buckets: Map<CloudStorageId, AwsStorageBucket> = new Map();
  private functions: Map<CloudFunctionId, AwsLambdaFunction> = new Map();
  private databases: Map<CloudDatabaseId, AwsRdsInstance> = new Map();
  private loadBalancers: Map<CloudLoadBalancerId, AwsLoadBalancer> = new Map();
  private roles: Map<CloudRoleId, IamRole> = new Map();
  private users: Map<CloudUserId, IamUser> = new Map();
  private policies: Map<CloudPolicyId, IamPolicy> = new Map();
  private clusters: Map<CloudClusterId, K8sCluster> = new Map();
  private auditEvents: AuditEvent[] = [];
  private findings: SecurityFinding[] = [];

  /* ── Accounts ── */

  createAccount(accountId: string, alias: string): AwsAccount {
    const acct = createAwsAccount(accountId, alias);
    this.accounts.set(acct.id, acct);
    return acct;
  }

  getAccount(id: CloudAccountId): AwsAccount | undefined {
    return this.accounts.get(id);
  }

  listAccounts(): AwsAccount[] {
    return Array.from(this.accounts.values());
  }

  removeAccount(id: CloudAccountId): boolean {
    return this.accounts.delete(id);
  }

  /* ── Regions ── */

  createRegion(name: string, fullName: string, accountId: CloudAccountId): AwsRegion {
    const rgn = createAwsRegion(name, fullName);
    this.regions.set(rgn.id, rgn);
    const acct = this.accounts.get(accountId);
    if (acct) acct.regions.push(rgn.id);
    return rgn;
  }

  getRegion(id: CloudRegionId): AwsRegion | undefined {
    return this.regions.get(id);
  }

  listRegions(): AwsRegion[] {
    return Array.from(this.regions.values());
  }

  /* ── VPCs ── */

  createVpc(name: string, cidrBlock: string, regionId: CloudRegionId): AwsVpc {
    const vpc = createVpc(name, cidrBlock, regionId);
    this.vpcs.set(vpc.id, vpc);
    const rgn = this.regions.get(regionId);
    if (rgn) rgn.vpcs.push(vpc.id);
    return vpc;
  }

  getVpc(id: CloudVpcId): AwsVpc | undefined {
    return this.vpcs.get(id);
  }

  listVpcs(): AwsVpc[] {
    return Array.from(this.vpcs.values());
  }

  listVpcsByRegion(regionId: CloudRegionId): AwsVpc[] {
    return this.listVpcs().filter((v) => v.region === regionId);
  }

  removeVpc(id: CloudVpcId): boolean {
    return this.vpcs.delete(id);
  }

  /* ── Subnets ── */

  createSubnet(name: string, cidrBlock: string, vpcId: CloudVpcId, az: string, isPublic = false): AwsSubnet {
    const subnet = createSubnet(name, cidrBlock, vpcId, az, isPublic);
    this.subnets.set(subnet.id, subnet);
    const vpc = this.vpcs.get(vpcId);
    if (vpc) vpc.subnets.push(subnet.id);
    return subnet;
  }

  getSubnet(id: CloudSubnetId): AwsSubnet | undefined {
    return this.subnets.get(id);
  }

  listSubnets(): AwsSubnet[] {
    return Array.from(this.subnets.values());
  }

  listSubnetsByVpc(vpcId: CloudVpcId): AwsSubnet[] {
    return this.listSubnets().filter((s) => s.vpcId === vpcId);
  }

  /* ── Security Groups ── */

  createSecurityGroup(name: string, description: string, vpcId: CloudVpcId): AwsSecurityGroup {
    const sg = createSecurityGroup(name, description, vpcId);
    this.securityGroups.set(sg.id, sg);
    const vpc = this.vpcs.get(vpcId);
    if (vpc) vpc.securityGroups.push(sg.id);
    return sg;
  }

  getSecurityGroup(id: CloudSecurityGroupId): AwsSecurityGroup | undefined {
    return this.securityGroups.get(id);
  }

  listSecurityGroups(): AwsSecurityGroup[] {
    return Array.from(this.securityGroups.values());
  }

  addInboundRule(sgId: CloudSecurityGroupId, rule: SecurityGroupRule): boolean {
    const sg = this.securityGroups.get(sgId);
    if (!sg) return false;
    sg.inboundRules.push(rule);
    return true;
  }

  /* ── Instances ── */

  createInstance(name: string, instanceType: string, vpcId: CloudVpcId, subnetId: CloudSubnetId, options?: Partial<AwsInstance>): AwsInstance {
    const inst = createInstance(name, instanceType, vpcId, subnetId, options);
    this.instances.set(inst.id, inst);
    const vpc = this.vpcs.get(vpcId);
    if (vpc) vpc.instances.push(inst.id);
    return inst;
  }

  getInstance(id: CloudInstanceId): AwsInstance | undefined {
    return this.instances.get(id);
  }

  listInstances(): AwsInstance[] {
    return Array.from(this.instances.values());
  }

  listInstancesByVpc(vpcId: CloudVpcId): AwsInstance[] {
    return this.listInstances().filter((i) => i.vpcId === vpcId);
  }

  setInstanceState(id: CloudInstanceId, state: InstanceState): boolean {
    const inst = this.instances.get(id);
    if (!inst) return false;
    inst.state = state;
    return true;
  }

  removeInstance(id: CloudInstanceId): boolean {
    return this.instances.delete(id);
  }

  /* ── Storage ── */

  createBucket(name: string, regionId: CloudRegionId): AwsStorageBucket {
    const bucket = createStorageBucket(name, regionId);
    this.buckets.set(bucket.id, bucket);
    return bucket;
  }

  getBucket(id: CloudStorageId): AwsStorageBucket | undefined {
    return this.buckets.get(id);
  }

  listBuckets(): AwsStorageBucket[] {
    return Array.from(this.buckets.values());
  }

  listPublicBuckets(): AwsStorageBucket[] {
    return this.listBuckets().filter((b) => b.access === StorageAccess.PublicRead || b.access === StorageAccess.PublicReadWrite);
  }

  removeBucket(id: CloudStorageId): boolean {
    return this.buckets.delete(id);
  }

  /* ── Lambda ── */

  createFunction(name: string, runtime: string, handler: string): AwsLambdaFunction {
    const fn = createLambdaFunction(name, runtime, handler);
    this.functions.set(fn.id, fn);
    return fn;
  }

  getFunction(id: CloudFunctionId): AwsLambdaFunction | undefined {
    return this.functions.get(id);
  }

  listFunctions(): AwsLambdaFunction[] {
    return Array.from(this.functions.values());
  }

  removeFunction(id: CloudFunctionId): boolean {
    return this.functions.delete(id);
  }

  /* ── RDS ── */

  createDatabase(name: string, engine: string, vpcId: CloudVpcId): AwsRdsInstance {
    const db = createRdsInstance(name, engine, vpcId);
    this.databases.set(db.id, db);
    const vpc = this.vpcs.get(vpcId);
    if (vpc) vpc.databases.push(db.id);
    return db;
  }

  getDatabase(id: CloudDatabaseId): AwsRdsInstance | undefined {
    return this.databases.get(id);
  }

  listDatabases(): AwsRdsInstance[] {
    return Array.from(this.databases.values());
  }

  /* ── Load Balancers ── */

  createLoadBalancer(name: string, type: AwsLoadBalancer['type'], vpcId: CloudVpcId, scheme: AwsLoadBalancer['scheme'] = 'internal'): AwsLoadBalancer {
    const lb = createLoadBalancer(name, type, vpcId, scheme);
    this.loadBalancers.set(lb.id, lb);
    const vpc = this.vpcs.get(vpcId);
    if (vpc) vpc.loadBalancers.push(lb.id);
    return lb;
  }

  getLoadBalancer(id: CloudLoadBalancerId): AwsLoadBalancer | undefined {
    return this.loadBalancers.get(id);
  }

  listLoadBalancers(): AwsLoadBalancer[] {
    return Array.from(this.loadBalancers.values());
  }

  /* ── IAM ── */

  createRole(name: string, assumeRolePolicy: string): IamRole {
    const role = createIamRole(name, assumeRolePolicy);
    this.roles.set(role.id, role);
    return role;
  }

  getRole(id: CloudRoleId): IamRole | undefined {
    return this.roles.get(id);
  }

  listRoles(): IamRole[] {
    return Array.from(this.roles.values());
  }

  attachPolicyToRole(roleId: CloudRoleId, policyId: CloudPolicyId): boolean {
    const role = this.roles.get(roleId);
    const policy = this.policies.get(policyId);
    if (!role || !policy) return false;
    if (!role.managedPolicies.includes(policyId)) {
      role.managedPolicies.push(policyId);
      policy.attachedTo.push(roleId);
    }
    return true;
  }

  createUser(userName: string, arn: string): IamUser {
    const user = createIamUser(userName, arn);
    this.users.set(user.id, user);
    return user;
  }

  getUser(id: CloudUserId): IamUser | undefined {
    return this.users.get(id);
  }

  listUsers(): IamUser[] {
    return Array.from(this.users.values());
  }

  createPolicy(name: string, effect: IamEffect, actions: string[], resources: string[] = ['*']): IamPolicy {
    const policy = createIamPolicy(name, effect, actions, resources);
    this.policies.set(policy.id, policy);
    return policy;
  }

  getPolicy(id: CloudPolicyId): IamPolicy | undefined {
    return this.policies.get(id);
  }

  listPolicies(): IamPolicy[] {
    return Array.from(this.policies.values());
  }

  /* ── Kubernetes ── */

  createCluster(name: string, provider: CloudProvider, regionId: CloudRegionId): K8sCluster {
    const cls = createK8sCluster(name, provider, regionId);
    this.clusters.set(cls.id, cls);
    return cls;
  }

  getCluster(id: CloudClusterId): K8sCluster | undefined {
    return this.clusters.get(id);
  }

  listClusters(): K8sCluster[] {
    return Array.from(this.clusters.values());
  }

  removeCluster(id: CloudClusterId): boolean {
    return this.clusters.delete(id);
  }

  addNodeToCluster(clusterId: CloudClusterId, node: K8sNode): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.nodes.push(node);
    cls.nodeCount = cls.nodes.length;
    return true;
  }

  addPodToCluster(clusterId: CloudClusterId, pod: K8sPod): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.pods.push(pod);
    return true;
  }

  addServiceToCluster(clusterId: CloudClusterId, service: K8sService): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.services.push(service);
    return true;
  }

  addNamespaceToCluster(clusterId: CloudClusterId, namespace: K8sNamespace): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.namespaces.push(namespace);
    return true;
  }

  addDeploymentToCluster(clusterId: CloudClusterId, deployment: K8sDeployment): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.deployments.push(deployment);
    return true;
  }

  addNetworkPolicyToCluster(clusterId: CloudClusterId, np: K8sNetworkPolicy): boolean {
    const cls = this.clusters.get(clusterId);
    if (!cls) return false;
    cls.networkPolicies.push(np);
    return true;
  }

  /* ── Audit & Findings ── */

  addAuditEvent(event: AuditEvent): CloudAuditEventId {
    this.auditEvents.push(event);
    return event.id;
  }

  getAuditEvents(): AuditEvent[] {
    return this.auditEvents;
  }

  getAuditEventsByUser(userName: string): AuditEvent[] {
    return this.auditEvents.filter((e) => e.userName === userName);
  }

  getAuditEventsBySource(source: AuditEventSource): AuditEvent[] {
    return this.auditEvents.filter((e) => e.source === source);
  }

  addFinding(finding: SecurityFinding): CloudFindingId {
    this.findings.push(finding);
    return finding.id;
  }

  getFindings(): SecurityFinding[] {
    return this.findings;
  }

  getFindingsBySeverity(severity: FindingSeverity): SecurityFinding[] {
    return this.findings.filter((f) => f.severity === severity);
  }

  getFindingsByCategory(category: FindingCategory): SecurityFinding[] {
    return this.findings.filter((f) => f.category === category);
  }

  getUnmitigatedFindings(): SecurityFinding[] {
    return this.findings.filter((f) => !f.mitigated);
  }

  mitigateFinding(id: CloudFindingId): boolean {
    const finding = this.findings.find((f) => f.id === id);
    if (!finding || finding.mitigated) return false;
    finding.mitigated = true;
    return true;
  }

  runSecurityAssessment(): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    for (const bucket of this.buckets.values()) {
      findings.push(...assessStorageBucket(bucket));
    }

    for (const inst of this.instances.values()) {
      findings.push(...assessInstance(inst));
    }

    for (const sg of this.securityGroups.values()) {
      for (const rule of sg.inboundRules) {
        const finding = assessSecurityGroup(rule);
        if (finding) findings.push(finding);
      }
    }

    for (const cls of this.clusters.values()) {
      for (const pod of cls.pods) {
        findings.push(...assessK8sPod(pod));
      }
    }

    for (const finding of findings) {
      this.findings.push(finding);
    }

    return findings;
  }

  getStats(): CloudStats {
    const runInstances = this.listInstances().filter((i) => i.state === InstanceState.Running).length;
    const pubBuckets = this.listBuckets().filter((b) => b.access === StorageAccess.PublicRead || b.access === StorageAccess.PublicReadWrite).length;
    const crFindings = this.findings.filter((f) => f.severity === FindingSeverity.Critical).length;
    const hiFindings = this.findings.filter((f) => f.severity === FindingSeverity.High).length;
    const totalPods = this.clusters.values().reduce((sum, c) => sum + c.pods.length, 0);

    return {
      accounts: this.accounts.size,
      regions: this.regions.size,
      vpcs: this.vpcs.size,
      subnets: this.subnets.size,
      securityGroups: this.securityGroups.size,
      computeInstances: this.instances.size,
      runningInstances: runInstances,
      storageBuckets: this.buckets.size,
      publicBuckets: pubBuckets,
      functions: this.functions.size,
      databases: this.databases.size,
      loadBalancers: this.loadBalancers.size,
      clusters: this.clusters.size,
      pods: totalPods,
      iamRoles: this.roles.size,
      iamUsers: this.users.size,
      iamPolicies: this.policies.size,
      auditEvents: this.auditEvents.length,
      findings: this.findings.length,
      criticalFindings: crFindings,
      highFindings: hiFindings,
    };
  }

  clear(): void {
    this.accounts.clear();
    this.regions.clear();
    this.vpcs.clear();
    this.subnets.clear();
    this.securityGroups.clear();
    this.instances.clear();
    this.buckets.clear();
    this.functions.clear();
    this.databases.clear();
    this.loadBalancers.clear();
    this.roles.clear();
    this.users.clear();
    this.policies.clear();
    this.clusters.clear();
    this.auditEvents = [];
    this.findings = [];
  }
}

/* ── Default Environment ── */

export function createDefaultCloudEnvironment(): CloudAccountManager {
  const manager = new CloudAccountManager();

  const acct = manager.createAccount('123456789012', 'production-engineering');

  const usEast1 = manager.createRegion('us-east-1', 'US East (N. Virginia)', acct.id);
  const usWest2 = manager.createRegion('us-west-2', 'US West (Oregon)', acct.id);
  const euWest1 = manager.createRegion('eu-west-1', 'EU (Ireland)', acct.id);

  const vpc1 = manager.createVpc('prod-vpc', '10.0.0.0/16', usEast1);
  const vpc2 = manager.createVpc('staging-vpc', '10.1.0.0/16', usWest2);

  const sub1 = manager.createSubnet('prod-public-a', '10.0.1.0/24', vpc1.id, 'us-east-1a', true);
  const sub2 = manager.createSubnet('prod-private-a', '10.0.2.0/24', vpc1.id, 'us-east-1a', false);
  const sub3 = manager.createSubnet('prod-private-b', '10.0.3.0/24', vpc1.id, 'us-east-1b', false);

  const sg1 = manager.createSecurityGroup('web-sg', 'Web server security group', vpc1.id);
  manager.addInboundRule(sg1.id, createSecurityGroupRule('tcp', 443, ['0.0.0.0/0'], 'HTTPS from internet'));
  manager.addInboundRule(sg1.id, createSecurityGroupRule('tcp', 80, ['0.0.0.0/0'], 'HTTP from internet'));

  const sg2 = manager.createSecurityGroup('ssh-sg', 'SSH access', vpc1.id);
  manager.addInboundRule(sg2.id, createSecurityGroupRule('tcp', 22, ['10.0.0.0/8'], 'SSH from internal'));

  const inst1 = manager.createInstance('web-server-1', 't3.large', vpc1.id, sub1.id, {
    privateIp: '10.0.1.10',
    publicIp: '203.0.113.10',
    securityGroups: [sg1.id, sg2.id],
    publicIpAutoAssign: true,
  });

  const inst2 = manager.createInstance('app-server-1', 't3.xlarge', vpc1.id, sub2.id, {
    privateIp: '10.0.2.10',
    securityGroups: [sg1.id],
    encryptionAtRest: true,
  });

  const inst3 = manager.createInstance('db-server-1', 'r5.large', vpc1.id, sub2.id, {
    privateIp: '10.0.2.20',
    securityGroups: [sg2.id],
    encryptionAtRest: true,
    detailedMonitoring: true,
  });

  const bucket1 = manager.createBucket('prod-app-data', usEast1);
  const bucket2 = manager.createBucket('prod-logs', usEast1);

  manager.createFunction('process-orders', 'nodejs18.x', 'index.handler');
  manager.createFunction('send-notifications', 'python3.11', 'handler.main');

  const db1 = manager.createDatabase('prod-primary', 'postgres', vpc1.id);
  const db2 = manager.createDatabase('prod-replica', 'mysql', vpc1.id);

  manager.createLoadBalancer('prod-alb', 'application', vpc1.id, 'internet_facing');

  const adminRole = manager.createRole('AdminRole', JSON.stringify({
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'sts:AssumeRole' }],
  }));

  const devRole = manager.createRole('DevRole', JSON.stringify({
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'sts:AssumeRole' }],
  }));

  const adminPolicy = manager.createPolicy('AdministratorAccess', IamEffect.Allow, ['*']);
  const readOnlyPolicy = manager.createPolicy('ReadOnlyAccess', IamEffect.Allow, ['ec2:Describe*', 's3:Get*', 'rds:Describe*']);

  manager.attachPolicyToRole(adminRole.id, adminPolicy.id);
  manager.attachPolicyToRole(devRole.id, readOnlyPolicy.id);

  const user1 = manager.createUser('john.doe', 'arn:aws:iam::123456789012:user/john.doe');
  const user2 = manager.createUser('jane.smith', 'arn:aws:iam::123456789012:user/jane.smith');

  const k8sCluster = manager.createCluster('prod-eks-1', CloudProvider.AWS, usEast1);

  const ns1 = createK8sNamespace('production');
  const ns2 = createK8sNamespace('monitoring');
  manager.addNamespaceToCluster(k8sCluster.id, ns1);
  manager.addNamespaceToCluster(k8sCluster.id, ns2);

  const pod1 = createK8sPod('web-app-7f8b9', 'production', ['nginx:1.25'], {
    nodeName: 'ip-10-0-1-100',
    hostNetwork: false,
    privileged: false,
    runAsRoot: true,
    securityContext: {
      runAsNonRoot: false,
      readOnlyRootFilesystem: false,
      allowPrivilegeEscalation: true,
      capabilities: { add: ['NET_ADMIN'], drop: [] },
      seccompProfile: 'unconfined',
      appArmorProfile: 'unconfined',
    },
    labels: { app: 'web', env: 'production' },
  });

  const pod2 = createK8sPod('mon-agent-6d2f1', 'monitoring', ['prometheus/node-exporter:latest'], {
    nodeName: 'ip-10-0-1-101',
    hostNetwork: true,
    hostPid: true,
    privileged: false,
    runAsRoot: true,
    securityContext: {
      runAsNonRoot: false,
      readOnlyRootFilesystem: false,
      allowPrivilegeEscalation: false,
      capabilities: { add: [], drop: ['ALL'] },
      seccompProfile: 'unconfined',
      appArmorProfile: 'unconfined',
    },
    labels: { app: 'monitoring' },
  });

  manager.addPodToCluster(k8sCluster.id, pod1);
  manager.addPodToCluster(k8sCluster.id, pod2);

  const svc1 = createK8sService('web-service', 'production', 'LoadBalancer', [{ port: 443, targetPort: 443, protocol: 'TCP' }]);
  const svc2 = createK8sService('internal-api', 'production', 'ClusterIP', [{ port: 8080, targetPort: 8080, protocol: 'TCP' }]);
  manager.addServiceToCluster(k8sCluster.id, svc1);
  manager.addServiceToCluster(k8sCluster.id, svc2);

  const adminRoleBinding: K8sRole = {
    name: 'cluster-admin', namespace: 'production', clusterScope: true,
    rules: [{ verbs: ['*'], resources: ['*'], apiGroups: ['*'] }],
  };
  manager.addDeploymentToCluster(k8sCluster.id, {
    name: 'web-app', namespace: 'production', replicas: 3, availableReplicas: 3,
    strategy: 'RollingUpdate', containers: ['nginx:1.25'], serviceAccount: 'default', labels: { app: 'web' },
  });

  const suspiciousEvent = createAuditEvent(
    'CreateAccessKey',
    'iam.amazonaws.com',
    'john.doe',
    '198.51.100.1',
    CloudProvider.AWS,
    acct.id,
    { severity: FindingSeverity.Medium, source: AuditEventSource.CloudTrail },
  );
  manager.addAuditEvent(suspiciousEvent);

  const consoleLoginEvent = createAuditEvent(
    'ConsoleLogin',
    'signin.amazonaws.com',
    'jane.smith',
    '203.0.113.45',
    CloudProvider.AWS,
    acct.id,
    { severity: FindingSeverity.Informational, source: AuditEventSource.CloudTrail },
  );
  manager.addAuditEvent(consoleLoginEvent);

  return manager;
}
