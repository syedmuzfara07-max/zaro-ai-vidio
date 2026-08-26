import { LanguageCode, VideoStyle } from '../types';

export class GeminiService {
  static async enhancePrompt(prompt: string, style: VideoStyle, language: LanguageCode = 'en') {
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, language }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend prompt enhancement fallback:', e);
    }

    return {
      enhancedPrompt: `${prompt}, master cinematography in ${style} style, dramatic 8k volumetric lighting, sharp focus, award-winning shot`,
      suggestedTitle: prompt.slice(0, 30),
      tags: [style, '4k', 'trending']
    };
  }

  static async generateScriptAndScenes(prompt: string, language: LanguageCode = 'en', duration = 5) {
    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language, duration }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend script generation fallback:', e);
    }

    const script = language === 'ur'
      ? 'زارو اے آئی ویڈیو کے ساتھ اپنی تخیل کو سنیماٹک حقیقت میں بدلیں۔'
      : language === 'hi'
      ? 'जारो एआई वीडियो के साथ अपनी कल्पना को सजीव वीडियो में बदलें।'
      : 'Transform your imagination into stunning AI cinema with Zaro AI Video.';

    return {
      title: prompt.slice(0, 30),
      script,
      scenes: [
        { sceneNumber: 1, description: 'Opening cinematic framing', durationSeconds: 2 },
        { sceneNumber: 2, description: 'Dynamic focus and camera movement', durationSeconds: 3 }
      ]
    };
  }

  static async generateSceneVisual(prompt: string, aspectRatio = '9:16', style = 'cinematic') {
    try {
      const res = await fetch('/api/ai/generate-scene-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, style }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          return data.imageUrl;
        }
      }
    } catch (e) {
      console.warn('Scene visual generation error:', e);
    }
    return null;
  }
}
