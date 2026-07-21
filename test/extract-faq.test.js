const { test } = require('node:test');
const assert = require('node:assert');
const { extractFaqs } = require('../scripts/extract-faq.js');

test('extracts question and answer text, stripping HTML tags', () => {
  const html = `
    <div class="faq-item">
      <span class="q-label" itemprop="name">Where is 3J's Auto Body located?</span>
      <div class="faq-answer" itemprop="text">
        <p class="answer-text">3J's Auto Body &amp; Paint is located at <strong>1855 E 29th St, Signal Hill, CA 90755</strong>.</p>
      </div>
    </div>
  `;
  const result = extractFaqs(html);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].question, "Where is 3J's Auto Body located?");
  assert.strictEqual(result[0].answer, "3J's Auto Body & Paint is located at 1855 E 29th St, Signal Hill, CA 90755.");
});

test('extracts multiple FAQ items in document order', () => {
  const html = `
    <span class="q-label" itemprop="name">Q1?</span>
    <div class="faq-answer" itemprop="text"><p class="answer-text">A1.</p></div>
    <span class="q-label" itemprop="name">Q2?</span>
    <div class="faq-answer" itemprop="text"><p class="answer-text">A2.</p></div>
  `;
  const result = extractFaqs(html);
  assert.deepStrictEqual(result.map(r => r.question), ['Q1?', 'Q2?']);
  assert.deepStrictEqual(result.map(r => r.answer), ['A1.', 'A2.']);
});
