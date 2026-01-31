import React from 'react';
import { ChevronRight } from 'lucide-react';

const CardStats = ({ title, value, icon: Icon, colorClass, linkText = "Ver detalles" }) => (
  <div className={`rounded-xl shadow-sm relative overflow-hidden h-32 ${colorClass} transition-transform hover:scale-[1.02]`}>
    <div className="p-5 relative z-10 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-3xl font-bold mb-1 brand-font text-white">{value}</h3>
        <p className="text-xs font-bold text-white/90 uppercase tracking-wide">{title}</p>
      </div>
    </div>
    <div className="absolute top-4 right-4 opacity-20 text-white">
      <Icon size={56} />
    </div>
    <a href="#" className="absolute bottom-0 w-full bg-black/10 hover:bg-black/20 text-white text-center py-1.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-colors backdrop-blur-sm">
      {linkText} <ChevronRight size={10} />
    </a>
  </div>
);

export default CardStats;