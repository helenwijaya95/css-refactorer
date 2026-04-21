# CSS Refactorer — AI-Powered CSS to Tailwind Converter

A developer tool that converts legacy CSS into modern Tailwind v4 utility classes in seconds, powered by Google Gemini Flash.

**Live demo:** https://css-refactorer.vercel.app

---

## What it does

Paste any legacy CSS on the left. Hit convert. Get clean, ready-to-use Tailwind v4 classes on the right

Built for developers migrating older codebases to Tailwind, or anyone who wants to stop writing vanilla CSS by hand.

---

## Tech stack

| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| Framework           | Next.js 15 (App Router)                 |
| Language            | TypeScript                              |
| Styling             | Tailwind CSS v4                         |
| AI                  | Google Gemini 1.5 Flash                 |
| Syntax highlighting | Prism.js                                |
| Deployment          | Vercel (Edge Runtime, Singapore region) |

---

## Features

- Split-panel editor — CSS input left, Tailwind output right
- Syntax highlighting on both panels via Prism.js
- One-click copy to clipboard with animated feedback
- Preloaded sample CSS so you can try it immediately
- Error handling for empty input, API failures and network errors
- 5-second cooldown to prevent API abuse
- Edge runtime deployed in Singapore (sin1) for low latency

---

## Getting started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([get one free here](https://aistudio.google.com/app/apikey))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/css-refactorer.git
cd css-refactorer
npm install
```

### Environment variables

Create a `.env.local` file in the root:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── __test__         # Unit test script
│   │   └── result-display.test.tsx
│   ├── actions.tsx         # Server action — Gemini API call
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page, split-panel layout
│   └── components/
│       ├── CodeEditor.tsx  # Editable input with Prism highlighting
│       ├── CodeOutput.tsx  # Read-only output with Prism highlighting
│       └── ResultDisplay.tsx # Output panel with explanation
│       └── CopyButton.tsx    # Copy to clipboard button
│       └── CodeEditor.module.css.    # Code Editor style
└── src/
    ├── types.ts            # RefactorResult type
    └── mockData.ts         # Dev-mode mock response
```

---

## Key technical decisions

**Edge Runtime** — deployed on Vercel's edge network in the Singapore region (`sin1`) for minimal cold start latency across Southeast Asia.

**Prism.js with `innerHTML`** — used `Prism.highlight()` instead of `Prism.highlightElement()` to avoid SSR hydration mismatches. React controls the DOM; Prism generates the HTML string only.

**Scroll sync** — the syntax-highlighted `<pre>` layer mirrors the `<textarea>` scroll position via `onScroll` to keep highlighted text and cursor perfectly aligned.

**Server Actions** — the Gemini API call runs as a Next.js Server Action, keeping the API key server-side and out of the client bundle.

---

## What I learned

- Handling SSR hydration mismatches when third-party libraries (Prism.js) mutate the DOM
- Building a pixel-perfect overlay editor using `<textarea>` + `<pre>` scroll sync
- Structuring Next.js 15 Server Actions with proper error handling and type safety
- Deploying to Vercel edge runtime with regional configuration

---

## Roadmap

- [ ] Support for multiple CSS selectors displayed as separate cards
- [ ] SCSS / Less input support
- [ ] Dark/light theme toggle
- [ ] Copy individual selector classes separately
- [ ] Usage history (recent conversions)

---

## License

MIT
