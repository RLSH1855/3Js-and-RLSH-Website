// test/rulebook-name.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { buildSystemPrompt } = require('../cloudflare/functions/_lib/rulebook.js');

test('assistant is named Hex and must not claim to be human', () => {
  const prompt = buildSystemPrompt();
  assert.ok(prompt.includes('Your name is Hex'));
  assert.ok(prompt.includes('Never claim to be a human'));
});

test('system prompt has no customer-name block when no name is given', () => {
  const prompt = buildSystemPrompt();
  assert.ok(!prompt.includes('Who you are talking to'));
});

test('system prompt names the customer and forbids re-asking when a name is given', () => {
  const prompt = buildSystemPrompt('Daniel');
  assert.ok(prompt.includes("The customer's first name is Daniel"));
  assert.ok(prompt.includes('never ask for their first name again'));
});

test('naming the customer does not drop the rest of the rulebook', () => {
  const prompt = buildSystemPrompt('Daniel');
  assert.ok(prompt.includes('Never invent or estimate a price'));
  assert.ok(prompt.includes('capture_lead'));
  assert.ok(prompt.includes('562-424-6744'));
});
