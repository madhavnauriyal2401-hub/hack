
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskLevel } from '../types';

interface GaugeProps {
  score: number;
  level: RiskLevel;
}

const Gauge: React.FC<GaugeProps> = ({ score, level }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case RiskLevel.LOW: return '#10b981'; // Softer Emerald
      case RiskLevel.MEDIUM: return '#f59e0b'; // Amber
      case RiskLevel.HIGH: return '#dc2626'; // Red
      default: return '#94a3b8';
    }
  };

  const color = getColor(level);

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={95}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} stroke="none" />
            <Cell fill="#f1f5f9" stroke="none" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Caution Level</span>
      </div>
    </div>
  );
};

export default Gauge;
