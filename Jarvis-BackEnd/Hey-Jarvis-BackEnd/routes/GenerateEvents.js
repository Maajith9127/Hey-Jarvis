import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_GENERATE_EVENT); // API key

router.post('/generate-events', async (req, res) => {
    try {
        const { selectedTodos, selectedAccountabilities, prompt, additionalInfo } = req.body;

        if (!prompt || (!selectedTodos?.length && !selectedAccountabilities?.length)) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const userMessage = `
${additionalInfo}

Prompt: ${prompt}

selectedTodos: ${JSON.stringify(selectedTodos)}
selectedAccountabilities: ${JSON.stringify(selectedAccountabilities)}
also note that the request is from india , so use indian timings
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" }); // SDK uses model name directly
      
        console.log('Generating events');
        
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = await response.text();

        let events;
        try {
            const cleanedText = text
                .replace(/^```json\s*/i, '')  // Remove ```json
                .replace(/^```/, '')          // Remove ``` (in case it starts directly)
                .replace(/```$/, '');         // Remove closing ```

            events = JSON.parse(cleanedText.trim());
        } catch (err) {
            console.error("❌ JSON parse failed. Raw:", text);
            return res.status(500).json({ error: "Invalid JSON returned from Gemini", raw: text });
        }

        return res.status(200).json({ events });

    } catch (err) {
        console.error("❌ Error in Gemini call:", err);
        return res.status(500).json({ error: "Gemini API call failed." });
    }
});

export default router;
