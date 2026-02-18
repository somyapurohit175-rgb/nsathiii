
import React from 'react';
import { LawReference } from '../types';

interface LawCardProps {
  law: LawReference;
  onListen: (text: string) => void;
}

const LawCard: React.FC<LawCardProps> = ({ law, onListen }) => {
  return (
    <div className="glass rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-white/40">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-full uppercase tracking-widest">{law.act}</span>
          <h3 className="text-lg font-bold text-gray-900 mt-1 leading-tight">{law.section}: {law.title}</h3>
        </div>
        <button 
          onClick={() => onListen(`${law.section} of ${law.act}: ${law.title}. ${law.description}`)}
          className="p-2.5 bg-white/50 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          title="Listen to this section"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-4 flex-grow">
        {law.description}
      </p>
      
      {law.punishment && (
        <div className="bg-white/30 rounded-xl p-4 border border-white/20">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Sanction</span>
          <p className="text-sm font-semibold text-gray-800">{law.punishment}</p>
        </div>
      )}
    </div>
  );
};

export default LawCard;
