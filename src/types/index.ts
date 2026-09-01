export type Language = 'tr' | 'en' | 'ru';

export type ModelClass = 'Chat AI' | 'Code AI' | 'Image AI' | 'Video AI' | string;

export interface AIModel {
  id: string;
  name: string;
  originalName: string;
  classes: ('Chat AI' | 'Code AI' | 'Image AI' | 'Video AI')[];
  size: string; // e.g. "4.7 GB"
  vramReq: number; // in GB
  ramReq: number; // in GB
  quantization: string; // e.g. "Q4_K_M", "FP16", "GGUF"
  author: string;
  downloads: string;
  repoUrl: string;
  description: Record<Language, string>;
  isDownloaded: boolean;
  downloadProgress: number; // 0 to 100
  downloadSpeed?: string; // e.g. "54.2 MB/s"
  isDownloading?: boolean;
  isPaused?: boolean;
  isCustomApi?: boolean;
  apiUrl?: string;
  apiKey?: string;
  tags: string[];
}

export type PreviewType = 'web' | 'mcaddon' | 'windows' | 'android' | 'image' | 'video';

export interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  content?: string;
  enabled?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  modelId?: string;
  modelName?: string;
  type: 'chat' | 'code' | 'image' | 'video';
  mediaUrl?: string;
  videoDuration?: string;
  codeFiles?: CodeFile[];
  previewType?: PreviewType;
  attachments?: AttachmentItem[];
  isGenerating?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
  selectedModelId: string;
  attachedFiles: AttachmentItem[];
  activePreviewType?: PreviewType;
  currentFiles?: CodeFile[];
}

export interface SystemPrompt {
  id: string;
  title: string;
  prompt: string;
  active: boolean;
}

export interface HardwareConfig {
  ramGB: number;
  gpuType: 'dedicated' | 'integrated';
  dedicatedGpuName: string;
  integratedCpuName: string;
  vramAllocatedGB: number;
  ramAllocatedGB: number;
  confirmed: boolean;
}

export type ActiveTab = 'chat' | 'preview' | 'code_studio' | 'context_files' | 'model_store' | 'model_manager' | 'settings';
