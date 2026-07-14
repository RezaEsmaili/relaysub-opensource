# RelaySub Open Source

RelaySub is a free, entirely client-side online subtitle translator that converts `.srt`, `.vtt`, and `.ass`/`.ssa` files into over 100 languages. 

## Features
- **Client-Side Processing**: Translates subtitles right in your browser using the public Google Translate endpoint via CORS. No backend or database required.
- **Timing Preservation**: Subtitle formats are parsed seamlessly, ensuring timing, numbers, and tags stay perfectly in sync.
- **RTL Language Support**: Works natively with Arabic, Hebrew, Persian, and other Right-to-Left (RTL) languages.
- **Modern UI**: Styled with Tailwind CSS and Framer Motion for premium aesthetics. 

## Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Function Explanations (`RelaySubClient.tsx`)

The main logic happens in `src/app/RelaySubClient.tsx`. Here are the core functions that drive the application:

- `parseSrt(fileContent: string)`: Parses an SRT file and converts it into a standardized array of `SubtitleCue` objects with original texts, IDs, start times, and end times.
- `parseVtt(content: string)`: Strips WebVTT headers, then parses the blocks into standard `SubtitleCue` objects.
- `parseAss(content: string)`: Extracts the `[Events]` Dialogue texts, replacing their inline variables (`{{RELAYSUB_X}}`) for the template reconstruction later, and outputs standard `SubtitleCue` elements.
- `translateAllRows()`: The orchestration wrapper function that calls translation logic. It iterates in chunks for efficiency.
- `createTranslationChunks(cues)`: Divides the subtitle array into batches (max 40 items or 4500 characters) to optimize network bandwidth and respect public translation limits.
- `translateChunk()`: A helper function that executes a chunk request to `translateText()`.
- `translateText(text: string, targetLanguage: string)`: Issues an asynchronous fetch request to Google's free translation URL `https://translate.googleapis.com/translate_a/single`.
- `exportSrt(cues)`, `exportVtt(cues)`, `exportAss(cues, template)`: Render standard `SubtitleCue` arrays back to their respective subtitle text file format strings, injecting translated text.
- `downloadTranslatedSrt()`: Packages the translated subtitle string into a `Blob` and triggers a browser download.

## Disclaimer

This codebase has been cleanly extracted by an AI agent (Antigravity). Proprietary hooks, databases, user authentication, and backend AI engines have been fully removed. The resulting application runs statically on the client. 
