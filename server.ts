import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import JSZip from "jszip";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper function to recursively add directory to JSZip
function addDirectoryToZip(zip: JSZip, dirPath: string, rootDir: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      addDirectoryToZip(zip, fullPath, rootDir);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zip.file(relativePath, fileData);
    }
  }
}

// Download Android Studio Project ZIP Endpoint
app.get("/api/download-android-project-zip", async (_req, res) => {
  try {
    const androidDir = path.join(process.cwd(), "android");
    if (!fs.existsSync(androidDir)) {
      return res.status(404).json({ error: "Android directory not found" });
    }

    const zip = new JSZip();
    addDirectoryToZip(zip, androidDir, androidDir);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="ZaroAIVideo_AndroidStudio_Project.zip"');
    res.setHeader("Content-Length", zipBuffer.length);
    return res.send(zipBuffer);
  } catch (error: any) {
    console.error("Error generating zip:", error);
    return res.status(500).json({ error: "Failed to generate project zip" });
  }
});

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Zaro AI Video", timestamp: Date.now() });
});

// Prompt Enhancer Endpoint
app.post("/api/ai/enhance-prompt", async (req, res) => {
  try {
    const { prompt, style = "cinematic", language = "en", type = "video" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return smart programmatic enhancement if no key
      const enhanced = `${prompt}, highly detailed ${style} style, 8k resolution, cinematic lighting, photorealistic textures, dynamic camera motion, award winning shot.`;
      return res.json({ enhancedPrompt: enhanced, tags: [style, "cinematic", "4K", "trending"] });
    }

    const systemInstruction = `You are a world-class AI video director for the Zaro AI Video mobile app. 
Your job is to expand the user's brief prompt into a breathtaking, highly detailed visual prompt optimized for AI video generation models like Veo, Imagen 3, and Sora.
Incorporate camera angles, motion, atmospheric lighting, mood, color palette, and physics.
Output clean JSON with "enhancedPrompt", "suggestedTitle", "cameraMotion", and "tags" (array of strings).
If the requested language is Urdu ('ur') or Hindi ('hi'), ensure the enhanced prompt has both English cinematic visual prompt and localized title/description.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Language: ${language}. Style: ${style}. Type: ${type}. User Prompt: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      enhancedPrompt: parsed.enhancedPrompt || `${prompt}, ultra-detailed, cinematic ${style} lighting, 8k render`,
      suggestedTitle: parsed.suggestedTitle || prompt.slice(0, 30),
      cameraMotion: parsed.cameraMotion || "Dynamic smooth zoom and pan",
      tags: parsed.tags || [style, "4k", "cinematic", "trending"],
    });
  } catch (error: any) {
    console.error("Error in enhance-prompt:", error);
    return res.status(500).json({
      error: error.message || "Failed to enhance prompt",
      enhancedPrompt: `${req.body.prompt || "Video scene"}, master quality, 8k, cinematic camera motion`,
    });
  }
});

// AI Script & Storyboard Generator
app.post("/api/ai/generate-script", async (req, res) => {
  try {
    const { prompt, language = "en", duration = 5 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackScript = language === "ur" 
        ? "یہ ایک زبردست ویڈیو ہے جو مصنوعی ذہانت سے تیار کی گئی ہے۔ زارو اے آئی ویڈیو کے ساتھ اپنے خیالات کو حقیقت بنائیں۔"
        : language === "hi"
        ? "यह जारो एआई वीडियो द्वारा निर्मित एक अद्भुत दृश्य है। अपनी कल्पना को सजीव वीडियो में बदलें।"
        : "Experience the magic of artificial intelligence. Turn your imagination into cinematic reality with Zaro AI Video.";
      return res.json({
        title: prompt ? prompt.slice(0, 35) : "Cinematic Creation",
        script: fallbackScript,
        scenes: [
          { sceneNumber: 1, description: "Opening wide shot with atmospheric volumetric lighting", durationSeconds: 2 },
          { sceneNumber: 2, description: "Close up with dynamic camera motion and crisp details", durationSeconds: 3 }
        ]
      });
    }

    const langName = language === "ur" ? "Urdu (اردو)" : language === "hi" ? "Hindi (हिन्दी)" : "English";
    const systemInstruction = `You are a scriptwriter and storyboard artist for short viral videos (TikTok, Shorts, Reels).
Generate a concise ${duration}-second narration script in ${langName} matching the visual topic, plus a 2-3 scene visual breakdown.
Output JSON schema:
{
  "title": "Short catchy title",
  "script": "Narration text in ${langName}",
  "scenes": [
    { "sceneNumber": 1, "description": "Visual scene description for AI generation", "durationSeconds": 2 }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Topic/Prompt: "${prompt}". Duration: ${duration} seconds. Target Language: ${langName}.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in generate-script:", error);
    return res.status(500).json({ error: error.message || "Failed to generate script" });
  }
});

// Text-to-Speech Endpoint
app.post("/api/ai/text-to-speech", async (req, res) => {
  try {
    const { text, voice = "Kore", language = "en" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Kore" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({
            audioBase64: base64Audio,
            mimeType: "audio/pcm;rate=24000",
            source: "gemini-tts",
          });
        }
      } catch (ttsErr) {
        console.warn("Gemini TTS fallback activated:", ttsErr);
      }
    }

    // Client fallback metadata for Web Speech API & synthesized audio
    return res.json({
      fallbackToBrowser: true,
      text,
      voice,
      language,
      message: "Browser TTS & Audio synthesis ready",
    });
  } catch (error: any) {
    console.error("Error in text-to-speech:", error);
    return res.status(500).json({ error: error.message || "Failed to synthesize speech" });
  }
});

// Visual Scene Generation / Storyboard Image Endpoint
app.post("/api/ai/generate-scene-visual", async (req, res) => {
  try {
    const { prompt, aspectRatio = "9:16", style = "cinematic" } = req.body;
const width = aspectRatio === "16:9" ? 1344 : aspectRatio === "1:1" ? 1024 : 768;
    const height = aspectRatio === "16:9" ? 768 : aspectRatio === "1:1" ? 1024 : 1344;
    const fullPrompt = `${prompt}, style: ${style}, high aesthetic visual composition, cinematic render, master quality`;
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

    try {
      const imgRes = await fetch(pollinationsUrl);
      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return res.json({
          imageUrl: `data:image/jpeg;base64,${base64}`,
          success: true,
        });
      }
    } catch (imgErr) {
      console.warn("Image gen fallback to procedural artwork generator:", imgErr);
    }
    return res.json({
      success: false,
      useProceduralCanvas: true,
    });
  } catch (error: any) {
    console.error("Error generating visual:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zaro AI Video server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
