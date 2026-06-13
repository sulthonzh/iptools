# iptools

Zero-dependency IPv4/IPv6 toolkit for Node.js. Parse, validate, normalize, CIDR math, subnet division, range operations, and address classification — all in one small package.

## Why

Every time you need to work with IP addresses in Node, you either Google for a package or write hacky regex. This does it properly: correct BigInt arithmetic, IPv4-mapped IPv6 support, RFC-compliant validation, and clean CIDR operations. No deps.

## Install

```bash
npm install @sulthonzh/iptools
```

## Library

```js
const {
  isValid, version, normalize, info,
  parseCIDR, cidrToRange, contains, overlap, subnet,
  isPrivate, isLoopback, isMulticast, isReserved,
  compare, toBigInt
} = require('@sulthonzh/iptools');
```

### Validation

```js
isValid('192.168.1.1')    // true
isValid('2001:db8::1')    // true
isValid('not-an-ip')      // false
version('10.0.0.1')       // 4
version('::1')            // 6
```

### Normalization

```js
normalize('2001:0DB8:0000:0000:0000:0000:0000:0001')
// → '2001:db8::1'

normalize('FE80::0001')
// → 'fe80::1'
```

### CIDR Operations

```js
// Range from CIDR
cidrToRange('192.168.1.0/24')
// { start: '192.168.1.0', end: '192.168.1.255', total: 256n, ... }

cidrToRange('10.0.0.0/30')
// { start: '10.0.0.0', end: '10.0.0.3', total: 4n }

// Check membership
contains('192.168.1.0/24', '192.168.1.100')  // true
contains('10.0.0.0/8', '11.0.0.1')           // false

// Check overlap
overlap('10.0.0.0/8', '10.1.0.0/16')         // true
overlap('10.0.0.0/8', '192.168.0.0/16')      // false

// Divide into subnets
subnet('192.168.1.0/24', 26)
// ['192.168.1.0/26', '192.168.1.64/26', '192.168.1.128/26', '192.168.1.192/26']
```

### Classification

```js
isPrivate('10.0.0.1')       // true
isPrivate('8.8.8.8')        // false
isLoopback('127.0.0.1')     // true
isMulticast('224.0.0.1')    // true
isReserved('0.0.0.0')       // true
isPrivate('fc00::1')        // true (ULA)
isLoopback('::1')           // true
```

### Info (all-in-one)

```js
info('10.0.0.1')
// {
//   ip: '10.0.0.1',
//   version: 4,
//   normalized: '10.0.0.1',
//   bigInt: '167772161',
//   private: true,
//   loopback: false,
//   multicast: false,
//   reserved: false
// }
```

### Comparison

```js
compare('10.0.0.1', '10.0.0.2')   // -1
compare('10.0.0.2', '10.0.0.1')   // 1
compare('10.0.0.1', '10.0.0.1')   // 0
// Cross-version: IPv4 < IPv6
compare('255.255.255.255', '::1') // -1
```

## CLI

```bash
# IP details
iptools info 10.0.0.1
iptools info ::1 --json

# CIDR range
iptools range 192.168.1.0/24

# Check membership
iptools contains 10.0.0.0/8 10.1.2.3  # exits 0 if true, 1 if false

# Overlap check
iptools overlap 10.0.0.0/8 10.1.0.0/16

# Subnet division
iptools subnet 192.168.1.0/24 26

# Normalize
iptools normalize 2001:0DB8:0000:0000:0000:0000:0000:0001
# → 2001:db8::1

# Validate
iptools valid 192.168.1.1  # exits 0 or 1
```

## Supported

- IPv4: full validation, no leading zeros, octet range
- IPv6: full + compressed (`::`), IPv4-mapped (`::ffff:1.2.3.4`), hex validation
- CIDR: `/0` to `/32` (v4), `/0` to `/128` (v6)
- BigInt arithmetic for exact range calculations
- Private ranges: 10/8, 172.16/12, 192.168/16, fc00::/7
- Loopback: 127/8, ::1
- Multicast: 224-239, ff00::/8
- Reserved: 0/8, 240/4, 255.255.255.255, 169.254/16, ::/8 (excl loopback/multicast)

## License

MIT
