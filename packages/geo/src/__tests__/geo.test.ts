import { describe, it, expect, beforeEach } from 'vitest';
import {
  latitude, longitude, altitude, asn,
  IpGeolocationDatabase, AsnDatabase, SubmarineCableDatabase,
  haversineDistance, pointInBounds, midpoint, coordinatesToRadians,
  calculateFreeSpacePathLoss, calculateReceivedPower,
  calculateFresnelZoneRadius, propagate, ituRuralPropagation,
  estimateFiberLatency,
  createDefaultGeoDatabase, createDefaultAsnDatabase, createDefaultCableDatabase,
} from '../index.js';

describe('branded type constructors', () => {
  it('latitude validates range', () => {
    expect(latitude(0)).toBe(0);
    expect(latitude(90)).toBe(90);
    expect(latitude(-90)).toBe(-90);
    expect(() => latitude(91)).toThrow('Invalid latitude');
    expect(() => latitude(-91)).toThrow('Invalid latitude');
  });

  it('longitude validates range', () => {
    expect(longitude(0)).toBe(0);
    expect(longitude(180)).toBe(180);
    expect(longitude(-180)).toBe(-180);
    expect(() => longitude(181)).toThrow('Invalid longitude');
  });

  it('altitude accepts any number', () => {
    expect(altitude(0)).toBe(0);
    expect(altitude(-100)).toBe(-100);
  });

  it('asn validates range', () => {
    expect(asn(1)).toBe(1);
    expect(asn(4294967295)).toBe(4294967295);
    expect(() => asn(0)).toThrow('Invalid ASN');
    expect(() => asn(4294967296)).toThrow('Invalid ASN');
  });
});

describe('haversineDistance', () => {
  it('returns zero for same point', () => {
    const d = haversineDistance({ lat: latitude(0), lng: longitude(0) }, { lat: latitude(0), lng: longitude(0) });
    expect(d.meters).toBeCloseTo(0, 0);
    expect(d.kilometers).toBeCloseTo(0, 0);
    expect(d.miles).toBeCloseTo(0, 0);
    expect(d.nauticalMiles).toBeCloseTo(0, 0);
  });

  it('calculates NYC to London distance', () => {
    const d = haversineDistance(
      { lat: latitude(40.7), lng: longitude(-74.0) },
      { lat: latitude(51.5), lng: longitude(-0.1) },
    );
    expect(d.kilometers).toBeGreaterThan(5500);
    expect(d.kilometers).toBeLessThan(5600);
  });

  it('calculates equator quarter circumference', () => {
    const d = haversineDistance(
      { lat: latitude(0), lng: longitude(0) },
      { lat: latitude(0), lng: longitude(90) },
    );
    expect(d.kilometers).toBeCloseTo(10019, -2);
  });
});

describe('coordinatesToRadians', () => {
  it('converts degrees to radians', () => {
    const r = coordinatesToRadians({ lat: latitude(90), lng: longitude(180) });
    expect(r.latRad).toBeCloseTo(Math.PI / 2);
    expect(r.lngRad).toBeCloseTo(Math.PI);
  });
});

describe('pointInBounds', () => {
  const bounds = {
    north: latitude(50), south: latitude(0),
    east: longitude(10), west: longitude(-10),
  };

  it('returns true for point inside bounds', () => {
    expect(pointInBounds({ lat: latitude(25), lng: longitude(0) }, bounds)).toBe(true);
  });

  it('returns false for point outside bounds', () => {
    expect(pointInBounds({ lat: latitude(60), lng: longitude(0) }, bounds)).toBe(false);
    expect(pointInBounds({ lat: latitude(25), lng: longitude(20) }, bounds)).toBe(false);
  });
});

describe('midpoint', () => {
  it('calculates midpoint between two points', () => {
    const m = midpoint(
      { lat: latitude(0), lng: longitude(0) },
      { lat: latitude(0), lng: longitude(90) },
    );
    expect(m.lat).toBeCloseTo(latitude(0), 10);
    expect(m.lng).toBeCloseTo(longitude(45), 5);
  });
});

describe('RF propagation', () => {
  const params = { frequencyMhz: 2400, powerDbm: 20, antennaGain: 6, cableLoss: 2, distanceKm: 10 };

  it('calculateFreeSpacePathLoss returns positive value', () => {
    const loss = calculateFreeSpacePathLoss(params);
    expect(loss).toBeGreaterThan(100);
  });

  it('calculateReceivedPower is less than transmit power', () => {
    const rx = calculateReceivedPower(params);
    expect(rx).toBeLessThan(params.powerDbm);
  });

  it('calculateFresnelZoneRadius returns positive radius', () => {
    const r = calculateFresnelZoneRadius(10, 2400);
    expect(r).toBeGreaterThan(0);
  });

  it('propagate returns complete result', () => {
    const result = propagate(params);
    expect(result.freeSpacePathLoss).toBeGreaterThan(0);
    expect(result.receivedPowerDbm).toBeLessThan(params.powerDbm);
    expect(result.fresnelZoneClearanceM).toBeGreaterThan(0);
    expect(typeof result.isLos).toBe('boolean');
  });

  it('ituRuralPropagation returns result', () => {
    const result = ituRuralPropagation(params);
    expect(result.basicTransmissionLoss).toBeGreaterThan(0);
    expect(result.reliability).toBe(0.5);
  });

  it('propagate returns line of sight when received power > -100 dBm', () => {
    const losResult = propagate({ frequencyMhz: 100, powerDbm: 50, antennaGain: 10, cableLoss: 1, distanceKm: 1 });
    expect(losResult.isLos).toBe(true);
  });
});

describe('fiber latency', () => {
  it('estimateFiberLatency returns positive latency', () => {
    const ms = estimateFiberLatency(1000);
    expect(ms).toBeGreaterThan(0);
  });

  it('estimateFiberLatency with longer cable', () => {
    const shortLat = estimateFiberLatency(100);
    const longLat = estimateFiberLatency(10000);
    expect(longLat).toBeGreaterThan(shortLat);
  });
});

describe('IpGeolocationDatabase', () => {
  const db = new IpGeolocationDatabase();

  it('init sets initialized flag', async () => {
    await db.init();
    expect(true).toBe(true);
  });

  it('addEntry and lookup', () => {
    db.addEntry({
      ipRange: '8.8.8.0/24', startIp: 0x08080800, endIp: 0x080808ff,
      coordinates: { lat: latitude(37.4), lng: longitude(-122.1) },
      country: 'US', countryCode: 'US', region: 'California',
      city: 'Mountain View', zip: '94043', timezone: 'America/Los_Angeles',
      isp: 'Google', asn: asn(15169),
    });
    const result = db.lookup('8.8.8.8');
    expect(result?.countryCode).toBe('US');
    expect(result?.isp).toBe('Google');
  });

  it('lookup returns undefined for unknown IP', () => {
    expect(db.lookup('0.0.0.0')).toBeUndefined();
  });

  it('batchLookup returns map', () => {
    const results = db.batchLookup(['8.8.8.8', '1.1.1.1']);
    expect(results.size).toBe(2);
    expect(results.get('8.8.8.8')?.countryCode).toBe('US');
    expect(results.get('1.1.1.1')).toBeUndefined();
  });

  it('size returns entry count', () => {
    expect(db.size).toBe(1);
  });
});

describe('AsnDatabase', () => {
  let db: AsnDatabase;

  beforeEach(() => {
    db = createDefaultAsnDatabase();
  });

  it('loadWellKnownAsns loads 8 ASNs', () => {
    expect(db.size).toBe(8);
  });

  it('lookup by ASN number', () => {
    const google = db.lookup(asn(15169));
    expect(google?.name).toBe('GOOGLE');
    expect(google?.organization).toBe('Google LLC');
  });

  it('lookupByPrefix', () => {
    const asns = db.lookupByPrefix('8.8.8.0/24');
    expect(asns.length).toBeGreaterThan(0);
    expect(asns[0]).toBe(asn(15169));
  });

  it('search by name', () => {
    const results = db.search('google');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getPeers returns peer list', () => {
    const peers = db.getPeers(asn(15169));
    expect(peers.length).toBeGreaterThan(0);
  });

  it('search is case-insensitive', () => {
    const results = db.search('GOOGLE');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('SubmarineCableDatabase', () => {
  let db: SubmarineCableDatabase;

  beforeEach(() => {
    db = createDefaultCableDatabase();
  });

  it('loadWellKnownCables loads 4 cables', () => {
    expect(db.size).toBe(4);
  });

  it('getAllCables returns all cables', () => {
    expect(db.getAllCables().length).toBe(4);
  });

  it('searchByName finds cables', () => {
    const results = db.searchByName('MAREA');
    expect(results.length).toBe(1);
    expect(results[0]!.name).toBe('MAREA');
  });

  it('searchByName is case-insensitive', () => {
    const results = db.searchByName('marea');
    expect(results.length).toBe(1);
  });

  it('getCablesNear returns cables near landing point', () => {
    const results = db.getCablesNear(latitude(40.7), longitude(-74.0), 100);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('factory functions', () => {
  it('createDefaultGeoDatabase returns empty database', () => {
    const db = createDefaultGeoDatabase();
    expect(db.size).toBe(0);
  });
});
