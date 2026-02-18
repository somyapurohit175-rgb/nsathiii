
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const styles = {
    [RiskLevel.HIGH]: 'bg-red-500/10 text-red-600 border-red-500/20',
    [RiskLevel.MODERATE]: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    [RiskLevel.SAFE]: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm tracking-widest uppercase ${styles[level]}`}>
      {level} RISK
    </span>
  );
};

export default RiskBadge;
