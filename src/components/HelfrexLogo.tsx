import React from 'react';

interface HelfrexLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTag?: boolean;
  showText?: boolean;
  theme?: 'dark' | 'light';
}

export const HelfrexLogo: React.FC<HelfrexLogoProps> = ({
  size = 'md',
  showTag = false,
  showText = false,
  theme = 'dark'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Box dimensions
  const boxDim = isSm ? 'w-7 h-7 rounded-lg' : isLg ? 'w-14 h-14 rounded-2xl' : 'w-9 h-9 rounded-xl';
  const hSize = isSm ? 'text-xs font-black' : isLg ? 'text-2xl font-black' : 'text-base font-black';
  const aiSize = isSm ? 'text-[9px] font-extrabold' : isLg ? 'text-sm font-extrabold' : 'text-[11px] font-extrabold';
  const icicleW = isSm ? 'w-3.5 h-2' : isLg ? 'w-7 h-3.5' : 'w-5 h-2.5';
  const icicleBottom = isSm ? '-bottom-1.5' : isLg ? '-bottom-3' : '-bottom-2';

  return (
    <div className="inline-flex items-center gap-2 select-none">
      {/* Lacivert Kare İçinde Logo (Navy Blue Square Container) */}
      <div
        className={`${boxDim} bg-gradient-to-br from-[#0c1f3f] via-[#091b38] to-[#040e1e] border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center justify-center relative overflow-visible shrink-0`}
      >
        {/* Glow corner shine */}
        <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-300 rounded-full blur-[0.5px] opacity-90" />

        {/* Content: Big H + Small AI with attached icicles */}
        <div className="flex items-baseline justify-center gap-0.5 relative">
          {/* Büyük H */}
          <span
            className={`${hSize} tracking-tight bg-gradient-to-b from-white via-cyan-100 to-indigo-300 bg-clip-text text-transparent font-mono drop-shadow-[0_1px_4px_rgba(56,189,248,0.5)]`}
          >
            H
          </span>

          {/* Küçük AI + Aşağıdan Bitişik Buz Sarkıtları */}
          <div className="relative flex flex-col items-center">
            <span
              className={`${aiSize} tracking-normal bg-gradient-to-b from-cyan-100 via-cyan-200 to-sky-400 bg-clip-text text-transparent font-mono leading-none drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]`}
            >
              AI
            </span>

            {/* AI Yazısına Aşağıdan Bitişik Buz Sarkıtları (Hanging Icicles) */}
            <div className={`absolute ${icicleBottom} left-0 right-0 flex justify-center pointer-events-none z-20`}>
              <svg
                className={icicleW}
                viewBox="0 0 20 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sol sarkıt (A harfinin altından) */}
                <path
                  d="M2 0 L5 0 L3.8 6.5 L3.5 9.5 L3.2 6.5 Z"
                  fill="url(#ice-grad-1)"
                />
                {/* Orta minik damla */}
                <path
                  d="M7.5 0 L9.5 0 L8.8 4 L8.5 5.5 L8.2 4 Z"
                  fill="url(#ice-grad-2)"
                />
                {/* Sağ sarkıt (I harfinin altından) */}
                <path
                  d="M12 0 L15 0 L13.8 7 L13.5 10 L13.2 7 Z"
                  fill="url(#ice-grad-1)"
                />
                {/* En sağ uç */}
                <path
                  d="M16.5 0 L18 0 L17.5 3.5 L17.2 5 L17 3.5 Z"
                  fill="url(#ice-grad-2)"
                />

                <defs>
                  <linearGradient id="ice-grad-1" x1="3.5" y1="0" x2="3.5" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E0F2FE" />
                    <stop offset="0.6" stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#0284C7" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="ice-grad-2" x1="8.5" y1="0" x2="8.5" y2="5.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F0F9FF" />
                    <stop offset="0.8" stopColor="#7DD3FC" />
                    <stop offset="1" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Text: HelfrexAI */}
      {showText && (
        <span
          className={`font-mono font-bold tracking-tight ${
            isSm ? 'text-xs' : isLg ? 'text-xl' : 'text-sm'
          } ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
        >
          Helfrex<span className="text-cyan-400">AI</span>
        </span>
      )}

      {/* Version / Beta tag */}
      {showTag && (
        <span
          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
            theme === 'dark'
              ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
              : 'bg-cyan-100 border-cyan-300 text-cyan-800'
          }`}
        >
          v2.5
        </span>
      )}
    </div>
  );
};
