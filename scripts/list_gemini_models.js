
const GEMINI_API_KEY = "AIzaSyAuMInFHOB0L4w5dldT7SA5gbBoj2Y5nNA";

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("Available Gemini Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Network Error:", e);
    }
}

listModels();
