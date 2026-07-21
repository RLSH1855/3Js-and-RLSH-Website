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

test('excludes answer-chip content and joins multiple answer-text paragraphs', () => {
  const html = `
    <div class="faq-item">
      <span class="q-label" itemprop="name">Where is 3J's Auto Body located?</span>
      <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <div class="faq-body-inner">
          <div class="faq-answer" itemprop="text">
            <p class="answer-text">3J's Auto Body &amp; Paint is located at <strong>1855 E 29th St, Signal Hill, CA 90755</strong> — right next to Long Beach. We're easy to get to from the 405, 710, and 91 freeways.</p>
            <p class="answer-text">📞 <strong>562-424-6744</strong> &nbsp;|&nbsp; ✉️ <strong>info@3jsautobody.com</strong></p>
            <span class="answer-chip">📍 Signal Hill, CA</span>
          </div>
        </div>
      </div>
    </div>
  `;
  const result = extractFaqs(html);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].question, "Where is 3J's Auto Body located?");
  assert.ok(!result[0].answer.includes('📍'));
  assert.ok(!result[0].answer.includes('answer-chip'));
  assert.strictEqual(
    result[0].answer,
    "3J's Auto Body & Paint is located at 1855 E 29th St, Signal Hill, CA 90755 — right next to Long Beach. We're easy to get to from the 405, 710, and 91 freeways. 📞 562-424-6744 | ✉️ info@3jsautobody.com"
  );
});
