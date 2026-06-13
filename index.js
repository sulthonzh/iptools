'use strict';

// ═══════════════════════════════════════════════════════════
//  iptools — Zero-dep IPv4/IPv6 toolkit
// ═══════════════════════════════════════════════════════════

const v4Part = /^(\d{1,3})$/;
const v6Hex = /^[0-9a-fA-F]{1,4}$/;

function isV4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  for (const p of parts) {
    if (!v4Part.test(p)) return false;
    const n = Number(p);
    if (n < 0 || n > 255) return false;
    if (p.length > 1 && p[0] === '0') return false; // no leading zeros
  }
  return true;
}

function isV6(ip) {
  ip = ip.trim();
  if (ip === '') return false;

  // Handle IPv4-mapped (::ffff:1.2.3.4)
  const v4Suffix = ip.match(/:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4Suffix) {
    if (!isV4(v4Suffix[1])) return false;
    ip = ip.slice(0, -v4Suffix[1].length);
    // Remove trailing colon
    if (ip.endsWith(':')) ip = ip.slice(0, -1);
    // Add placeholder for the 2 groups that v4 represents
    ip = ip + ':0:0';
  }

  // Check for :: (compression)
  const doubleColon = ip.match(/::/g);
  if (doubleColon) {
    if (doubleColon.length > 1) return false; // only one ::
    // Expand: split on :: and figure out how many groups are missing
    const [left, right] = ip.split('::');
    const leftGroups = left ? left.split(':') : [];
    const rightGroups = right ? right.split(':') : [];
    const total = leftGroups.length + rightGroups.length;
    if (total > 7) return false; // :: must replace at least 1 group (8 total with v4 expansion might differ)
    // Validate each group
    for (const g of [...leftGroups, ...rightGroups]) {
      if (!v6Hex.test(g)) return false;
    }
    return true;
  }

  // No :: — must have exactly 8 groups
  const groups = ip.split(':');
  if (groups.length !== 8) return false;
  for (const g of groups) {
    if (!v6Hex.test(g)) return false;
  }
  return true;
}

function isValid(ip) {
  return isV4(ip) || isV6(ip);
}

function version(ip) {
  if (isV4(ip)) return 4;
  if (isV6(ip)) return 6;
  return 0;
}

// BigInt representations
function v4ToBigInt(ip) {
  const [a, b, c, d] = ip.split('.').map(Number);
  return BigInt(a) * 16777216n + BigInt(b) * 65536n + BigInt(c) * 256n + BigInt(d);
}

function bigIntToV4(n) {
  const a = Number((n >> 24n) & 255n);
  const b = Number((n >> 16n) & 255n);
  const c = Number((n >> 8n) & 255n);
  const d = Number(n & 255n);
  return `${a}.${b}.${c}.${d}`;
}

function v6ToBigInt(ip) {
  // Normalize: expand :: and handle v4 suffix
  let normalized = normalizeV6(ip);
  const groups = normalized.split(':');
  let result = 0n;
  for (const g of groups) {
    result = (result << 16n) + BigInt(parseInt(g, 16));
  }
  return result;
}

function bigIntToV6(n) {
  const groups = [];
  for (let i = 7; i >= 0; i--) {
    groups.push(((n >> BigInt(i * 16)) & 0xFFFFn).toString(16));
  }
  return compressV6(groups.join(':'));
}

function compressV6(ip) {
  // Find longest run of zero groups and replace with ::
  const groups = ip.split(':');
  let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i] === '0') {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
    } else {
      curStart = -1; curLen = 0;
    }
  }
  if (bestLen < 2) return ip;
  const before = groups.slice(0, bestStart).join(':');
  const after = groups.slice(bestStart + bestLen).join(':');
  let result = before + '::' + after;
  // Clean up edge cases
  if (result.startsWith(':::')) result = result.slice(1);
  if (result.endsWith(':::')) result = result.slice(0, -1);
  return result;
}

function normalizeV6(ip) {
  let v4Part = null;
  const v4Match = ip.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4Match) {
    v4Part = v4Match[1];
    ip = ip.slice(0, -v4Part.length);
    if (ip.endsWith(':')) ip = ip.slice(0, -1);
  }

  // Handle :: expansion
  if (ip.includes('::')) {
    const [left, right] = ip.split('::');
    const leftGroups = left ? left.split(':') : [];
    const rightGroups = right ? right.split(':') : [];
    const present = leftGroups.length + rightGroups.length;
    const missing = (v4Part ? 6 : 8) - present;
    const expanded = [...leftGroups, ...Array(missing).fill('0'), ...rightGroups];
    ip = expanded.join(':');
  }

  let groups = ip.split(':');
  if (v4Part) {
    const [a, b, c, d] = v4Part.split('.').map(Number);
    const g7 = ((a << 8) | b).toString(16);
    const g8 = ((c << 8) | d).toString(16);
    groups = [...groups, g7, g8];
  }

  // Pad to 8 if needed
  while (groups.length < 8) groups.push('0');

  return groups.map(g => parseInt(g, 16).toString(16)).join(':');
}

function toBigInt(ip) {
  if (isV4(ip)) return v4ToBigInt(ip);
  if (isV6(ip)) return v6ToBigInt(ip);
  throw new Error(`Invalid IP: ${ip}`);
}

// CIDR
function parseCIDR(cidr) {
  const idx = cidr.indexOf('/');
  if (idx === -1) {
    // No prefix — treat as /32 or /128
    const ip = cidr;
    if (!isValid(ip)) throw new Error(`Invalid IP: ${ip}`);
    const ver = version(ip);
    return { ip, prefix: ver === 4 ? 32 : 128, version: ver };
  }
  const ip = cidr.slice(0, idx);
  const prefixStr = cidr.slice(idx + 1);
  const prefix = parseInt(prefixStr, 10);
  if (!isValid(ip)) throw new Error(`Invalid IP: ${ip}`);
  const ver = version(ip);
  if (isNaN(prefix) || prefix < 0 || (ver === 4 && prefix > 32) || (ver === 6 && prefix > 128)) {
    throw new Error(`Invalid prefix: /${prefixStr}`);
  }
  return { ip, prefix, version: ver };
}

function cidrToRange(cidr) {
  const { ip, prefix, version: ver } = parseCIDR(cidr);
  const ipBig = toBigInt(ip);
  const maxBits = ver === 4 ? 32n : 128n;
  const prefixBig = BigInt(prefix);
  const mask = prefixBig === 0n ? 0n : ((-1n) << (maxBits - prefixBig)) & ((1n << maxBits) - 1n);
  const network = ipBig & mask;
  const broadcast = network | (~mask & ((1n << maxBits) - 1n));
  const fmt = ver === 4 ? bigIntToV4 : bigIntToV6;
  return {
    start: fmt(network),
    end: fmt(broadcast),
    startBig: network,
    endBig: broadcast,
    version: ver,
    prefix,
    total: broadcast - network + 1n
  };
}

function contains(cidr, ip) {
  const range = cidrToRange(cidr);
  if (version(ip) !== range.version) return false;
  const ipBig = toBigInt(ip);
  return ipBig >= range.startBig && ipBig <= range.endBig;
}

function overlap(cidr1, cidr2) {
  const r1 = cidrToRange(cidr1);
  const r2 = cidrToRange(cidr2);
  if (r1.version !== r2.version) return false;
  return r1.startBig <= r2.endBig && r2.startBig <= r1.endBig;
}

function subnet(cidr, newPrefix) {
  const { ip, prefix, version: ver } = parseCIDR(cidr);
  const maxBits = ver === 4 ? 32 : 128;
  if (newPrefix <= prefix || newPrefix > maxBits) {
    throw new Error(`Invalid new prefix: ${newPrefix} (must be > ${prefix} and <= ${maxBits})`);
  }
  const range = cidrToRange(cidr);
  const subnetSize = ver === 4 ? (1n << BigInt(32 - newPrefix)) : (1n << BigInt(128 - newPrefix));
  const fmt = ver === 4 ? bigIntToV4 : bigIntToV6;
  const results = [];
  for (let cur = range.startBig; cur <= range.endBig; cur += subnetSize) {
    results.push(`${fmt(cur)}/${newPrefix}`);
  }
  return results;
}

// Classification
function isPrivate(ip) {
  if (isV4(ip)) {
    const n = v4ToBigInt(ip);
    // 10.0.0.0/8
    if (contains('10.0.0.0/8', ip)) return true;
    // 172.16.0.0/12
    if (contains('172.16.0.0/12', ip)) return true;
    // 192.168.0.0/16
    if (contains('192.168.0.0/16', ip)) return true;
    return false;
  }
  if (isV6(ip)) {
    // fc00::/7 (unique local address)
    const n = v6ToBigInt(ip);
    return n >= 0xfc000000000000000000000000000000n && n <= 0xfdfffffffffffefffffffffffeffffffffn;
  }
  return false;
}

function isLoopback(ip) {
  if (isV4(ip)) return ip.startsWith('127.');
  if (isV6(ip)) {
    const n = normalizeV6(ip);
    return n === '0:0:0:0:0:0:0:1' || ip === '::1';
  }
  return false;
}

function isMulticast(ip) {
  if (isV4(ip)) {
    const first = parseInt(ip.split('.')[0], 10);
    return first >= 224 && first <= 239;
  }
  if (isV6(ip)) {
    const n = v6ToBigInt(ip);
    return n >= 0xff000000000000000000000000000000n && n <= 0xffffffffffffffffffffffffffffffffn;
  }
  return false;
}

function isReserved(ip) {
  if (isV4(ip)) {
    if (ip === '0.0.0.0' || ip.startsWith('0.')) return true;
    if (ip.startsWith('240.')) return true;
    if (ip === '255.255.255.255') return true;
    if (contains('169.254.0.0/16', ip)) return true; // link-local
    return false;
  }
  if (isV6(ip)) {
    const n = v6ToBigInt(ip);
    // ::/8 (reserved by IETF), excluding ::1 (loopback) and ff00::/8 (multicast)
    return n < 0x01000000000000000000000000000n && n !== 0x1n;
  }
  return false;
}

function compare(ip1, ip2) {
  const v1 = version(ip1), v2 = version(ip2);
  if (v1 !== v2) return v1 < v2 ? -1 : 1;
  const diff = toBigInt(ip1) - toBigInt(ip2);
  return diff > 0n ? 1 : diff < 0n ? -1 : 0;
}

function normalize(ip) {
  if (isV4(ip)) return ip;
  if (isV6(ip)) return compressV6(normalizeV6(ip));
  throw new Error(`Invalid IP: ${ip}`);
}

function info(ip) {
  const ver = version(ip);
  if (ver === 0) throw new Error(`Invalid IP: ${ip}`);
  return {
    ip,
    version: ver,
    normalized: normalize(ip),
    bigInt: toBigInt(ip).toString(),
    private: isPrivate(ip),
    loopback: isLoopback(ip),
    multicast: isMulticast(ip),
    reserved: isReserved(ip)
  };
}

module.exports = {
  isV4, isV6, isValid, version,
  toBigInt, normalize,
  v4ToBigInt, bigIntToV4, v6ToBigInt, bigIntToV6,
  parseCIDR, cidrToRange, contains, overlap, subnet,
  isPrivate, isLoopback, isMulticast, isReserved,
  compare, info
};
