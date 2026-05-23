import path from 'path';
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../temp');
const PYTHON_SCRIPT_PATH = path.join(__dirname, '../scripts/verifyMoireScore.py');

// STEP 1: Save base64 image to disk
async function saveBase64Image(base64String, filename) {
    try {
        const buffer = Buffer.from(base64String.split(',')[1], 'base64');
        const filePath = path.join(TEMP_DIR, filename);
        await fs.mkdir(TEMP_DIR, { recursive: true });
        await fs.writeFile(filePath, buffer);
        return filePath;
    } catch (err) {
        console.error("Failed to save image:", err);
        throw err;
    }
}

// STEP 2: Call Python script (for now mocked)
async function runPythonScriptMock(imagePath) {
    console.log(" (MOCK) Running fake moiré analyzer on:", imagePath);
    await new Promise(resolve => setTimeout(resolve, 300));
    const fakeScore = Math.random();
    return fakeScore;
}

// Final function you call in controller
export async function analyzeMoire(imageBase64) {
    console.log("🌀 Starting moiré check...");

    const filename = `moire-check-${Date.now()}.jpg`;
    const imagePath = await saveBase64Image(imageBase64, filename);

    const score = await runPythonScriptMock(imagePath);

    console.log("Moiré Score:", score);
    return score;
}
