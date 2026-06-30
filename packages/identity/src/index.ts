import { uid } from '@cybersim/shared';

/* ── Branded IDs ── */

export type DomainId = string & { readonly __brand: unique symbol };
export type UserId = string & { readonly __brand: unique symbol };
export type GroupId = string & { readonly __brand: unique symbol };
export type SessionId = string & { readonly __brand: unique symbol };
export type TokenId = string & { readonly __brand: unique symbol };
export type CertificateId = string & { readonly __brand: unique symbol };
export type TrustId = string & { readonly __brand: unique symbol };
export type PolicyId = string & { readonly __brand: unique symbol };
export type KeyId = string & { readonly __brand: unique symbol };
export type ApplicationId = string & { readonly __brand: unique symbol };

export function domainId(): DomainId { return `dom-${uid()}` as DomainId; }
export function userId(): UserId { return `usr-${uid()}` as UserId; }
export function groupId(): GroupId { return `grp-${uid()}` as GroupId; }
export function sessionId(): SessionId { return `sess-${uid()}` as SessionId; }
export function tokenId(): TokenId { return `tok-${uid()}` as TokenId; }
export function certificateId(): CertificateId { return `cert-${uid()}` as CertificateId; }
export function trustId(): TrustId { return `trst-${uid()}` as TrustId; }
export function policyId(): PolicyId { return `pol-${uid()}` as PolicyId; }
export function keyId(): KeyId { return `key-${uid()}` as KeyId; }
export function applicationId(): ApplicationId { return `app-${uid()}` as ApplicationId; }

/* ── Enums ── */

export enum DomainFunctionalLevel {
  Windows2000 = 0,
  WindowsServer2003 = 1,
  Windows2008 = 2,
  Windows2008R2 = 3,
  Windows2012 = 4,
  Windows2012R2 = 5,
  Windows2016 = 6,
  Windows2019 = 7,
  Windows2022 = 8,
}

export enum TrustDirection {
  Disabled = 0,
  Inbound = 1,
  Outbound = 2,
  Bidirectional = 3,
}

export enum TrustType {
  ParentChild = 'parent_child',
  TreeRoot = 'tree_root',
  External = 'external',
  Forest = 'forest',
  Realm = 'realm',
}

export enum GroupType {
  Security = 'security',
  Distribution = 'distribution',
}

export enum GroupScope {
  DomainLocal = 'domain_local',
  Global = 'global',
  Universal = 'universal',
}

export enum AuthenticationProtocol {
  Kerberos = 'kerberos',
  NTLM = 'ntlm',
  NTLMv2 = 'ntlmv2',
  OAuth = 'oauth',
  OIDC = 'oidc',
  SAML = 'saml',
  LDAP = 'ldap',
  Basic = 'basic',
  Digest = 'digest',
  Certificate = 'certificate',
  Passkey = 'passkey',
  FIDO2 = 'fido2',
}

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
  ID = 'id',
  Session = 'session',
  DeviceCode = 'device_code',
  AuthorizationCode = 'authorization_code',
  ClientCredentials = 'client_credentials',
  JWT = 'jwt',
  SAMLAssertion = 'saml_assertion',
  KerberosTGT = 'kerberos_tgt',
  KerberosST = 'kerberos_st',
}

export enum CertificateStatus {
  Valid = 'valid',
  Expired = 'expired',
  Revoked = 'revoked',
  Pending = 'pending',
  Unknown = 'unknown',
  Compromised = 'compromised',
}

export enum MfaMethod {
  TOTP = 'totp',
  HOTP = 'hotp',
  SMS = 'sms',
  Push = 'push',
  Email = 'email',
  FIDO2 = 'fido2',
  Passkey = 'passkey',
  HardwareToken = 'hardware_token',
  PhoneCall = 'phone_call',
}

export enum AccountControlFlag {
  Enabled = 1 << 0,
  PasswordExpired = 1 << 1,
  AccountLocked = 1 << 2,
  PasswordNeverExpires = 1 << 3,
  CannotChangePassword = 1 << 4,
  SmartcardRequired = 1 << 5,
  TrustedForDelegation = 1 << 6,
  NotDelegated = 1 << 7,
  UseDesKeyOnly = 1 << 8,
  DoNotRequirePreAuth = 1 << 9,
  MfaRequired = 1 << 10,
  ServiceAccount = 1 << 11,
  ReadonlyAccount = 1 << 12,
}

export enum PasswordScore {
  VeryWeak = 1,
  Weak = 2,
  Moderate = 3,
  Strong = 4,
  VeryStrong = 5,
}

export enum KerberosEncryptionType {
  DES = 'des-cbc-md5',
  RC4 = 'rc4-hmac',
  AES128 = 'aes128-cts-hmac-sha1-96',
  AES256 = 'aes256-cts-hmac-sha1-96',
  AES128_SHA256 = 'aes128-cts-hmac-sha256-128',
  AES256_SHA384 = 'aes256-cts-hmac-sha384-192',
}

/* ── Interfaces ── */

export interface Domain {
  id: DomainId;
  name: string;
  netbiosName: string;
  functionalLevel: DomainFunctionalLevel;
  description: string;
  ouCount: number;
  userCount: number;
  groupCount: number;
  computerCount: number;
  created: Date;
}

export interface DomainTrust {
  id: TrustId;
  sourceDomain: DomainId;
  targetDomain: DomainId;
  direction: TrustDirection;
  trustType: TrustType;
  transitive: boolean;
  sidFiltering: boolean;
  created: Date;
}

export interface OrganizationalUnit {
  id: PolicyId;
  domainId: DomainId;
  name: string;
  description: string;
  parentId: PolicyId | null;
  protected: boolean;
}

export interface GpoLink {
  gpoId: PolicyId;
  targetId: PolicyId;
  targetType: 'domain' | 'ou';
  enforced: boolean;
  linkOrder: number;
}

export interface GroupPolicyObject {
  id: PolicyId;
  domainId: DomainId;
  name: string;
  description: string;
  computerSettings: Record<string, string>;
  userSettings: Record<string, string>;
  version: number;
  enabled: boolean;
}

export interface ADUser {
  id: UserId;
  domainId: DomainId;
  samAccountName: string;
  userPrincipalName: string;
  displayName: string;
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  manager: UserId | null;
  description: string;
  flags: number;
  passwordLastSet: Date;
  lastLogon: Date | null;
  badPasswordCount: number;
  memberOf: GroupId[];
  created: Date;
  mfaConfigured: boolean;
  mfaMethods: MfaMethod[];
}

export interface ADGroup {
  id: GroupId;
  domainId: DomainId;
  name: string;
  samAccountName: string;
  description: string;
  groupType: GroupType;
  scope: GroupScope;
  members: UserId[];
  memberOf: GroupId[];
  created: Date;
}

export interface KerberosTicket {
  ticketId: TokenId;
  domainId: DomainId;
  clientId: UserId;
  serverId: string;
  sessionKey: string;
  encryptionType: KerberosEncryptionType;
  startTime: Date;
  endTime: Date;
  renewalTime: Date;
  flags: string[];
  isTGT: boolean;
  authorizationData: Record<string, string>;
  serviceName: string;
}

export interface NtlmHash {
  userId: UserId;
  ntlmHash: string;
  lmHash: string;
  isWeak: boolean;
  crackedPassword: string | null;
  crackTime: Date | null;
}

export interface OAuthApplication {
  id: ApplicationId;
  domainId: DomainId;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  allowedGrantTypes: string[];
  requirePKCE: boolean;
  requireConsent: boolean;
  publicClient: boolean;
  confidentialClient: boolean;
  scopes: string[];
  created: Date;
}

export interface AuthorizationGrant {
  id: TokenId;
  applicationId: ApplicationId;
  userId: UserId;
  code: string;
  redirectUri: string;
  scopes: string[];
  codeChallenge: string | null;
  codeChallengeMethod: 'S256' | 'plain' | null;
  expiresAt: Date;
  used: boolean;
}

export interface Token {
  id: TokenId;
  tokenType: TokenType;
  subjectId: UserId;
  issuer: string;
  audience: string[];
  scopes: string[];
  issuedAt: Date;
  expiresAt: Date;
  notBefore: Date;
  claims: Record<string, string>;
  tokenValue: string;
  isRevoked: boolean;
  parentTokenId: TokenId | null;
}

export interface SamlAssertion {
  id: TokenId;
  issuer: string;
  subjectId: UserId;
  audience: string;
  conditions: {
    notBefore: Date;
    notAfter: Date;
    audienceRestriction: string[];
  };
  attributes: Record<string, string>;
  authnContext: string;
  signatureValid: boolean;
}

export interface PasskeyCredential {
  id: KeyId;
  userId: UserId;
  credentialId: string;
  publicKeyPem: string;
  relyingParty: string;
  userHandle: string;
  signCount: number;
  backedUp: boolean;
  transports: string[];
  created: Date;
  lastUsed: Date | null;
}

export interface TOTPConfig {
  userId: UserId;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  verified: boolean;
  backupCodes: string[];
  usedBackupCodes: string[];
}

export interface Certificate {
  id: CertificateId;
  subject: string;
  subjectAltNames: string[];
  issuer: string;
  serialNumber: string;
  notBefore: Date;
  notAfter: Date;
  status: CertificateStatus;
  keyUsage: string[];
  extendedKeyUsage: string[];
  signatureAlgorithm: string;
  isCA: boolean;
  thumbprint: string;
  revocationDate: Date | null;
  revocationReason: string | null;
  issuedBy: CertificateId | null;
  issuedTo: CertificateId[];
  chainLength: number;
  keySize: number;
}

export interface PasswordHash {
  userId: UserId;
  algorithm: string;
  hash: string;
  salt: string;
  iterations: number;
  lastChanged: Date;
}

export interface Session {
  id: SessionId;
  userId: UserId;
  tokenId: TokenId;
  ipAddress: string;
  userAgent: string;
  authProtocol: AuthenticationProtocol;
  startedAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
  mfaVerified: boolean;
  deviceId: string;
  location: string;
  riskScore: number;
}

export interface PAMResource {
  id: PolicyId;
  name: string;
  resourceType: 'server' | 'database' | 'application' | 'network_device' | 'cloud_account';
  address: string;
  credentialType: 'password' | 'ssh_key' | 'certificate';
  rotationInterval: number;
  sessionRecording: boolean;
  justInTime: boolean;
  approvers: UserId[];
  lastRotation: Date | null;
  nextRotation: Date | null;
}

export interface IdentityProviderConfig {
  id: PolicyId;
  name: string;
  providerType: 'entra_id' | 'adfs' | 'okta' | 'ping' | 'keycloak' | 'shibboleth';
  domain: string;
  protocol: AuthenticationProtocol;
  metadataUrl: string;
  signingCertificates: CertificateId[];
  ssoUrl: string;
  sloUrl: string;
  issuer: string;
  enabled: boolean;
}

/* ── DomainManager ── */

export class DomainManager {
  readonly domains = new Map<DomainId, Domain>();
  readonly trusts = new Map<TrustId, DomainTrust>();
  readonly ous = new Map<PolicyId, OrganizationalUnit>();
  readonly gpos = new Map<PolicyId, GroupPolicyObject>();
  readonly gpoLinks = new Map<string, GpoLink>();

  createDomain(name: string, netbiosName: string, level: DomainFunctionalLevel = DomainFunctionalLevel.Windows2016): Domain {
    const d: Domain = {
      id: domainId(),
      name,
      netbiosName,
      functionalLevel: level,
      description: '',
      ouCount: 0,
      userCount: 0,
      groupCount: 0,
      computerCount: 0,
      created: new Date(),
    };
    this.domains.set(d.id, d);
    return d;
  }

  createTrust(src: DomainId, tgt: DomainId, direction: TrustDirection, type: TrustType = TrustType.External): DomainTrust {
    if (!this.domains.has(src) || !this.domains.has(tgt)) return null!;
    const t: DomainTrust = {
      id: trustId(),
      sourceDomain: src,
      targetDomain: tgt,
      direction,
      trustType: type,
      transitive: true,
      sidFiltering: true,
      created: new Date(),
    };
    this.trusts.set(t.id, t);
    return t;
  }

  createOU(domainId: DomainId, name: string, parentId: PolicyId | null = null, description = ''): OrganizationalUnit {
    if (!this.domains.has(domainId)) return null!;
    const ou: OrganizationalUnit = {
      id: policyId(),
      domainId,
      name,
      description,
      parentId,
      protected: false,
    };
    this.ous.set(ou.id, ou);
    const d = this.domains.get(domainId)!;
    d.ouCount = [...this.ous.values()].filter((o) => o.domainId === domainId).length;
    return ou;
  }

  createGPO(domainId: DomainId, name: string): GroupPolicyObject {
    const gpo: GroupPolicyObject = {
      id: policyId(),
      domainId,
      name,
      description: '',
      computerSettings: {},
      userSettings: {},
      version: 1,
      enabled: true,
    };
    this.gpos.set(gpo.id, gpo);
    return gpo;
  }

  linkGPO(gpoId: PolicyId, targetId: PolicyId, targetType: 'domain' | 'ou', enforced = false): GpoLink | null {
    if (!this.gpos.has(gpoId)) return null;
    if (targetType === 'domain' && !this.domains.has(targetId as DomainId)) return null;
    if (targetType === 'ou' && !this.ous.has(targetId)) return null;
    const link: GpoLink = { gpoId, targetId, targetType, enforced, linkOrder: this.gpoLinks.size + 1 };
    const key = `${gpoId}:${targetId}`;
    this.gpoLinks.set(key, link);
    return link;
  }

  getTrustsForDomain(domainId: DomainId): DomainTrust[] {
    return [...this.trusts.values()].filter(
      (t) => t.sourceDomain === domainId || t.targetDomain === domainId,
    );
  }

  getOUSForDomain(domainId: DomainId): OrganizationalUnit[] {
    return [...this.ous.values()].filter((o) => o.domainId === domainId);
  }

  getGPOsForDomain(domainId: DomainId): GroupPolicyObject[] {
    return [...this.gpos.values()].filter((g) => g.domainId === domainId);
  }

  getLinkedGPOs(targetId: PolicyId): GroupPolicyObject[] {
    const links = [...this.gpoLinks.values()].filter((l) => l.targetId === targetId);
    return links.map((l) => this.gpos.get(l.gpoId)).filter(Boolean) as GroupPolicyObject[];
  }
}

/* ── UserManager ── */

export class UserManager {
  readonly users = new Map<UserId, ADUser>();
  readonly groups = new Map<GroupId, ADGroup>();
  readonly passwordHashes = new Map<UserId, PasswordHash>();
  readonly sessions = new Map<SessionId, Session>();
  readonly pamResources = new Map<PolicyId, PAMResource>();

  createUser(domainId: DomainId, samAccountName: string, displayName: string, email: string, title = '', department = ''): ADUser {
    const parts = displayName.split(' ');
    const u: ADUser = {
      id: userId(),
      domainId,
      samAccountName,
      userPrincipalName: `${samAccountName}@${this.getDomainName(domainId)}`,
      displayName,
      givenName: parts[0] || '',
      surname: parts.slice(1).join(' ') || '',
      email,
      phone: '',
      title,
      department,
      manager: null,
      description: '',
      flags: AccountControlFlag.Enabled,
      passwordLastSet: new Date(),
      lastLogon: null,
      badPasswordCount: 0,
      memberOf: [],
      created: new Date(),
      mfaConfigured: false,
      mfaMethods: [],
    };
    this.users.set(u.id, u);
    return u;
  }

  private getDomainName(domainId: DomainId): string {
    for (const d of this.domainManager?.domains.values() ?? []) {
      if (d.id === domainId) return d.name;
    }
    return 'unknown.local';
  }

  private domainManager: DomainManager | null = null;
  private tokenManager: TokenManager | null = null;

  setDomainManager(dm: DomainManager): void { this.domainManager = dm; }
  setTokenManager(tm: TokenManager): void { this.tokenManager = tm; }

  createGroup(domainId: DomainId, name: string, scope: GroupScope = GroupScope.Global, type: GroupType = GroupType.Security): ADGroup {
    const g: ADGroup = {
      id: groupId(),
      domainId,
      name,
      samAccountName: name,
      description: '',
      groupType: type,
      scope,
      members: [],
      memberOf: [],
      created: new Date(),
    };
    this.groups.set(g.id, g);
    return g;
  }

  addUserToGroup(userId: UserId, groupId: GroupId): boolean {
    const u = this.users.get(userId);
    const g = this.groups.get(groupId);
    if (!u || !g) return false;
    if (!g.members.includes(userId)) g.members.push(userId);
    if (!u.memberOf.includes(groupId)) u.memberOf.push(groupId);
    return true;
  }

  removeUserFromGroup(userId: UserId, groupId: GroupId): boolean {
    const u = this.users.get(userId);
    const g = this.groups.get(groupId);
    if (!u || !g) return false;
    g.members = g.members.filter((id) => id !== userId);
    u.memberOf = u.memberOf.filter((id) => id !== groupId);
    return true;
  }

  getGroupMembers(groupId: GroupId): ADUser[] {
    const g = this.groups.get(groupId);
    if (!g) return [];
    return g.members.map((id) => this.users.get(id)).filter(Boolean) as ADUser[];
  }

  setManager(userId: UserId, managerId: UserId): boolean {
    if (!this.users.has(userId) || !this.users.has(managerId)) return false;
    this.users.get(userId)!.manager = managerId;
    return true;
  }

  setPasswordHash(userId: UserId, algorithm: string, hash: string, salt: string, iterations = 1): void {
    this.passwordHashes.set(userId, { userId, algorithm, hash, salt, iterations, lastChanged: new Date() });
  }

  setAccountFlag(userId: UserId, flag: AccountControlFlag, set: boolean): boolean {
    const u = this.users.get(userId);
    if (!u) return false;
    if (set) u.flags |= flag;
    else u.flags &= ~flag;
    return true;
  }

  findUserByUPN(upn: string): ADUser | undefined {
    return [...this.users.values()].find((u) => u.userPrincipalName === upn);
  }

  findUserBySamAccountName(sam: string): ADUser | undefined {
    return [...this.users.values()].find((u) => u.samAccountName === sam);
  }

  getUsersInOU(domainId: DomainId): ADUser[] {
    return [...this.users.values()].filter((u) => u.domainId === domainId);
  }

  configureMFA(userId: UserId, method: MfaMethod): boolean {
    const u = this.users.get(userId);
    if (!u) return false;
    if (!u.mfaMethods.includes(method)) u.mfaMethods.push(method);
    u.mfaConfigured = true;
    return true;
  }

  increaseBadPassword(userId: UserId): number {
    const u = this.users.get(userId);
    if (!u) return -1;
    u.badPasswordCount++;
    if (u.badPasswordCount >= 10) {
      u.flags |= AccountControlFlag.AccountLocked;
    }
    return u.badPasswordCount;
  }

  unlockAccount(userId: UserId): boolean {
    const u = this.users.get(userId);
    if (!u) return false;
    u.flags &= ~AccountControlFlag.AccountLocked;
    u.badPasswordCount = 0;
    return true;
  }

  createSession(userId: UserId, authProtocol: AuthenticationProtocol, ip: string, userAgent: string, tokenId: TokenId): Session {
    const s: Session = {
      id: sessionId(),
      userId,
      tokenId,
      ipAddress: ip,
      userAgent,
      authProtocol,
      startedAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 8 * 3600_000),
      isActive: true,
      mfaVerified: false,
      deviceId: '',
      location: '',
      riskScore: 0,
    };
    this.sessions.set(s.id, s);
    return s;
  }

  createPAMResource(name: string, type: PAMResource['resourceType'], address: string): PAMResource {
    const r: PAMResource = {
      id: policyId(),
      name,
      resourceType: type,
      address,
      credentialType: 'password',
      rotationInterval: 30,
      sessionRecording: true,
      justInTime: false,
      approvers: [],
      lastRotation: null,
      nextRotation: null,
    };
    this.pamResources.set(r.id, r);
    return r;
  }
}

/* ── TokenManager ── */

export class TokenManager {
  readonly tokens = new Map<TokenId, Token>();
  readonly applications = new Map<ApplicationId, OAuthApplication>();
  readonly grants = new Map<TokenId, AuthorizationGrant>();

  registerOAuthApp(
    domainId: DomainId, name: string, redirectUris: string[], scopes: string[],
    confidential = true, requirePKCE = false,
  ): OAuthApplication {
    const app: OAuthApplication = {
      id: applicationId(),
      domainId,
      name,
      clientId: `client-${uid()}`,
      clientSecret: confidential ? `secret-${uid()}` : '',
      redirectUris,
      allowedGrantTypes: ['authorization_code', 'refresh_token'],
      requirePKCE,
      requireConsent: true,
      publicClient: !confidential,
      confidentialClient: confidential,
      scopes,
      created: new Date(),
    };
    this.applications.set(app.id, app);
    return app;
  }

  createAuthorizationGrant(appId: ApplicationId, userId: UserId, redirectUri: string, scopes: string[], codeChallenge: string | null = null): AuthorizationGrant {
    const grant: AuthorizationGrant = {
      id: tokenId(),
      applicationId: appId,
      userId,
      code: `auth-${uid()}`,
      redirectUri,
      scopes,
      codeChallenge,
      codeChallengeMethod: codeChallenge ? 'S256' : null,
      expiresAt: new Date(Date.now() + 600_000),
      used: false,
    };
    this.grants.set(grant.id, grant);
    return grant;
  }

  exchangeAuthorizationGrant(grantId: TokenId): Token | null {
    const grant = this.grants.get(grantId);
    if (!grant || grant.used || grant.expiresAt < new Date()) return null;
    grant.used = true;
    return this.createToken(TokenType.Access, grant.userId, grant.scopes);
  }

  createToken(tokenType: TokenType, subjectId: UserId, scopes: string[], audience: string[] = ['default'], claims: Record<string, string> = {}): Token {
    const now = new Date();
    const exp = new Date(now.getTime() + 3600_000);
    const tok: Token = {
      id: tokenId(),
      tokenType,
      subjectId,
      issuer: 'cybersim',
      audience,
      scopes,
      issuedAt: now,
      expiresAt: exp,
      notBefore: now,
      claims,
      tokenValue: `eyJ-${uid()}`,
      isRevoked: false,
      parentTokenId: null,
    };
    this.tokens.set(tok.id, tok);
    return tok;
  }

  refreshToken(parentTokenId: TokenId): Token | null {
    const parent = this.tokens.get(parentTokenId);
    if (!parent || parent.isRevoked || parent.expiresAt < new Date()) return null;
    const tok = this.createToken(TokenType.Access, parent.subjectId, parent.scopes, parent.audience, parent.claims);
    tok.parentTokenId = parentTokenId;
    return tok;
  }

  revokeToken(tokenId: TokenId): boolean {
    const tok = this.tokens.get(tokenId);
    if (!tok) return false;
    tok.isRevoked = true;
    return true;
  }

  validateToken(tokenValue: string): Token | null {
    for (const tok of this.tokens.values()) {
      if (tok.tokenValue === tokenValue && !tok.isRevoked && tok.expiresAt >= new Date() && tok.notBefore <= new Date()) {
        return tok;
      }
    }
    return null;
  }

  getActiveSessions(userId: UserId): Token[] {
    return [...this.tokens.values()].filter(
      (t) => t.subjectId === userId && !t.isRevoked && t.expiresAt >= new Date(),
    );
  }

  createSamlAssertion(issuer: string, subjectId: UserId, audience: string, attributes: Record<string, string>): SamlAssertion {
    return {
      id: tokenId(),
      issuer,
      subjectId,
      audience,
      conditions: {
        notBefore: new Date(),
        notAfter: new Date(Date.now() + 3600_000),
        audienceRestriction: [audience],
      },
      attributes,
      authnContext: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
      signatureValid: true,
    };
  }
}

/* ── AuthenticationEngine ── */

export interface KerberosAuthResult {
  success: boolean;
  ticket: KerberosTicket | null;
  error: string;
}

export interface NtlmAuthResult {
  success: boolean;
  challenge: string;
  response: string;
  valid: boolean;
  error: string;
}

export interface OAuthAuthResult {
  success: boolean;
  authorizationCode: string | null;
  accessToken: Token | null;
  idToken: Token | null;
  error: string;
}

export class AuthenticationEngine {
  private userManager: UserManager;
  private tokenManager: TokenManager;
  private domainManager: DomainManager;
  readonly tickets = new Map<TokenId, KerberosTicket>();

  constructor(um: UserManager, tm: TokenManager, dm: DomainManager) {
    this.userManager = um;
    this.tokenManager = tm;
    this.domainManager = dm;
  }

  kerberosASRequest(username: string, password: string, domainId: DomainId, encryptionType: KerberosEncryptionType = KerberosEncryptionType.AES256): KerberosAuthResult {
    const user = this.userManager.findUserByUPN(username) ?? this.userManager.findUserBySamAccountName(username);
    if (!user) return { success: false, ticket: null, error: 'Unknown user' };
    if (user.domainId !== domainId) return { success: false, ticket: null, error: 'User not in domain' };
    if (user.flags & AccountControlFlag.AccountLocked) return { success: false, ticket: null, error: 'Account locked' };
    if (password !== 'correct_password' && password !== 'valid_kerberos_pass') {
      this.userManager.increaseBadPassword(user.id);
      return { success: false, ticket: null, error: 'Invalid password' };
    }

    const now = new Date();
    const tgt: KerberosTicket = {
      ticketId: tokenId(),
      domainId,
      clientId: user.id,
      serverId: 'krbtgt/' + (this.domainManager.domains.get(domainId)?.name ?? ''),
      sessionKey: uid(),
      encryptionType,
      startTime: now,
      endTime: new Date(now.getTime() + 10 * 3600_000),
      renewalTime: new Date(now.getTime() + 7 * 24 * 3600_000),
      flags: ['forwardable', 'renewable', 'initial'],
      isTGT: true,
      authorizationData: {},
      serviceName: 'krbtgt',
    };
    this.tickets.set(tgt.ticketId, tgt);
    return { success: true, ticket: tgt, error: '' };
  }

  kerberosTGSRequest(tgtId: TokenId, servicePrincipal: string): KerberosAuthResult {
    const tgt = this.tickets.get(tgtId);
    if (!tgt) return { success: false, ticket: null, error: 'No TGT found' };
    if (tgt.endTime < new Date()) return { success: false, ticket: null, error: 'TGT expired' };

    const now = new Date();
    const st: KerberosTicket = {
      ticketId: tokenId(),
      domainId: tgt.domainId,
      clientId: tgt.clientId,
      serverId: servicePrincipal,
      sessionKey: uid(),
      encryptionType: tgt.encryptionType,
      startTime: now,
      endTime: new Date(now.getTime() + 1 * 3600_000),
      renewalTime: new Date(now.getTime() + 24 * 3600_000),
      flags: ['forwardable'],
      isTGT: false,
      authorizationData: {},
      serviceName: servicePrincipal,
    };
    this.tickets.set(st.ticketId, st);
    return { success: true, ticket: st, error: '' };
  }

  kerberosGetDelegationTicket(tgtId: TokenId, servicePrincipal: string, delegateTo: string): KerberosAuthResult {
    const tgt = this.tickets.get(tgtId);
    if (!tgt) return { success: false, ticket: null, error: 'No TGT found' };
    const user = this.userManager.users.get(tgt.clientId);
    if (!user || !(user.flags & AccountControlFlag.TrustedForDelegation)) {
      return { success: false, ticket: null, error: 'User not trusted for delegation' };
    }

    const now = new Date();
    const deleg: KerberosTicket = {
      ticketId: tokenId(),
      domainId: tgt.domainId,
      clientId: tgt.clientId,
      serverId: `${delegateTo}@${servicePrincipal}`,
      sessionKey: uid(),
      encryptionType: tgt.encryptionType,
      startTime: now,
      endTime: new Date(now.getTime() + 3600_000),
      renewalTime: now,
      flags: ['forwardable', 'ok-as-delegate', 'delegated'],
      isTGT: false,
      authorizationData: { delegateTo },
      serviceName: servicePrincipal,
    };
    this.tickets.set(deleg.ticketId, deleg);
    return { success: true, ticket: deleg, error: '' };
  }

  ntlmAuthenticate(username: string, password: string): NtlmAuthResult {
    const user = this.userManager.findUserByUPN(username) ?? this.userManager.findUserBySamAccountName(username);
    if (!user) return { success: false, challenge: '', response: '', valid: false, error: 'Unknown user' };

    const challenge = uid();
    const valid = password === 'correct_password' || password === 'valid_ntlm_pass';
    const response = valid ? `ntlm-response-${challenge}` : 'invalid-ntlm-response';
    return { success: valid, challenge, response, valid, error: valid ? '' : 'Invalid credentials' };
  }

  oauthAuthorizationCodeGrant(appId: ApplicationId, userId: UserId, redirectUri: string, scopes: string[]): OAuthAuthResult {
    const app = this.tokenManager.applications.get(appId);
    if (!app) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Unknown application' };
    if (!app.redirectUris.includes(redirectUri)) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Invalid redirect URI' };
    if (!app.scopes.every((s) => scopes.includes(s) || scopes.every((s2) => app.scopes.includes(s2))))
      return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Invalid scopes' };

    const grant = this.tokenManager.createAuthorizationGrant(appId, userId, redirectUri, scopes);
    return {
      success: true,
      authorizationCode: grant.code,
      accessToken: null,
      idToken: null,
      error: '',
    };
  }

  oauthTokenExchange(authorizationCode: string, appId: ApplicationId, codeVerifier: string | null = null): OAuthAuthResult {
    const grant = [...this.tokenManager.grants.values()].find((g) => g.code === authorizationCode);
    if (!grant) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Invalid authorization code' };
    if (grant.used || grant.expiresAt < new Date()) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Authorization code expired or used' };
    if (grant.applicationId !== appId.id) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Application mismatch' };

    const app = this.tokenManager.applications.get(appId);
    if (app?.requirePKCE && grant.codeChallenge) {
      if (!codeVerifier) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'PKCE required' };
    }

    const accessToken = this.tokenManager.exchangeAuthorizationGrant(grant.id);
    if (!accessToken) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Token exchange failed' };

    return { success: true, authorizationCode: grant.code, accessToken, idToken: null, error: '' };
  }

  oauthClientCredentialsGrant(appId: ApplicationId, requestedScopes: string[]): OAuthAuthResult {
    const app = this.tokenManager.applications.get(appId);
    if (!app || !app.confidentialClient) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'Invalid or non-confidential client' };
    const allowedScopes = requestedScopes.filter((s) => app.scopes.includes(s));
    if (allowedScopes.length === 0) return { success: false, authorizationCode: null, accessToken: null, idToken: null, error: 'No valid scopes' };

    const at = this.tokenManager.createToken(TokenType.ClientCredentials, '' as UserId, allowedScopes, [app.clientId]);
    return { success: true, authorizationCode: null, accessToken: at, idToken: null, error: '' };
  }

  samlSSO(issuer: string, subjectId: UserId, audience: string, attributes: Record<string, string>): SamlAssertion {
    return this.tokenManager.createSamlAssertion(issuer, subjectId, audience, attributes);
  }

  fido2Authenticate(credentialId: string, signature: string, counter: number): boolean {
    return counter > 0 && signature.length > 0;
  }

  totpValidate(secret: string, code: string): boolean {
    return code.length === 6 && /^\d{6}$/.test(code);
  }
}

/* ── PasswordAnalyzer ── */

export interface PasswordStrengthResult {
  score: PasswordScore;
  length: number;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  entropy: number;
  crackTimeMs: number;
  isCommon: boolean;
  isLeaked: boolean;
  feedback: string[];
}

export interface CrackResult {
  cracked: boolean;
  password: string | null;
  method: string;
  attempts: number;
  timeMs: number;
}

export class PasswordAnalyzer {
  private commonPasswords = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'dragon', '111111', 'baseball', 'iloveyou', 'trustno1',
    'sunshine', 'master', 'welcome', 'shadow', 'ashley', 'football',
    'jesus', 'michael', 'ninja', 'mustang', 'password1', 'admin',
    'administrator', 'Passw0rd', 'P@ssw0rd', 'changeme', 'default',
    'root', 'toor', 'ubuntu', 'raspberry', 'Password123', 'Summer2024',
    'Company123', 'Welcome1', 'qwerty123', '123456789', 'test',
    'guest', 'temp', 'temp123', 'pass', 'pass123', 'secret',
  ]);

  private leakedPasswords = new Set([
    'P@ssw0rd!', 'Welcome123', 'Summer2024!', 'Admin123!',
    'Password1!', 'changeme123', 'Company2024', 'Qwerty123!',
    '1q2w3e4r', 'Pass1234', 'passw0rd', 'Pa$$w0rd',
  ]);

  analyzePassword(password: string): PasswordStrengthResult {
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isCommon = this.commonPasswords.has(password.toLowerCase());
    const isLeaked = this.leakedPasswords.has(password);

    const charsetSize = (hasUpper ? 26 : 0) + (hasLower ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 32 : 0);
    const entropy = charsetSize > 0 ? length * Math.log2(charsetSize) : 0;
    const crackTimeMs = isCommon || isLeaked ? 1 : entropy < 30 ? 100 : entropy < 50 ? 3600_000 : entropy < 70 ? 86400_000 : entropy < 90 ? 30 * 86400_000 : 365 * 86400_000;

    let score = PasswordScore.VeryWeak;
    if (length >= 8 && hasUpper && hasLower && hasDigit) score = PasswordScore.Weak;
    if (length >= 10 && hasUpper && hasLower && hasDigit && hasSpecial) score = PasswordScore.Moderate;
    if (length >= 12 && hasUpper && hasLower && hasDigit && hasSpecial) score = PasswordScore.Strong;
    if (length >= 16 && hasUpper && hasLower && hasDigit && hasSpecial && !isCommon && !isLeaked) score = PasswordScore.VeryStrong;

    if (isCommon) score = PasswordScore.VeryWeak;
    if (isLeaked && score as number > PasswordScore.Weak) score = PasswordScore.Weak;

    const feedback: string[] = [];
    if (length < 8) feedback.push('Password is too short');
    if (!hasUpper) feedback.push('Add uppercase letters');
    if (!hasLower) feedback.push('Add lowercase letters');
    if (!hasDigit) feedback.push('Add digits');
    if (!hasSpecial) feedback.push('Add special characters');
    if (isCommon) feedback.push('This password is very common');
    if (isLeaked) feedback.push('This password appears in known data breaches');
    if (length >= 8 && !isCommon && !isLeaked && hasUpper && hasLower && hasDigit) feedback.push('Password meets minimum requirements');

    return { score, length, hasUpper, hasLower, hasDigit, hasSpecial, entropy, crackTimeMs, isCommon, isLeaked, feedback };
  }

  crackNtlmHash(hash: string, wordlist: string[]): CrackResult {
    const start = Date.now();
    for (let i = 0; i < wordlist.length; i++) {
      const candidate = wordlist[i];
      const candidateHash = this.simulateNtlmHash(candidate);
      if (candidateHash === hash.toLowerCase()) {
        return { cracked: true, password: candidate, method: 'Dictionary Attack', attempts: i + 1, timeMs: Date.now() - start || 1 };
      }
    }
    return { cracked: false, password: null, method: 'Dictionary Attack', attempts: wordlist.length, timeMs: Date.now() - start || 1 };
  }

  private simulateNtlmHash(input: string): string {
    let hash = '';
    for (let i = 0; i < input.length; i++) {
      hash += (input.charCodeAt(i) * 31 + i * 17).toString(16).padStart(2, '0');
    }
    return hash.padEnd(32, '0').slice(0, 32);
  }

  passwordSpray(usernames: string[], commonPassword: string): { user: string; success: boolean }[] {
    return usernames.map((u) => ({
      user: u,
      success: !this.commonPasswords.has(commonPassword) && commonPassword.length >= 8,
    }));
  }
}

/* ── CertificateAuthority ── */

export class CertificateAuthority {
  readonly certificates = new Map<CertificateId, Certificate>();
  readonly rootCAs = new Set<CertificateId>();
  readonly intermediateCAs = new Set<CertificateId>();
  private serialCounter = 1;

  createRootCA(subject: string, keySize = 4096): Certificate {
    const cert = this.createCertificate(subject, ['digitalSignature', 'keyCertSign', 'cRLSign'], ['serverAuth', 'clientAuth'], true, keySize);
    cert.issuer = subject;
    cert.chainLength = 1;
    this.rootCAs.add(cert.id);
    return cert;
  }

  createIntermediateCA(subject: string, parentCA: CertificateId): Certificate | null {
    const parent = this.certificates.get(parentCA);
    if (!parent || !parent.isCA) return null;
    const cert = this.createCertificate(subject, ['digitalSignature', 'keyCertSign', 'cRLSign'], ['serverAuth', 'clientAuth'], true, 2048);
    cert.issuer = parent.subject;
    cert.issuedBy = parentCA;
    cert.chainLength = parent.chainLength + 1;
    parent.issuedTo.push(cert.id);
    this.intermediateCAs.add(cert.id);
    return cert;
  }

  issueServerCertificate(commonName: string, subjectAltNames: string[], caId: CertificateId, keySize = 2048): Certificate | null {
    const ca = this.certificates.get(caId);
    if (!ca || !ca.isCA) return null;
    const cert = this.createCertificate(`CN=${commonName}`, ['digitalSignature', 'keyEncipherment'], ['serverAuth'], false, keySize);
    cert.issuer = ca.subject;
    cert.subjectAltNames = subjectAltNames;
    cert.issuedBy = caId;
    cert.chainLength = ca.chainLength + 1;
    ca.issuedTo.push(cert.id);
    return cert;
  }

  issueClientCertificate(commonName: string, caId: CertificateId): Certificate | null {
    const ca = this.certificates.get(caId);
    if (!ca || !ca.isCA) return null;
    const cert = this.createCertificate(`CN=${commonName}`, ['digitalSignature'], ['clientAuth'], false, 2048);
    cert.issuer = ca.subject;
    cert.issuedBy = caId;
    cert.chainLength = ca.chainLength + 1;
    ca.issuedTo.push(cert.id);
    return cert;
  }

  revokeCertificate(certId: CertificateId, reason: string): boolean {
    const cert = this.certificates.get(certId);
    if (!cert) return false;
    cert.status = CertificateStatus.Revoked;
    cert.revocationDate = new Date();
    cert.revocationReason = reason;
    return true;
  }

  validateCertificate(certId: CertificateId): boolean {
    const cert = this.certificates.get(certId);
    if (!cert) return false;
    if (cert.status === CertificateStatus.Revoked || cert.status === CertificateStatus.Compromised) return false;
    if (cert.status === CertificateStatus.Expired || cert.notAfter < new Date()) {
      cert.status = CertificateStatus.Expired;
      return false;
    }
    const now = new Date();
    if (cert.notBefore > now || cert.notAfter < now) return false;
    return true;
  }

  getCertificateChain(certId: CertificateId): Certificate[] {
    const chain: Certificate[] = [];
    let current = this.certificates.get(certId);
    while (current) {
      chain.push(current);
      current = current.issuedBy ? this.certificates.get(current.issuedBy) : undefined;
    }
    return chain;
  }

  findExpiredCertificates(): Certificate[] {
    const now = new Date();
    return [...this.certificates.values()].filter((c) => c.notAfter < now);
  }

  findCompromisedCertificates(): Certificate[] {
    return [...this.certificates.values()].filter((c) => c.status === CertificateStatus.Compromised);
  }

  private createCertificate(subject: string, keyUsage: string[], extKeyUsage: string[], isCA: boolean, keySize: number): Certificate {
    const now = new Date();
    const serial = `00${this.serialCounter++.toString(16).toUpperCase().padStart(16, '0')}`;
    const thumbprint = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const cert: Certificate = {
      id: certificateId(),
      subject,
      subjectAltNames: [],
      issuer: '',
      serialNumber: serial,
      notBefore: new Date(now.getTime() - 3600_000),
      notAfter: new Date(now.getTime() + (isCA ? 10 : 2) * 365 * 86400_000),
      status: CertificateStatus.Valid,
      keyUsage,
      extendedKeyUsage: extKeyUsage,
      signatureAlgorithm: isCA && keySize >= 4096 ? 'sha512WithRSAEncryption' : 'sha256WithRSAEncryption',
      isCA,
      thumbprint,
      revocationDate: null,
      revocationReason: null,
      issuedBy: null,
      issuedTo: [],
      chainLength: 0,
      keySize,
    };
    this.certificates.set(cert.id, cert);
    return cert;
  }
}

/* ── IdentityProviderSimulator ── */

export class IdentityProviderSimulator {
  readonly providers = new Map<PolicyId, IdentityProviderConfig>();
  readonly signOnLogs: Array<{ userId: UserId; providerId: PolicyId; success: boolean; timestamp: Date; ip: string; }> = [];

  createProvider(config: Omit<IdentityProviderConfig, 'id'>): IdentityProviderConfig {
    const p: IdentityProviderConfig = { ...config, id: policyId() };
    this.providers.set(p.id, p);
    return p;
  }

  simulateSSO(providerId: PolicyId, userId: UserId, ip: string): boolean {
    const p = this.providers.get(providerId);
    if (!p || !p.enabled) return false;
    const success = true;
    this.signOnLogs.push({ userId, providerId, success, timestamp: new Date(), ip });
    return success;
  }

  simulateSSOFailure(providerId: PolicyId, userId: UserId, ip: string): boolean {
    const p = this.providers.get(providerId);
    if (!p || !p.enabled) return false;
    this.signOnLogs.push({ userId, providerId, success: false, timestamp: new Date(), ip });
    return false;
  }

  getLatestLogs(count = 10) {
    return this.signOnLogs.slice(-count).reverse();
  }

  getProviderStats(providerId: PolicyId): { total: number; success: number; failure: number; } {
    const logs = this.signOnLogs.filter((l) => l.providerId === providerId);
    return {
      total: logs.length,
      success: logs.filter((l) => l.success).length,
      failure: logs.filter((l) => !l.success).length,
    };
  }
}

/* ── IdentityCoordinator ── */

export class IdentityCoordinator {
  readonly domainManager: DomainManager;
  readonly userManager: UserManager;
  readonly tokenManager: TokenManager;
  readonly authEngine: AuthenticationEngine;
  readonly passwordAnalyzer: PasswordAnalyzer;
  readonly certificateAuthority: CertificateAuthority;
  readonly identityProvider: IdentityProviderSimulator;

  constructor() {
    this.domainManager = new DomainManager();
    this.userManager = new UserManager();
    this.tokenManager = new TokenManager();
    this.authEngine = new AuthenticationEngine(this.userManager, this.tokenManager, this.domainManager);
    this.passwordAnalyzer = new PasswordAnalyzer();
    this.certificateAuthority = new CertificateAuthority();
    this.identityProvider = new IdentityProviderSimulator();
    this.userManager.setDomainManager(this.domainManager);
    this.userManager.setTokenManager(this.tokenManager);
  }

  createDefaultEnterprise(): {
    domain: Domain;
    users: ADUser[];
    groups: ADGroup[];
    applications: OAuthApplication[];
    rootCA: Certificate;
  } {
    const domain = this.domainManager.createDomain('cybersim.corp', 'CYBERSIM', DomainFunctionalLevel.Windows2022);
    this.domainManager.createOU(domain.id, 'Users');
    this.domainManager.createOU(domain.id, 'Computers');
    this.domainManager.createOU(domain.id, 'Servers');
    this.domainManager.createOU(domain.id, 'Admins');
    this.domainManager.createOU(domain.id, 'ServiceAccounts');

    const admins = this.userManager.createGroup(domain.id, 'Domain Admins', GroupScope.Global);
    const users_g = this.userManager.createGroup(domain.id, 'Domain Users', GroupScope.Global);
    const analysts = this.userManager.createGroup(domain.id, 'Security Analysts', GroupScope.Global);
    const engineers = this.userManager.createGroup(domain.id, 'Security Engineers', GroupScope.Global);
    const soc = this.userManager.createGroup(domain.id, 'SOC Team', GroupScope.Global);

    const usernames = [
      { sam: 'admin', name: 'Alice Admin', email: 'alice@cybersim.corp', title: 'Domain Admin', dept: 'IT', groups: [admins, users_g] },
      { sam: 'jane.doe', name: 'Jane Doe', email: 'jane@cybersim.corp', title: 'Security Analyst', dept: 'SOC', groups: [analysts, users_g, soc] },
      { sam: 'john.smith', name: 'John Smith', email: 'john@cybersim.corp', title: 'Security Engineer', dept: 'Engineering', groups: [engineers, users_g] },
      { sam: 'bob.jones', name: 'Bob Jones', email: 'bob@cybersim.corp', title: 'SOC Analyst', dept: 'SOC', groups: [analysts, users_g, soc] },
      { sam: 'svc_monitor', name: 'Monitor Service', email: 'monitor@cybersim.corp', title: 'Service Account', dept: 'IT', groups: [users_g] },
    ];

    const users: ADUser[] = [];
    for (const u of usernames) {
      const user = this.userManager.createUser(domain.id, u.sam, u.name, u.email, u.title, u.dept);
      if (u.sam === 'svc_monitor') {
        this.userManager.setAccountFlag(user.id, AccountControlFlag.ServiceAccount, true);
      }
      for (const g of u.groups) {
        this.userManager.addUserToGroup(user.id, g.id);
      }
      users.push(user);
    }

    this.userManager.setManager(users[1].id, users[0].id);
    this.userManager.setManager(users[2].id, users[0].id);
    this.userManager.setManager(users[3].id, users[1].id);

    const rootCA = this.certificateAuthority.createRootCA('CN=Cybersim Root CA');
    const interCA = this.certificateAuthority.createIntermediateCA('CN=Cybersim Issuing CA', rootCA.id);
    if (interCA) {
      this.certificateAuthority.issueServerCertificate('*.cybersim.corp', ['cybersim.corp', '*.cybersim.corp'], interCA.id);
    }

    const app = this.tokenManager.registerOAuthApp(
      domain.id, 'Cybersim Portal', ['https://portal.cybersim.io/callback'],
      ['openid', 'profile', 'email', 'offline_access'], true, true,
    );

    return { domain, users, groups: [admins, users_g, analysts, engineers, soc], applications: [app], rootCA };
  }

  getUserOverview(): Array<{
    user: ADUser;
    groupCount: number;
    sessionCount: number;
    mfaStatus: string;
    riskLevel: string;
  }> {
    return [...this.userManager.users.values()].map((u) => ({
      user: u,
      groupCount: u.memberOf.length,
      sessionCount: [...this.userManager.sessions.values()].filter((s) => s.userId === u.id && s.isActive).length,
      mfaStatus: u.mfaConfigured ? 'MFA Enabled' : 'MFA Not Configured',
      riskLevel: u.flags & AccountControlFlag.AccountLocked ? 'Critical' :
        u.flags & AccountControlFlag.PasswordExpired ? 'High' :
        u.badPasswordCount > 5 ? 'Medium' : 'Low',
    }));
  }

  runPasswordAudit(): Array<{ user: ADUser; score: PasswordScore; feedback: string[]; }> {
    const results: Array<{ user: ADUser; score: PasswordScore; feedback: string[]; }> = [];
    for (const user of this.userManager.users.values()) {
      const analysis = this.passwordAnalyzer.analyzePassword('dummy_password_for_audit');
      results.push({ user, score: analysis.score, feedback: analysis.feedback });
    }
    return results;
  }
}
