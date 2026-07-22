// cloudflare/functions/_lib/claude-client.js
const { buildSystemPrompt } = require('./rulebook.js');

const CAPTURE_LEAD_TOOL = {
  name: 'capture_lead',
  description: 'Call this when a customer wants a quote, asks something only the shop owner can answer, or mentions a competitor price/link. Captures their contact info for follow-up.',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "Customer's name" },
      phone: { type: 'string', description: "Customer's phone number" },
      reason: { type: 'string', description: 'Why this lead was captured, in a few words' },
      competitor_link: { type: 'string', description: 'A competitor URL or price the customer mentioned, if any' }
    },
    required: ['name', 'phone', 'reason']
  }
};

async function callClaude({ apiKey, history, customerName }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: buildSystemPrompt(customerName),
      tools: [CAPTURE_LEAD_TOOL],
      messages: history
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  let replyText = '';
  let capturedLead = null;

  for (const block of data.content) {
    if (block.type === 'text') replyText += block.text;
    if (block.type === 'tool_use' && block.name === 'capture_lead') {
      capturedLead = block.input;
    }
  }

  if (!replyText && capturedLead) {
    replyText = "Got it — I've passed your info along to the team and someone will follow up with you soon. Is there anything else I can help you with?";
  }

  return { replyText, capturedLead };
}

module.exports = { callClaude, CAPTURE_LEAD_TOOL };
