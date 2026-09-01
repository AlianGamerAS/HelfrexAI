import { AIModel } from '../types';

export interface GpuOption {
  id: string;
  name: string;
  vramGB: number;
  tier: 'low' | 'mid' | 'high' | 'ultra';
}

export interface IntegratedCpuOption {
  id: string;
  name: string;
  integratedGpu: string;
  sharedVramEstimateGB: number;
  tier: 'low' | 'mid' | 'high';
}

export const DEDICATED_GPUS: GpuOption[] = [
  { id: 'rtx-5090', name: 'NVIDIA GeForce RTX 5090 (32 GB)', vramGB: 32, tier: 'ultra' },
  { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090 (24 GB)', vramGB: 24, tier: 'ultra' },
  { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080 / Super (16 GB)', vramGB: 16, tier: 'high' },
  { id: 'rtx-4070ti', name: 'NVIDIA GeForce RTX 4070 Ti / Super (16 GB)', vramGB: 16, tier: 'high' },
  { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070 (12 GB)', vramGB: 12, tier: 'high' },
  { id: 'rtx-4060ti-16', name: 'NVIDIA GeForce RTX 4060 Ti (16 GB)', vramGB: 16, tier: 'high' },
  { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060 (8 GB)', vramGB: 8, tier: 'mid' },
  { id: 'rtx-3090', name: 'NVIDIA GeForce RTX 3090 (24 GB)', vramGB: 24, tier: 'ultra' },
  { id: 'rtx-3080ti', name: 'NVIDIA GeForce RTX 3080 Ti (12 GB)', vramGB: 12, tier: 'high' },
  { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080 (10 GB)', vramGB: 10, tier: 'high' },
  { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070 (8 GB)', vramGB: 8, tier: 'mid' },
  { id: 'rtx-3060-12', name: 'NVIDIA GeForce RTX 3060 (12 GB)', vramGB: 12, tier: 'high' },
  { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050 (6 GB / 8 GB)', vramGB: 6, tier: 'low' },
  { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660 / Ti / Super (6 GB)', vramGB: 6, tier: 'low' },
  { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX (24 GB)', vramGB: 24, tier: 'ultra' },
  { id: 'rx-7900-xt', name: 'AMD Radeon RX 7900 XT (20 GB)', vramGB: 20, tier: 'ultra' },
  { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT (16 GB)', vramGB: 16, tier: 'high' },
  { id: 'rx-7700-xt', name: 'AMD Radeon RX 7700 XT (12 GB)', vramGB: 12, tier: 'high' },
  { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT (12 GB)', vramGB: 12, tier: 'high' },
  { id: 'rx-6600', name: 'AMD Radeon RX 6600 (8 GB)', vramGB: 8, tier: 'mid' },
  { id: 'arc-a770', name: 'Intel Arc A770 (16 GB)', vramGB: 16, tier: 'high' },
  { id: 'arc-a750', name: 'Intel Arc A750 (8 GB)', vramGB: 8, tier: 'mid' },
  { id: 'other-dedicated', name: 'Diğer / Özel Harici GPU (Other Dedicated GPU)', vramGB: 8, tier: 'mid' }
];

export const INTEGRATED_CPUS: IntegratedCpuOption[] = [
  { id: 'intel-ultra-9-185h', name: 'Intel Core Ultra 9 185H (Intel Arc Graphics)', integratedGpu: 'Intel Arc 8-Cores', sharedVramEstimateGB: 8, tier: 'high' },
  { id: 'intel-ultra-7-155h', name: 'Intel Core Ultra 7 155H (Intel Arc Graphics)', integratedGpu: 'Intel Arc 8-Cores', sharedVramEstimateGB: 8, tier: 'high' },
  { id: 'intel-ultra-5-125h', name: 'Intel Core Ultra 5 125H (Intel Arc Graphics)', integratedGpu: 'Intel Arc 7-Cores', sharedVramEstimateGB: 6, tier: 'mid' },
  { id: 'intel-i9-14900k', name: 'Intel Core i9-14900K / 13900K (UHD 770)', integratedGpu: 'Intel UHD Graphics 770', sharedVramEstimateGB: 4, tier: 'low' },
  { id: 'intel-i7-13700h', name: 'Intel Core i7-13700H / 12700H (Iris Xe)', integratedGpu: 'Intel Iris Xe 96EU', sharedVramEstimateGB: 4, tier: 'low' },
  { id: 'intel-i5-13500h', name: 'Intel Core i5-13500H / 12500H (Iris Xe)', integratedGpu: 'Intel Iris Xe 80EU', sharedVramEstimateGB: 3, tier: 'low' },
  { id: 'amd-ryzen-ai-9-hx370', name: 'AMD Ryzen AI 9 HX 370 (Radeon 890M RDNA 3.5)', integratedGpu: 'Radeon 890M', sharedVramEstimateGB: 8, tier: 'high' },
  { id: 'amd-ryzen-7-8840hs', name: 'AMD Ryzen 7 8840HS / 7840HS (Radeon 780M)', integratedGpu: 'Radeon 780M', sharedVramEstimateGB: 8, tier: 'high' },
  { id: 'amd-ryzen-7-7840u', name: 'AMD Ryzen 7 7840U / 6800U (Radeon 780M / 680M)', integratedGpu: 'Radeon 780M / 680M', sharedVramEstimateGB: 6, tier: 'mid' },
  { id: 'amd-ryzen-5-8640hs', name: 'AMD Ryzen 5 8640HS / 7640HS (Radeon 760M)', integratedGpu: 'Radeon 760M', sharedVramEstimateGB: 4, tier: 'low' },
  { id: 'amd-ryzen-5-7600', name: 'AMD Ryzen 5 7600 / 7700 (Radeon 610M)', integratedGpu: 'Radeon Graphics (RDNA2 2CU)', sharedVramEstimateGB: 2, tier: 'low' },
  { id: 'apple-m3-max', name: 'Apple M3 Max / M4 Pro (Unified Memory GPU)', integratedGpu: 'Apple GPU 30/40-Core', sharedVramEstimateGB: 24, tier: 'high' },
  { id: 'apple-m2-m3-base', name: 'Apple M1 / M2 / M3 / M4 (Base Unified GPU)', integratedGpu: 'Apple GPU 8/10-Core', sharedVramEstimateGB: 8, tier: 'mid' },
  { id: 'other-integrated', name: 'Diğer Dahili GPU İşlemcisi (Other Integrated CPU)', integratedGpu: 'Generic iGPU', sharedVramEstimateGB: 4, tier: 'low' }
];

export const RAM_OPTIONS = [4, 8, 16, 24, 32, 48, 64, 96, 128];

export interface HardwareRecommendation {
  bestChatModel?: AIModel;
  bestCodeModel?: AIModel;
  bestImageModel?: AIModel;
  bestVideoModel?: AIModel;
  effectiveVramGB: number;
  effectiveRamGB: number;
  supportsImage: boolean;
  supportsVideo: boolean;
  summaryNote: string;
}

export function computeHardwareRecommendations(
  ramGB: number,
  gpuType: 'dedicated' | 'integrated',
  gpuId: string,
  cpuId: string,
  allModels: AIModel[]
): HardwareRecommendation {
  let effectiveVramGB = 4;
  
  if (gpuType === 'dedicated') {
    const foundGpu = DEDICATED_GPUS.find(g => g.id === gpuId) || DEDICATED_GPUS.find(g => g.id === 'rtx-3060-12')!;
    effectiveVramGB = foundGpu.vramGB;
  } else {
    const foundCpu = INTEGRATED_CPUS.find(c => c.id === cpuId) || INTEGRATED_CPUS[0];
    // Dynamic shared memory limit based on total system RAM
    const maxSharedByRam = Math.floor(ramGB / 2);
    effectiveVramGB = Math.min(foundCpu.sharedVramEstimateGB, maxSharedByRam);
    if (effectiveVramGB < 1) effectiveVramGB = 1;
  }

  // Model filters based on effective hardware limits
  const codeModels = allModels.filter(m => m.classes.includes('Code AI') && m.vramReq <= effectiveVramGB && m.ramReq <= ramGB);
  const chatModels = allModels.filter(m => m.classes.includes('Chat AI') && m.vramReq <= effectiveVramGB && m.ramReq <= ramGB);
  const imageModels = allModels.filter(m => m.classes.includes('Image AI') && m.vramReq <= effectiveVramGB && m.ramReq <= ramGB);
  const videoModels = allModels.filter(m => m.classes.includes('Video AI') && m.vramReq <= effectiveVramGB && m.ramReq <= ramGB);

  // Pick highest capability within limits (largest feasible model for best performance)
  const bestCodeModel = codeModels.sort((a, b) => b.vramReq - a.vramReq)[0] || allModels.find(m => m.id === 'qwen-coder-0.5b');
  const bestChatModel = chatModels.sort((a, b) => b.vramReq - a.vramReq)[0] || allModels.find(m => m.id === 'qwen-chat-0.5b');
  
  // Image & Video support rules
  const supportsImage = imageModels.length > 0 && (effectiveVramGB >= 4 || ramGB >= 16);
  const bestImageModel = supportsImage ? (imageModels.sort((a, b) => b.vramReq - a.vramReq)[0]) : undefined;

  const supportsVideo = videoModels.length > 0 && (effectiveVramGB >= 6 && ramGB >= 16);
  const bestVideoModel = supportsVideo ? (videoModels.sort((a, b) => b.vramReq - a.vramReq)[0]) : undefined;

  let summaryNote = '';
  if (!supportsVideo && !supportsImage) {
    summaryNote = 'Donanımınız (düşük VRAM/RAM) metin ve kodlama için optimize edildi. Görsel ve video modelleri gizlendi.';
  } else if (!supportsVideo) {
    summaryNote = 'Donanımınız metin, kod ve görsel üretimi için uygundur. Video modelleri için en az 6GB VRAM önerilir.';
  } else {
    summaryNote = 'Mükemmel donanım! Sohbet, Kod, Görsel ve Video modellerinin tümü çalıştırılabilir.';
  }

  return {
    bestChatModel,
    bestCodeModel,
    bestImageModel,
    bestVideoModel,
    effectiveVramGB,
    effectiveRamGB: ramGB,
    supportsImage,
    supportsVideo,
    summaryNote
  };
}
