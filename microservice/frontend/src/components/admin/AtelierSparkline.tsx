import React from 'react';

interface AtelierSparklineProps {
  data: number[];
  color?: string;
  fillColor?: string;
  height?: number;
  width?: number | string;
  strokeWidth?: number;
  className?: string;
}

export const AtelierSparkline: React.FC<AtelierSparklineProps> = ({
  data = [12, 19, 15, 27, 24, 38, 42],
  color = '#DFBF7A',
  fillColor,
  height = 42,
  width = '100%',
  strokeWidth = 2,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 4;
  const effectiveHeight = height - paddingY * 2;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = height - paddingY - ((val - min) / range) * effectiveHeight;
    return { x, y };
  });

  // Build smooth curve path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${point.x},${point.y}`;
  }, '');

  // Build area fill path
  const areaD = `${pathD} L 100,${height} L 0,${height} Z`;

  const gradId = `spark-grad-${Math.random().toString(36).substr(2, 6)}`;
  const finalFillColor = fillColor || color;

  const lastPoint = points[points.length - 1];

  return (
    <div style={{ width, height }} className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={finalFillColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={finalFillColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Gradient Area Fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Smooth Trend Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing End Point */}
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.8}
          fill={color}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
