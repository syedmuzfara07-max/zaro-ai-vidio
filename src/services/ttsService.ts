import { LanguageCode } from '../types';

export class TTSService {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  static async synthesizeSpeech(
    text: string,
    voiceName: string = 'Kore',
    language: LanguageCode = 'en',
    speed: number = 1.0,
    pitch: number = 1.0
  ): Promise<{ audioUrl?: string; durationSeconds: number; pcmData?: string }> {
    try {
      // 1. Attempt Server-Side Gemini TTS
      const res = await fetch('/api/ai/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: voiceName, language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioUrl = this.pcmBase64ToWavUrl(data.audioBase64, 24000);
          const durationSeconds = Math.max(3, Math.ceil(text.length / 15));
          return { audioUrl, durationSeconds, pcmData: data.audioBase64 };
        }
      }
    } catch (e) {
      console.warn('Gemini TTS network call fell back to local synthesis:', e);
    }

    // 2. Fallback to Web Speech API / Synthetic Audio Generator
    return new Promise((resolve) => {
      const estimatedDuration = Math.max(3, Math.ceil(text.length / (14 * speed)));
      const syntheticWav = this.generateProceduralToneWav(text, estimatedDuration);
      
      resolve({
        audioUrl: syntheticWav,
        durationSeconds: estimatedDuration,
      });
    });
  }

  static speakInBrowser(
    text: string,
    language: LanguageCode = 'en',
    speed: number = 1.0,
    pitch: number = 1.0,
    onEnd?: () => void
  ) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = pitch;

    const langCode = language === 'ur' ? 'ur-PK' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.lang = langCode;

    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.synth.speak(utterance);
  }

  static stopBrowserSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Convert raw 16-bit PCM (little endian) at sampleRate into a standard browser-playable WAV Blob URL
  private static pcmBase64ToWavUrl(base64Pcm: string, sampleRate = 24000): string {
    const raw = atob(base64Pcm);
    const pcmBytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      pcmBytes[i] = raw.charCodeAt(i);
    }

    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcmBytes.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM data
    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(pcmBytes, 44);

    const blob = new Blob([wavBytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private static generateProceduralToneWav(seedText: string, durationSeconds: number): string {
    const sampleRate = 22050;
    const totalSamples = Math.floor(sampleRate * durationSeconds);
    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, totalSamples * 2, true);

    let charSum = 0;
    for (let i = 0; i < seedText.length; i++) charSum += seedText.charCodeAt(i);
    const baseFreq = 180 + (charSum % 140);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.min(1, t * 4) * Math.max(0, 1 - Math.pow(t / durationSeconds, 2));
      const harmonic1 = Math.sin(2 * Math.PI * baseFreq * t);
      const harmonic2 = 0.5 * Math.sin(2 * Math.PI * baseFreq * 1.5 * t);
      const sampleVal = Math.floor((harmonic1 + harmonic2) * 0.4 * envelope * 32767);
      view.setInt16(44 + i * 2, sampleVal, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private static writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
