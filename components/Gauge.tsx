import React from 'react';
import { motion } from 'motion/react';
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
      case RiskLevel.LOW: return '#059669'; // Emerald 600
      case RiskLevel.MEDIUM: return '#d97706'; // Amber 600
      case RiskLevel.HIGH: return '#dc2626'; // Red 600
      default: return '#64748b';
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
            animationDuration={1500}
            animationBegin={300}
          >
            <Cell fill={color} stroke="none" />
            <Cell fill="#fee2e2" stroke="none" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="absolute top-[60%] flex flex-col items-center"
      >
        <span className="text-3xl font-black" style={{ color }}>{score}%</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Threat Risk</span>
      </motion.div>
    </div>
  );
};

export default Gauge;