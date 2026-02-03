# Galgame Resources Unpacking Guide (Amakano 3)

The application requires independent audio (`.wav`/`.ogg`) and image (`.jpg`/`.png`) files. 
Since **Amakano 3** uses the **Artemis Engine (`.pfs`)** which encrypts its archives, you need to use a specialized tool to extract them.

## Recommended Tool: GARbro

**GARbro** is a specialized game resource browser that supports hundreds of visual novel engines, including Artemis.

### Steps to Extract

1.  **Download GARbro**
    *   Search for "GARbro releases github" (created by `morkt`) and download the latest release (`GARbro-v*.zip`).
    *   Extract GARbro to a folder.

2.  **Open the Archive**
    *   Run `GARbro.GUI.exe`.
    *   Navigate to your game folder: `C:\Users\12657\Downloads\アマカノ3\`.
    *   You will see files like `Amakano3.pfs` (or `.pfs.000`).
    *   Double-click `Amakano3.pfs`. GARbro should detect it as **"Artemis Engine"**.

3.  **Extract Audio & Images**
    *   Inside the archive, look for folders named `voice` (audio) and `image` (or `bg`, `event`).
    *   **Right-click** on the `voice` folder -> **Extract to...**.
    *   Choose a destination (e.g., `C:\Users\12657\Downloads\アマカノ3\Extracted\`).
    *   **Important**: In the extraction dialog, ensure **"Convert to standard formats"** (or similar) is checked if available, to convert `ogg` or custom formats to standard playable files.

4.  **Import into App**
    *   Start the vocab app (`npm run dev` -> `http://localhost:5173`).
    *   Click the **Settings (Gear Icon)**.
    *   Select the **Extracted** folder (not the raw game folder).
    *   The app will now scan and index the voice files.

### Troubleshooting
*   If GARbro asks for a "crypt key" or "password", standard Artemis games usually don't requiring manual key entry in recent GARbro versions. If it does, check Visual Novel forums (like EGS code) for "Amakano 3 encryption key".
*   If `voice` files are unnamed (e.g., `00001.ogg`), you might need a `filename` map, but typically Artemis uses named files like `c01_0100.ogg`.
