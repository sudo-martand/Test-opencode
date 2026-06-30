import { describe, it, expect } from 'vitest';
import {
  DomainManager, UserManager, TokenManager,
  AuthenticationEngine, PasswordAnalyzer, CertificateAuthority,
  IdentityProviderSimulator, IdentityCoordinator,
  DomainFunctionalLevel, TrustDirection, TrustType,
  GroupScope, GroupType, AccountControlFlag, MfaMethod,
  AuthenticationProtocol, TokenType, KerberosEncryptionType,
  PasswordScore, CertificateStatus,
} from '../index';

/* ── DomainManager ── */

describe('DomainManager', () => {
  it('creates a domain', () => {
    const dm = new DomainManager();
    const d = dm.createDomain('test.corp', 'TEST', DomainFunctionalLevel.Windows2019);
    expect(d.id).toBeTruthy();
    expect(d.name).toBe('test.corp');
    expect(d.netbiosName).toBe('TEST');
    expect(d.functionalLevel).toBe(DomainFunctionalLevel.Windows2019);
  });

  it('creates trust relationships', () => {
    const dm = new DomainManager();
    const a = dm.createDomain('a.corp', 'A');
    const b = dm.createDomain('b.corp', 'B');
    const t = dm.createTrust(a.id, b.id, TrustDirection.Bidirectional, TrustType.Forest);
    expect(t.sourceDomain).toBe(a.id);
    expect(t.targetDomain).toBe(b.id);
    expect(t.direction).toBe(TrustDirection.Bidirectional);
    expect(t.trustType).toBe(TrustType.Forest);
    expect(t.transitive).toBe(true);
    expect(t.sidFiltering).toBe(true);
  });

  it('returns trusts for a domain', () => {
    const dm = new DomainManager();
    const a = dm.createDomain('a.corp', 'A');
    const b = dm.createDomain('b.corp', 'B');
    const c = dm.createDomain('c.corp', 'C');
    dm.createTrust(a.id, b.id, TrustDirection.Bidirectional);
    dm.createTrust(c.id, a.id, TrustDirection.Outbound);
    const trusts = dm.getTrustsForDomain(a.id);
    expect(trusts.length).toBe(2);
  });

  it('creates OUs', () => {
    const dm = new DomainManager();
    const d = dm.createDomain('corp', 'CORP');
    const ou = dm.createOU(d.id, 'Servers');
    expect(ou.domainId).toBe(d.id);
    expect(ou.name).toBe('Servers');
    expect(ou.parentId).toBeNull();
    expect(ou.protected).toBe(false);
  });

  it('creates nested OUs', () => {
    const dm = new DomainManager();
    const d = dm.createDomain('corp', 'CORP');
    const parent = dm.createOU(d.id, 'Admins');
    const child = dm.createOU(d.id, 'Domain Admins', parent.id);
    expect(child.parentId).toBe(parent.id);
  });

  it('lists OUs for a domain', () => {
    const dm = new DomainManager();
    const a = dm.createDomain('a', 'A');
    const b = dm.createDomain('b', 'B');
    dm.createOU(a.id, 'OU1');
    dm.createOU(a.id, 'OU2');
    dm.createOU(b.id, 'OU3');
    expect(dm.getOUSForDomain(a.id).length).toBe(2);
    expect(dm.getOUSForDomain(b.id).length).toBe(1);
  });

  it('creates and links GPOs', () => {
    const dm = new DomainManager();
    const d = dm.createDomain('corp', 'CORP');
    const gpo = dm.createGPO(d.id, 'Default Domain Policy');
    expect(gpo.version).toBe(1);
    expect(gpo.enabled).toBe(true);

    const link = dm.linkGPO(gpo.id, d.id, 'domain');
    expect(link).not.toBeNull();
    expect(link!.gpoId).toBe(gpo.id);
    expect(link!.targetId).toBe(d.id);

    const linked = dm.getLinkedGPOs(d.id);
    expect(linked.length).toBe(1);
    expect(linked[0].name).toBe('Default Domain Policy');
  });

  it('returns GPOs for a domain', () => {
    const dm = new DomainManager();
    const a = dm.createDomain('a', 'A');
    const b = dm.createDomain('b', 'B');
    dm.createGPO(a.id, 'GPO1');
    dm.createGPO(a.id, 'GPO2');
    dm.createGPO(b.id, 'GPO3');
    expect(dm.getGPOsForDomain(a.id).length).toBe(2);
  });
});

/* ── UserManager ── */

describe('UserManager', () => {
  it('creates a user', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane Doe', 'jane@corp.com', 'Analyst', 'SOC');
    expect(u.samAccountName).toBe('jdoe');
    expect(u.displayName).toBe('Jane Doe');
    expect(u.email).toBe('jane@corp.com');
    expect(u.title).toBe('Analyst');
    expect(u.department).toBe('SOC');
    expect(u.memberOf).toEqual([]);
    expect(u.flags & AccountControlFlag.Enabled).toBe(AccountControlFlag.Enabled);
  });

  it('creates groups', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const g = um.createGroup(d.id, 'Domain Admins', GroupScope.Global);
    expect(g.name).toBe('Domain Admins');
    expect(g.scope).toBe(GroupScope.Global);
    expect(g.groupType).toBe(GroupType.Security);
  });

  it('adds user to group', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane Doe', 'j@c.com');
    const g = um.createGroup(d.id, 'Analysts');
    expect(um.addUserToGroup(u.id, g.id)).toBe(true);
    expect(g.members).toContain(u.id);
    expect(u.memberOf).toContain(g.id);
  });

  it('removes user from group', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane Doe', 'j@c.com');
    const g = um.createGroup(d.id, 'Analysts');
    um.addUserToGroup(u.id, g.id);
    expect(um.removeUserFromGroup(u.id, g.id)).toBe(true);
    expect(g.members).not.toContain(u.id);
    expect(u.memberOf).not.toContain(g.id);
  });

  it('gets group members', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u1 = um.createUser(d.id, 'a', 'A', 'a@c.com');
    const u2 = um.createUser(d.id, 'b', 'B', 'b@c.com');
    const g = um.createGroup(d.id, 'Group');
    um.addUserToGroup(u1.id, g.id);
    um.addUserToGroup(u2.id, g.id);
    const members = um.getGroupMembers(g.id);
    expect(members.length).toBe(2);
  });

  it('sets manager', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const mgr = um.createUser(d.id, 'admin', 'Admin', 'admin@c.com');
    const emp = um.createUser(d.id, 'emp', 'Emp', 'emp@c.com');
    expect(um.setManager(emp.id, mgr.id)).toBe(true);
    expect(emp.manager).toBe(mgr.id);
  });

  it('finds user by UPN and SAM', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    um.createUser(d.id, 'jdoe', 'Jane Doe', 'jane@corp.com');
    expect(um.findUserByUPN('jdoe@corp')).toBeDefined();
    expect(um.findUserBySamAccountName('jdoe')).toBeDefined();
    expect(um.findUserByUPN('nonexistent')).toBeUndefined();
  });

  it('manages account flags', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane', 'j@c.com');
    um.setAccountFlag(u.id, AccountControlFlag.PasswordNeverExpires, true);
    expect(u.flags & AccountControlFlag.PasswordNeverExpires).toBe(AccountControlFlag.PasswordNeverExpires);
    um.setAccountFlag(u.id, AccountControlFlag.PasswordNeverExpires, false);
    expect(u.flags & AccountControlFlag.PasswordNeverExpires).toBe(0);
  });

  it('handles bad passwords and lockout', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane', 'j@c.com');
    for (let i = 0; i < 10; i++) um.increaseBadPassword(u.id);
    expect(u.flags & AccountControlFlag.AccountLocked).toBe(AccountControlFlag.AccountLocked);
    expect(um.unlockAccount(u.id)).toBe(true);
    expect(u.flags & AccountControlFlag.AccountLocked).toBe(0);
    expect(u.badPasswordCount).toBe(0);
  });

  it('configures MFA', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane', 'j@c.com');
    expect(um.configureMFA(u.id, MfaMethod.TOTP)).toBe(true);
    expect(u.mfaConfigured).toBe(true);
    expect(u.mfaMethods).toContain(MfaMethod.TOTP);
  });

  it('creates sessions', () => {
    const um = new UserManager();
    const dm = new DomainManager();
    um.setDomainManager(dm);
    const d = dm.createDomain('corp', 'CORP');
    const u = um.createUser(d.id, 'jdoe', 'Jane', 'j@c.com');
    const s = um.createSession(u.id, AuthenticationProtocol.Kerberos, '10.0.0.1', 'Mozilla/5.0', '' as any);
    expect(s.isActive).toBe(true);
    expect(s.authProtocol).toBe(AuthenticationProtocol.Kerberos);
    expect(s.ipAddress).toBe('10.0.0.1');
  });

  it('creates PAM resources', () => {
    const um = new UserManager();
    const r = um.createPAMResource('DC-01', 'server', '10.0.0.10');
    expect(r.name).toBe('DC-01');
    expect(r.sessionRecording).toBe(true);
    expect(r.lastRotation).toBeNull();
  });
});

/* ── TokenManager ── */

describe('TokenManager', () => {
  it('registers OAuth applications', () => {
    const tm = new TokenManager();
    const app = tm.registerOAuthApp('' as any, 'MyApp', ['https://app.io/cb'], ['openid', 'profile']);
    expect(app.clientId).toBeTruthy();
    expect(app.clientSecret).toBeTruthy();
    expect(app.confidentialClient).toBe(true);
    expect(app.requirePKCE).toBe(false);
    expect(app.scopes).toContain('openid');
  });

  it('creates public OAuth client', () => {
    const tm = new TokenManager();
    const app = tm.registerOAuthApp('' as any, 'SPA', ['https://spa.io/cb'], ['openid'], false);
    expect(app.publicClient).toBe(true);
    expect(app.confidentialClient).toBe(false);
    expect(app.clientSecret).toBe('');
  });

  it('creates and exchanges authorization grant', () => {
    const tm = new TokenManager();
    const app = tm.registerOAuthApp('' as any, 'App', ['https://app.io/cb'], ['openid']);
    const grant = tm.createAuthorizationGrant(app.id, '' as any, 'https://app.io/cb', ['openid']);
    expect(grant.code).toBeTruthy();
    expect(grant.used).toBe(false);

    const token = tm.exchangeAuthorizationGrant(grant.id);
    expect(token).not.toBeNull();
    expect(grant.used).toBe(true);
  });

  it('rejects expired grants', () => {
    const tm = new TokenManager();
    const app = tm.registerOAuthApp('' as any, 'App', ['https://app.io/cb'], ['openid']);
    const grant = tm.createAuthorizationGrant(app.id, '' as any, 'https://app.io/cb', ['openid']);
    grant.expiresAt = new Date(Date.now() - 1000);
    const token = tm.exchangeAuthorizationGrant(grant.id);
    expect(token).toBeNull();
  });

  it('creates tokens', () => {
    const tm = new TokenManager();
    const t = tm.createToken(TokenType.Access, '' as any, ['read', 'write']);
    expect(t.tokenType).toBe(TokenType.Access);
    expect(t.isRevoked).toBe(false);
    expect(t.scopes).toEqual(['read', 'write']);
    expect(t.tokenValue).toBeTruthy();
  });

  it('refreshes tokens', () => {
    const tm = new TokenManager();
    const parent = tm.createToken(TokenType.Access, '' as any, ['read']);
    const child = tm.refreshToken(parent.id);
    expect(child).not.toBeNull();
    expect(child!.parentTokenId).toBe(parent.id);
    expect(child!.id).not.toBe(parent.id);
  });

  it('rejects refresh of revoked token', () => {
    const tm = new TokenManager();
    const t = tm.createToken(TokenType.Access, '' as any, ['read']);
    tm.revokeToken(t.id);
    expect(tm.refreshToken(t.id)).toBeNull();
  });

  it('validates tokens', () => {
    const tm = new TokenManager();
    const t = tm.createToken(TokenType.Access, '' as any, ['read']);
    const validated = tm.validateToken(t.tokenValue);
    expect(validated).not.toBeNull();
    expect(validated!.id).toBe(t.id);
  });

  it('rejects revoked tokens', () => {
    const tm = new TokenManager();
    const t = tm.createToken(TokenType.Access, '' as any, ['read']);
    tm.revokeToken(t.id);
    expect(tm.validateToken(t.tokenValue)).toBeNull();
  });

  it('gets active sessions for user', () => {
    const tm = new TokenManager();
    const user2 = '' as any;
    tm.createToken(TokenType.Access, user2, ['read']);
    tm.createToken(TokenType.Access, user2, ['write']);
    tm.createToken(TokenType.Access, 'other-user' as any, ['admin']); // different user
    expect(tm.getActiveSessions(user2).length).toBe(2);
  });

  it('creates SAML assertions', () => {
    const tm = new TokenManager();
    const saml = tm.createSamlAssertion('https://idp.corp/saml', '' as any, 'https://sp.corp/saml', { email: 'user@corp.com' });
    expect(saml.issuer).toBe('https://idp.corp/saml');
    expect(saml.audience).toBe('https://sp.corp/saml');
    expect(saml.attributes.email).toBe('user@corp.com');
    expect(saml.signatureValid).toBe(true);
  });
});

/* ── AuthenticationEngine ── */

describe('AuthenticationEngine', () => {
  function setup() {
    const dm = new DomainManager();
    const um = new UserManager();
    const tm = new TokenManager();
    um.setDomainManager(dm);
    um.setTokenManager(tm);
    const engine = new AuthenticationEngine(um, tm, dm);
    const domain = dm.createDomain('corp', 'CORP');
    const user = um.createUser(domain.id, 'jdoe', 'Jane Doe', 'jane@corp.com');
    return { dm, um, tm, engine, domain, user };
  }

  describe('Kerberos', () => {
    it('handles AS request with valid credentials', () => {
      const { engine, user } = setup();
      const result = engine.kerberosASRequest('jdoe@corp', 'correct_password', user.domainId);
      expect(result.success).toBe(true);
      expect(result.ticket).not.toBeNull();
      expect(result.ticket!.isTGT).toBe(true);
      expect(result.ticket!.clientId).toBe(user.id);
    });

    it('rejects AS request with wrong password', () => {
      const { engine, user } = setup();
      const result = engine.kerberosASRequest('jdoe', 'wrong_password', user.domainId);
      expect(result.success).toBe(false);
      expect(result.ticket).toBeNull();
    });

    it('rejects unknown user', () => {
      const { engine, domain } = setup();
      const result = engine.kerberosASRequest('nobody@corp.com', 'pass', domain.id);
      expect(result.success).toBe(false);
    });

    it('handles TGS request', () => {
      const { engine, user } = setup();
      const as = engine.kerberosASRequest('jdoe', 'correct_password', user.domainId);
      const tgs = engine.kerberosTGSRequest(as.ticket!.ticketId, 'HTTP/www.corp.com');
      expect(tgs.success).toBe(true);
      expect(tgs.ticket!.isTGT).toBe(false);
      expect(tgs.ticket!.serviceName).toBe('HTTP/www.corp.com');
    });

    it('rejects TGS request with expired TGT', () => {
      const { engine, user } = setup();
      const as = engine.kerberosASRequest('jdoe', 'correct_password', user.domainId);
      as.ticket!.endTime = new Date(Date.now() - 1000);
      const tgs = engine.kerberosTGSRequest(as.ticket!.ticketId, 'HTTP/www.corp.com');
      expect(tgs.success).toBe(false);
    });

    it('handles delegation when user is trusted', () => {
      const { engine, um, user } = setup();
      um.setAccountFlag(user.id, AccountControlFlag.TrustedForDelegation, true);
      const as = engine.kerberosASRequest('jdoe', 'correct_password', user.domainId);
      const del = engine.kerberosGetDelegationTicket(as.ticket!.ticketId, 'cifs/file-server.corp', 'app-server.corp');
      expect(del.success).toBe(true);
      expect(del.ticket!.flags).toContain('ok-as-delegate');
    });

    it('rejects delegation when user is not trusted', () => {
      const { engine, user } = setup();
      const as = engine.kerberosASRequest('jdoe', 'correct_password', user.domainId);
      const del = engine.kerberosGetDelegationTicket(as.ticket!.ticketId, 'cifs/file-server.corp', 'app-server.corp');
      expect(del.success).toBe(false);
    });
  });

  describe('NTLM', () => {
    it('authenticates with valid password', () => {
      const { engine } = setup();
      const result = engine.ntlmAuthenticate('jdoe', 'correct_password');
      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.challenge).toBeTruthy();
    });

    it('rejects invalid password', () => {
      const { engine } = setup();
      const result = engine.ntlmAuthenticate('jdoe', 'wrong');
      expect(result.success).toBe(false);
    });
  });

  describe('OAuth', () => {
    it('handles authorization code grant flow', () => {
      const { engine, dm, um, tm } = setup();
      const d = dm.domains.values().next().value!;
      const u = um.users.values().next().value!;
      const app = tm.registerOAuthApp(d.id, 'App', ['https://app.io/cb'], ['openid', 'email']);

      const auth = engine.oauthAuthorizationCodeGrant(app.id, u.id, 'https://app.io/cb', ['openid', 'email']);
      expect(auth.success).toBe(true);
      expect(auth.authorizationCode).toBeTruthy();

      const exchange = engine.oauthTokenExchange(auth.authorizationCode!, app, null);
      expect(exchange.success).toBe(true);
      expect(exchange.accessToken).not.toBeNull();
    });

    it('rejects invalid redirect URI', () => {
      const { engine, tm } = setup();
      const app = tm.registerOAuthApp('' as any, 'App', ['https://app.io/cb'], ['openid']);
      const result = engine.oauthAuthorizationCodeGrant(app.id, '' as any, 'https://evil.io/cb', ['openid']);
      expect(result.success).toBe(false);
    });

    it('handles client credentials grant', () => {
      const { engine, dm, tm } = setup();
      const d = dm.domains.values().next().value!;
      const app = tm.registerOAuthApp(d.id, 'Svc', ['https://svc.io/cb'], ['read', 'write']);
      const result = engine.oauthClientCredentialsGrant(app.id, ['read', 'write']);
      expect(result.success).toBe(true);
      expect(result.accessToken).not.toBeNull();
    });

    it('rejects client credentials for public client', () => {
      const { engine, dm, tm } = setup();
      const d = dm.domains.values().next().value!;
      const app = tm.registerOAuthApp(d.id, 'SPA', ['https://spa.io/cb'], ['read'], false);
      const result = engine.oauthClientCredentialsGrant(app, ['read']);
      expect(result.success).toBe(false);
    });
  });

  describe('SAML', () => {
    it('creates SAML assertion', () => {
      const { engine } = setup();
      const saml = engine.samlSSO('https://idp.corp/saml', '' as any, 'https://sp.corp/saml', { role: 'admin' });
      expect(saml.attributes.role).toBe('admin');
      expect(saml.conditions.audienceRestriction).toContain('https://sp.corp/saml');
    });
  });

  describe('FIDO2', () => {
    it('validates FIDO2 authentication', () => {
      const { engine } = setup();
      expect(engine.fido2Authenticate('cred1', 'signature', 5)).toBe(true);
      expect(engine.fido2Authenticate('cred1', '', 0)).toBe(false);
    });
  });

  describe('TOTP', () => {
    it('validates TOTP codes', () => {
      const { engine } = setup();
      expect(engine.totpValidate('secret', '123456')).toBe(true);
      expect(engine.totpValidate('secret', 'abc')).toBe(false);
      expect(engine.totpValidate('secret', '12345')).toBe(false);
    });
  });
});

/* ── PasswordAnalyzer ── */

describe('PasswordAnalyzer', () => {
  const pa = new PasswordAnalyzer();

  it('scores very weak passwords', () => {
    const r = pa.analyzePassword('password');
    expect(r.score).toBe(PasswordScore.VeryWeak);
    expect(r.isCommon).toBe(true);
    expect(r.crackTimeMs).toBe(1);
  });

  it('scores strong passwords', () => {
    const r = pa.analyzePassword('kX9#mP2$vL8@qR5!wN3');
    expect(r.score).toBe(PasswordScore.VeryStrong);
    expect(r.isCommon).toBe(false);
    expect(r.isLeaked).toBe(false);
    expect(r.entropy).toBeGreaterThan(90);
  });

  it('identifies leaked passwords', () => {
    const r = pa.analyzePassword('P@ssw0rd!');
    expect(r.isLeaked).toBe(true);
    expect(r.isCommon).toBe(false);
    expect(r.score).toBeLessThanOrEqual(PasswordScore.Weak);
  });

  it('provides feedback', () => {
    const r = pa.analyzePassword('short');
    expect(r.feedback.length).toBeGreaterThan(0);
    expect(r.feedback.some((f) => f.includes('short'))).toBe(true);
  });

  it('generates entropy correctly', () => {
    const simple = pa.analyzePassword('abc');
    const complex = pa.analyzePassword('Abcd1234!');
    expect(complex.entropy).toBeGreaterThan(simple.entropy);
  });

  it('cracks NTLM hashes with dictionary', () => {
    const hash = pa['simulateNtlmHash']('secretpass');
    const result = pa.crackNtlmHash(hash, ['password', '123456', 'secretpass', 'admin']);
    expect(result.cracked).toBe(true);
    expect(result.password).toBe('secretpass');
    expect(result.attempts).toBe(3);
  });

  it('fails to crack with wrong wordlist', () => {
    const hash = pa['simulateNtlmHash']('unknown');
    const result = pa.crackNtlmHash(hash, ['password', '123456']);
    expect(result.cracked).toBe(false);
  });

  it('performs password spraying', () => {
    const results = pa.passwordSpray(['admin', 'jdoe', 'jsmith'], 'SecurePass1!');
    expect(results.length).toBe(3);
    expect(results.every((r) => r.success)).toBe(true);
  });
});

/* ── CertificateAuthority ── */

describe('CertificateAuthority', () => {
  it('creates root CA', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Test Root CA');
    expect(root.isCA).toBe(true);
    expect(root.chainLength).toBe(1);
    expect(root.subject).toBe('CN=Test Root CA');
    expect(root.keySize).toBe(4096);
    expect(ca.rootCAs.has(root.id)).toBe(true);
  });

  it('creates intermediate CA', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    const inter = ca.createIntermediateCA('CN=Intermediate', root.id);
    expect(inter).not.toBeNull();
    expect(inter!.isCA).toBe(true);
    expect(inter!.chainLength).toBe(2);
    expect(inter!.issuedBy).toBe(root.id);
    expect(ca.intermediateCAs.has(inter!.id)).toBe(true);
  });

  it('issues server certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    const server = ca.issueServerCertificate('*.example.com', ['example.com', '*.example.com'], root.id);
    expect(server).not.toBeNull();
    expect(server!.subject).toBe('CN=*.example.com');
    expect(server!.subjectAltNames).toContain('example.com');
    expect(server!.keyUsage).toContain('keyEncipherment');
  });

  it('issues client certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    const client = ca.issueClientCertificate('user@example.com', root.id);
    expect(client).not.toBeNull();
    expect(client!.keyUsage).toContain('digitalSignature');
    expect(client!.extendedKeyUsage).toContain('clientAuth');
  });

  it('revokes certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    expect(ca.revokeCertificate(root.id, 'Key compromise')).toBe(true);
    expect(root.status).toBe(CertificateStatus.Revoked);
    expect(root.revocationReason).toBe('Key compromise');
  });

  it('validates certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    expect(ca.validateCertificate(root.id)).toBe(true);
    ca.revokeCertificate(root.id, 'test');
    expect(ca.validateCertificate(root.id)).toBe(false);
  });

  it('builds certificate chain', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    const inter = ca.createIntermediateCA('CN=Inter', root.id)!;
    const server = ca.issueServerCertificate('server', ['server.local'], inter.id)!;
    const chain = ca.getCertificateChain(server.id);
    expect(chain.length).toBe(3);
    expect(chain[0].subject).toBe('CN=server');
    expect(chain[1].subject).toBe('CN=Inter');
    expect(chain[2].subject).toBe('CN=Root');
  });

  it('finds expired certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    root.notAfter = new Date(Date.now() - 1000);
    const expired = ca.findExpiredCertificates();
    expect(expired.length).toBeGreaterThan(0);
  });

  it('finds compromised certificates', () => {
    const ca = new CertificateAuthority();
    const root = ca.createRootCA('CN=Root');
    ca.revokeCertificate(root.id, 'compromised');
    root.status = CertificateStatus.Compromised;
    const comp = ca.findCompromisedCertificates();
    expect(comp.length).toBeGreaterThan(0);
  });
});

/* ── IdentityProviderSimulator ── */

describe('IdentityProviderSimulator', () => {
  it('creates identity providers', () => {
    const sim = new IdentityProviderSimulator();
    const p = sim.createProvider({
      name: 'Cybersim Entra ID', providerType: 'entra_id',
      domain: 'cybersim.io', protocol: AuthenticationProtocol.OIDC,
      metadataUrl: 'https://login.cybersim.io/.well-known/openid-configuration',
      signingCertificates: [], ssoUrl: 'https://login.cybersim.io/sso',
      sloUrl: 'https://login.cybersim.io/slo', issuer: 'https://login.cybersim.io',
      enabled: true,
    });
    expect(p.name).toBe('Cybersim Entra ID');
    expect(p.enabled).toBe(true);
  });

  it('simulates SSO', () => {
    const sim = new IdentityProviderSimulator();
    const p = sim.createProvider({ name: 'IDP', providerType: 'keycloak', domain: 'k.io', protocol: AuthenticationProtocol.SAML, metadataUrl: '', signingCertificates: [], ssoUrl: '', sloUrl: '', issuer: '', enabled: true });
    const result = sim.simulateSSO(p.id, '' as any, '10.0.0.1');
    expect(result).toBe(true);
    expect(sim.signOnLogs.length).toBe(1);
  });

  it('simulates SSO failure', () => {
    const sim = new IdentityProviderSimulator();
    const p = sim.createProvider({ name: 'IDP', providerType: 'okta', domain: 'okta.io', protocol: AuthenticationProtocol.OIDC, metadataUrl: '', signingCertificates: [], ssoUrl: '', sloUrl: '', issuer: '', enabled: true });
    const result = sim.simulateSSOFailure(p.id, '' as any, '10.0.0.2');
    expect(result).toBe(false);
    expect(sim.signOnLogs[0].success).toBe(false);
  });

  it('returns provider stats', () => {
    const sim = new IdentityProviderSimulator();
    const p = sim.createProvider({ name: 'IDP', providerType: 'keycloak', domain: 'k.io', protocol: AuthenticationProtocol.SAML, metadataUrl: '', signingCertificates: [], ssoUrl: '', sloUrl: '', issuer: '', enabled: true });
    sim.simulateSSO(p.id, '' as any, '1.1.1.1');
    sim.simulateSSO(p.id, '' as any, '2.2.2.2');
    sim.simulateSSOFailure(p.id, '' as any, '3.3.3.3');
    const stats = sim.getProviderStats(p.id);
    expect(stats.total).toBe(3);
    expect(stats.success).toBe(2);
    expect(stats.failure).toBe(1);
  });
});

/* ── IdentityCoordinator ── */

describe('IdentityCoordinator', () => {
  it('creates default enterprise', () => {
    const coord = new IdentityCoordinator();
    const env = coord.createDefaultEnterprise();
    expect(env.domain.name).toBe('cybersim.corp');
    expect(env.users.length).toBe(5);
    expect(env.groups.length).toBe(5);
    expect(env.applications.length).toBe(1);
    expect(env.rootCA.isCA).toBe(true);
  });

  it('sets up OUs in default enterprise', () => {
    const coord = new IdentityCoordinator();
    coord.createDefaultEnterprise();
    const ous = coord.domainManager.getOUSForDomain(
      [...coord.domainManager.domains.values()][0].id,
    );
    expect(ous.length).toBe(5);
    expect(ous.map((o) => o.name)).toContain('Admins');
    expect(ous.map((o) => o.name)).toContain('ServiceAccounts');
  });

  it('returns user overview with risk levels', () => {
    const coord = new IdentityCoordinator();
    coord.createDefaultEnterprise();
    const overview = coord.getUserOverview();
    expect(overview.length).toBe(5);
    expect(overview[0].mfaStatus).toBe('MFA Not Configured');
    expect(overview[0].riskLevel).toBe('Low');
  });

  it('runs password audit', () => {
    const coord = new IdentityCoordinator();
    coord.createDefaultEnterprise();
    const audit = coord.runPasswordAudit();
    expect(audit.length).toBe(5);
  });

  it('creates cross-domain trusts through coordinator', () => {
    const coord = new IdentityCoordinator();
    const a = coord.domainManager.createDomain('a.corp', 'A');
    const b = coord.domainManager.createDomain('b.corp', 'B');
    const trust = coord.domainManager.createTrust(a.id, b.id, TrustDirection.Bidirectional, TrustType.External);
    expect(trust.transitive).toBe(true);
  });

  it('supports full auth flow end-to-end', () => {
    const coord = new IdentityCoordinator();
    const env = coord.createDefaultEnterprise();
    const user = env.users[0];

    const result = coord.authEngine.kerberosASRequest(user.userPrincipalName, 'correct_password', env.domain.id);
    expect(result.success).toBe(true);
    expect(result.ticket!.isTGT).toBe(true);

    const tgs = coord.authEngine.kerberosTGSRequest(result.ticket!.ticketId, 'cifs/file-server.corp');
    expect(tgs.success).toBe(true);
  });

  it('supports PKCE-enhanced OAuth', () => {
    const coord = new IdentityCoordinator();
    const env = coord.createDefaultEnterprise();
    const app = env.applications[0];

    const auth = coord.authEngine.oauthAuthorizationCodeGrant(app.id, env.users[0].id, 'https://portal.cybersim.io/callback', ['openid', 'profile', 'email', 'offline_access']);
    expect(auth.success).toBe(true);
  });
});
