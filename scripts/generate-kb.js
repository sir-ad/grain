import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KB_DIR = path.join(__dirname, '../packages/docs-site/kb');

if (!fs.existsSync(KB_DIR)) {
    fs.mkdirSync(KB_DIR, { recursive: true });
}

const components = [
    {
        id: 'stream',
        title: '<stream>',
        desc: 'The fundamental primitive for manifesting iterative, real-time output from AIs to Humans.',
        why: 'When AI outputs tokens, UIs typically have to guess when a paragraph ends or a code block begins. <stream> forces the AI to demarcate the exact boundaries of user-facing text, allowing precise typwriter styling and sub-component rendering.',
        code: '// A standard stream tag\\n<stream speed="fast">Hello world</stream>\\n\\n// A partial stream chunk arriving from an LLM\\n<stream speed="normal" status="pending">The capital of F'
    },
    {
        id: 'think',
        title: '<think>',
        desc: 'Encapsulates the internal monologue and Chain-of-Thought reasoning of an autonomous agent.',
        why: 'Agents need to reason before they act. By wrapping this cognition in a <think> tag instead of raw text, the frontend UI can choose to hide it, style it as a collapsible accordion, or stream it mutely, preserving the UX.',
        code: '<message role="assistant">\\n  <think model="chain-of-thought" visible="false">\\n    User asked for the capital of France.\\n    Retrieving from memory... Paris.\\n  </think>\\n  <stream speed="fast">The capital of France is Paris.</stream>\\n</message>'
    },
    {
        id: 'tool',
        title: '<tool>',
        desc: 'The standardized execution request from an Agent to the host environment or MCP server.',
        why: 'Proprietary tool-call JSON schemas tightly couple you to OpenAI, Anthropic, or Gemini. The <tool> tag ensures any model, open-source or proprietary, simply outputs HTML limits to execute a function, perfectly decoupling the model from the execution layer.',
        code: '<tool name="calculator" id="call_123" status="running">\\n  <tool_args>\\n    {"expression": "2 + 2"}\\n  </tool_args>\\n</tool>'
    },
    {
        id: 'form',
        title: '<form>',
        desc: 'Allows AI Agents to request structured input fields directly from the Human User.',
        why: 'Instead of an ongoing conversational ping-pong to gather 5 pieces of information, the AI can render a semantic <form> primitive. The Web Adapter intercepts this, renders standard HTML inputs, and submits an explicit <tool_result> back to the agent.',
        code: '<form action="submit_profile" method="post">\\n  <label>First Name:</label>\\n  <input type="text" name="firstName" required="true" />\\n  \\n  <label>Age:</label>\\n  <input type="number" name="age" />\\n  \\n  <button type="submit">Complete Profile</button>\\n</form>'
    }
];

function generateHtml(comp) {
    let sidebarLinks = components.map(c => {
        let active = c.id === comp.id ? 'active' : '';
        let safeTitle = c.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return '<li><a href="' + c.id + '.html" class="' + active + '">' + safeTitle + '</a></li>';
    }).join('\\n        ');

    let codeSafe = comp.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let titleSafe = comp.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return '<!DOCTYPE html>\\n' +
        '<html lang="en">\\n' +
        '<head>\\n' +
        '  <meta charset="UTF-8">\\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n' +
        '  <title>' + comp.title + ' | Grain Knowledgebase</title>\\n' +
        '  <link rel="preconnect" href="https://fonts.googleapis.com">\\n' +
        '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\\n' +
        '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">\\n' +
        '  <link rel="stylesheet" href="../src/style.css">\\n' +
        '  <style>\\n' +
        '    .kb-container { max-width: 1000px; margin: 120px auto 60px; padding: 0 24px; display: grid; grid-template-columns: 240px 1fr; gap: 48px; }\\n' +
        '    @media (max-width: 768px) { .kb-container { grid-template-columns: 1fr; } }\\n' +
        '    .kb-sidebar { position: sticky; top: 120px; height: fit-content; }\\n' +
        '    .kb-sidebar ul { list-style: none; padding: 0; margin: 0; }\\n' +
        '    .kb-sidebar li { margin-bottom: 12px; }\\n' +
        '    .kb-sidebar a { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; display: block; padding: 4px 0; }\\n' +
        '    .kb-sidebar a:hover, .kb-sidebar a.active { color: var(--text); }\\n' +
        '    .kb-sidebar h4 { font-family: var(--font-display); color: var(--text); margin-bottom: 16px; font-size: 1.1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px; }\\n' +
        '    .kb-content { line-height: 1.7; color: var(--text-muted); }\\n' +
        '    .kb-content h1 { font-family: var(--font-mono); font-size: 2.5rem; color: var(--text); margin-bottom: 16px; letter-spacing: -0.02em; }\\n' +
        '    .kb-content .desc-lead { font-size: 1.2rem; color: #e2e8f0; margin-bottom: 48px; line-height: 1.6; }\\n' +
        '    .kb-content h2 { font-family: var(--font-display); font-size: 1.5rem; color: var(--text); margin-top: 48px; margin-bottom: 16px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; }\\n' +
        '    .kb-content p { margin-bottom: 20px; }\\n' +
        '    pre { background: #0d0d0d !important; border: 1px solid var(--glass-border); padding: 24px; border-radius: 8px; overflow-x: auto; margin-bottom: 24px; }\\n' +
        '    pre code { font-family: var(--font-mono); font-size: 0.9rem; color: #a855f7; line-height: 1.5; }\\n' +
        '  </style>\\n' +
        '</head>\\n' +
        '<body>\\n' +
        '  <nav class="glass-nav">\\n' +
        '    <div class="nav-content">\\n' +
        '      <a href="../index.html" class="logo" style="text-decoration: none;">Grain</a>\\n' +
        '      <div class="nav-links">\\n' +
        '        <a href="../index.html#docs">Docs</a>\\n' +
        '        <a href="index.html" style="color: var(--text);">Knowledgebase</a>\\n' +
        '        <a href="../whitepaper.html">Whitepaper</a>\\n' +
        '        <a href="https://github.com/sir-ad/grain">GitHub</a>\\n' +
        '      </div>\\n' +
        '    </div>\\n' +
        '  </nav>\\n' +
        '\\n' +
        '  <div class="kb-container">\\n' +
        '    <aside class="kb-sidebar">\\n' +
        '      <h4>Primitives (Tags)</h4>\\n' +
        '      <ul>\\n' +
        '        ' + sidebarLinks + '\\n' +
        '      </ul>\\n' +
        '      <h4 style="margin-top: 32px;">Overview</h4>\\n' +
        '      <ul>\\n' +
        '        <li><a href="index.html">Runtime Guides</a></li>\\n' +
        '      </ul>\\n' +
        '    </aside>\\n' +
        '\\n' +
        '    <main class="kb-content">\\n' +
        '      <h1>' + titleSafe + '</h1>\\n' +
        '      <p class="desc-lead">' + comp.desc.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>\\n' +
        '\\n' +
        "      <h2>Why it's valuable</h2>\\n" +
        '      <p>' + comp.why.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>\\n' +
        '\\n' +
        '      <h2>Implementation Example</h2>\\n' +
        '      <pre><code>' + codeSafe + '</code></pre>\\n' +
        '      \\n' +
        '      <p style="margin-top: 64px; font-size: 0.9rem;">\\n' +
        '        ← Back to <a href="index.html" style="color: #fff;">Knowledgebase Index</a>\\n' +
        '      </p>\\n' +
        '    </main>\\n' +
        '  </div>\\n' +
        '</body>\\n' +
        '</html>';
}

components.forEach(comp => {
    const file = path.join(KB_DIR, comp.id + '.html');
    fs.writeFileSync(file, generateHtml(comp));
    console.log('Generated ' + file);
});
