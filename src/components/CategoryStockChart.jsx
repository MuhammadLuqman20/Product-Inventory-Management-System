import React from 'react';

const CategoryStockChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '250px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)' 
      }}>
        No stock data available to display.
      </div>
    );
  }

  // Find max value for scaling
  const maxVal = Math.max(...data.map(d => d.value), 10);

  return (
    <div className="chart-container">
      {data.map((item, index) => {
        // Calculate percentage height
        const heightPct = (item.value / maxVal) * 100;
        
        return (
          <div key={index} className="chart-bar-wrapper">
            <div 
              className="chart-bar-fill" 
              style={{ height: `${Math.max(heightPct, 5)}%` }}
            >
              <div className="chart-bar-tooltip">
                <strong>{item.value}</strong> units
              </div>
            </div>
            <div className="chart-bar-label" title={item.label}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryStockChart;
