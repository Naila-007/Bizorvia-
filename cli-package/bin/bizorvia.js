#!/usr/bin/env node
/**
 * Bizorvia CLI — The coding agent powered by Bizorvia AI
 * Run: bizorvia "what you want to build"
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const CONFIG_DIR = join(homedir(), '.bizorvia');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const API_BASE = 'https://bizorvia.com/api';
const VERSION = '1.0.0';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  lime: '\x1b[93m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;
const ok = (msg) => console.log(`${c('green', '✓')} ${msg}`);
const err = (msg) => console.log(`${c('red', '✗')} ${msg}`);
const info = (msg) => console.log(`${c('gray', '→')} ${msg}`);
const lime = (msg) => console.log(c('lime', msg));

function loadConfig() {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveConfig(data) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

async function callBizorvia(token, prompt, options = {}) {
  const res = await fetch(`${API_BASE}/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': `bizorvia-cli/${VERSION}`,
    },
    body: JSON.stringify({ prompt, model: options.model || 'claude' }),
  });
  
  if (res.status === 429) {
    const data = await res.json();
    err(`Credit limit reached. Upgrade at bizorvia.com/pricing`);
    process.exit(1);
  }
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    err(data.error || `API error: ${res.status}`);
    process.exit(1);
  }
  
  return await res.json();
}

async function getSupabaseToken(email, password) {
  const supabaseUrl = 'https://xcbezfmthtcbmcpfilyk.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYmV6Zm10aHRjYm1jcGZpbHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDg5NTAsImV4cCI6MjA2MTQyNDk1MH0.X9Y9EMtxWPxMtWE28hpBBG8gfP5vLUHWy0I7HLn62Fk';
  
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

function printHeader() {
  console.log('');
  lime('  ██████╗ ██╗███████╗ ██████╗ ██████╗ ██╗   ██╗██╗ █████╗');
  lime('  ██╔══██╗██║╚══███╔╝██╔═══██╗██╔══██╗██║   ██║██║██╔══██╗');
  lime('  ██████╔╝██║  ███╔╝ ██║   ██║██████╔╝██║   ██║██║███████║');
  lime('  ██╔══██╗██║ ███╔╝  ██║   ██║██╔══██╗╚██╗ ██╔╝██║██╔══██║');
  lime('  ██████╔╝██║███████╗╚██████╔╝██║  ██║ ╚████╔╝ ██║██║  ██║');
  lime('  ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═╝');
  console.log(`\n  ${c('gray', 'The coding agent for your terminal')}  ${c('gray', `v${VERSION}`)}\n`);
}

function printHelp() {
  printHeader();
  console.log(`${c('bright', 'USAGE')}`);
  console.log(`  bizorvia <prompt>           Run a coding task`);
  console.log(`  bizorvia fix "<error>"      Debug and auto-fix an error`);
  console.log(`  bizorvia explain <file>     Explain what a file does`);
  console.log(`  bizorvia refactor <file>    Refactor a file for clarity`);
  console.log(`  bizorvia test <file>        Generate unit tests`);
  console.log(`  bizorvia review             Review your last git diff`);
  console.log(`  bizorvia credits            Check remaining AI credits`);
  console.log(`  bizorvia login              Connect your account`);
  console.log(`  bizorvia logout             Sign out`);
  console.log('');
  console.log(`${c('bright', 'EXAMPLES')}`);
  console.log(`  ${c('lime', 'bizorvia')} "build a REST API for a todo app in Node.js"`);
  console.log(`  ${c('lime', 'bizorvia')} fix "TypeError: Cannot read properties of undefined"`);
  console.log(`  ${c('lime', 'bizorvia')} explain src/auth.ts`);
  console.log(`  ${c('lime', 'bizorvia')} "add dark mode to my React app"`);
  console.log('');
  console.log(`${c('gray', 'Docs & account: bizorvia.com')}`);
  console.log('');
}

async function cmdLogin() {
  printHeader();
  console.log(`${c('bright', 'Connect your Bizorvia account')}\n`);
  console.log(`  Don't have an account? ${c('lime', 'bizorvia.com/signup')}\n`);
  
  const rl = readline.createInterface({ input, output });
  const email = await rl.question(`  ${c('gray', 'Email:')} `);
  const password = await rl.question(`  ${c('gray', 'Password:')} `);
  rl.close();
  
  console.log('');
  info('Authenticating...');
  
  const token = await getSupabaseToken(email.trim(), password.trim());
  if (!token) {
    err('Invalid email or password. Try again or visit bizorvia.com/login');
    process.exit(1);
  }
  
  saveConfig({ token, email: email.trim(), loginAt: new Date().toISOString() });
  ok(`Logged in as ${c('lime', email.trim())}`);
  console.log(`\n  Run ${c('lime', 'bizorvia "your task"')} to start coding.\n`);
}

function cmdLogout() {
  saveConfig({});
  ok('Logged out. Run `bizorvia login` to reconnect.');
}

async function cmdCredits(token) {
  info('Fetching credits...');
  const res = await fetch(`${API_BASE}/credits`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) { err('Could not fetch credits.'); return; }
  const { used, limit, plan } = await res.json();
  const remaining = limit - used;
  const bar = '█'.repeat(Math.round((used / limit) * 20)) + '░'.repeat(20 - Math.round((used / limit) * 20));
  console.log('');
  console.log(`  Plan:      ${c('lime', plan.toUpperCase())}`);
  console.log(`  Used:      ${c(used >= limit ? 'red' : 'white', `${used} / ${limit}`)}`);
  console.log(`  Remaining: ${c('lime', String(remaining))}`);
  console.log(`  ${c('gray', bar)}`);
  if (remaining < 5) console.log(`\n  ${c('lime', 'Upgrade at bizorvia.com/pricing')}`);
  console.log('');
}

async function runTask(token, prompt) {
  console.log('');
  info(`Processing: ${c('gray', prompt.slice(0, 80) + (prompt.length > 80 ? '...' : ''))}`);
  
  const data = await callBizorvia(token, prompt);
  
  console.log('');
  console.log('─'.repeat(60));
  console.log(data.result || '');
  console.log('─'.repeat(60));
  
  if (data.credits) {
    console.log(`\n  ${c('gray', `Credits used: ${data.credits.used}/${data.credits.limit} (${data.credits.remaining} remaining)`)}`);
  }
  console.log('');
}

async function cmdExplain(token, file) {
  const { readFileSync } = await import('fs');
  if (!existsSync(file)) { err(`File not found: ${file}`); process.exit(1); }
  const code = readFileSync(file, 'utf-8').slice(0, 3000);
  const prompt = `Explain this code file (${file}) clearly and concisely:\n\n\`\`\`\n${code}\n\`\`\``;
  await runTask(token, prompt);
}

async function cmdRefactor(token, file) {
  const { readFileSync } = await import('fs');
  if (!existsSync(file)) { err(`File not found: ${file}`); process.exit(1); }
  const code = readFileSync(file, 'utf-8').slice(0, 3000);
  const prompt = `Refactor this code for clarity, performance, and best practices. Show the improved version with comments explaining changes:\n\n\`\`\`\n${code}\n\`\`\``;
  await runTask(token, prompt);
}

async function cmdTest(token, file) {
  const { readFileSync } = await import('fs');
  if (!existsSync(file)) { err(`File not found: ${file}`); process.exit(1); }
  const code = readFileSync(file, 'utf-8').slice(0, 3000);
  const prompt = `Generate comprehensive unit tests for this code (${file}). Use the appropriate test framework (Jest/Vitest for JS/TS, pytest for Python):\n\n\`\`\`\n${code}\n\`\`\``;
  await runTask(token, prompt);
}

async function cmdReview(token) {
  const { execSync } = await import('child_process');
  let diff = '';
  try { diff = execSync('git diff HEAD~1 HEAD --unified=3 2>/dev/null || git diff --cached 2>/dev/null || git diff 2>/dev/null', { encoding: 'utf-8' }).slice(0, 3000); }
  catch { err('No git repo or no changes found.'); process.exit(1); }
  if (!diff.trim()) { info('No changes to review.'); return; }
  const prompt = `Review this git diff for bugs, security issues, and code quality problems. Be specific and actionable:\n\n\`\`\`diff\n${diff}\n\`\`\``;
  await runTask(token, prompt);
}

// ─── MAIN ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === '--help' || cmd === '-h') { printHelp(); process.exit(0); }
if (cmd === '--version' || cmd === '-v') { console.log(`bizorvia/${VERSION}`); process.exit(0); }
if (cmd === 'login') { await cmdLogin(); process.exit(0); }
if (cmd === 'logout') { cmdLogout(); process.exit(0); }

// All other commands require auth
const config = loadConfig();
if (!config.token) {
  err('Not logged in. Run `bizorvia login` first.');
  console.log(`  Create account at: ${c('lime', 'bizorvia.com/signup')}`);
  process.exit(1);
}

if (cmd === 'credits') { await cmdCredits(config.token); }
else if (cmd === 'explain' && args[1]) { await cmdExplain(config.token, args[1]); }
else if (cmd === 'refactor' && args[1]) { await cmdRefactor(config.token, args[1]); }
else if (cmd === 'test' && args[1]) { await cmdTest(config.token, args[1]); }
else if (cmd === 'review') { await cmdReview(config.token); }
else if (cmd === 'fix') {
  const errorMsg = args.slice(1).join(' ');
  if (!errorMsg) { err('Provide an error message: bizorvia fix "your error"'); process.exit(1); }
  await runTask(config.token, `Debug and fix this error. Explain the root cause and show the exact code fix:\n\nError: ${errorMsg}`);
} else {
  // Plain prompt
  const prompt = args.join(' ');
  await runTask(config.token, `You are an expert software engineer. The user is asking you to help with a coding task in their terminal. Provide working, production-quality code with brief explanations.\n\nTask: ${prompt}`);
}
