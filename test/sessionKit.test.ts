import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseRolloutFile, MemoryStore } from '../src/index';

const FIX = [
  JSON.stringify({type:'session_header', payload:{id:'sess_123'}}),
  JSON.stringify({type:'response_item', payload:{role:'user', text:'hi'}}),
  'NOT VALID JSON {{{',
  JSON.stringify({type:'event_msg', payload:{ok:true}}),
].join('\n');

describe('rollout reader (tolerant)', () => {
  it('parses good lines, counts bad lines, captures header', () => {
    const dir = mkdtempSync(join(tmpdir(),'sk-'));
    const file = join(dir,'s.jsonl'); writeFileSync(file, FIX);
    const r = parseRolloutFile(file);
    expect(r.header?.payload.id).toBe('sess_123');
    expect(r.items.length).toBe(2);
    expect(r.badLines).toBe(1);
    rmSync(dir,{recursive:true,force:true});
  });
});

describe('MemoryStore', () => {
  it('set/get/has/keys roundtrip persists across reopen', () => {
    const dir = mkdtempSync(join(tmpdir(),'mem-'));
    const file = join(dir,'memory.jsonl');
    const m1 = new MemoryStore(file);
    m1.set('project','pnpm'); m1.set('lang','ts');
    const m2 = new MemoryStore(file);
    expect(m2.get('project')).toBe('pnpm');
    expect(m2.keys().sort()).toEqual(['lang','project']);
    m2.delete('lang');
    expect(new MemoryStore(file).has('lang')).toBe(false);
    rmSync(dir,{recursive:true,force:true});
  });
});
