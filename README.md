# VocabFlow (Galgame Audio Reader)

**VocabFlow** is an immersive Japanese vocabulary and sentence learning application designed to integrate directly with Galgame (Visual Novel) resources. It allows you to import game scripts and audio files to create a context-rich flashcard experience, leveraging the "FileSystem Access API" to play local assets without uploading them.

![App Screenshot](https://placeholder-image-url.com) *(Insert screenshot here)*

## ✨ Features

- **Immersive "Flow" Interface**: A vertical scrolling, TikTok-style interface for reviewing vocab and sentences.
- **Galgame Integration**:
    - Import unpacked game scripts (`.ast` format supported via tools).
    - Map extracted Voice (`.ogg`/`.wav`) and Background resources directly from your local drive.
    - **Contextual Audio**: Automatically plays the corresponding character voice for each sentence.
- **SRS (Spaced Repetition System)**: Built-in algorithm to schedule reviews based on your performance (Hard / Good).
- **Pitch Accent Visualization**: Visual indicators for Japanese pitch accent (data dependent).
- **Zero-Upload**: Uses the browser's FileSystem Access API. Your massive GBs of voice files stay on your disk; the app simply reads them.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **State/db**: Dexie.js (IndexedDB wrapper) for storing thousands of cards and script lines efficiently.
- **Audio**: Howler.js

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.x (for script extraction tools)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/vocab-flow.git
    cd vocab-flow
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

### 1. Preparing Game Resources
This app currently supports resources unpacked from engines like Artemis (e.g., *Amakano 3*).

1.  **Extract Scripts**: Use a tool like `GARbro` to extract the `.ast` script files and `.ogg` voice files from your game.
2.  **Generate Index**:
    Run the included Python tool to parse the scripts and generate a `galgame_index.json`.
    ```bash
    python tools/reextract_script.py
    ```
    This will create `public/galgame_index.json` containing the text-to-audio mapping.

### 2. Loading into App
1.  Open the app in a browser (e.g., Chrome/Edge).
2.  Click the **Settings (Gear Icon)**.
3.  **Step 1: Select Game Folder**: Choose the root folder containing your extracted `voice/` and `script/` directories. Grant permission when asked.
4.  **Step 2: Load Script Data**: Import the `galgame_index.json` into the browser database.
5.  **Step 3: Generate Deck**: Create flashcards based on the imported sentences.

### 3. Review
- **Swipe Left** or Click "Review" if you need to see the card again soon.
- **Scroll Down** to mark as "Good" and proceed to the next card.
- **Click Text** to select/copy sentence.

## 📂 Project Structure

- `/src`
    - `/components`: UI Components (FlowCard, FlowDeck, etc.)
    - `/db`: Database schema (Dexie)
    - `/utils`: SRS logic, FileSystem handlers.
- `/tools`: Python scripts for processing game assets.
    - `reextract_script.py`: The main parser for `.ast` files.

## ⚠️ Disclaimer
This software is for **educational purposes only**. You must own a legal copy of any game you extract resources from. Do not distribute extracted game assets.

## License
MIT
