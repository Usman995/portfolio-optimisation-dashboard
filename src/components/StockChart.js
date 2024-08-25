import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StockChart({ data }) {
  const chartData = data.results.map(item => ({
    date: new Date(item.t).toLocaleDateString(),
    open: item.o,
    close: item.c,
    high: item.h,
    low: item.l,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`Date : ${label}`}</p>
          <p style={{ color: '#82ca9d' }}>{`Open : ${payload[0].payload.open.toFixed(2)}`}</p>
          <p style={{ color: '#8884d8' }}>{`Close : ${payload[0].payload.close.toFixed(2)}`}</p>
          <p style={{ color: '#82ca9d' }}>{`High : ${payload[0].payload.high.toFixed(2)}`}</p>
          <p style={{ color: '#8884d8' }}>{`Low : ${payload[0].payload.low.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="low" fill="#8884d8" />
        <Bar dataKey="high" fill="#82ca9d" />
        {chartData.map((entry, index) => (
          <rect
            key={`candle-${index}`}
            x={index * (800 / chartData.length) + 35}
            y={entry.open > entry.close ? entry.close : entry.open}
            width={4}
            height={Math.abs(entry.open - entry.close)}
            fill={entry.open > entry.close ? "#ff0000" : "#00ff00"}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default StockChart;