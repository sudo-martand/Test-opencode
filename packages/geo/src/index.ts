import type { UID } from '@cybersim/shared';
import { uid } from '@cybersim/shared';

// ── Branded types ────────────────────────────────────────────────────────

export type Latitude = number & { readonly __brand: 'latitude' };
export type Longitude = number & { readonly __brand: 'longitude' };
export type Altitude = number & { readonly __brand: 'altitude' };
export type Asn = number & { readonly __brand: 'asn' };
export type IpRange = string & { readonly __brand: 'ipRange' };

export function latitude(value: number): Latitude {
  if (value < -90 || value > 90) throw new Error(`Invalid latitude: ${value}`);
  return value as Latitude;
}

export function longitude(value: number): Longitude {
  if (value < -180 || value > 180) throw new Error(`Invalid longitude: ${value}`);
  return value as Longitude;
}

export function altitude(value: number): Altitude { return value as Altitude; }

export function asn(value: number): Asn {
  if (value < 1 || value > 4294967295) throw new Error(`Invalid ASN: ${value}`);
  return value as Asn;
}

// ── Coordinate types ─────────────────────────────────────────────────────

export interface GeoCoordinates {
  lat: Latitude;
  lng: Longitude;
  alt?: Altitude;
}

export interface GeoBounds {
  north: Latitude;
  south: Latitude;
  east: Longitude;
  west: Longitude;
}

export interface GeoPoint {
  id: UID;
  name: string;
  coordinates: GeoCoordinates;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
}

export interface GeoDistance {
  meters: number;
  kilometers: number;
  miles: number;
  nauticalMiles: number;
}

// ── IP Geolocation ────────────────────────────────────────────────────────

export interface IpGeoLocation {
  ip: string;
  coordinates: GeoCoordinates;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  zip: string;
  timezone: string;
  isp: string;
  organization: string;
  asn: Asn;
  isProxy: boolean;
  isHosting: boolean;
  isMobile: boolean;
  confidence: number;
}

export interface GeoDatabaseEntry {
  ipRange: string;
  startIp: number;
  endIp: number;
  coordinates: GeoCoordinates;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  zip: string;
  timezone: string;
  isp: string;
  asn: Asn;
}

export class IpGeolocationDatabase {
  private entries: GeoDatabaseEntry[] = [];
  private initialized: boolean = false;

  async init(): Promise<void> {
    this.initialized = true;
  }

  addEntry(entry: GeoDatabaseEntry): void {
    this.entries.push(entry);
  }

  addEntries(entries: GeoDatabaseEntry[]): void {
    this.entries.push(...entries);
  }

  lookup(ip: string): GeoDatabaseEntry | undefined {
    const ipNum = this.ipToNumber(ip);
    for (const entry of this.entries) {
      if (ipNum >= entry.startIp && ipNum <= entry.endIp) {
        return entry;
      }
    }
    return undefined;
  }

  batchLookup(ips: string[]): Map<string, GeoDatabaseEntry | undefined> {
    const results = new Map<string, GeoDatabaseEntry | undefined>();
    for (const ip of ips) {
      results.set(ip, this.lookup(ip));
    }
    return results;
  }

  private ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return 0;
    return (
      ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0
    );
  }

  get size(): number {
    return this.entries.length;
  }
}

// ── BGP ASN Lookup ─────────────────────────────────────────────────────────

export interface AsnInfo {
  asn: Asn;
  name: string;
  description: string;
  countryCode: string;
  organization: string;
  orgId: string;
  registry: 'arin' | 'ripe' | 'apnic' | 'lacnic' | 'afrinic';
  dateAllocated: string;
  routes: PrefixEntry[];
  peers: Asn[];
}

export interface PrefixEntry {
  prefix: IpRange;
  asn: Asn;
  description?: string;
  origin: string;
}

export interface BgpRelationship {
  asn: Asn;
  peerAsn: Asn;
  relationship: 'transit' | 'peer' | 'customer' | 'sibling';
}

export interface AsPathSegment {
  asns: Asn[];
  type: 'as_set' | 'as_sequence' | 'as_confed_set' | 'as_confed_sequence';
}

export class AsnDatabase {
  private entries: Map<Asn, AsnInfo> = new Map();
  private prefixes: Map<string, Asn[]> = new Map();
  private initialized: boolean = false;

  async init(): Promise<void> {
    this.initialized = true;
  }

  register(asnInfo: AsnInfo): void {
    this.entries.set(asnInfo.asn, asnInfo);
    for (const route of asnInfo.routes) {
      const existing = this.prefixes.get(route.prefix) ?? [];
      existing.push(route.asn);
      this.prefixes.set(route.prefix, existing);
    }
  }

  lookup(asn: Asn): AsnInfo | undefined {
    return this.entries.get(asn);
  }

  lookupByPrefix(prefix: string): Asn[] {
    return this.prefixes.get(prefix) ?? [];
  }

  search(name: string): AsnInfo[] {
    const lower = name.toLowerCase();
    return Array.from(this.entries.values()).filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.organization.toLowerCase().includes(lower),
    );
  }

  getPeers(asn: Asn): Asn[] {
    const info = this.entries.get(asn);
    return info?.peers ?? [];
  }

  get size(): number {
    return this.entries.size;
  }

  // ── Pre-loaded well-known ASNs ────────────────────────────────────

  loadWellKnownAsns(): void {
    const wellKnown: AsnInfo[] = [
      {
        asn: asn(15169), name: 'GOOGLE', description: 'Google LLC', countryCode: 'US',
        organization: 'Google LLC', orgId: 'GOGL', registry: 'arin',
        dateAllocated: '2000-03-30', routes: [
          { prefix: '8.8.8.0/24' as IpRange, asn: asn(15169), origin: 'GOOGLE' },
          { prefix: '8.8.4.0/24' as IpRange, asn: asn(15169), origin: 'GOOGLE' },
        ], peers: [asn(174), asn(2914)],
      },
      {
        asn: asn(16509), name: 'AMAZON-02', description: 'Amazon.com, Inc.', countryCode: 'US',
        organization: 'Amazon Web Services', orgId: 'AMAZO', registry: 'arin',
        dateAllocated: '2000-06-14', routes: [
          { prefix: '52.0.0.0/8' as IpRange, asn: asn(16509), origin: 'AMAZON' },
        ], peers: [asn(174), asn(2914), asn(1299)],
      },
      {
        asn: asn(8075), name: 'MICROSOFT-CORP', description: 'Microsoft Corporation', countryCode: 'US',
        organization: 'Microsoft Corporation', orgId: 'MSFT', registry: 'arin',
        dateAllocated: '1998-09-08', routes: [
          { prefix: '13.64.0.0/11' as IpRange, asn: asn(8075), origin: 'MICROSOFT' },
        ], peers: [asn(174), asn(2914)],
      },
      {
        asn: asn(13335), name: 'CLOUDFLARENET', description: 'Cloudflare, Inc.', countryCode: 'US',
        organization: 'Cloudflare Inc', orgId: 'CLOUD', registry: 'arin',
        dateAllocated: '2010-07-14', routes: [
          { prefix: '104.16.0.0/12' as IpRange, asn: asn(13335), origin: 'CLOUDFLARE' },
          { prefix: '1.1.1.0/24' as IpRange, asn: asn(13335), origin: 'CLOUDFLARE' },
        ], peers: [asn(174), asn(2914), asn(1299), asn(3257)],
      },
      {
        asn: asn(174), name: 'COGENT-174', description: 'Cogent Communications', countryCode: 'US',
        organization: 'Cogent Communications', orgId: 'COG', registry: 'arin',
        dateAllocated: '1992-01-01', routes: [], peers: [],
      },
      {
        asn: asn(2914), name: 'NTT-LTD-2914', description: 'NTT America, Inc.', countryCode: 'US',
        organization: 'NTT Communications', orgId: 'NTT', registry: 'arin',
        dateAllocated: '1995-02-15', routes: [], peers: [],
      },
      {
        asn: asn(1299), name: 'TWELVE99', description: 'Arelion Sweden AB', countryCode: 'SE',
        organization: 'Arelion', orgId: 'TWEL', registry: 'ripe',
        dateAllocated: '1997-01-01', routes: [], peers: [],
      },
      {
        asn: asn(3257), name: 'GTT-BACKBONE', description: 'GTT Communications Inc.', countryCode: 'US',
        organization: 'GTT', orgId: 'GTT', registry: 'arin',
        dateAllocated: '2004-07-19', routes: [], peers: [],
      },
    ];

    for (const info of wellKnown) {
      this.register(info);
    }
  }
}

// ── Submarine cable routes ───────────────────────────────────────────────

export interface CableLandingPoint {
  name: string;
  coordinates: GeoCoordinates;
  country: string;
  city?: string;
}

export interface SubmarineCable {
  id: UID;
  name: string;
  length: number;
  owners: string[];
  suppliers: string[];
  readyForService: string;
  landings: CableLandingPoint[];
  rfs: string;
  litCapacityGbps?: number;
  designCapacityGbps?: number;
  fiberPairs?: number;
}

export class SubmarineCableDatabase {
  private cables: Map<UID, SubmarineCable> = new Map();

  addCable(cable: SubmarineCable): void {
    this.cables.set(cable.id, cable);
  }

  getCable(id: UID): SubmarineCable | undefined {
    return this.cables.get(id);
  }

  getAllCables(): SubmarineCable[] {
    return Array.from(this.cables.values());
  }

  searchByName(name: string): SubmarineCable[] {
    const lower = name.toLowerCase();
    return this.getAllCables().filter((c) => c.name.toLowerCase().includes(lower));
  }

  getCablesNear(lat: Latitude, lng: Longitude, radiusKm: number): SubmarineCable[] {
    const result: SubmarineCable[] = [];
    for (const cable of this.cables.values()) {
      for (const landing of cable.landings) {
        const dist = haversineDistance({ lat, lng }, landing.coordinates);
        if (dist.kilometers <= radiusKm) {
          result.push(cable);
          break;
        }
      }
    }
    return result;
  }

  get size(): number {
    return this.cables.size;
  }

  loadWellKnownCables(): void {
    const cables: SubmarineCable[] = [
      {
        id: uid(), name: 'SEA-ME-WE 5', length: 20000,
        owners: ['Singtel', 'Telecom Egypt', 'Orange'], suppliers: ['ASN', 'NEC'],
        readyForService: '2016', rfs: '2016',
        designCapacityGbps: 24000, fiberPairs: 8,
        landings: [
          { name: 'Marseille', coordinates: { lat: latitude(43.3), lng: longitude(5.4) }, country: 'France', city: 'Marseille' },
          { name: 'Alexandria', coordinates: { lat: latitude(31.2), lng: longitude(29.9) }, country: 'Egypt', city: 'Alexandria' },
          { name: 'Singapore', coordinates: { lat: latitude(1.3), lng: longitude(103.8) }, country: 'Singapore', city: 'Singapore' },
        ],
      },
      {
        id: uid(), name: 'FA-1', length: 900,
        owners: ['AT&T', 'Verizon'], suppliers: ['ASN'],
        readyForService: '2001', rfs: '2001',
        designCapacityGbps: 5120, fiberPairs: 4,
        landings: [
          { name: 'New York', coordinates: { lat: latitude(40.7), lng: longitude(-74.0) }, country: 'United States', city: 'New York' },
          { name: 'London', coordinates: { lat: latitude(51.5), lng: longitude(-0.1) }, country: 'United Kingdom', city: 'London' },
        ],
      },
      {
        id: uid(), name: 'APG (Asia Pacific Gateway)', length: 10800,
        owners: ['China Telecom', 'China Mobile', 'KT', 'NTT', 'Singtel'], suppliers: ['NEC', 'Fujitsu'],
        readyForService: '2016', rfs: '2016',
        designCapacityGbps: 54000, fiberPairs: 6,
        landings: [
          { name: 'Shanghai', coordinates: { lat: latitude(31.2), lng: longitude(121.5) }, country: 'China', city: 'Shanghai' },
          { name: 'Singapore', coordinates: { lat: latitude(1.3), lng: longitude(103.8) }, country: 'Singapore', city: 'Singapore' },
          { name: 'Tokyo', coordinates: { lat: latitude(35.7), lng: longitude(139.8) }, country: 'Japan', city: 'Tokyo' },
        ],
      },
      {
        id: uid(), name: 'MAREA', length: 6600,
        owners: ['Facebook', 'Microsoft', 'Telxius'], suppliers: ['ASN'],
        readyForService: '2018', rfs: '2018',
        litCapacityGbps: 200000, designCapacityGbps: 200000, fiberPairs: 8,
        landings: [
          { name: 'Virginia Beach', coordinates: { lat: latitude(36.8), lng: longitude(-76.0) }, country: 'United States', city: 'Virginia Beach' },
          { name: 'Sopelana', coordinates: { lat: latitude(43.4), lng: longitude(-2.9) }, country: 'Spain', city: 'Sopelana' },
        ],
      },
    ];

    for (const c of cables) {
      this.addCable(c);
    }
  }
}

// ── Geospatial utilities ────────────────────────────────────────────────

export function haversineDistance(a: GeoCoordinates, b: GeoCoordinates): GeoDistance {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  const meters = R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return {
    meters,
    kilometers: meters / 1000,
    miles: meters / 1609.344,
    nauticalMiles: meters / 1852,
  };
}

export function coordinatesToRadians(
  coords: GeoCoordinates,
): { latRad: number; lngRad: number } {
  return {
    latRad: (coords.lat * Math.PI) / 180,
    lngRad: (coords.lng * Math.PI) / 180,
  };
}

export function pointInBounds(point: GeoCoordinates, bounds: GeoBounds): boolean {
  return (
    point.lat <= bounds.north &&
    point.lat >= bounds.south &&
    point.lng <= bounds.east &&
    point.lng >= bounds.west
  );
}

export function midpoint(a: GeoCoordinates, b: GeoCoordinates): GeoCoordinates {
  const { latRad: lat1, lngRad: lng1 } = coordinatesToRadians(a);
  const { latRad: lat2, lngRad: lng2 } = coordinatesToRadians(b);
  const bx = Math.cos(lat2) * Math.cos(lng2 - lng1);
  const by = Math.cos(lat2) * Math.sin(lng2 - lng1);
  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by),
  );
  const lng3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
  return {
    lat: latitude((lat3 * 180) / Math.PI),
    lng: longitude((lng3 * 180) / Math.PI),
  };
}

// ── RF Propagation ────────────────────────────────────────────────────────

export interface RfSignalParams {
  frequencyMhz: number;
  powerDbm: number;
  antennaGain: number;
  cableLoss: number;
  distanceKm: number;
}

export interface RfPropagationResult {
  freeSpacePathLoss: number;
  receivedPowerDbm: number;
  fresnelZoneClearanceM: number;
  effectiveDistanceKm: number;
  isLos: boolean;
}

export function calculateFreeSpacePathLoss(params: RfSignalParams): number {
  const freq = params.frequencyMhz * 1e6;
  const dist = params.distanceKm * 1000;
  return 20 * Math.log10(dist) + 20 * Math.log10(freq) - 147.55;
}

export function calculateReceivedPower(params: RfSignalParams): number {
  const fsl = calculateFreeSpacePathLoss(params);
  return params.powerDbm + params.antennaGain - params.cableLoss - fsl;
}

export function calculateFresnelZoneRadius(
  distanceKm: number,
  frequencyMhz: number,
  pointFraction: number = 0.5,
): number {
  const d = distanceKm * 1000;
  const f = frequencyMhz * 1e6;
  const d1 = d * pointFraction;
  const d2 = d * (1 - pointFraction);
  return Math.sqrt((d1 * d2 * 3e8) / (d * f));
}

export function propagate(params: RfSignalParams): RfPropagationResult {
  const fsl = calculateFreeSpacePathLoss(params);
  const receivedPower = calculateReceivedPower(params);
  const fresnelRadius = calculateFresnelZoneRadius(params.distanceKm, params.frequencyMhz);

  return {
    freeSpacePathLoss: fsl,
    receivedPowerDbm: receivedPower,
    fresnelZoneClearanceM: fresnelRadius,
    effectiveDistanceKm: params.distanceKm,
    isLos: receivedPower > -100,
  };
}

// ── ITU propagation models ────────────────────────────────────────────────

export interface ItmResult {
  basicTransmissionLoss: number;
  fieldStrength: number;
  reliability: number;
}

export function ituRuralPropagation(params: RfSignalParams): ItmResult {
  const fsl = calculateFreeSpacePathLoss(params);
  const additionalLoss = params.distanceKm > 10 ? 10 * Math.log10(params.distanceKm / 10) : 0;
  const totalLoss = fsl + additionalLoss;

  return {
    basicTransmissionLoss: totalLoss,
    fieldStrength: params.powerDbm + params.antennaGain - totalLoss,
    reliability: 0.5,
  };
}

// ── Oceanic fiber path calculation ────────────────────────────────────────

export function estimateFiberLatency(distanceKm: number, refractiveIndex: number = 1.48): number {
  const speedOfLight = 299792458;
  const fiberSpeed = speedOfLight / refractiveIndex;
  return (distanceKm * 1000) / fiberSpeed * 1000;
}

export function estimateCableLatencyMs(cable: SubmarineCable): number {
  const totalLength = cable.landings.reduce((sum, _lp, i, arr) => {
    if (i === 0) return 0;
    const a = arr[i - 1]!.coordinates;
    const b = _lp.coordinates;
    return sum + haversineDistance(a, b).kilometers;
  }, 0);
  return estimateFiberLatency(totalLength);
}

// ── Default databases ────────────────────────────────────────────────────

export function createDefaultGeoDatabase(): IpGeolocationDatabase {
  const db = new IpGeolocationDatabase();
  return db;
}

export function createDefaultAsnDatabase(): AsnDatabase {
  const db = new AsnDatabase();
  db.loadWellKnownAsns();
  return db;
}

export function createDefaultCableDatabase(): SubmarineCableDatabase {
  const db = new SubmarineCableDatabase();
  db.loadWellKnownCables();
  return db;
}
