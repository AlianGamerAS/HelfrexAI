import { AIModel } from '../types';

export const INITIAL_MODELS: AIModel[] = [
  // ===================== 9 CODE AI MODELS (From lightest to largest) =====================
  {
    id: 'qwen-coder-0.5b',
    name: 'Qwen 2.5 Coder 0.5B Instruct',
    originalName: 'Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF',
    classes: ['Code AI'],
    size: '0.45 GB',
    vramReq: 1,
    ramReq: 2,
    quantization: 'Q8_0 / FP16',
    author: 'Qwen Team (Alibaba)',
    downloads: '1.2M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Ultra hafif kodlama modeli. Düşük donanımlı dizüstü ve dahili GPU için ideal hızlı tamamlama ve kod yazımı.',
      en: 'Ultra-lightweight code model. Ideal for low-spec laptops and integrated GPUs with fast completions.',
      ru: 'Ультралегкая модель для кодирования. Идеально для слабых ноутбуков и встроенных GPU.'
    },
    isDownloaded: true,
    downloadProgress: 100,
    tags: ['Ultra Light', 'Fast', 'Python', 'C++']
  },
  {
    id: 'qwen-coder-1.5b-q4',
    name: 'Qwen 2.5 Coder 1.5B Q4_K_M',
    originalName: 'Qwen/Qwen2.5-Coder-1.5B-Q4_K_M',
    classes: ['Code AI'],
    size: '1.1 GB',
    vramReq: 2,
    ramReq: 4,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '2.8M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Hızlı ve dengeli hafif kodlayıcı. JavaScript, TypeScript, Python ve SQL için harika optimizasyon.',
      en: 'Fast and balanced lightweight coder. Highly optimized for JS, TS, Python, and SQL.',
      ru: 'Быстрый и сбалансированный легковесный кодер для JS, TS, Python и SQL.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Web Dev', 'TypeScript', 'Compact']
  },
  {
    id: 'qwen-coder-3b-instruct',
    name: 'Qwen 2.5 Coder 3B Instruct',
    originalName: 'Qwen/Qwen2.5-Coder-3B-Instruct',
    classes: ['Code AI'],
    size: '2.1 GB',
    vramReq: 3,
    ramReq: 6,
    quantization: 'Q5_K_M',
    author: 'Qwen Team',
    downloads: '3.4M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Orta seviye kod üretim modeli. Mimari oluşturma, hata ayıklama ve test senaryolarında yüksek başarı.',
      en: 'Mid-tier code generation model. High success in scaffolding, debugging, and test suites.',
      ru: 'Модель среднего уровня для генерации кода, отладки и архитектуры.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Architecture', 'Debugging', 'Fullstack']
  },
  {
    id: 'qwen-coder-7b-q4',
    name: 'Qwen 2.5 Coder 7B Q4_K_M',
    originalName: 'Qwen/Qwen2.5-Coder-7B-Instruct-GGUF',
    classes: ['Code AI'],
    size: '4.4 GB',
    vramReq: 6,
    ramReq: 8,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '6.1M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'En popüler kodlama modeli. GPT-4o-mini seviyesinde kodlama, Minecraft modlama, web ve mobil uygulama desteği.',
      en: 'Most popular coding model. GPT-4o-mini tier coding, Minecraft modding, web & mobile app generation.',
      ru: 'Популярнейшая модель кодирования уровня GPT-4o-mini с поддержкой модов и веба.'
    },
    isDownloaded: true,
    downloadProgress: 100,
    tags: ['Most Popular', 'Minecraft Addons', 'Web Apps', 'Windows GUI']
  },
  {
    id: 'qwen-coder-7b-q8',
    name: 'Qwen 2.5 Coder 7B Q8_0 High Precision',
    originalName: 'Qwen/Qwen2.5-Coder-7B-Instruct-Q8',
    classes: ['Code AI'],
    size: '7.8 GB',
    vramReq: 8,
    ramReq: 12,
    quantization: 'Q8_0 (8-bit)',
    author: 'Qwen Team',
    downloads: '1.9M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: '8-bit kayıpsız yüksek hassasiyetli 7B kod modeli. Karmaşık algoritmalar ve hassas refactor işlemleri.',
      en: 'High-precision 8-bit quantized 7B code model. Complex algorithms and refactoring precision.',
      ru: 'Высокоточная 8-битная модель 7B для алгоритмов и сложного рефакторинга.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['High Precision', '8-bit', 'Algorithms']
  },
  {
    id: 'qwen-coder-14b-q4',
    name: 'Qwen 2.5 Coder 14B Q4_K_M',
    originalName: 'Qwen/Qwen2.5-Coder-14B-Instruct-Q4',
    classes: ['Code AI'],
    size: '8.9 GB',
    vramReq: 10,
    ramReq: 16,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '4.2M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Profesyonel 14B kod mimarı. Çok dosyalı kurumsal projeler, sistem programlama ve backend mimarileri.',
      en: 'Professional 14B code architect. Multi-file enterprise apps, systems programming, and backend logic.',
      ru: 'Профессиональный архитектор 14B для многофайловых проектов и бэкенда.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['14B', 'Multi-File', 'Backend', 'Systems']
  },
  {
    id: 'qwen-coder-14b-q8',
    name: 'Qwen 2.5 Coder 14B Q8_0 Master',
    originalName: 'Qwen/Qwen2.5-Coder-14B-Instruct-Q8',
    classes: ['Code AI'],
    size: '15.2 GB',
    vramReq: 16,
    ramReq: 24,
    quantization: 'Q8_0',
    author: 'Qwen Team',
    downloads: '1.4M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Kayıpsız tam 8-bit 14B amiral kodlama gücü. Yüksek karmaşıklıkta C++, Rust ve TypeScript geliştirme.',
      en: 'Lossless 8-bit 14B powerhouse. Handles highest complexity in C++, Rust, and full-stack TypeScript.',
      ru: 'Безупречная 8-битная модель 14B для разработки на C++, Rust и TypeScript.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Master Tier', 'Rust', 'C++', 'Lossless']
  },
  {
    id: 'qwen-coder-32b-q4',
    name: 'Qwen 2.5 Coder 32B Q4_K_M',
    originalName: 'Qwen/Qwen2.5-Coder-32B-Instruct-Q4',
    classes: ['Code AI'],
    size: '19.8 GB',
    vramReq: 20,
    ramReq: 32,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '3.1M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'Claude 3.5 Sonnet ile yarışan açık kaynak kod devi. Kapsamlı tam stack kodlama ve devasa bağlam desteği.',
      en: 'Open-source coding titan rivaling Claude 3.5 Sonnet. Massive codebase reasoning & long-context support.',
      ru: 'Флагманский гигант 32B с качеством уровня Claude 3.5 Sonnet для огромных кодовых баз.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Top Tier', 'Claude Rival', '32B', 'Massive Context']
  },
  {
    id: 'qwen-coder-32b-q8',
    name: 'Qwen 2.5 Coder 32B Q8_0 Deep Architect',
    originalName: 'Qwen/Qwen2.5-Coder-32B-Instruct-Q8',
    classes: ['Code AI'],
    size: '34.2 GB',
    vramReq: 36,
    ramReq: 48,
    quantization: 'Q8_0 (Near FP16)',
    author: 'Qwen Team',
    downloads: '980K',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5-Coder',
    description: {
      tr: 'En üst düzey yerel kodlama motoru. RTX 4090 veya profesyonel iş istasyonları için kusursuz hassasiyet.',
      en: 'Absolute pinnacle of local code generation. Unmatched precision for RTX 4090 / Workstation rigs.',
      ru: 'Абсолютная вершина локального кодинга для рабочих станций и RTX 4090.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Workstation', 'Pinnacle', 'Ultra Precision']
  },

  // ===================== 9 CHAT AI MODELS (Qwen 2.5 Chat Series) =====================
  {
    id: 'qwen-chat-0.5b',
    name: 'Qwen 2.5 0.5B Chat Instruct',
    originalName: 'Qwen/Qwen2.5-0.5B-Instruct',
    classes: ['Chat AI'],
    size: '0.4 GB',
    vramReq: 1,
    ramReq: 2,
    quantization: 'Q8_0 / FP16',
    author: 'Qwen Team',
    downloads: '850K',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Hızlı, az kaynak tüketen sohbet asistanı. Düşük sistemlerde anında yanıt ve temel soru-cevap.',
      en: 'Ultra-fast, lightweight conversation assistant. Instant replies on low-spec hardware.',
      ru: 'Сверхбыстрый легкий чат-ассистент для мгновенных ответов на слабых системах.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Ultra Light', 'Fast Chat', 'Instant']
  },
  {
    id: 'qwen-chat-1.5b-q4',
    name: 'Qwen 2.5 1.5B Chat Q4_K_M',
    originalName: 'Qwen/Qwen2.5-1.5B-Instruct-Q4',
    classes: ['Chat AI'],
    size: '1.0 GB',
    vramReq: 2,
    ramReq: 4,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '1.7M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Günlük sohbet, özetleme ve metin analizi için optimize edilmiş kompakt model.',
      en: 'Compact conversational model optimized for daily dialogue, summaries, and text analysis.',
      ru: 'Компактная модель для ежедневного диалога, саммари и анализа текста.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Daily Assistant', 'Summarization', 'Compact']
  },
  {
    id: 'qwen-chat-3b-instruct',
    name: 'Qwen 2.5 3B Chat Instruct',
    originalName: 'Qwen/Qwen2.5-3B-Instruct',
    classes: ['Chat AI'],
    size: '2.0 GB',
    vramReq: 3,
    ramReq: 6,
    quantization: 'Q5_K_M',
    author: 'Qwen Team',
    downloads: '2.3M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Yüksek mantık yürütme kabiliyetine sahip orta ölçekli akıllı sohbet modeli.',
      en: 'Mid-sized intelligent chat model with impressive reasoning and role-play capabilities.',
      ru: 'Умная модель среднего размера с отличной логикой и ролевыми сценариями.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Reasoning', 'Creative Writing', 'Bilingual']
  },
  {
    id: 'qwen-chat-7b-q4',
    name: 'Qwen 2.5 7B Chat Q4_K_M',
    originalName: 'Qwen/Qwen2.5-7B-Instruct-Q4',
    classes: ['Chat AI'],
    size: '4.3 GB',
    vramReq: 6,
    ramReq: 8,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '5.8M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'En dengeli ve çok yönlü genel sohbet modeli. Akıcı Türkçe, İngilizce ve Rusça diyalog desteği.',
      en: 'Most balanced and versatile general conversational model. Fluent multi-language capabilities.',
      ru: 'Сбалансированная модель для глубокого диалога, работы с текстом и логики.'
    },
    isDownloaded: true,
    downloadProgress: 100,
    tags: ['Most Popular', 'Multilingual', 'Versatile']
  },
  {
    id: 'qwen-chat-7b-q8',
    name: 'Qwen 2.5 7B Chat Q8_0',
    originalName: 'Qwen/Qwen2.5-7B-Instruct-Q8',
    classes: ['Chat AI'],
    size: '7.6 GB',
    vramReq: 8,
    ramReq: 12,
    quantization: 'Q8_0',
    author: 'Qwen Team',
    downloads: '1.6M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: '8-bit kayıpsız 7B genel model. Detaylı felsefi, bilimsel ve yaratıcı metin üretimi.',
      en: '8-bit lossless 7B chat model for detailed philosophical, scientific, and creative writing.',
      ru: '8-битная модель 7B для детальных научных и литературных текстов.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['High Quality', '8-bit', 'Literature']
  },
  {
    id: 'qwen-chat-14b-q4',
    name: 'Qwen 2.5 14B Chat Q4_K_M',
    originalName: 'Qwen/Qwen2.5-14B-Instruct-Q4',
    classes: ['Chat AI'],
    size: '8.8 GB',
    vramReq: 10,
    ramReq: 16,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '3.9M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Gelişmiş analitik akıl yürütme ve çok adımlı problem çözme yeteneğine sahip 14B amiral sohbet modeli.',
      en: 'Advanced analytical reasoning and multi-step problem solver 14B model.',
      ru: 'Флагманский чат 14B с мощным аналитическим мышлением.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Analytical', 'Advanced Logic', '14B']
  },
  {
    id: 'qwen-chat-14b-q8',
    name: 'Qwen 2.5 14B Chat Q8_0 Pro',
    originalName: 'Qwen/Qwen2.5-14B-Instruct-Q8',
    classes: ['Chat AI'],
    size: '15.0 GB',
    vramReq: 16,
    ramReq: 24,
    quantization: 'Q8_0',
    author: 'Qwen Team',
    downloads: '1.2M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Kayıpsız 14B profesyonel diyalog motoru. Akademik araştırma ve derin kavram analizi.',
      en: 'Lossless 14B conversational engine for academic research and deep conceptual breakdown.',
      ru: '8-битный двигатель 14B для академических исследований и глубоких разборов.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Pro', 'Academic', 'Deep Logic']
  },
  {
    id: 'qwen-chat-32b-q4',
    name: 'Qwen 2.5 32B Chat Q4_K_M',
    originalName: 'Qwen/Qwen2.5-32B-Instruct-Q4',
    classes: ['Chat AI'],
    size: '19.5 GB',
    vramReq: 20,
    ramReq: 32,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '2.9M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'GPT-4 seviyesinde açık kaynak akıl yürütme. 128k bağlam desteği ile devasa döküman analizi.',
      en: 'GPT-4 class open reasoning with 128k context support for monumental document processing.',
      ru: 'Интеллект уровня GPT-4 с поддержкой контекста 128k для анализа документов.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['GPT-4 Tier', '128k Context', 'Heavy Reasoning']
  },
  {
    id: 'qwen-chat-72b-q4',
    name: 'Qwen 2.5 72B Chat Q4_K_M Flagship',
    originalName: 'Qwen/Qwen2.5-72B-Instruct-Q4',
    classes: ['Chat AI'],
    size: '42.0 GB',
    vramReq: 44,
    ramReq: 64,
    quantization: 'Q4_K_M',
    author: 'Qwen Team',
    downloads: '1.8M',
    repoUrl: 'https://github.com/QwenLM/Qwen2.5',
    description: {
      tr: 'Açık kaynağın tartışmasız en güçlü 72B genel yapay zekası. Tüm kıyaslamalarda lider.',
      en: 'Undisputed champion of open-source conversational intelligence. Top of all benchmarks.',
      ru: 'Безоговорочный лидер среди опенсорсных языковых моделей 72B.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Flagship 72B', 'Ultimate Intelligence', 'Master Class']
  },

  // ===================== 9 IMAGE AI MODELS =====================
  {
    id: 'sd-1.5-turbo',
    name: 'Stable Diffusion 1.5 Turbo',
    originalName: 'stabilityai/sd-turbo',
    classes: ['Image AI'],
    size: '1.2 GB',
    vramReq: 3,
    ramReq: 6,
    quantization: 'FP16 1-Step',
    author: 'Stability AI',
    downloads: '4.5M',
    repoUrl: 'https://huggingface.co/stabilityai/sd-turbo',
    description: {
      tr: '1 adımlı ultra hızlı görsel üretim modeli. Düşük sistemlerde anlık çizim.',
      en: 'Real-time 1-step image generation. Instant rendering on low-tier hardware.',
      ru: 'Ультрабыстрая 1-шаговая генерация изображений в реальном времени.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['1-Step', 'Realtime', 'Ultra Fast']
  },
  {
    id: 'sdxl-turbo-lightning',
    name: 'SDXL Turbo Lightning 4-Step',
    originalName: 'ByteDance/SDXL-Lightning-4step',
    classes: ['Image AI'],
    size: '2.4 GB',
    vramReq: 4,
    ramReq: 8,
    quantization: '4-Step LCM',
    author: 'ByteDance & Stability AI',
    downloads: '5.1M',
    repoUrl: 'https://huggingface.co/ByteDance/SDXL-Lightning',
    description: {
      tr: 'Yalnızca 4 adımda 1024x1024 yüksek çözünürlüklü keskin görsel oluşturucu.',
      en: 'Produces crisp 1024x1024 high-resolution imagery in only 4 generation steps.',
      ru: 'Генерация четких изображений 1024x1024 всего за 4 шага.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['1024px', 'Lightning', '4-Step', 'Fast']
  },
  {
    id: 'playground-v2.5',
    name: 'Playground v2.5 Aesthetic 1024px',
    originalName: 'playgroundai/playground-v2.5-1024px-aesthetic',
    classes: ['Image AI'],
    size: '4.2 GB',
    vramReq: 6,
    ramReq: 10,
    quantization: 'FP16',
    author: 'Playground AI',
    downloads: '2.8M',
    repoUrl: 'https://huggingface.co/playgroundai/playground-v2.5-1024px-aesthetic',
    description: {
      tr: 'Sanatsal ve estetik kompozisyonlarda uzmanlaşmış yüksek kaliteli görsel modeli.',
      en: 'State-of-the-art aesthetic and visual composition model for portraiture and design.',
      ru: 'Модель с непревзойденной эстетикой и качеством композиции.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Aesthetic', 'Portraits', 'Artistic']
  },
  {
    id: 'sdxl-base-1.0',
    name: 'SDXL 1.0 Base FP16 Refiner',
    originalName: 'stabilityai/stable-diffusion-xl-base-1.0',
    classes: ['Image AI'],
    size: '6.6 GB',
    vramReq: 8,
    ramReq: 12,
    quantization: 'FP16',
    author: 'Stability AI',
    downloads: '12.4M',
    repoUrl: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0',
    description: {
      tr: 'Endüstri standardı 1024px görsel üretim motoru. Yüksek detay, ışık ve doku başarımı.',
      en: 'Industry-standard 1024px visual synthesizer with photoreal lighting and detailed textures.',
      ru: 'Индустриальный стандарт 1024px для фотореалистичных и стилизованных артов.'
    },
    isDownloaded: true,
    downloadProgress: 100,
    tags: ['Industry Standard', '1024px', 'Versatile']
  },
  {
    id: 'pixart-sigma-4k',
    name: 'PixArt-Sigma 4K Photoreal',
    originalName: 'PixArt-alpha/PixArt-Sigma-XL-2-1024-MS',
    classes: ['Image AI'],
    size: '7.2 GB',
    vramReq: 8,
    ramReq: 16,
    quantization: 'DiT FP16',
    author: 'PixArt Alpha Team',
    downloads: '1.9M',
    repoUrl: 'https://github.com/PixArt-alpha/PixArt-sigma',
    description: {
      tr: 'Diffusion Transformer (DiT) mimarisiyle 4K detay seviyesinde fotogerçekçi çıktılar.',
      en: 'DiT-powered photo-realism synthesizer supporting high-density 4K details.',
      ru: 'Трансформерная модель DiT для фотореалистичных 4K деталей.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['DiT', 'Photoreal', '4K Support']
  },
  {
    id: 'flux-schnell-q4',
    name: 'FLUX.1 Schnell 4-Step Q4',
    originalName: 'black-forest-labs/FLUX.1-schnell-GGUF',
    classes: ['Image AI'],
    size: '8.2 GB',
    vramReq: 10,
    ramReq: 16,
    quantization: 'Q4_K_S',
    author: 'Black Forest Labs',
    downloads: '6.7M',
    repoUrl: 'https://github.com/black-forest-labs/flux',
    description: {
      tr: '4 adımda Midjourney kalitesinde fotogerçekçilik, mükemmel parmak ve metin çizimi.',
      en: 'Midjourney-grade quality in 4 steps. Flawless text rendering and anatomy.',
      ru: 'Качество Midjourney за 4 шага с идеальным текстом и анатомией.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['FLUX', 'Text in Image', 'Anatomy Master']
  },
  {
    id: 'flux-schnell-q8',
    name: 'FLUX.1 Schnell Q8_0',
    originalName: 'black-forest-labs/FLUX.1-schnell-Q8',
    classes: ['Image AI'],
    size: '13.5 GB',
    vramReq: 14,
    ramReq: 24,
    quantization: 'Q8_0',
    author: 'Black Forest Labs',
    downloads: '2.4M',
    repoUrl: 'https://github.com/black-forest-labs/flux',
    description: {
      tr: 'FLUX Schnell için 8-bit yüksek keskinlik. Karmaşık tipografi ve hiper-detaylı dokular.',
      en: '8-bit precision FLUX Schnell for crisp typography and hyper-detailed textures.',
      ru: '8-битная точность FLUX Schnell для идеальной типографики и микротекстур.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Hyper Detail', 'Typography', '8-bit']
  },
  {
    id: 'flux-dev-q4',
    name: 'FLUX.1 Dev 12B Q4_K_S',
    originalName: 'black-forest-labs/FLUX.1-dev-Q4',
    classes: ['Image AI'],
    size: '14.2 GB',
    vramReq: 16,
    ramReq: 24,
    quantization: 'Q4_K_S',
    author: 'Black Forest Labs',
    downloads: '4.8M',
    repoUrl: 'https://github.com/black-forest-labs/flux',
    description: {
      tr: '12 milyar parametreli dünyanın en gelişmiş açık kaynak görsel modeli.',
      en: 'World-leading 12B parameter visual engine with unparalleled prompt comprehension.',
      ru: 'Передовая 12B модель с непревзойденным пониманием сложных промптов.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['12B Params', 'Cinema Quality', 'Prompt Adherence']
  },
  {
    id: 'flux-dev-fp16',
    name: 'FLUX.1 Dev 12B FP16 Ultra',
    originalName: 'black-forest-labs/FLUX.1-dev-FP16',
    classes: ['Image AI'],
    size: '23.8 GB',
    vramReq: 24,
    ramReq: 32,
    quantization: 'FP16 Lossless',
    author: 'Black Forest Labs',
    downloads: '1.3M',
    repoUrl: 'https://github.com/black-forest-labs/flux',
    description: {
      tr: 'Tam FP16 amiral görsel modeli. RTX 4090 / 48GB GPU için sinematik stüdyo kalitesi.',
      en: 'Full FP16 flagship visual engine. Cinematic studio grade outputs for RTX 4090 / 48GB rigs.',
      ru: 'Полноразмерная FP16 модель студийного уровня для топовых видеокарт.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Studio Grade', 'FP16', 'Ultra Photoreal']
  },

  // ===================== 9 VIDEO AI MODELS =====================
  {
    id: 'animatediff-lcm',
    name: 'AnimateDiff LCM Turbo',
    originalName: 'guoyww/AnimateDiff-Lightning',
    classes: ['Video AI'],
    size: '1.8 GB',
    vramReq: 4,
    ramReq: 8,
    quantization: 'LCM 4-Step',
    author: 'AnimateDiff Team',
    downloads: '3.2M',
    repoUrl: 'https://github.com/guoyww/AnimateDiff',
    description: {
      tr: 'Hafif ve hızlı video animasyon üreticisi. 4 saniyelik akıcı GIF/MP4 hareket klipleri.',
      en: 'Lightweight and rapid motion synthesizer. Generates 4s fluid video clips effortlessly.',
      ru: 'Легкий и быстрый генератор плавной анимации и 4-секундных видеоклипов.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Lightweight', 'Motion', 'Fast MP4']
  },
  {
    id: 'svd-xt',
    name: 'Stable Video Diffusion (SVD-XT)',
    originalName: 'stabilityai/stable-video-diffusion-img2vid-xt',
    classes: ['Video AI'],
    size: '4.8 GB',
    vramReq: 8,
    ramReq: 12,
    quantization: 'FP16 (25 Frames)',
    author: 'Stability AI',
    downloads: '4.1M',
    repoUrl: 'https://github.com/Stability-AI/generative-models',
    description: {
      tr: 'Görselleri 25 karelik akıcı videolara dönüştüren popüler görüntüden-videoya (I2V) modeli.',
      en: 'Popular image-to-video (I2V) model synthesizing 25-frame smooth camera motions.',
      ru: 'Модель Image-to-Video для преобразования фото в 25-кадровые видео.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Image2Video', 'Smooth Motion', 'Stability']
  },
  {
    id: 'cogvideox-2b',
    name: 'CogVideoX-2B Fast Motion',
    originalName: 'THUDM/CogVideoX-2b',
    classes: ['Video AI'],
    size: '5.6 GB',
    vramReq: 8,
    ramReq: 14,
    quantization: 'BF16 / INT8',
    author: 'THUDM (Tsinghua)',
    downloads: '2.7M',
    repoUrl: 'https://github.com/THUDM/CogVideo',
    description: {
      tr: 'Metinden video üreten 2B hafif model. Dinamik kamera hareketleri ve 3D uzamsal tutarlılık.',
      en: 'Text-to-video 2B model with dynamic camera transitions and 3D spatial consistency.',
      ru: 'Текстовая видеомодель 2B с динамичными движениями камеры.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Text2Video', 'Fast Motion', '3D Camera']
  },
  {
    id: 'ltx-video-q4',
    name: 'LTX-Video 0.9.1 Realtime Q4',
    originalName: 'Lightricks/LTX-Video-Q4',
    classes: ['Video AI'],
    size: '6.8 GB',
    vramReq: 10,
    ramReq: 16,
    quantization: 'Q4_K_M',
    author: 'Lightricks',
    downloads: '3.8M',
    repoUrl: 'https://github.com/Lightricks/LTX-Video',
    description: {
      tr: 'Gerçek zamanlıya yakın metin ve görselden video üretimi. Yüksek kare hızı ve sinematik sahneler.',
      en: 'Near real-time text/image to video generation. High framerate cinematic sequences.',
      ru: 'Почти реал-тайм генерация видео из текста и картинок с кинематографичными сценами.'
    },
    isDownloaded: true,
    downloadProgress: 100,
    tags: ['Realtime T2V', 'Cinematic', 'Lightricks']
  },
  {
    id: 'cogvideox-5b-q4',
    name: 'CogVideoX-5B I2V Q4',
    originalName: 'THUDM/CogVideoX-5b-Q4',
    classes: ['Video AI'],
    size: '9.5 GB',
    vramReq: 12,
    ramReq: 20,
    quantization: 'Q4_K_M',
    author: 'THUDM',
    downloads: '2.1M',
    repoUrl: 'https://github.com/THUDM/CogVideo',
    description: {
      tr: '5 milyar parametreli gelişmiş video motoru. Yüksek fizik simülasyonu ve ışık tutarlılığı.',
      en: '5B parameter advanced video engine with physics simulation and lighting continuity.',
      ru: 'Продвинутый видео-движок 5B с высокой физической достоверностью.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['5B', 'Physics Sim', 'Lighting Continuity']
  },
  {
    id: 'hunyuan-video-720p',
    name: 'HunyuanVideo 720p Q4',
    originalName: 'Tencent/HunyuanVideo-720p-Q4',
    classes: ['Video AI'],
    size: '12.2 GB',
    vramReq: 14,
    ramReq: 24,
    quantization: 'Q4_K_M',
    author: 'Tencent',
    downloads: '3.6M',
    repoUrl: 'https://github.com/Tencent/HunyuanVideo',
    description: {
      tr: 'Sora kalitesinde açık kaynak video modeli. 720p çözünürlükte sinematik uzun sekanslar.',
      en: 'Sora-class open source video powerhouse. Generates 720p cinematic sequences.',
      ru: 'Опенсорсная модель уровня Sora для 720p кинематографичных сцен.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Sora Class', '720p', 'Tencent', 'Long Video']
  },
  {
    id: 'cogvideox-5b-fp16',
    name: 'CogVideoX-5B FP16 Cinematic',
    originalName: 'THUDM/CogVideoX-5b-FP16',
    classes: ['Video AI'],
    size: '18.4 GB',
    vramReq: 20,
    ramReq: 32,
    quantization: 'BF16 Full',
    author: 'THUDM',
    downloads: '1.5M',
    repoUrl: 'https://github.com/THUDM/CogVideo',
    description: {
      tr: 'Kayıpsız 5B video oluşturucu. Film yapımcıları için kusursuz renk derecelendirmesi ve kamera kontrolü.',
      en: 'Lossless 5B video synthesis. Full color grading and nuanced camera choreography.',
      ru: 'Полноразмерная модель 5B для кинематографического контроля и цвета.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['Full Precision', 'Filmmaking', 'Camera Rig']
  },
  {
    id: 'hunyuan-video-1080p',
    name: 'HunyuanVideo 1080p Q8_0',
    originalName: 'Tencent/HunyuanVideo-1080p-Q8',
    classes: ['Video AI'],
    size: '22.5 GB',
    vramReq: 24,
    ramReq: 36,
    quantization: 'Q8_0',
    author: 'Tencent',
    downloads: '1.9M',
    repoUrl: 'https://github.com/Tencent/HunyuanVideo',
    description: {
      tr: 'Tam 1080p Full HD çözünürlükte video üretimi. İleri seviye fizik, insan hareketi ve sinematik ışık.',
      en: 'Full 1080p HD video synthesis with advanced human kinetics, fluid dynamics, and cinematic lighting.',
      ru: 'Генерация видео 1080p Full HD с передовой кинетикой и освещением.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['1080p Full HD', 'Human Motion', 'Flagship Video']
  },
  {
    id: 'mochi-1-preview',
    name: 'Mochi 1 Preview 480p/720p',
    originalName: 'genmo/mochi-1-preview',
    classes: ['Video AI'],
    size: '28.0 GB',
    vramReq: 28,
    ramReq: 48,
    quantization: 'AsymmDiT BF16',
    author: 'Genmo AI',
    downloads: '1.4M',
    repoUrl: 'https://github.com/genmoai/models',
    description: {
      tr: 'En gerçekçi hareket dinamiklerine sahip 10B AsymmDiT video modeli. İş istasyonları için üst seviye.',
      en: 'Most realistic motion fidelity 10B AsymmDiT model. Premier workstation video synthesizer.',
      ru: 'Модель 10B AsymmDiT с максимальной точностью динамики движений.'
    },
    isDownloaded: false,
    downloadProgress: 0,
    tags: ['10B AsymmDiT', 'Motion Fidelity', 'Workstation']
  }
];
