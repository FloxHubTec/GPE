
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreWidgetProps {
  score: number;
  maxScore: number;
}

const ScoreWidget: React.FC<ScoreWidgetProps> = ({ score, maxScore }) => {
  const data = [
    { name: 'Completed', value: score },
    { name: 'Remaining', value: Math.max(0, maxScore - score) },
  ];

  const COLORS = ['#00E054', '#E2E8F0'];

  const percentage = Math.min(100, Math.round((score / maxScore) * 100));

  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-lead">{percentage}%</span>
        <span className="text-xs font-semibold text-muted tracking-wider uppercase">Score Diário</span>
      </div>
    </div>
  );
};

export default ScoreWidget;
