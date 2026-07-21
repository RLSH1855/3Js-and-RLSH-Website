const fs = require('fs');
const path = require('path');

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripTags(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function extractFaqs(html) {
  const questions = [...html.matchAll(/<span class="q-label"[^>]*>([\s\S]*?)<\/span>/g)]
    .map(m => stripTags(m[1]));
  const answerBlocks = [...html.matchAll(/<div class="faq-answer"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>)?/g)]
    .map(m => [...m[1].matchAll(/<p class="answer-text"[^>]*>([\s\S]*?)<\/p>/g)]
      .map(p => stripTags(p[1]))
      .join(' '));
  const count = Math.min(questions.length, answerBlocks.length);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ question: questions[i], answer: answerBlocks[i] });
  }
  return result;
}

function main() {
  const srcPath = path.join(__dirname, '..', 'cloudflare', 'FAQ_PAGE_V2.html');
  const outPath = path.join(__dirname, '..', 'cloudflare', 'functions', '_lib', 'faq-data.json');
  const html = fs.readFileSync(srcPath, 'utf8');
  const faqs = extractFaqs(html);
  fs.writeFileSync(outPath, JSON.stringify(faqs, null, 2));
  console.log(`Extracted ${faqs.length} FAQs to ${outPath}`);
}

if (require.main === module) main();

module.exports = { extractFaqs };
