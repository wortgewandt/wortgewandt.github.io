import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 44, height: 44, text: 'text-xl', sub: 'text-[7px]', lineY: 'my-1' },
    md: { width: 64, height: 64, text: 'text-2xl', sub: 'text-[9px]', lineY: 'my-1.5' },
    lg: { width: 110, height: 110, text: 'text-4xl', sub: 'text-[13px]', lineY: 'my-2' },
  };

  const current = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      {/* Symbol: Bibel als Gewand um das Kreuz */}
      <div style={{ width: current.width, height: current.height }} className="shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 1. Bibel-Körper (Aufgeschlagenes Buch / Gewand-Form) */}
          <path 
            d="M10 45 Q30 30 50 42 Q70 30 90 45 V85 Q70 70 50 82 Q30 70 10 85 Z" 
            fill="white" 
            stroke="#2E5DAD" 
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          
          {/* 2. Linke Seite (beschrieben mit Textandeutungen) */}
          <g stroke="#C6D1D7" strokeWidth="0.7">
            <path d="M20 52 H42" />
            <path d="M18 58 H44" />
            <path d="M19 64 H40" />
            <path d="M20 70 H43" />
            <path d="M21 76 H38" />
          </g>
          
          {/* 3. Rechte Seite (beschrieben mit Textandeutungen) */}
          <g stroke="#C6D1D7" strokeWidth="0.7">
            <path d="M58 52 H80" />
            <path d="M56 58 H82" />
            <path d="M60 64 H81" />
            <path d="M57 70 H80" />
            <path d="M62 76 H79" />
          </g>

          {/* 4. Mittelfalz / Buchrücken-Andeutung */}
          <path d="M50 42 V82" stroke="#DEE7EB" strokeWidth="1" strokeDasharray="2 2" />

          {/* 5. Das Kreuz (Prominent im Vordergrund, ragt oben heraus) */}
          <rect x="46" y="8" width="8" height="70" rx="1.5" fill="#2E5DAD" />
          <rect x="30" y="32" width="40" height="8" rx="1.5" fill="#2E5DAD" />
          
          {/* Zusätzliche Dynamik-Falten für den "Gewand"-Effekt */}
          <path d="M10 45 C25 42 35 45 50 48" stroke="#2E5DAD" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M90 45 C75 42 65 45 50 48" stroke="#2E5DAD" strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>
      </div>

      {/* Vertikale Trennlinie zwischen Symbol und Text */}
      <div className="h-12 w-[1.5px] bg-nak-accent-dark opacity-30 mx-5"></div>

      {/* Textblock */}
      <div className="flex flex-col justify-center">
        <h1 className={`${current.text} font-bold font-serif text-nak-accent-dark leading-tight tracking-tight`}>
          Wortgewand<span>(</span>t<span>)</span>
        </h1>
        
        {/* Horizontale Trennlinie zwischen Name und Unterüberschrift */}
        <div className={`h-[1px] w-full bg-nak-highlight-orange opacity-40 ${current.lineY}`}></div>
        
        <p className={`${current.sub} uppercase tracking-[0.25em] font-bold text-nak-highlight-orange`}>
          Die Kunst der Predigt
        </p>
      </div>
    </div>
  );
};

export default Logo;