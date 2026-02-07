import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  accentColor: string;
  onMoreInfo?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, accentColor, onMoreInfo, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl border border-nak-border shadow-sm overflow-hidden flex relative ${className}`}>
      {/* Akzentstreifen am linken Rand (RGB optimiert) */}
      <div className="absolute left-0 top-0 bottom-0 w-3" style={{ backgroundColor: accentColor }} />
      
      <div className="p-8 pl-12 w-full flex flex-col">
        <h3 className="text-[12px] font-bold text-nak-accent-dark uppercase tracking-[0.2em] mb-4 border-b border-nak-bg pb-1 inline-block">
          {title}
        </h3>
        <div className="text-nak-accent-dark text-base leading-relaxed flex-grow font-medium">
          {children}
        </div>
        {onMoreInfo && (
          <button 
            onClick={onMoreInfo}
            className="mt-6 self-end text-[10px] font-bold text-nak-border uppercase tracking-widest hover:text-nak-highlight-orange transition-all border border-nak-border/20 px-4 py-2 rounded-lg hover:border-nak-highlight-orange"
          >
            weitere Informationen →
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;