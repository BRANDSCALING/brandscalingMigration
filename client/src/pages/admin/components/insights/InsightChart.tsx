import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface InsightChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  height?: number;
}

export default function InsightChart({ type, data, options, height = 200 }: InsightChartProps) {
  const chartRef = useRef<any>(null);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    } : undefined,
    ...options,
  };

  // Make chart available for printing
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.canvas.setAttribute('data-chart-type', type);
    }
  }, [type]);

  const ChartComponent = () => {
    switch (type) {
      case 'line':
        return <Line ref={chartRef} data={data} options={defaultOptions} height={height} />;
      case 'bar':
        return <Bar ref={chartRef} data={data} options={defaultOptions} height={height} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={data} options={defaultOptions} height={height} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="chart-container">
      <ChartComponent />
    </div>
  );
}