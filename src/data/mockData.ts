import { AspectRatio, CameraMotion, GeneratedVideo, LanguageCode, VideoStyle, VoiceOption } from '../types';

export const VIDEO_STYLES: { id: VideoStyle; name: string; nameUr: string; nameHi: string; icon: string; previewBg: string; description: string }[] = [
  {
    id: 'cinematic',
    name: 'Cinematic 8K',
    nameUr: 'سنیماٹک 8K',
    nameHi: 'सिनेमैटिक 8K',
    icon: 'Clapperboard',
    previewBg: 'from-amber-600 to-indigo-950',
    description: 'Hollywood movie lighting, anamorphic lens flare, shallow depth of field.'
  },
  {
    id: 'anime',
    name: 'Anime 3D',
    nameUr: 'اینیمے 3D',
    nameHi: 'एनीमे 3D',
    icon: 'Sparkles',
    previewBg: 'from-pink-500 to-purple-900',
    description: 'Vibrant Makoto Shinkai aesthetic with glowing particles & sky.'
  },
  {
    id: 'realistic_4k',
    name: 'Hyper Realistic',
    nameUr: 'حقیقی 4K',
    nameHi: 'यथार्थवादी 4K',
    icon: 'Camera',
    previewBg: 'from-emerald-600 to-slate-900',
    description: 'Crisp 4K textures, natural sunlight, photorealistic reflections.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    nameUr: 'سائبر پنک نیون',
    nameHi: 'साइबरपंक नियॉन',
    icon: 'Zap',
    previewBg: 'from-cyan-500 to-fuchsia-900',
    description: 'Futuristic rainy city, holographic billboards, neon glows.'
  },
  {
    id: '3d_animation',
    name: '3D Pixar Style',
    nameUr: 'تھری ڈی اینیمیشن',
    nameHi: '3D एनिमेशन',
    icon: 'Smile',
    previewBg: 'from-orange-500 to-rose-900',
    description: 'Soft stylized character animation with warm subsurface scattering.'
  },
  {
    id: 'vintage_film',
    name: 'Vintage 35mm',
    nameUr: 'ونٹیج فلم',
    nameHi: 'विंटेज फिल्म',
    icon: 'Film',
    previewBg: 'from-yellow-700 to-stone-900',
    description: 'Nostalgic 1970s film grain, warm muted tones, subtle chromatic aberration.'
  },
  {
    id: 'watercolor',
    name: 'Watercolor Art',
    nameUr: 'واٹر کلر آرٹ',
    nameHi: 'वॉटरकलर आर्ट',
    icon: 'Palette',
    previewBg: 'from-teal-400 to-sky-900',
    description: 'Fluid watercolor brush strokes, paper texture, painterly motion.'
  },
  {
    id: 'studio_portrait',
    name: 'Studio Portrait',
    nameUr: 'اسٹوڈیو پورٹریٹ',
    nameHi: 'स्टूडियो पोर्ट्रेट',
    icon: 'User',
    previewBg: 'from-violet-600 to-zinc-950',
    description: 'Professional softbox studio lighting, clean high-fashion backdrop.'
  }
];

export const CAMERA_MOTIONS: { id: CameraMotion; name: string; nameUr: string; nameHi: string; description: string }[] = [
  { id: 'zoom_in', name: 'Slow Zoom In', nameUr: 'آہستہ زوم ان', nameHi: 'धीमा ज़ूम इन', description: 'Draws focus closer to the central subject.' },
  { id: 'zoom_out', name: 'Dramatic Zoom Out', nameUr: 'زوم آؤٹ', nameHi: 'ज़ूम आउट', description: 'Reveals the vast background landscape.' },
  { id: 'pan_right', name: 'Smooth Pan Right', nameUr: 'دائیں پین', nameHi: 'दाएं पैन', description: 'Horizontal cinematic tracking movement.' },
  { id: 'pan_left', name: 'Smooth Pan Left', nameUr: 'بائیں پین', nameHi: 'बाएं पैन', description: 'Glides across the visual scene.' },
  { id: 'orbit_360', name: '360° Orbit', nameUr: '360 ڈگری گردش', nameHi: '360° चक्कर', description: 'Rotates dynamically around the focal point.' },
  { id: 'drone_flythrough', name: 'Drone Fly-Through', nameUr: 'ڈرون فلائی تھرو', nameHi: 'ड्रोन फ्लाई-थ्रू', description: 'High-speed sweeping aerial perspective.' },
  { id: 'static', name: 'Tripod Still', nameUr: 'ساکن کیمرہ', nameHi: 'स्थिर कैमरा', description: 'Fixed camera framing natural subject movement.' }
];

export const ASPECT_RATIOS: { id: AspectRatio; name: string; ratio: string; bestFor: string; width: number; height: number; icon: string }[] = [
  { id: '9:16', name: '9:16 Portrait', ratio: '9:16', bestFor: 'TikTok, Shorts, Reels', width: 1080, height: 1920, icon: 'Smartphone' },
  { id: '16:9', name: '16:9 Landscape', ratio: '16:9', bestFor: 'YouTube, TV, Cinema', width: 1920, height: 1080, icon: 'Tv' },
  { id: '1:1', name: '1:1 Square', ratio: '1:1', bestFor: 'Instagram Feed, Square', width: 1080, height: 1080, icon: 'Square' }
];

export const VOICE_OPTIONS: VoiceOption[] = [
  // English Voices
  { id: 'en_kore', name: 'Kore (Warm Female)', gender: 'female', language: 'en', accent: 'American Warm', geminiVoice: 'Kore', previewText: 'Welcome to Zaro AI Video! Create magical videos in seconds.' },
  { id: 'en_zephyr', name: 'Zephyr (Natural Male)', gender: 'male', language: 'en', accent: 'American Professional', geminiVoice: 'Zephyr', previewText: 'Transform your imagination into high quality cinematic video today.' },
  { id: 'en_aoede', name: 'Aoede (Storyteller Female)', gender: 'female', language: 'en', accent: 'British Storyteller', geminiVoice: 'Aoede', previewText: 'Deep in the neon city, an AI revolution began to unfold.' },
  { id: 'en_fenrir', name: 'Fenrir (Deep Male)', gender: 'male', language: 'en', accent: 'Deep Movie Trailer', geminiVoice: 'Fenrir', previewText: 'In a world driven by artificial intelligence, creation knows no limits.' },
  { id: 'en_puck', name: 'Puck (Energetic Male)', gender: 'male', language: 'en', accent: 'Youthful & Fast', geminiVoice: 'Puck', previewText: 'Hey guys! Check out this mind blowing AI generated video!' },

  // Urdu Voices
  { id: 'ur_fatima', name: 'Fatima (فاطمہ - Female)', gender: 'female', language: 'ur', accent: 'پاکستانی شائستہ اردو', geminiVoice: 'Kore', previewText: 'زارو اے آئی ویڈیو میں خوش آمدید۔ چند سیکنڈ میں شاندار ویڈیوز بنائیں۔' },
  { id: 'ur_tariq', name: 'Tariq (طارق - Male)', gender: 'male', language: 'ur', accent: 'پاکستانی باوقار آواز', geminiVoice: 'Zephyr', previewText: 'اپنے خیالات اور تصاویر کو اب سنیماٹک ویڈیو میں تبدیل کریں۔' },
  { id: 'ur_ayesha', name: 'Ayesha (عائشہ - Female)', gender: 'female', language: 'ur', accent: 'پُرجوش کہانی نویس', geminiVoice: 'Aoede', previewText: 'مصنوعی ذہانت کی دنیا میں آپ کا ہر خواب حقیقت بن سکتا ہے۔' },
  { id: 'ur_zaid', name: 'Zaid (زید - Deep Male)', gender: 'male', language: 'ur', accent: 'گہری نیوز کاسٹر آواز', geminiVoice: 'Fenrir', previewText: 'ایک نئی کہانی کا آغاز، زارو اے آئی ویڈیو کے ساتھ۔' },

  // Hindi Voices
  { id: 'hi_priya', name: 'Priya (प्रिया - Female)', gender: 'female', language: 'hi', accent: 'भारतीय मधुर आवाज़', geminiVoice: 'Kore', previewText: 'जारो एआई वीडियो में आपका स्वागत है। सिर्फ एक क्लिक में बनाएं शानदार वीडियो।' },
  { id: 'hi_rajesh', name: 'Rajesh (राजेश - Male)', gender: 'male', language: 'hi', accent: 'प्रोफेशनल हिंदी वॉयस', geminiVoice: 'Zephyr', previewText: 'अपनी कल्पना को सजीव और खूबसूरत वीडियो में बदलें।' },
  { id: 'hi_sunita', name: 'Sunita (सुनीता - Female)', gender: 'female', language: 'hi', accent: 'कहानीकार आवाज़', geminiVoice: 'Aoede', previewText: 'आर्टिफिशियल इंटेलिजेंस से वीडियो बनाना अब हुआ और भी आसान।' },
  { id: 'hi_vikram', name: 'Vikram (विक्रम - Deep Male)', gender: 'male', language: 'hi', accent: 'गंभीर वॉयस ओवर', geminiVoice: 'Fenrir', previewText: 'एक नए युग की शुरुआत, जारो एआई वीडियो के साथ।' }
];

export const SAMPLE_PROMPTS = [
  {
    title: 'Neon Cyberpunk Samurai',
    titleUr: 'سائبر پنک سامورائی',
    titleHi: 'साइबरपंक समुराई',
    prompt: 'A futuristic cyber samurai walking down a rainy Tokyo alley illuminated by glowing neon signs and holographic cherry blossoms, 8k cinematic.',
    style: 'cyberpunk' as VideoStyle,
    aspectRatio: '9:16' as AspectRatio,
    tag: 'Trending'
  },
  {
    title: 'Majestic Eagle in Himalayas',
    titleUr: 'ہمالیہ میں سنہری عقاب',
    titleHi: 'हिमालय में राजसी चील',
    prompt: 'Golden eagle soaring over snow-capped Himalayan peaks at sunrise with golden morning rays breaking through mist, ultra realistic 4K.',
    style: 'realistic_4k' as VideoStyle,
    aspectRatio: '16:9' as AspectRatio,
    tag: '4K Nature'
  },
  {
    title: 'Cute Baby Dragon in Forest',
    titleUr: 'جنگل میں پیارا اژدہا',
    titleHi: 'जंगल में नन्हा ड्रैगन',
    prompt: 'A tiny cute fluffy green baby dragon playing with bioluminescent glowing mushrooms in a magical enchanted forest, Pixar 3D style.',
    style: '3d_animation' as VideoStyle,
    aspectRatio: '9:16' as AspectRatio,
    tag: 'Anime 3D'
  },
  {
    title: 'Vintage Sports Car at Sunset',
    titleUr: 'غروب آفتاب پر کلاسک کار',
    titleHi: 'सूर्यास्त पर विंटेज कार',
    prompt: 'Vintage 1968 red convertible sports car speeding along the California Pacific Coast Highway during a golden hour sunset, 35mm film grain.',
    style: 'vintage_film' as VideoStyle,
    aspectRatio: '16:9' as AspectRatio,
    tag: 'Cinematic'
  }
];

export const SAMPLE_STARTING_IMAGES = [
  {
    id: 'sample_1',
    name: 'Cyberpunk Girl',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    prompt: 'Gentle wind blowing through neon-lit hair, eyes blinking slowly, background rain droplets falling.'
  },
  {
    id: 'sample_2',
    name: 'Mountain Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    prompt: 'Water ripples expanding smoothly, clouds slowly drifting across mountain peaks with sun rays.'
  },
  {
    id: 'sample_3',
    name: 'Cute Anime Cat',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    prompt: 'Cat tilting head playfully, magical sparks floating around, soft camera zoom in.'
  },
  {
    id: 'sample_4',
    name: 'Futuristic City',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    prompt: 'Flying futuristic cars gliding between skyscrapers, dynamic highway traffic flow.'
  }
];

export const INITIAL_GENERATED_VIDEOS: GeneratedVideo[] = [
  {
    id: 'vid_1',
    title: 'Neon Cyberpunk Samurai in Rain',
    prompt: 'A futuristic cyber samurai walking down a rainy Tokyo alley illuminated by glowing neon signs, 8k cinematic.',
    type: 'text_to_video',
    style: 'cyberpunk',
    aspectRatio: '9:16',
    durationSeconds: 5,
    cameraMotion: 'pan_right',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 3600000 * 2,
    language: 'en',
    voiceId: 'en_zephyr',
    isFavorite: true,
    subtitles: ['In the heart of Neo-Tokyo...', 'A lone samurai emerges through the neon rain.']
  },
  {
    id: 'vid_2',
    title: 'Sunlit Mountain Peak Flyover',
    prompt: 'Golden sunrise over Himalayan peaks with mist drifting between alpine trees, ultra realistic 4K.',
    type: 'image_to_video',
    style: 'realistic_4k',
    aspectRatio: '16:9',
    durationSeconds: 6,
    cameraMotion: 'drone_flythrough',
    sourceImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 3600000 * 14,
    language: 'ur',
    voiceId: 'ur_tariq',
    isFavorite: false,
    subtitles: ['ہمالیہ کی بلند چوٹیاں اور صبح کا سنہرا سورج۔', 'قدرت کا ایک لاجواب نظارہ۔']
  },
  {
    id: 'vid_3',
    title: 'Enchanted Forest Baby Dragon',
    prompt: 'Cute green baby dragon with glowing fireflies in magical ancient forest, 3D Pixar animation.',
    type: 'text_to_video',
    style: '3d_animation',
    aspectRatio: '9:16',
    durationSeconds: 5,
    cameraMotion: 'zoom_in',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 3600000 * 28,
    language: 'hi',
    voiceId: 'hi_priya',
    isFavorite: true,
    subtitles: ['जादुई जंगल में एक नन्हा प्यारा ड्रैगन।', 'चमकते जुगनुओं के साथ खेलता हुआ।']
  }
];

// UI Localization Dictionary
export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appName: 'Zaro AI Video',
    appTagline: 'Professional AI Video Maker for Android',
    home: 'Home',
    textToVideo: 'Text to Video',
    imageToVideo: 'Image to Video',
    textToVoice: 'Text to Voice',
    history: 'History',
    profile: 'Profile',
    premium: 'Go Premium',
    freeCredits: 'Free Credits',
    getMore: 'Get More',
    promptPlaceholder: 'Describe the video you want to create (e.g. Cyberpunk samurai in rainy neon street)...',
    enhanceWithAI: 'Enhance with AI',
    selectStyle: 'Visual Style',
    aspectRatio: 'Aspect Ratio',
    cameraMotion: 'Camera Motion',
    addVoiceover: 'Attach AI Voiceover',
    generateVideo: 'Generate AI Video',
    uploadImage: 'Upload or Select Image',
    imageMotionPrompt: 'Describe how the image should animate...',
    generateFromImage: 'Animate to Video',
    generateVoice: 'Generate AI Speech',
    enterScriptText: 'Write or paste your script text here...',
    selectVoice: 'Select Voice & Accent',
    speed: 'Speed',
    pitch: 'Pitch',
    listenPreview: 'Preview Voice',
    watchAdForCredits: 'Watch Ad (+2 Credits)',
    upgradeForUnlimited: 'Upgrade to Unlimited Pro',
    downloadVideo: 'Download MP4 / WebM',
    shareVideo: 'Share Video',
    remixPrompt: 'Remix Prompt',
    deleteItem: 'Delete',
    noHistoryYet: 'No generated videos yet',
    noHistoryDesc: 'Create your first AI video or voiceover using the buttons below!',
    generatingVideoTitle: 'Rendering AI Video',
    generatingStep1: 'Analyzing prompt and cinematic scene parameters...',
    generatingStep2: 'Synthesizing high-definition visual keyframes...',
    generatingStep3: 'Interpolating camera motion & optical fluid dynamics...',
    generatingStep4: 'Synthesizing multilingual neural audio track...',
    generatingStep5: 'Compositing final high-resolution video stream...',
    generationSuccess: 'Video Generated Successfully!',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirmPurchase: 'Confirm Subscription',
    exportAndroid: 'Android Studio Source',
    androidStudioExportDesc: 'Export ready-to-build Kotlin & Jetpack Compose native Android project.',
    copyCode: 'Copy Code',
    copied: 'Copied!'
  },
  ur: {
    appName: 'زارو اے آئی ویڈیو',
    appTagline: 'اینڈرائیڈ کے لیے پیشہ ورانہ اے آئی ویڈیو میکر',
    home: 'ہوم',
    textToVideo: 'متن سے ویڈیو',
    imageToVideo: 'تصویر سے ویڈیو',
    textToVoice: 'متن سے آواز',
    history: 'تاریخچہ',
    profile: 'پروفائل',
    premium: 'پریمیم لیں',
    freeCredits: 'مفت کریڈٹس',
    getMore: 'مزید حاصل کریں',
    promptPlaceholder: 'اپنی مطلوبہ ویڈیو کا بیان لکھیں (مثلاً: نیون سڑک پر چلتا ہوا سامورائی)...',
    enhanceWithAI: 'اے آئی سے بہتر بنائیں',
    selectStyle: 'ویڈیو کا انداز',
    aspectRatio: 'ویڈیو کا سائز (فارمیٹ)',
    cameraMotion: 'کیمرہ موشن',
    addVoiceover: 'اردو / انگریزی آواز شامل کریں',
    generateVideo: 'ویڈیو بنائیں',
    uploadImage: 'تصویر اپ لوڈ کریں',
    imageMotionPrompt: 'بیان کریں کہ تصویر کو کیسے متحرک کیا جائے...',
    generateFromImage: 'تصویر کو ویڈیو میں بدلیں',
    generateVoice: 'اے آئی آواز تیار کریں',
    enterScriptText: 'یہاں اپنا اردو، ہندی یا انگریزی سکرپٹ لکھیں...',
    selectVoice: 'آواز اور لہجہ منتخب کریں',
    speed: 'رفتار',
    pitch: 'پچ (سر)',
    listenPreview: 'آواز سنیں',
    watchAdForCredits: 'اشتہار دیکھیں (+2 کریڈٹس)',
    upgradeForUnlimited: 'لامحدود پرو لیں',
    downloadVideo: 'ویڈیو ڈاؤن لوڈ کریں',
    shareVideo: 'ویڈیو شیئر کریں',
    remixPrompt: 'دوبارہ بنائیں',
    deleteItem: 'حذف کریں',
    noHistoryYet: 'ابھی تک کوئی ویڈیو نہیں بنائی گئی',
    noHistoryDesc: 'نیچے دیے گئے بٹنوں سے اپنی پہلی ویڈیو یا وائس اوور تیار کریں!',
    generatingVideoTitle: 'اے آئی ویڈیو بن رہی ہے',
    generatingStep1: 'سین اور سکرپٹ کا تجزیہ کیا جا رہا ہے...',
    generatingStep2: 'ہائی ڈیفینیشن فریمز تیار ہو رہے ہیں...',
    generatingStep3: 'کیمرہ موشن اور اینیمیشن لاگو ہو رہی ہے...',
    generatingStep4: 'نیورل وائس اوور آڈیو کو ہم آہنگ کیا جا رہا ہے...',
    generatingStep5: 'فائنل ہائی کوالٹی ویڈیو تیار کی جا رہی ہے...',
    generationSuccess: 'ویڈیو کامیابی سے تیار ہو گئی!',
    close: 'بند کریں',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    confirmPurchase: 'خریداری کی تصدیق کریں',
    exportAndroid: 'اینڈرائیڈ اسٹوڈیو کوڈ',
    androidStudioExportDesc: 'اینڈرائیڈ اسٹوڈیو کے لیے تیار کوٹلن اور جیٹ پیک کمپوز سورس کوڈ۔',
    copyCode: 'کوڈ کاپی کریں',
    copied: 'کاپی ہو گیا!'
  },
  hi: {
    appName: 'जारो एआई वीडियो',
    appTagline: 'एंड्रॉइड के लिए प्रोफेशनल एआई वीडियो मेकर',
    home: 'होम',
    textToVideo: 'टेक्स्ट से वीडियो',
    imageToVideo: 'फोटो से वीडियो',
    textToVoice: 'टेक्स्ट से आवाज़',
    history: 'इतिहास',
    profile: 'प्रोफ़ाइल',
    premium: 'प्रीमियम लें',
    freeCredits: 'मुफ़्त क्रेडिट',
    getMore: 'और पाएं',
    promptPlaceholder: 'जो वीडियो आप बनाना चाहते हैं उसका विवरण लिखें (उदा: बारिश में नियॉन सिटी में समुराई)...',
    enhanceWithAI: 'एआई से बेहतर बनाएं',
    selectStyle: 'विजुअल स्टाइल',
    aspectRatio: 'पहलू अनुपात (आस्पेक्ट रेश्यो)',
    cameraMotion: 'कैमरा मोशन',
    addVoiceover: 'एआई वॉयसओवर जोड़ें',
    generateVideo: 'एआई वीडियो बनाएं',
    uploadImage: 'फ़ोटो अपलोड करें',
    imageMotionPrompt: 'बताएं कि फ़ोटो को कैसे एनिमेट करना है...',
    generateFromImage: 'फ़ोटो को वीडियो में बदलें',
    generateVoice: 'एआई आवाज़ तैयार करें',
    enterScriptText: 'यहाँ अपनी हिंदी, उर्दू या अंग्रेजी स्क्रिप्ट लिखें...',
    selectVoice: 'आवाज़ और टोन चुनें',
    speed: 'गति',
    pitch: 'पिच',
    listenPreview: 'आवाज़ सुनें',
    watchAdForCredits: 'विज्ञापन देखें (+2 क्रेडिट)',
    upgradeForUnlimited: 'अनलिमिटेड प्रो में अपग्रेड करें',
    downloadVideo: 'वीडियो डाउनलोड करें',
    shareVideo: 'वीडियो शेयर करें',
    remixPrompt: 'रीमिक्स करें',
    deleteItem: 'हटाएं',
    noHistoryYet: 'अभी तक कोई वीडियो नहीं बनी',
    noHistoryDesc: 'नीचे दिए गए बटनों का उपयोग करके अपनी पहली एआई वीडियो बनाएं!',
    generatingVideoTitle: 'एआई वीडियो रेंडर हो रहा है',
    generatingStep1: 'प्रॉम्प्ट और विजुअल पैरामीटर का विश्लेषण...',
    generatingStep2: 'हाई-डेफिनिशन कीफ्रेम तैयार हो रहे हैं...',
    generatingStep3: 'कैमरा मोशन और ऑप्टिकल फ्लो लागू हो रहा है...',
    generatingStep4: 'मल्टीलिंगुअल न्यूरल ऑडियो ट्रैक सिंक हो रहा है...',
    generatingStep5: 'अंतिम वीडियो स्ट्रीम तैयार की जा रही है...',
    generationSuccess: 'वीडियो सफलतापूर्वक तैयार हो गई!',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirmPurchase: 'सदस्यता की पुष्टि करें',
    exportAndroid: 'एंड्रॉइड स्टूडियो कोड',
    androidStudioExportDesc: 'एंड्रॉइड स्टूडियो के लिए रेडी-टू-बिल्ड कोटलिन और जेटपैक कंपोज़ कोड।',
    copyCode: 'कोड कॉपी करें',
    copied: 'कॉपी हुआ!'
  }
};
