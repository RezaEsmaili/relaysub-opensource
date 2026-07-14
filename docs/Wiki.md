# RelaySub Wiki

Welcome to the RelaySub wiki! 

## Architecture Overview

RelaySub is built on **Next.js** using the **App Router** (`src/app`). It operates entirely on the client side, meaning there is no server-side fetching, storing, or translating of subtitles. 

### Key Components

- **`src/app/RelaySubClient.tsx`**: The massive monolithic component handling state, drag-and-drop file inputs, UI interactivity, parsing algorithms for SRT/VTT/ASS formats, translation logic chunks, and final string regeneration.
- **`src/app/languages.ts`**: Contains the `LANGUAGES` array listing over 100 supported translation target languages.
- **`src/components/AnimatedReveal.tsx`**: Utility wrapper utilizing `framer-motion` for scroll-triggered reveal animations.
- **`src/components/FAQAccordion.tsx`**: An accordion dropdown for FAQ items leveraging Framer Motion.
- **`src/lib/utils.ts`**: Typical tailwind-merge and clsx merging utility.

### Translation Engine

RelaySub utilizes an unofficial Google Translate endpoint:
\`\`\`
https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={target}&dt=t&q={text}
\`\`\`
Because this endpoint has rate limits and text size limits, RelaySub parses subtitles and joins them together with a separator string (`<<<RELAYSUB_SPLIT_TOKEN>>>`). It batches these in chunks of up to 4500 characters or 40 subtitle lines (whichever comes first). This reduces HTTP overhead and speeds up the entire translation process via parallel requests (`runWithConcurrency` limits it to 6 simultaneous workers).

### Subtitle Processing Lifecycle

1. **Upload**: User drops a file. React references the file and reads it using `file.text()`.
2. **Parsing**: Depending on file extension, `parseSrt()`, `parseVtt()`, or `parseAss()` converts the raw text into a standard JS object format (`SubtitleCue`).
3. **Editing**: `cues` state is rendered in an editable table. Users can modify original or translated texts directly. 
4. **Translation**: Upon pressing translate, `translateCuesFast()` kicks in, updating the UI with percentage progress.
5. **Export**: Finally, `exportSrt()`, `exportVtt()`, or `exportAss()` iterates through the cues array and stitches the file back into standard format syntax. 

## Customization

You can easily customize the fallback properties of the landing page in `RelaySubClient.tsx`, such as `fallbackFeatures` and `fallbackFaq`. Colors can be changed by modifying `RELAYSUB_BLUE` or updating the Tailwind utilities used across the component.
