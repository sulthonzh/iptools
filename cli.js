#!/usr/bin/env node
'use strict';

const { info, cidrToRange, contains, overlap, subnet, version, isValid, normalize } = require('./index.js');

function usage() {
  console.log(`iptools — IPv4/IPv6 toolkit

Usage:
  iptools info <ip>          Show IP details (version, class, flags)
  iptools range <cidr>       Show start/end/size of CIDR range
  iptools contains <cidr> <ip>   Check if IP is inside CIDR
  iptools overlap <cidr1> <cidr2>   Check if two CIDRs overlap
  iptools subnet <cidr> <prefix>   Divide CIDR into smaller subnets
  iptools normalize <ip>     Normalize an IP address
  iptools valid <ip>         Check if IP is valid

Options:
  --json    Output as JSON`);
}

const args = process.argv.slice(2);
const json = args.includes('--json');
const cmd = args.find(a => !a.startsWith('-'));
const rest = args.filter(a => !a.startsWith('-') && a !== cmd);

try {
  switch (cmd) {
    case 'info': {
      const r = info(rest[0]);
      if (json) console.log(JSON.stringify(r, null, 2));
      else {
        console.log(`IP:       ${r.ip}`);
        console.log(`Version:  IPv${r.version}`);
        console.log(`Normal:   ${r.normalized}`);
        console.log(`BigInt:   ${r.bigInt}`);
        console.log(`Private:  ${r.private ? 'yes' : 'no'}`);
        console.log(`Loopback: ${r.loopback ? 'yes' : 'no'}`);
        console.log(`Multi:    ${r.multicast ? 'yes' : 'no'}`);
        console.log(`Reserved: ${r.reserved ? 'yes' : 'no'}`);
      }
      break;
    }
    case 'range': {
      const r = cidrToRange(rest[0]);
      const out = {
        cidr: rest[0], start: r.start, end: r.end,
        version: r.version, prefix: r.prefix,
        total: r.total.toString()
      };
      if (json) console.log(JSON.stringify(out, null, 2));
      else {
        console.log(`${rest[0]} → ${r.start} – ${r.end}`);
        console.log(`Total addresses: ${r.total}`);
      }
      break;
    }
    case 'contains': {
      const result = contains(rest[0], rest[1]);
      if (json) console.log(JSON.stringify({ cidr: rest[0], ip: rest[1], contains: result }));
      else console.log(result ? `${rest[1]} is in ${rest[0]} ✓` : `${rest[1]} is NOT in ${rest[0]} ✗`);
      process.exit(result ? 0 : 1);
      break;
    }
    case 'overlap': {
      const result = overlap(rest[0], rest[1]);
      if (json) console.log(JSON.stringify({ cidr1: rest[0], cidr2: rest[1], overlap: result }));
      else console.log(result ? `Overlap ✓` : `No overlap`);
      break;
    }
    case 'subnet': {
      const subs = subnet(rest[0], parseInt(rest[1], 10));
      if (json) console.log(JSON.stringify({ parent: rest[0], prefix: parseInt(rest[1], 10), count: subs.length, subnets: subs }, null, 2));
      else { console.log(`${subs.length} subnets:`); subs.forEach(s => console.log(`  ${s}`)); }
      break;
    }
    case 'normalize': {
      console.log(normalize(rest[0]));
      break;
    }
    case 'valid': {
      const v = isValid(rest[0]);
      if (json) console.log(JSON.stringify({ ip: rest[0], valid: v }));
      else console.log(v ? 'valid' : 'invalid');
      process.exit(v ? 0 : 1);
      break;
    }
    default:
      usage();
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
