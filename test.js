'use strict';

const assert = require('assert');
const {
  isV4, isV6, isValid, version, normalize,
  toBigInt, v4ToBigInt, bigIntToV4,
  parseCIDR, cidrToRange, contains, overlap, subnet,
  isPrivate, isLoopback, isMulticast, isReserved,
  compare, info
} = require('./index.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fail++; console.log(`  ✗ ${name}: ${e.message}`); }
}

console.log('\n🧪 iptools test suite\n');

// ── IPv4 validation ──
console.log('IPv4 validation');
t('valid v4 addresses', () => {
  assert.strictEqual(isV4('192.168.1.1'), true);
  assert.strictEqual(isV4('0.0.0.0'), true);
  assert.strictEqual(isV4('255.255.255.255'), true);
  assert.strictEqual(isV4('10.0.0.1'), true);
});
t('invalid v4 — wrong octet count', () => {
  assert.strictEqual(isV4('1.2.3'), false);
  assert.strictEqual(isV4('1.2.3.4.5'), false);
});
t('invalid v4 — out of range', () => {
  assert.strictEqual(isV4('256.1.1.1'), false);
  assert.strictEqual(isV4('1.256.1.1'), false);
  assert.strictEqual(isV4('1.1.1.256'), false);
});
t('invalid v4 — non-numeric', () => {
  assert.strictEqual(isV4('a.b.c.d'), false);
  assert.strictEqual(isV4('1.2.3.a'), false);
});
t('invalid v4 — leading zeros', () => {
  assert.strictEqual(isV4('192.168.01.1'), false);
  assert.strictEqual(isV4('192.168.001.1'), false);
});

// ── IPv6 validation ──
console.log('\nIPv6 validation');
t('valid v6 full', () => {
  assert.strictEqual(isV6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true);
  assert.strictEqual(isV6('2001:db8:85a3:0:0:8a2e:370:7334'), true);
});
t('valid v6 compressed', () => {
  assert.strictEqual(isV6('::1'), true);
  assert.strictEqual(isV6('::'), true);
  assert.strictEqual(isV6('2001:db8::1'), true);
  assert.strictEqual(isV6('2001:db8::'), true);
  assert.strictEqual(isV6('fe80::1'), true);
});
t('valid v6 with v4 suffix', () => {
  assert.strictEqual(isV6('::ffff:192.168.1.1'), true);
  assert.strictEqual(isV6('::ffff:0:192.168.1.1'), true);  // valid: 0:0:0:0:ffff:0:c0a8:101
});
t('invalid v6 — too many groups', () => {
  assert.strictEqual(isV6('1:2:3:4:5:6:7:8:9'), false);
});
t('invalid v6 — double ::', () => {
  assert.strictEqual(isV6('::1::'), false);
  assert.strictEqual(isV6('1::2::3'), false);
});
t('invalid v6 — bad hex', () => {
  assert.strictEqual(isV6('gggg::1'), false);
  assert.strictEqual(isV6('1:2:3:4:5:6:7:gg'), false);
});

// ── version() ──
console.log('\nversion()');
t('detects v4', () => { assert.strictEqual(version('10.0.0.1'), 4); });
t('detects v6', () => { assert.strictEqual(version('::1'), 6); });
t('rejects invalid', () => { assert.strictEqual(version('not-an-ip'), 0); });

// ── normalize() ──
console.log('\nnormalize()');
t('normalizes v6 compressed', () => {
  assert.strictEqual(normalize('2001:0DB8:0000:0000:0000:0000:0000:0001'), '2001:db8::1');
  assert.strictEqual(normalize('FE80:0000:0000:0000:0000:0000:0000:0001'), 'fe80::1');
});
t('normalizes v4 unchanged', () => {
  assert.strictEqual(normalize('192.168.1.1'), '192.168.1.1');
});

// ── BigInt conversion ──
console.log('\nBigInt conversion');
t('v4 to bigint and back', () => {
  assert.strictEqual(v4ToBigInt('0.0.0.0'), 0n);
  assert.strictEqual(v4ToBigInt('255.255.255.255'), 4294967295n);
  assert.strictEqual(bigIntToV4(0n), '0.0.0.0');
  assert.strictEqual(bigIntToV4(16909060n), '1.2.3.4');
  assert.strictEqual(bigIntToV4(4294967295n), '255.255.255.255');
});
t('roundtrip v4', () => {
  for (const ip of ['10.0.0.1', '172.16.5.100', '8.8.8.8', '192.168.0.1']) {
    assert.strictEqual(bigIntToV4(v4ToBigInt(ip)), ip);
  }
});

// ── CIDR parsing ──
console.log('\nCIDR parsing');
t('parse v4 CIDR', () => {
  const r = parseCIDR('192.168.1.0/24');
  assert.strictEqual(r.ip, '192.168.1.0');
  assert.strictEqual(r.prefix, 24);
  assert.strictEqual(r.version, 4);
});
t('parse v6 CIDR', () => {
  const r = parseCIDR('2001:db8::/32');
  assert.strictEqual(r.ip, '2001:db8::');
  assert.strictEqual(r.prefix, 32);
  assert.strictEqual(r.version, 6);
});
t('no prefix defaults to /32 or /128', () => {
  assert.strictEqual(parseCIDR('10.0.0.1').prefix, 32);
  assert.strictEqual(parseCIDR('::1').prefix, 128);
});
t('invalid CIDR throws', () => {
  assert.throws(() => parseCIDR('999.1.1.1/24'));
  assert.throws(() => parseCIDR('10.0.0.0/33'));
  assert.throws(() => parseCIDR('::1/129'));
});

// ── cidrToRange ──
console.log('\ncidrToRange');
t('v4 /24 range', () => {
  const r = cidrToRange('192.168.1.0/24');
  assert.strictEqual(r.start, '192.168.1.0');
  assert.strictEqual(r.end, '192.168.1.255');
  assert.strictEqual(r.total, 256n);
});
t('v4 /30 range', () => {
  const r = cidrToRange('10.0.0.0/30');
  assert.strictEqual(r.start, '10.0.0.0');
  assert.strictEqual(r.end, '10.0.0.3');
  assert.strictEqual(r.total, 4n);
});
t('v4 /16 range', () => {
  const r = cidrToRange('172.16.0.0/16');
  assert.strictEqual(r.start, '172.16.0.0');
  assert.strictEqual(r.end, '172.16.255.255');
  assert.strictEqual(r.total, 65536n);
});
t('v4 /0 range (everything)', () => {
  const r = cidrToRange('0.0.0.0/0');
  assert.strictEqual(r.start, '0.0.0.0');
  assert.strictEqual(r.end, '255.255.255.255');
  assert.strictEqual(r.total, 4294967296n);
});
t('v6 /64 range', () => {
  const r = cidrToRange('2001:db8::/64');
  assert.ok(r.start.startsWith('2001:db8::'));
  assert.strictEqual(r.total, (1n << 64n));
});

// ── contains() ──
console.log('\ncontains()');
t('v4 inside CIDR', () => {
  assert.strictEqual(contains('192.168.1.0/24', '192.168.1.100'), true);
  assert.strictEqual(contains('192.168.1.0/24', '192.168.1.255'), true);
});
t('v4 outside CIDR', () => {
  assert.strictEqual(contains('192.168.1.0/24', '192.168.2.1'), false);
  assert.strictEqual(contains('10.0.0.0/8', '11.0.0.1'), false);
});
t('cross-version returns false', () => {
  assert.strictEqual(contains('192.168.1.0/24', '::1'), false);
  assert.strictEqual(contains('::1/128', '10.0.0.1'), false);
});

// ── overlap() ──
console.log('\noverlap()');
t('overlapping CIDRs', () => {
  assert.strictEqual(overlap('10.0.0.0/8', '10.1.0.0/16'), true);
  assert.strictEqual(overlap('192.168.0.0/16', '192.168.1.0/24'), true);
});
t('non-overlapping CIDRs', () => {
  assert.strictEqual(overlap('10.0.0.0/8', '192.168.0.0/16'), false);
  assert.strictEqual(overlap('172.16.0.0/12', '10.0.0.0/8'), false);
});

// ── subnet() ──
console.log('\nsubnet()');
t('v4 /24 → /26 gives 4 subnets', () => {
  const subs = subnet('192.168.1.0/24', 26);
  assert.strictEqual(subs.length, 4);
  assert.strictEqual(subs[0], '192.168.1.0/26');
  assert.strictEqual(subs[1], '192.168.1.64/26');
  assert.strictEqual(subs[2], '192.168.1.128/26');
  assert.strictEqual(subs[3], '192.168.1.192/26');
});
t('v4 /16 → /24 gives 256 subnets', () => {
  const subs = subnet('10.0.0.0/16', 24);
  assert.strictEqual(subs.length, 256);
  assert.strictEqual(subs[0], '10.0.0.0/24');
  assert.strictEqual(subs[255], '10.0.255.0/24');
});
t('equal prefix throws', () => {
  assert.throws(() => subnet('10.0.0.0/24', 24));
});
t('smaller prefix throws', () => {
  assert.throws(() => subnet('10.0.0.0/24', 23));
});

// ── Classification ──
console.log('\nClassification');
t('private addresses', () => {
  assert.strictEqual(isPrivate('10.0.0.1'), true);
  assert.strictEqual(isPrivate('172.16.0.1'), true);
  assert.strictEqual(isPrivate('192.168.1.1'), true);
  assert.strictEqual(isPrivate('8.8.8.8'), false);
  assert.strictEqual(isPrivate('fc00::1'), true);
});
t('loopback addresses', () => {
  assert.strictEqual(isLoopback('127.0.0.1'), true);
  assert.strictEqual(isLoopback('127.255.255.255'), true);
  assert.strictEqual(isLoopback('::1'), true);
  assert.strictEqual(isLoopback('10.0.0.1'), false);
});
t('multicast addresses', () => {
  assert.strictEqual(isMulticast('224.0.0.1'), true);
  assert.strictEqual(isMulticast('239.255.255.255'), true);
  assert.strictEqual(isMulticast('223.255.255.255'), false);
  assert.strictEqual(isMulticast('ff02::1'), true);
});
t('reserved addresses', () => {
  assert.strictEqual(isReserved('0.0.0.0'), true);
  assert.strictEqual(isReserved('240.0.0.1'), true);
  assert.strictEqual(isReserved('255.255.255.255'), true);
  assert.strictEqual(isReserved('169.254.1.1'), true); // link-local
  assert.strictEqual(isReserved('8.8.8.8'), false);
});

// ── compare() ──
console.log('\ncompare()');
t('v4 comparison', () => {
  assert.strictEqual(compare('10.0.0.1', '10.0.0.2'), -1);
  assert.strictEqual(compare('10.0.0.2', '10.0.0.1'), 1);
  assert.strictEqual(compare('10.0.0.1', '10.0.0.1'), 0);
});
t('cross-version comparison', () => {
  assert.strictEqual(compare('255.255.255.255', '::1'), -1);
  assert.strictEqual(compare('::1', '255.255.255.255'), 1);
});

// ── info() ──
console.log('\ninfo()');
t('info returns structured data', () => {
  const i = info('10.0.0.1');
  assert.strictEqual(i.version, 4);
  assert.strictEqual(i.private, true);
  assert.strictEqual(i.loopback, false);
  assert.strictEqual(i.normalized, '10.0.0.1');
});
t('info for v6', () => {
  const i = info('::1');
  assert.strictEqual(i.version, 6);
  assert.strictEqual(i.loopback, true);
  assert.strictEqual(i.normalized, '::1');
});

// ── Summary ──
console.log(`\n${'═'.repeat(40)}`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log(`${'═'.repeat(40)}\n`);
process.exit(fail > 0 ? 1 : 0);
