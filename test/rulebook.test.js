// test/rulebook.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { buildSystemPrompt } = require('../cloudflare/functions/_lib/rulebook.js');

test('system prompt includes shop identity and slogan', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes("3J's Auto Body & Paint"));
  assert.ok(prompt.includes('Where we meet great people by accident'));
});

test('system prompt includes pricing rules verbatim', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes('Never invent or estimate a price'));
  assert.ok(prompt.includes('capture_lead'));
});

test('system prompt includes at least one FAQ question', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes("Where is 3J's Auto Body located?"));
});

test('system prompt includes hours and phone number', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes('562-424-6744'));
  assert.ok(prompt.includes('Saturday: Closed'));
});

test('system prompt forbids decorative emoji and heavy markup', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes('## Formatting'));
  assert.ok(prompt.includes('Never use decorative emoji'));
  assert.ok(prompt.includes('Do not use headings, tables, code blocks'));
});
