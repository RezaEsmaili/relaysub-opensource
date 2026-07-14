<div align="center">
  <img src="https://r22e.com/api/asset/app-assets/relaysub/2f458d7d-f42b-444f-9f0a-ca99de654561.png" width="120" alt="RelaySub Logo" />
  <h1>RelaySub Open Source</h1>
  <p><strong>A free, fast, completely client-side online subtitle translator for .srt, .vtt, and .ass files.</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-r22e.com%2Frelaysub-007AFF?style=for-the-badge&logo=react)](https://r22e.com/relaysub)
  
  <p>
    <em>Don't want to clone and build it yourself? Try the live production version right now at <b><a href="https://r22e.com/relaysub">r22e.com/relaysub</a></b>!</em>
  </p>
</div>

<br />

## 🎥 See it in Action

Here's a quick look at the user experience. Drag, drop, select your language, translate, and export in seconds without ever refreshing the page.

<div align="center">
  <video src="https://github.com/RezaEsmaili/relaysub-opensource/raw/master/public/apps/relaysub-demo.mp4" width="100%" controls autoplay loop muted></video>
</div>

<br />

## 📸 Interface Preview

<div align="center">
  <img src="https://github.com/RezaEsmaili/relaysub-opensource/raw/master/public/apps/relaysub-screenshot.png" width="100%" alt="RelaySub Beautiful UI Screenshot" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
</div>

<br />

## ✨ Features

- **100% Client-Side Processing**: Translates subtitles right in your browser using the public Google Translate API via CORS. No backend server or database is required. Your files are private and never stored.
- **Timing & Sync Preservation**: Advanced subtitle parsing algorithms ensure that timings, sequence numbers, and complex formatting tags stay perfectly preserved in sync with your video.
- **RTL Language Support**: Works natively with Arabic, Hebrew, Persian, and other Right-to-Left (RTL) languages using dynamic text-alignment.
- **Interactive Split-View Table**: The UI presents an intuitive side-by-side table displaying the original and translated text for manual editing line by line.
- **Modern Next.js UI**: Beautifully styled with Tailwind CSS, Framer Motion animations, and Lucide icons. 

<br />

## 🛠 Function Explanations (`RelaySubClient.tsx`)

The entirety of RelaySub's frontend logic, parsing, and state management happens inside `src/app/RelaySubClient.tsx`. Here are the core functions that drive the application:

### File Parsing
- `parseSrt(fileContent)`: Parses a standard `.srt` file string and converts it into a standardized array of `SubtitleCue` objects containing IDs, start times, end times, and text payloads.
- `parseVtt(content)`: Strips WebVTT headers and annotations, then extracts block data into standard `SubtitleCue` elements.
- `parseAss(content)`: Advanced parser that extracts the `[Events]` Dialogue texts, replacing their inline parameters and styles with variables (`{{RELAYSUB_X}}`) for clean reconstruction later.

### Translation Engine
- `translateAllRows()`: The orchestration wrapper function that kicks off translation, manages the loading state, and computes progress percentages.
- `createTranslationChunks(cues)`: Divides the subtitle array into efficient batches (max 40 items or 4500 characters) to optimize network payload size and respect public translation limits.
- `translateChunk(lines, targetLanguage)`: A helper function that executes a chunk request. It joins lines with a proprietary separator token (`<<<RELAYSUB_SPLIT_TOKEN>>>`) to translate them simultaneously in one network call.
- `translateText(text, targetLanguage)`: Issues an asynchronous fetch request to Google's free translation URL (`https://translate.googleapis.com/translate_a/single`).
- `runWithConcurrency()`: Controls promise execution to limit simultaneous network requests to 6 workers, preventing HTTP 429 rate limit drops.

### Output Generation
- `exportSrt(cues)`, `exportVtt(cues)`, `exportAss(cues, template)`: Renders the mutated `SubtitleCue` array back into raw text strings according to strict subtitle formatting specifications, re-injecting the translated text strings.
- `downloadTranslatedSrt()`: Packages the final translated string into a browser `Blob` object and triggers a synthetic download click.

<br />

## 🚀 Getting Started

To run RelaySub locally, ensure you have Node.js installed.

1. **Clone this repository**:
   ```bash
   git clone https://github.com/RezaEsmaili/relaysub-opensource.git
   ```
2. **Install dependencies**:
   ```bash
   cd relaysub-opensource
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## ⚖️ Disclaimer

This codebase has been cleanly extracted from **R22E** and published as a standalone utility. Proprietary hooks, user authentication, billing systems, and backend premium AI engines have been fully removed. The resulting application runs statically and freely on the client. 
