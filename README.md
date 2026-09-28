# 🤖 Bilal AI Agent — Autonomous Personal Voice & Tool Operating System

[![AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Gemini%203.8%20Flash-blue.svg)](https://aistudio.google.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20%7C%20React%2019-blue)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://expressjs.com)
[![Security](https://img.shields.io/badge/Security-Strict%20Allowlist%20%7C%20Approval%20Gate-red)](#15-security-notes)

**Bilal AI Agent** is a production-grade, full-stack personal AI assistant controlled primarily by voice and natural language. It features an allowlisted modular tool registry, intent decomposition, browser automation, WhatsApp Cloud API bridge, TikTok creator integration, code sandboxing with live web preview, persistent memory vault, and a mandatory confirmation gatekeeper for sensitive actions.

---

## 📋 Table of Contents
1. [Architecture & Workflow](#1-architecture--workflow)
2. [Requirements](#2-requirements)
3. [Quick Installation](#3-quick-installation)
4. [Environment Variables](#4-environment-variables)
5. [AI API Setup (Gemini 3.8 Flash)](#5-ai-api-setup)
6. [Voice Control & Speech-to-Text Setup](#6-voice-control--speech-to-text-setup)
7. [WhatsApp Integration Setup](#7-whatsapp-integration-setup)
8. [TikTok Integration Setup](#8-tiktok-integration-setup)
9. [Browser Automation (Playwright)](#9-browser-automation-playwright)
10. [Database & Memory Setup](#10-database--memory-setup)
11. [Running the Application](#11-running-the-application)
12. [Supported Natural Commands (English & Roman Urdu)](#12-supported-natural-commands)
13. [Production Deployment](#13-production-deployment)
14. [Security Notes & Allowlist Policies](#14-security-notes--allowlist-policies)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Architecture & Workflow

```text
USER (Voice Mic / Text)
       ↓
[Web Speech API / SpeechRecognition] (English, Urdu, Roman Urdu)
       ↓
[Agent Central Orchestrator] (Google Gemini 3.8 Flash)
       ↓
[Intent Parser & Task Decomposition]
   ├─ Step 1: Analyze Command Context
   ├─ Step 2: Select Allowlisted Tool
   ├─ Step 3: Check Permission Gate (Low-risk vs Sensitive)
   └─ Step 4: Execute or Prompt User for Approval
       ↓
[Approval Gatekeeper Modal] (Required for WhatsApp Send, TikTok Post, File Deletion)
       ↓
[Tool Execution Engine]
   ├─ Web Search (DuckDuckGo & Google Esports Citations)
   ├─ Safe Browser Automation (Playwright / Chrome)
   ├─ WhatsApp Integration Layer (Meta Graph Cloud API / Sandbox)
   ├─ TikTok Creator Hub (Comments Analysis & Reply Moderation)
   ├─ Sandboxed File System & Document AI (/workspace)
   ├─ Coding Studio (Live HTML/React/Tailwind Runner)
   ├─ Task Scheduler (One-time reminders & recurring cron)
   └─ Memory Vault (Persistent user preferences & aliases)
       ↓
[Live Task Progress Panel + UI Response]
       ↓
[SpeechSynthesis TTS] (Spoken natural voice feedback)
```

---

## 2. Requirements

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **NPM**: v9.0.0 or higher
- **Modern Web Browser**: Google Chrome, Microsoft Edge, or Safari with microphone permissions granted
- **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com)

---

## 3. Quick Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/bilal-ai-agent.git
cd bilal-ai-agent

# 2. Install all dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env
```

---

## 4. Environment Variables

Configure your `.env` file with the following keys:

```ini
# Gemini API Key (Required for AI agent core)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Model Selection
AI_MODEL="gemini-3.8-flash"

# Port & Server Host
PORT=3000
APP_URL="http://localhost:3000"

# Application Security
SESSION_SECRET="bilal_ai_super_secret_session_key_2026"
ALLOWED_ORIGIN="http://localhost:3000"

# Persistent Database File
DATABASE_URL="file:./data/bilal_agent.json"

# WhatsApp Cloud API (Optional - default uses interactive Sandbox)
WHATSAPP_API_KEY=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""

# TikTok For Developers (Optional - default uses creator sandbox)
TIKTOK_CLIENT_ID=""
TIKTOK_CLIENT_SECRET=""

# Playwright Headless Automation
HEADLESS_BROWSER="true"
BROWSER_TIMEOUT_MS="30000"
```

---

## 5. AI API Setup

1. Visit [Google AI Studio](https://aistudio.google.com).
2. Generate an API Key.
3. Add your key to `.env`:
   ```bash
   GEMINI_API_KEY="AIzaSy..."
   ```
4. The system leverages `gemini-3.8-flash` by default for sub-second agent planning and tool calling.

---

## 6. Voice Control & Speech-to-Text Setup

- Click the large glowing **Microphone Orb** in the center of the dashboard.
- When prompted by your browser, click **Allow** for microphone access.
- The agent includes:
  - Real-time sound wave visualizer
  - Dynamic interim transcription
  - Support for **English**, **Urdu**, and **Roman Urdu**
  - **Speech Synthesis (TTS)**: Spoken voice responses with rate control and an instant mute/unmute button in the top navigation.

---

## 7. WhatsApp Integration Setup

Bilal AI features an authorized WhatsApp communication layer:
1. **Local Sandbox Mode** (Default): Pre-seeded with realistic conversations with **Ahmed**, **Ali**, and the **Gaming Squad Group**. You can test summarization, drafts, and approval flows immediately.
2. **Meta Cloud API Live Mode**:
   - Go to [Meta for Developers](https://developers.facebook.com).
   - Create an app of type **Business** and add the **WhatsApp** product.
   - Copy your **Temporary / Permanent Access Token** and **Phone Number ID**.
   - Paste into `.env`:
     ```ini
     WHATSAPP_API_KEY="EAA..."
     WHATSAPP_PHONE_NUMBER_ID="104829381920"
     ```
   - **Safety First**: Any outgoing message triggers an explicit approval confirmation card (`[Cancel] [Authorize & Send]`) before transmission.

---

## 8. TikTok Integration Setup

1. **Creator Sandbox Mode** (Default): Pre-populated with real audience comments on Sony Xperia XZ3 PUBG Mobile gameplay videos.
2. **Official TikTok Display API**:
   - Visit [TikTok for Developers](https://developers.tiktok.com).
   - Register an app under the **TikTok Display API** & **Comment Management** scope.
   - Set redirect URI to: `http://localhost:3000/api/integrations/tiktok/callback`.
   - Add credentials to `.env`:
     ```ini
     TIKTOK_CLIENT_ID="aw12..."
     TIKTOK_CLIENT_SECRET="secret..."
     ```
   - Uses the three-step workflow: **[Edit] -> [Approve] -> [Post]**.

---

## 9. Browser Automation (Playwright)

Bilal AI includes safe headless browser execution:
- Navigates to requested websites (e.g., YouTube, Google, documentation).
- Extracts web pages and searches live sources with citation links.
- Strictly observes authentication boundaries: **never** attempts CAPTCHA bypass or password cracking.

---

## 10. Database & Memory Setup

- Stores conversations, tasks, audit logs, and memories in `./data/bilal_agent.json` with an atomic sync engine.
- Sandboxed files are isolated in `./workspace/`.
- Memory Vault categories:
  - Preferences
  - Projects
  - Contacts & Aliases
  - Frequently Used Commands
  - Tool Settings
- Sensitive credentials (passwords, tokens) are blocked by security policy from entering memory.

---

## 11. Running the Application

### Development Mode (Full-Stack Express + Vite SPA):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production:
```bash
npm run build
npm start
```

---

## 12. Supported Natural Commands

Try speaking or typing any of the following natural commands:

### Web & Device Optimization:
- *"Open Chrome and search PUBG sensitivity for Sony Xperia XZ3."*
- *"Search Google for the latest PUBG Mobile update."*
- *"Find the best free video editing software for my laptop."*

### WhatsApp Integration:
- *"Show me my unread WhatsApp messages."*
- *"Summarize my conversation with Ahmed."*
- *"Ahmed ko WhatsApp message draft karo ke main 10 minutes mein aaunga."*
- *"Send this message to Ahmed."* (Triggers Approval Dialog)

### TikTok Engagement:
- *"Check my latest TikTok comments."*
- *"Is comment ka funny reply banao."*
- *"Approve and post this TikTok reply."* (Triggers Approval Dialog)

### Coding & Web Development:
- *"Create a modern responsive gaming website in HTML and Tailwind CSS."*
- *"Find my HTML project files."*
- *"Analyze and fix bugs in index.html."*

### Document AI:
- *"Read this file and explain it in simple Urdu."*
- *"Summarize Sony_Xperia_PUBG_Guide.pdf."*

### Task Scheduling:
- *"Remind me tomorrow at 10 AM to review project code."*
- *"Every Monday at 9 AM remind me to upload my YouTube video."*

---

## 13. Production Deployment

To deploy on Cloud Run or any Linux VPS:
```bash
# 1. Build the frontend
npm run build

# 2. Start the production server
NODE_ENV=production npm start
```

---

## 14. Security Notes & Allowlist Policies

1. **Tool Allowlist**: The agent cannot execute arbitrary bash or eval code. Only verified tools registered in `ToolRegistry` are accessible.
2. **Permission Gating**:
   - `low_risk`: Safe operations (e.g. read files, search web, create drafts) run automatically.
   - `sensitive`: High-impact actions (e.g. send WhatsApp, post to TikTok, delete files) trigger a modal dialog requiring manual approval.
3. **Audit Trail**: Every invocation is logged with timestamp, user ID, status, and parameter details under **Settings -> Audit Logs**.
4. **Sandboxed Workspace**: File reads and writes are restricted to the `./workspace` directory.

---

## 15. Troubleshooting

- **Microphone not working**: Check that microphone permission is granted in your browser settings (`chrome://settings/content/microphone`) and that your OS microphone input is active.
- **Port 3000 already in use**: Pass custom port via `PORT=3001 npm run dev`.
- **Gemini API Error**: Verify that `GEMINI_API_KEY` is correctly defined in `.env` and that your quota is active.

---

Built with pride for **Bilal** • Powered by Google AI Studio
