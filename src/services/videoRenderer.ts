import { AspectRatio, CameraMotion, VideoStyle } from '../types';

export interface RenderSceneOptions {
  prompt: string;
  style: VideoStyle;
  cameraMotion: CameraMotion;
  aspectRatio: AspectRatio;
  sourceImage?: string;
  subtitles?: string[];
  isPremium?: boolean;
  progress: number; // 0 to 1
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export class VideoRenderer {
  private static cachedImages: Map<string, HTMLImageElement> = new Map();

  static loadImage(src: string): Promise<HTMLImageElement> {
    if (this.cachedImages.has(src)) {
      return Promise.resolve(this.cachedImages.get(src)!);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.cachedImages.set(src, img);
        resolve(img);
      };
      img.onerror = () => {
        // Create fallback colored canvas if external image fails
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 512;
        fallbackCanvas.height = 512;
        const ctx = fallbackCanvas.getContext('2d')!;
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#818cf8';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Zaro AI Scene', 256, 256);
        const fallbackImg = new Image();
        fallbackImg.src = fallbackCanvas.toDataURL();
        fallbackImg.onload = () => resolve(fallbackImg);
      };
      img.src = src;
    });
  }

  static renderFrame(options: RenderSceneOptions) {
    const { canvas, width, height, progress, style, cameraMotion, prompt, sourceImage, subtitles, isPremium } = options;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas dimensions if needed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Calculate motion offsets
    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    let rotation = 0;

    switch (cameraMotion) {
      case 'zoom_in':
        scale = 1.0 + progress * 0.28;
        break;
      case 'zoom_out':
        scale = 1.28 - progress * 0.25;
        break;
      case 'pan_right':
        translateX = -progress * (width * 0.15);
        scale = 1.15;
        break;
      case 'pan_left':
        translateX = (1 - progress) * (width * 0.15);
        scale = 1.15;
        break;
      case 'orbit_360':
        scale = 1.1 + Math.sin(progress * Math.PI) * 0.1;
        rotation = Math.sin(progress * Math.PI * 2) * 0.04;
        translateX = Math.sin(progress * Math.PI * 2) * (width * 0.05);
        break;
      case 'drone_flythrough':
        scale = 1.0 + progress * 0.35;
        translateY = Math.sin(progress * Math.PI) * (height * 0.04);
        break;
      case 'static':
      default:
        scale = 1.04 + Math.sin(progress * Math.PI * 2) * 0.02;
        break;
    }

    // Center transform
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2 + translateX, -height / 2 + translateY);

    // Draw Base Scene / Image
    if (sourceImage && this.cachedImages.has(sourceImage)) {
      const img = this.cachedImages.get(sourceImage)!;
      this.drawCoverImage(ctx, img, 0, 0, width, height);
    } else {
      this.drawProceduralWorld(ctx, width, height, style, progress, prompt);
    }

    ctx.restore();

    // Style Specific Atmospheric Overlays
    this.applyAtmosphericEffects(ctx, width, height, style, progress);

    // Render Subtitles / Captions if present
    if (subtitles && subtitles.length > 0) {
      const subtitleIndex = Math.min(
        subtitles.length - 1,
        Math.floor(progress * subtitles.length)
      );
      const activeSubtitle = subtitles[subtitleIndex];
      if (activeSubtitle) {
        this.drawSubtitles(ctx, activeSubtitle, width, height);
      }
    }

    // Watermark for Free users
    if (!isPremium) {
      this.drawWatermark(ctx, width, height);
    }
  }

  private static drawCoverImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let renderW = w;
    let renderH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      offsetY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = (w - renderW) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, renderW, renderH);
  }

  private static drawProceduralWorld(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    style: VideoStyle,
    progress: number,
    prompt: string
  ) {
    // Generate harmonious dynamic gradients based on prompt & style
    let grad: CanvasGradient;

    switch (style) {
      case 'cyberpunk':
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f051d');
        grad.addColorStop(0.5, '#2e0854');
        grad.addColorStop(1, '#051937');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Neon grid lines
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.lineWidth = 2;
        const horizon = h * 0.65;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, horizon);
          ctx.lineTo((x - w / 2) * 2.5 + w / 2, h);
          ctx.stroke();
        }
        for (let y = horizon; y < h; y += 24) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        break;

      case 'anime':
        grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 20, w * 0.5, h * 0.5, w * 0.8);
        grad.addColorStop(0, '#fed7aa');
        grad.addColorStop(0.4, '#f472b6');
        grad.addColorStop(1, '#3b0764');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Anime sun orb
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.38 + Math.sin(progress * Math.PI) * 10, w * 0.18, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'realistic_4k':
      case 'cinematic':
        grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e293b');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Volumetric light beam
        const lightGrad = ctx.createRadialGradient(w * 0.8, h * 0.2, 10, w * 0.5, h * 0.5, w);
        lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, w, h);
        break;

      default:
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#18181b');
        grad.addColorStop(0.5, '#27272a');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        break;
    }

    // Dynamic Central Silhouette & Visual Glyphs
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px system-ui, sans-serif';
    
    // Draw abstract artistic focal visual
    const focalY = h * 0.45;
    const pulse = 1.0 + Math.sin(progress * Math.PI * 4) * 0.05;
    ctx.beginPath();
    ctx.arc(w / 2, focalY, Math.min(w, h) * 0.15 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Floating particles
    for (let i = 0; i < 20; i++) {
      const px = (Math.sin(i * 99 + progress * 2) * 0.5 + 0.5) * w;
      const py = ((i * 37 + progress * 80) % h);
      const pr = 2 + (i % 4);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(236, 72, 153, 0.6)';
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private static applyAtmosphericEffects(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    style: VideoStyle,
    progress: number
  ) {
    if (style === 'cyberpunk') {
      // Rain streaks
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 35; i++) {
        const rx = ((i * 73 + progress * 400) % w);
        const ry = ((i * 127 + progress * 800) % h);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 8, ry + 26);
        ctx.stroke();
      }
    } else if (style === 'vintage_film') {
      // Film grain overlay & subtle vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }
  }

  private static drawSubtitles(
    ctx: CanvasRenderingContext2D,
    text: string,
    w: number,
    h: number
  ) {
    ctx.save();
    const subY = h * 0.84;
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const boxW = Math.min(w * 0.9, metrics.width + 36);
    const boxH = 46;

    // Subtitle Pill Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - boxW / 2, subY - boxH / 2, boxW, boxH, 23);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Subtitle Text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, w / 2, subY);
    ctx.restore();
  }

  private static drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    const markX = w - 16;
    const markY = 32;

    ctx.textAlign = 'right';
    ctx.font = 'bold 13px system-ui, sans-serif';
    
    // Background chip
    const label = '✨ Zaro AI Video';
    const metrics = ctx.measureText(label);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect(markX - metrics.width - 20, markY - 14, metrics.width + 24, 28, 14);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, markX - 8, markY + 4);
    ctx.restore();
  }

  // Record an animated video sequence from canvas to downloadable WebM/MP4 Blob
  static async exportVideoBlob(
    options: Omit<RenderSceneOptions, 'progress' | 'canvas'>,
    durationSeconds = 5,
    fps = 30,
    onProgress?: (percent: number) => void
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;

    if (options.sourceImage) {
      try {
        await this.loadImage(options.sourceImage);
      } catch (e) {
        console.warn('Failed to pre-load image for export:', e);
      }
    }

    const stream = canvas.captureStream(fps);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: mimeType });
        resolve(finalBlob);
      };

      recorder.start();

      const totalFrames = durationSeconds * fps;
      let frame = 0;

      const renderInterval = setInterval(() => {
        const progress = frame / totalFrames;
        this.renderFrame({
          ...options,
          progress,
          canvas,
        });

        if (onProgress) {
          onProgress(Math.floor(progress * 100));
        }

        frame++;
        if (frame > totalFrames) {
          clearInterval(renderInterval);
          recorder.stop();
        }
      }, 1000 / fps);
    });
  }
}
