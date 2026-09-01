import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Check,
  ExternalLink,
  HardDrive,
  Sparkles,
  Layers,
  Cpu,
  Bot,
  Code,
  Image as ImageIcon,
  Film,
  AlertCircle
} from 'lucide-react';
import { AIModel, HardwareConfig, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ModelStoreViewProps {
  allModels: AIModel[];
  onStartDownload: (modelId: string) => void;
  hardware: HardwareConfig;
  lang: Language;
  theme: 'dark' | 'light';
  onOpenSettings?: () => void;
}

export const ModelStoreView: React.FC<ModelStoreViewProps> = ({
  allModels,
  onStartDownload,
  hardware,
  lang,
  theme,
  onOpenSettings
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Chat AI' | 'Code AI' | 'Image AI' | 'Video AI'>('ALL');

  // Compute the 4 recommended models based directly on allocated VRAM and RAM
  const recommendedModels = useMemo(() => {
    const vram = typeof hardware.vramAllocatedGB === 'number' ? hardware.vramAllocatedGB : 0;
    const ram = typeof hardware.ramAllocatedGB === 'number' ? hardware.ramAllocatedGB : 0;

    // Zero-resource check: If neither RAM nor VRAM is allocated, no local model can run.
    if (vram === 0 && ram === 0) {
      return {
        chat: null,
        code: null,
        image: null,
        video: null,
        allZero: true
      };
    }

    // For LLMs (Qwen Chat & Qwen Coder with GGUF / CPU offload or Pure GPU):
    const canRunLLM = (m: AIModel) => {
      if (vram === 0 && ram === 0) return false;
      // 1. Pure GPU run (when user allocated sufficient VRAM, even with 0 RAM)
      if (vram > 0 && m.vramReq <= vram) return true;
      // 2. Pure CPU / RAM run (when user has 0 VRAM or low VRAM and allocated RAM)
      if (ram > 0 && m.ramReq <= ram) return true;
      // 3. Hybrid CPU + GPU memory pool
      if (ram > 0 && vram > 0 && (m.ramReq <= ram + Math.floor(vram * 0.75))) return true;
      return false;
    };

    // For Image & Video AI models (Diffusion models):
    const canRunDiffusion = (m: AIModel) => {
      if (vram === 0 && ram === 0) return false;
      // 1. Direct GPU fit
      if (vram > 0 && m.vramReq <= vram) return true;
      // 2. Low-VRAM CPU offload mode (runs if RAM has headroom and VRAM is within 4GB margin)
      if (ram > 0 && m.ramReq <= ram && (vram + 4 >= m.vramReq) && (vram >= 2 || ram >= 16)) return true;
      // 3. High RAM pure CPU fallback (requires at least 16 GB RAM)
      if (vram === 0 && ram >= m.ramReq * 1.5 && ram >= 16) return true;
      return false;
    };

    // 1. Best Chat Model
    const chatCandidates = allModels.filter(m => m.classes.includes('Chat AI'));
    const validChat = chatCandidates.filter(canRunLLM);
    const bestChat = validChat.length > 0 ? validChat[validChat.length - 1] : null;

    // 2. Best Code Model
    const codeCandidates = allModels.filter(m => m.classes.includes('Code AI'));
    const validCode = codeCandidates.filter(canRunLLM);
    const bestCode = validCode.length > 0 ? validCode[validCode.length - 1] : null;

    // 3. Best Image Model
    const imageCandidates = allModels.filter(m => m.classes.includes('Image AI'));
    const validImage = imageCandidates.filter(canRunDiffusion);
    const bestImage = validImage.length > 0 ? validImage[validImage.length - 1] : null;

    // 4. Best Video Model
    const videoCandidates = allModels.filter(m => m.classes.includes('Video AI'));
    const validVideo = videoCandidates.filter(canRunDiffusion);
    const bestVideo = validVideo.length > 0 ? validVideo[validVideo.length - 1] : null;

    const hasAnyModel = Boolean(bestChat || bestCode || bestImage || bestVideo);

    return {
      chat: bestChat,
      code: bestCode,
      image: bestImage,
      video: bestVideo,
      allZero: !hasAnyModel
    };
  }, [allModels, hardware.vramAllocatedGB, hardware.ramAllocatedGB]);

  const categories: { id: 'ALL' | 'Chat AI' | 'Code AI' | 'Image AI' | 'Video AI'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'Tüm Modeller', icon: Layers },
    { id: 'Chat AI', label: t.classes['Chat AI'], icon: Bot },
    { id: 'Code AI', label: t.classes['Code AI'], icon: Code },
    { id: 'Image AI', label: t.classes['Image AI'], icon: ImageIcon },
    { id: 'Video AI', label: t.classes['Video AI'], icon: Film }
  ];

  const getFilteredModelsForCategory = (cls: 'Chat AI' | 'Code AI' | 'Image AI' | 'Video AI') => {
    return allModels.filter(m => {
      const matchesCategory = m.classes.includes(cls);
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const nameMatch = m.name.toLowerCase().includes(q) || m.originalName.toLowerCase().includes(q);
      const tagMatch = m.tags.some(tag => tag.toLowerCase().includes(q));
      const descMatch = (m.description[lang] || '').toLowerCase().includes(q);

      return nameMatch || tagMatch || descMatch;
    });
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
      {/* Top Search Bar & Category Filter Bar */}
      <div
        className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        {/* Search Input */}
        <div className="flex-1 min-w-[260px] max-w-xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchModels}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              isLight
                ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400'
                : 'bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                    ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {/* ===================== TOP: ÖNERİLEN MODELLER (RECOMMENDED) ===================== */}
        {!searchQuery.trim() && selectedCategory === 'ALL' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.recommendedSection}
                  </h2>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.recommendedSubtitle} ({hardware.vramAllocatedGB} GB VRAM • {hardware.ramAllocatedGB} GB RAM)
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Content: either Zero-hardware banner or 4 Slots */}
            {recommendedModels.allZero ? (
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isLight
                    ? 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-sm'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3.5 max-w-2xl">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-1">
                      {t.noRecommendedModels}
                    </h3>
                    <p className="text-xs leading-relaxed opacity-90">
                      {t.noRecommendedModelsDesc}
                    </p>
                  </div>
                </div>
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 shadow-sm transition active:scale-[0.98]"
                  >
                    {t.adjustHardwareSettings}
                  </button>
                )}
              </div>
            ) : (
              /* 4 Recommended Models Grid (Chat, Code, Image, Video) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { title: t.bestChatAI, model: recommendedModels.chat, typeBadge: 'Chat AI', icon: Bot, minReq: '1GB VRAM / 2GB RAM' },
                  { title: t.bestCodeAI, model: recommendedModels.code, typeBadge: 'Code AI', icon: Code, minReq: '1GB VRAM / 2GB RAM' },
                  { title: t.bestImageAI, model: recommendedModels.image, typeBadge: 'Image AI', icon: ImageIcon, minReq: '4GB VRAM / 16GB RAM' },
                  { title: t.bestVideoAI, model: recommendedModels.video, typeBadge: 'Video AI', icon: Film, minReq: '6GB VRAM / 24GB RAM' }
                ].map((item, idx) => {
                  const m = item.model;
                  const Icon = item.icon;

                  if (!m) {
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl p-4 border border-dashed flex flex-col justify-between opacity-80 ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-700'
                            : 'bg-[#121622] border-slate-800 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {item.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              {t.insufficientHardware}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed mb-3 text-slate-500">
                            {t.insufficientForClass}
                          </p>
                          <div className="text-[10px] font-mono text-slate-400">
                            {t.minRequirement}: {item.minReq}
                          </div>
                        </div>
                        {onOpenSettings && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                            <button
                              onClick={onOpenSettings}
                              className="w-full py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                            >
                              {t.adjustHardwareSettings}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-4 border flex flex-col justify-between transition-all hover:shadow-md ${
                        isLight
                          ? 'bg-white border-slate-200/90 hover:border-indigo-400'
                          : 'bg-[#141a28] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Top Label & Class */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isLight ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-300 border border-indigo-800'
                          }`}>
                            {item.typeBadge}
                          </span>
                        </div>

                        {/* Model Name */}
                        <h3 className={`font-bold text-xs line-clamp-1 mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {m.name}
                        </h3>

                        {/* Description */}
                        <p className={`text-[11px] line-clamp-2 leading-relaxed mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {m.description[lang] || m.description.tr}
                        </p>

                        {/* Tech Specifications Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {m.size}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {m.quantization}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
                            isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'
                          }`}>
                            <HardDrive className="w-3 h-3 text-cyan-600" />
                            <span>{m.vramReq}GB VRAM</span>
                          </span>
                        </div>
                      </div>

                      {/* Download Button */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                        {m.isDownloaded ? (
                          <div className="w-full py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{t.downloaded}</span>
                          </div>
                        ) : m.isDownloading ? (
                          <div className="w-full py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5">
                            <Download className="w-3.5 h-3.5 animate-bounce" />
                            <span>{t.downloading} ({m.downloadProgress || 0}%)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onStartDownload(m.id)}
                            className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.download}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ===================== CATEGORY SECTIONS (Chat, Code, Image, Video) ===================== */}
        {(['Chat AI', 'Code AI', 'Image AI', 'Video AI'] as const)
          .filter(cls => selectedCategory === 'ALL' || selectedCategory === cls)
          .map(cls => {
            const modelsInClass = getFilteredModelsForCategory(cls);

            return (
              <section key={cls} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {t.classes[cls]}
                    </span>
                    <span className={`text-[11px] px-2 py-0.2 rounded-full ${
                      isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {modelsInClass.length} Model
                    </span>
                  </div>
                </div>

                {/* Model Cards Grid or "Model Yok" Empty State */}
                {modelsInClass.length === 0 ? (
                  <div
                    className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 ${
                      isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#141a27] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {t.noModelFoundInSearch}
                    </h4>
                    <p className={`text-xs max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t.noModelDesc}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {modelsInClass.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-2xl p-4 border flex flex-col justify-between transition-all hover:shadow-md ${
                          isLight
                            ? 'bg-white border-slate-200 hover:border-indigo-400'
                            : 'bg-[#141a27] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          {/* Top row: Name & Size */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className={`font-bold text-xs line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {m.name}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold shrink-0 ${
                              isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-200'
                            }`}>
                              {m.size}
                            </span>
                          </div>

                          {/* Author & downloads */}
                          <div className={`text-[10px] flex items-center gap-2 mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span>{m.author}</span>
                            <span>•</span>
                            <span>{m.downloads} İndirme</span>
                          </div>

                          {/* Description */}
                          <p className={`text-[11px] line-clamp-2 leading-relaxed mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {m.description[lang] || m.description.tr}
                          </p>

                          {/* Tags & Tech specs */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {m.quantization}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
                              isLight ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            }`}>
                              <HardDrive className="w-3 h-3" />
                              <span>{m.vramReq}GB VRAM</span>
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
                              isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'
                            }`}>
                              <Cpu className="w-3 h-3" />
                              <span>{m.ramReq}GB RAM</span>
                            </span>
                          </div>
                        </div>

                        {/* Bottom Actions: Repo link & Download button */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <a
                            href={m.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-2 rounded-xl transition flex items-center justify-center ${
                              isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                            title="HuggingFace / GitHub Repository"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <div className="flex-1">
                            {m.isDownloaded ? (
                              <div className="w-full py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{t.downloaded}</span>
                              </div>
                            ) : m.isDownloading ? (
                              <div className="w-full py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5">
                                <Download className="w-3.5 h-3.5 animate-bounce" />
                                <span>{t.downloading} ({m.downloadProgress || 0}%)</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => onStartDownload(m.id)}
                                className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{t.download}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
};
