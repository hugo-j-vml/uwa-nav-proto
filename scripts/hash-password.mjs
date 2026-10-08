#!/usr/bin/env node
/**
 * Prints the SHA-256 hash of a password, for src/config.ts (PASSWORD_SHA256).
 * Usage: npm run hash-password -- "my new password"
 */
import { createHash } from 'node:crypto';

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: npm run hash-password -- "my new password"');
  process.exit(1);
}
console.log(createHash('sha256').update(pw, 'utf8').digest('hex'));
